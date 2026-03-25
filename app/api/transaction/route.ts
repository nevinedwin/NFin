'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { TransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { outputResp } from "@/lib/utils/response";
import { createTransactionSchema } from "@/schemas/transaction.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const user = await getCurrentUser();

        if (!user) {
            outputResp({ message: "UnAuthorized", status: 401 });
        }

        const body = await req.json();

        const parsed = createTransactionSchema.safeParse(body);

        if (!parsed.success) {
            return outputResp({ message: "Invalid Data", error: parsed.error, status: 400 })
        }

        const { accountId, amount, categoryId, date, repeat, type, description, toAccountId } = parsed.data;


        if (amount.lte(0)) {
            return outputResp({ message: "Invaid Amount", status: 500 })
        }

        await prisma.$transaction(async (tx) => {
            const updates = [];

            if (type === TransactionType.EXPENSE) {
                updates.push(
                    tx.account.update({
                        where: { id: accountId },
                        data: { balance: { decrement: amount } }
                    })
                )
            }

            if (type === TransactionType.INCOME) {
                updates.push(
                    tx.account.update({
                        where: { id: accountId },
                        data: { balance: { increment: amount } }
                    })
                )
            }

            if (type === TransactionType.TRANSFER) {
                updates.push(
                    tx.account.update({
                        where: { id: accountId },
                        data: { balance: { decrement: amount } }
                    })
                );

                updates.push(
                    tx.account.update({
                        where: { id: toAccountId },
                        data: { balance: { increment: amount } }
                    })
                )
            }

            await tx.transaction.create({
                data: {
                    amount,
                    description,
                    type,
                    date,
                    repeat,
                    category: { connect: { id: categoryId ?? '' } },
                    account: { connect: { id: accountId } },
                    user: { connect: { id: user!.id } },
                    ...(toAccountId && { toAccount: { connect: { id: toAccountId } } })
                }
            });

            await Promise.all(updates);
        });

        return NextResponse.json({ message: "Transaction Created" }, { status: 201 });
    } catch (error) {
        console.error(error);

        return outputResp({
            message: "Transaction creation failed",
            status: 500
        });
    }
}