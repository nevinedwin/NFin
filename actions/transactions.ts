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

            const account = await tx.account.findUnique({
                where: { id: accountId },
                select: { balance: true }
            });

            if (!account) throw new Error("Account not found");

            let newBalance = account.balance;

            switch (type) {
                case TransactionType.EXPENSE:
                case TransactionType.TRANSFER:
                    newBalance = newBalance.minus(amount);
                    break;

                case TransactionType.INCOME:
                    newBalance = newBalance.plus(amount);
                    break;
            };



            await tx.transaction.create({
                data: {
                    amount,
                    description,
                    type,
                    date,
                    repeat,
                    balance: newBalance,
                    category: { connect: { id: categoryId } },
                    account: { connect: { id: accountId } },
                    user: { connect: { id: user!.id } },
                    ...(toAccountId && { toAccount: { connect: { id: toAccountId } } })
                }
            });

            updates.push(
                tx.account.update({
                    where: { id: accountId },
                    data: { balance: newBalance }
                })
            );

            switch (type) {

                case TransactionType.TRANSFER:
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

        console.log(error);

        return {
            success: false,
            errors: "Transaction failed"
        };
    }
}

const PAGE_SIZE = 10;
export async function getTransactions(cursor?: { date: Date; id: string }) {
    const user = await getCurrentUser();
    if (!user) return { data: [], nextCursor: null };

    const transactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: [
            { date: "desc" },
            { id: "desc" }
        ],
        take: PAGE_SIZE + 1,
        ...(cursor && {
            cursor: {
                date: cursor.date,
                id: cursor.id
            },
            skip: 1
        }),
        select: {
            id: true,
            amount: true,
            type: true,
            date: true,
            balance: true,
            category: { select: { name: true, icon: true } },
            account: { select: { accountNumber: true, name: true } }
        }
    });

    let nextCursor = null;
    if (transactions.length > PAGE_SIZE) {
        transactions.pop();
        const last = transactions[transactions.length - 1];
        nextCursor = { date: last.date, id: last.id };
    }

    const safeTransactions = transactions.map((t) => ({
        ...t,
        amount: t.amount.toNumber(),
        balance: t.balance.toNumber()
    }));

    return { data: safeTransactions, nextCursor };
}