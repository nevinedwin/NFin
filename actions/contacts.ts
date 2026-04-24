'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/auth/currentUser';
import { Prisma } from '@/generated/prisma/client';

export type Cursor = {
    transactionDate: Date;
    id: string;
};

export async function createContact(data: {
    name: string;
    phone: string;
    email?: string;
}) {
    const user = await getCurrentUser();
    if (!user) return { success: false };

    await prisma.contact.create({
        data: {
            ...data,
            email: data.email || null,
            userId: user.id
        }
    });

    return { success: true };
}
export async function createGroup(data: {
    name: string;
    memberIds: string[];
}) {
    const user = await getCurrentUser();
    if (!user) return { success: false };

    const uniqueIds = [...new Set(data.memberIds)];

    await prisma.group.create({
        data: {
            name: data.name,
            userId: user.id,
            members: {
                create: uniqueIds.map(id => ({
                    contactId: id
                }))
            }
        }
    });

    return { success: true };
}



export async function getContacts({
    cursor,
    search,
    take = 20
}: {
    cursor?: { name: string; id: string } | null;
    search?: string;
    take?: number;
}) {
    const user = await getCurrentUser();
    if (!user) return { data: [], nextCursor: null };

    const contacts = await prisma.contact.findMany({
        where: {
            userId: user.id,
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        phone: {
                            contains: search
                        }
                    }
                ]
            })
        },
        orderBy: [
            { name: "asc" },
            { id: "asc" }
        ],
        take: take + 1,
        ...(cursor && {
            cursor: {
                userId: user.id,
                name: cursor.name,
                id: cursor.id
            },
            skip: 1
        }),
        select: {
            id: true,
            name: true,
            phone: true
        }
    });

    let nextCursor = null;

    if (contacts.length > take) {
        contacts.pop();
        const last = contacts[contacts.length - 1];
        nextCursor = last
            ? { name: last.name, id: last.id }
            : null;
    }

    return { data: contacts, nextCursor };
}

export async function getData({ id, type }: { id: string; type: 'group' | 'contact' }) {
    const user = await getCurrentUser();
    if (!user) return { success: false };

    let result;

    if (type === 'contact') {
        result = await prisma.contact.findFirst({
            where: {
                id,
                userId: user.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                updatedAt: true
            }
        });
    } else if (type === 'group') {
        result = await prisma.group.findFirst({
            where: {
                id,
                userId: user.id
            },
            select: {
                id: true,
                name: true,
                members: {
                    select: {
                        id: true,
                        contact: {
                            select: {
                                id: true,
                                name: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });
    } else {
        result = []
    };

    return { data: result, success: true };
}

export const getContactTransactions = async (
    {
        cursor = null,
        take = 10,
        id
    }: {
        id: string;
        take: number;
        cursor: Cursor | null;
        [key: string]: unknown;
    }) => {


    const user = await getCurrentUser();
    if (!user) return { success: false };

    const transactions = await prisma.transactionParticipant.findMany({
        where: {
            contactId: id
        },
        orderBy: [
            { transactionDate: "desc" },
            { transactionRefId: "asc" }
        ],
        take: take + 1,
        ...(cursor && {
            cursor: {
                transactionDate_transactionRefId: {
                    transactionDate: cursor.transactionDate,
                    transactionRefId: cursor.id,
                },
            },
            skip: 1
        }),
        select: {
            id: true,
            obligationAmount: true,
            shareAmount: true,
            transactionDate: true,
            paidAmount: true,
            status: true,
            transactionRefId: true
        }
    });

    let nextCursor = null;
    if (transactions.length > take) {
        transactions.pop();
        const last = transactions[transactions.length - 1];
        nextCursor = { transactionDate: last.transactionDate, transactionRefId: last.transactionRefId };
    }

    const safeTransactions = transactions.map((t) => ({
        ...t,
        obligationAmount: t.obligationAmount.toNumber(),
        shareAmount: t.shareAmount.toNumber(),
        paidAmount: t.paidAmount.toNumber()
    }));

    return { data: safeTransactions, nextCursor, success: true };
}