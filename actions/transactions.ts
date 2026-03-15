'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { Prisma, TransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createTransactionSchema } from "@/schemas/transaction.schema";
import { revalidatePath } from "next/cache";

export async function createTransaction(prevState: any, formData: FormData) {

    const user = await getCurrentUser();

    if (!user) return {
        success: false,
        errors: "Unauthorized User"
    };;

    const body = Object.fromEntries(formData);

    const parsed = createTransactionSchema.safeParse({
        ...body,
        repeat: body.repeat === 'true',
        date: body.date ? new Date(body.date as string) : new Date()
    });


    if (!parsed.success) {
        const message = Object.values(parsed.error.flatten().fieldErrors)
            .flat()
            .join(", ");

        return {
            success: false,
            errors: message
        };
    }

    const { accountId, amount, categoryId, date, repeat, type, description, toAccountId } = parsed.data;

    if (amount.lte(0)) {
        return {
            success: false,
            errors: "Amount must be greater than 0"
        };
    }

    try {

        await prisma.$transaction(async (tx) => {

            const updates: Promise<any>[] = [];

            await tx.transaction.create({
                data: {
                    amount,
                    description,
                    type,
                    date,
                    repeat,
                    category: { connect: { id: categoryId } },
                    account: { connect: { id: accountId } },
                    user: { connect: { id: user!.id } },
                    ...(toAccountId && { toAccount: { connect: { id: toAccountId } } })
                }
            });

            switch (type) {

                case TransactionType.EXPENSE:
                    updates.push(
                        tx.account.update({
                            where: { id: accountId },
                            data: { balance: { decrement: amount } }
                        })
                    );
                    break;

                case TransactionType.INCOME:
                    updates.push(
                        tx.account.update({
                            where: { id: accountId },
                            data: { balance: { increment: amount } }
                        })
                    );
                    break;

                case TransactionType.TRANSFER:
                    updates.push(
                        tx.account.update({
                            where: { id: accountId },
                            data: { balance: { decrement: amount } }
                        })
                    );

                    updates.push(
                        tx.account.update({
                            where: { id: toAccountId! },
                            data: { balance: { increment: amount } }
                        })
                    );
                    break;
            }

            await Promise.all(updates);

        });

        revalidatePath('/dashboard');

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            errors: "Transaction failed"
        };
    }
}