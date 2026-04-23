'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { TransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type Cursor = {
    transactionDate: Date;
    transactionRefId: string;
};

export async function getContactTransactions(
    contactId: string,
    cursor?: Cursor
) {
    const user = await getCurrentUser();
    if (!user) return { success: false };

    const PAGE_SIZE = 10;

    const data = await prisma.transactionParticipant.findMany({
        where: {
            contactId,
            transaction: {
                userId: user.id,
                type: {
                    in: [
                        TransactionType.LEND,
                        TransactionType.BORROW,
                        TransactionType.GROUP_SPLIT,
                    ],
                },
                isDeleted: false,
            },
        },

        include: {
            transaction: {
                include: {
                    category: true,
                    account: true,
                },
            },
        },

        orderBy: [
            { transactionDate: "desc" },
            { transactionRefId: "desc" },
        ],

        take: PAGE_SIZE + 1,

        ...(cursor && {
            cursor: {
                transactionDate_transactionRefId: {
                    transactionDate: cursor.transactionDate,
                    transactionRefId: cursor.transactionRefId,
                },
            },
            skip: 1,
        }),
    });

    const formatted = data.map((p) => {
        const tx = p.transaction;

        const obligationAmount = Number(p.obligationAmount);
        const paidAmount = Number(p.paidAmount);
        const remainingAmount = obligationAmount - paidAmount;

        return {
            cursor: {
                transactionDate: p.transactionDate,
                transactionRefId: p.transactionRefId,
            },

            transactionId: tx.id,
            date: tx.date,
            description: tx.description,
            totalAmount: Number(tx.amount),

            type: tx.type,

            obligationAmount,
            paidAmount,
            remainingAmount,

            status: p.status,

            category: tx.category?.name || null,
            account: tx.account?.name || null,
        };
    });

    let nextCursor: Cursor | null = null;

    if (formatted.length > PAGE_SIZE) {
        const nextItem = formatted.pop();
        nextCursor = nextItem!.cursor;
    }

    return {
        success: true,
        data: formatted,
        nextCursor
    };
};