'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/auth/currentUser';

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

    await prisma.group.create({
        data: {
            name: data.name,
            userId: user.id,
            members: {
                create: data.memberIds.map(id => ({
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
        const last =  contacts[contacts.length - 1];
        nextCursor = last
            ? { name: last.name, id: last.id }
            : null;
    }

    return { data: contacts, nextCursor };
}