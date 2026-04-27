'use server';

import { FormBody } from "@/app/(main)/features/transaction/transaction.types";
import { getCurrentUser } from "@/auth/currentUser";
import { ObligationStatus, Prisma, TransactionType, TransferType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createTransactionSchema } from "@/schemas/transaction.schema";
import { ActiveFilters } from "@/types/filters";
import { Cursor } from "@/types/general";
import { revalidatePath } from "next/cache";
import { v4 as uuidV4 } from 'uuid';


async function updateContactBalance(
    tx: Prisma.TransactionClient,
    userId: string,
    contactId: string,
    delta: Prisma.Decimal
) {
    await tx.contactBalance.upsert({
        where: {
            userId_contactId: {
                userId,
                contactId
            }
        },
        update: {
            netAmount: { increment: delta }
        },
        create: {
            userId,
            contactId,
            netAmount: delta
        }
    });
}

// ─────────────────────────────────────────────
// MAIN ACTION
// ─────────────────────────────────────────────
export async function createTransaction(prevState: any, formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        return { success: false, errors: "Unauthorized User" };
    }

    try {
        // ─── Extract base fields ─────────────────────────────
        const raw = Object.fromEntries(formData.entries()) as FormBody;

        const body = {
            ...raw,
        };

        let normalizedContacts: any = [];

        if (raw.type === TransactionType.GROUP_SPLIT) {
            let contacts
            if (raw.contacts) {
                body.contacts = raw.contacts ? JSON.parse(raw.contacts as string) : undefined
                contacts = raw.contacts ? JSON.parse(raw.contacts as string) : undefined
            }

            normalizedContacts = contacts.map((c: any) => ({
                id: c.id,
                obligationAmount: Number(c.obligationAmount ?? 0),
                shareAmount: Number(c.shareAmount ?? 0),
                splitType: c.split_type
            }));
        } else {
            body.contacts = raw.contactId;
        };


        // ─── Validate ───────────────────────────────────────
        const parsed = createTransactionSchema.safeParse({
            ...body,
            contacts: normalizedContacts,
            accountId: body.accountId || undefined,
            categoryId: body.categoryId || undefined,
            groupId: body.groupId || undefined,
            toAccountId: body.toAccountId || undefined,
            contactId: body.contactId || undefined,
        });


        if (!parsed.success) {
            const message = Object.values(parsed.error.flatten().fieldErrors)
                .flat()
                .join(", ");
            return { success: false, errors: message };
        }

        const {
            accountId,
            amount,
            categoryId,
            date,
            repeat,
            type,
            description,
            toAccountId,
            contacts: parsedContacts,
            contactId,
            groupId
        } = parsed.data;

        if (amount.lte(0)) {
            return { success: false, errors: "Amount must be greater than 0" };
        }

        // ─────────────────────────────────────────────
        // DB TRANSACTION
        // ─────────────────────────────────────────────
        await prisma.$transaction(async (tx) => {

            const account = await tx.account.findUnique({
                where: { id: accountId, userId: user.id },
                select: { balance: true }
            });

            if (!account) throw new Error("Account not found");

            let newBalance = account.balance;

            const basePayload: Prisma.TransactionCreateInput = {
                amount,
                description,
                type,
                date,
                repeat,
                account: { connect: { id: accountId } },
                user: { connect: { id: user.id } },
                ...(categoryId && {
                    category: { connect: { id: categoryId } }
                })
            };

            // ─────────────────────────────
            // EXPENSE
            // ─────────────────────────────
            if (type === TransactionType.EXPENSE) {
                newBalance = newBalance.minus(amount);

                await tx.transaction.create({ data: basePayload });

                await tx.account.update({
                    where: { id: accountId },
                    data: { balance: newBalance }
                });
            }

            // ─────────────────────────────
            // INCOME
            // ─────────────────────────────
            else if (type === TransactionType.INCOME) {
                newBalance = newBalance.plus(amount);

                await tx.transaction.create({ data: basePayload });

                await tx.account.update({
                    where: { id: accountId },
                    data: { balance: newBalance }
                });
            }

            // ─────────────────────────────
            // TRANSFER
            // ─────────────────────────────
            else if (type === TransactionType.TRANSFER) {


                const toAccount = await tx.account.findUnique({
                    where: { id: toAccountId!, userId: user.id },
                    select: { balance: true }
                });

                newBalance = newBalance.minus(amount);
                const newToBalance = toAccount?.balance.plus(amount);

                if (!toAccount) throw new Error("To account not found");

                const transferGroupId = uuidV4();

                // OUT
                await tx.transaction.create({
                    data: {
                        ...basePayload,
                        transferType: TransferType.TRANSFER_OUT,
                        transferGroupId,
                        balance: newBalance
                    }
                });

                // IN
                await tx.transaction.create({
                    data: {
                        ...basePayload,
                        account: { connect: { id: toAccountId! } },
                        transferType: TransferType.TRANSFER_IN,
                        transferGroupId,
                        balance: newToBalance
                    }
                });

                await tx.account.update({
                    where: { id: accountId },
                    data: { balance: { decrement: amount } }
                });

                await tx.account.update({
                    where: { id: toAccountId! },
                    data: { balance: { increment: amount } }
                });
            }

            // ─────────────────────────────
            // LEND / BORROW
            // ─────────────────────────────
            else if (type === TransactionType.LEND || type === TransactionType.BORROW) {


                if (!contactId) {
                    throw new Error("Contact is required");
                }

                if (type === TransactionType.LEND) {
                    newBalance = newBalance.minus(amount);

                    // contact owes you (+)
                    await updateContactBalance(
                        tx,
                        user.id,
                        contactId,
                        amount
                    );

                } else {
                    newBalance = newBalance.plus(amount);

                    // you owe contact (-)
                    await updateContactBalance(
                        tx,
                        user.id,
                        contactId,
                        amount.neg()
                    );
                }

                await tx.transaction.create({
                    data: {
                        ...basePayload,
                        balance: newBalance,
                        participants: {
                            create: {
                                contact: { connect: { id: contactId } },
                                user: { connect: { id: user.id } },
                                shareAmount: amount,
                                obligationAmount: type === TransactionType.BORROW ? amount.neg() : amount,
                                paidAmount: new Prisma.Decimal(0),
                                status: ObligationStatus.PENDING,
                                transactionDate: date,
                                transactionRefId: uuidV4()
                            }
                        }
                    }
                });

                await tx.account.update({
                    where: { id: accountId },
                    data: { balance: newBalance }
                });
            }

            // ─────────────────────────────
            // GROUP SPLIT
            // ─────────────────────────────
            else if (type === TransactionType.GROUP_SPLIT) {
                if (!parsedContacts || parsedContacts.length === 0) {
                    throw new Error("No participants provided");
                }

                const groupTxnId = uuidV4();
                newBalance = newBalance.minus(amount);

                // Create transaction + participants (single query)
                await tx.transaction.create({
                    data: {
                        ...basePayload,
                        balance: newBalance,
                        transferGroupId: groupTxnId,

                        ...(groupId && {
                            group: { connect: { id: groupId } }
                        }),


                        participants: {
                            createMany: {
                                data: parsedContacts.map((c: any) => ({
                                    contactId: c.id,
                                    userId: user.id,
                                    shareAmount: new Prisma.Decimal(c.shareAmount || 0),
                                    obligationAmount: new Prisma.Decimal(c.obligationAmount),
                                    paidAmount: new Prisma.Decimal(0),
                                    status: ObligationStatus.PENDING,
                                    transactionDate: date,
                                    transactionRefId: uuidV4()
                                }))
                            }
                        }
                    }
                });

                // Ensure rows exist (bulk insert)
                // Ensure rows exist (bulk insert)
                await tx.contactBalance.createMany({
                    data: parsedContacts.map((c: any) => ({
                        userId: user.id,
                        contactId: c.id,
                        netAmount: new Prisma.Decimal(0)
                    })),
                    skipDuplicates: true
                });

                // Increment netAmount for each contact (atomic, parallel)
                await Promise.all(
                    parsedContacts.map((c: any) =>
                        tx.contactBalance.update({
                            where: {
                                userId_contactId: {
                                    userId: user.id,
                                    contactId: c.id
                                }
                            },
                            data: {
                                netAmount: {
                                    increment: Number(c.obligationAmount)
                                }
                            }
                        })
                    )
                );

                // Update account
                await tx.account.update({
                    where: { id: accountId },
                    data: { balance: newBalance }
                });
            }
        }, {
            timeout: 15000
        });

        revalidatePath("/dashboard");

        return { success: true };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: error instanceof Error ? error.message : "Transaction failed"
        };
    }
}

export async function getTransactions({
    cursor = null,
    search = "",
    take = 10,
    filters
}: {
    cursor: Cursor,
    search: string,
    take: number,
    filters?: ActiveFilters
}) {

    const user = await getCurrentUser();
    if (!user) return { data: [], nextCursor: null };

    const where: any = { userId: user.id };

    if (search?.trim()) {
        where.description = { contains: search.trim(), mode: "insensitive" };
    }

    if (filters?.bank) {
        where.accountId = filters.bank;
    }

    if (filters?.type) {
        where.type = filters.type;
    }

    if (filters?.category) {
        where.categoryId = filters.category;
    }

    if (filters?.date?.from && filters?.date?.to) {
        where.date = {
            gte: new Date(filters.date.from),
            lte: new Date(filters.date.to + "T23:59:59.999Z"),
        };
    }

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: [
            { date: "desc" },
            { id: "desc" }
        ],
        take: take + 1,
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
            description: true,
            category: { select: { id: true, name: true, icon: true } },
            account: { select: { id: true, accountNumber: true, name: true } },
            transferGroupId: true,
            transferType: true,
            updatedAt: true
        }
    });

    let nextCursor = null;
    if (transactions.length > take) {
        transactions.pop();
        const last = transactions[transactions.length - 1];
        nextCursor = { date: last.date, id: last.id };
    }

    const safeTransactions = transactions.map((t) => ({
        ...t,
        amount: t.amount.toNumber(),
        balance: t.balance.toNumber()
    }));

    return { data: safeTransactions, nextCursor, success: true };
}


export type MonthSummary = {
    key: string;
    label: string;
    count: number;
    totalIncome: number;
    totalExpense: number;
};

export async function getMonthlyTotals(
    search?: string,
    filters?: ActiveFilters
): Promise<MonthSummary[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    const where: any = { userId: user.id };

    if (search?.trim()) {
        where.description = { contains: search.trim(), mode: "insensitive" };
    }
    if (filters?.bank) where.accountId = filters.bank;
    if (filters?.type) where.type = filters.type;
    if (filters?.category) where.categoryId = filters.category;
    if (filters?.date?.from && filters?.date?.to) {
        where.date = {
            gte: new Date(filters.date.from),
            lte: new Date(filters.date.to + "T23:59:59.999Z"),
        };
    }

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: [{ date: "desc" }],
        select: {
            id: true,
            date: true,
            type: true,
            amount: true,
        },
    });

    const map = new Map<string, MonthSummary>();

    for (const tx of transactions) {
        const date = new Date(tx.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const label = date.toLocaleString("default", { month: "long", year: "numeric" });
        const amount = tx.amount.toNumber();

        if (!map.has(key)) {
            map.set(key, { key, label, count: 0, totalIncome: 0, totalExpense: 0 });
        }

        const g = map.get(key)!;
        g.count++;
        if (tx.type === "INCOME") g.totalIncome += amount;
        if (tx.type === "EXPENSE") g.totalExpense += amount;
    }

    return Array.from(map.values());
}