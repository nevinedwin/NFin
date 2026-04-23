'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type Cursor = {
    id: string;
} | null;

export async function getGroupMembers({
    groupId = '',
    cursor = null,
    take = 10,
    query = ''
}: {
    groupId: string;
    cursor?: Cursor;
    take?: number;
    query?: string;
}) {

    const user = await getCurrentUser();
    if (!user) return { success: false };

    const members = await prisma.groupMember.findMany({
        where: {
            groupId,
            contact: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            }
        },
        include: {
            contact: true
        },
        take: take + 1,
        ...(cursor && {
            cursor: {
                id: cursor.id
            },
            skip: 1
        }),
        orderBy: {
            id: 'asc'
        }
    });

    let nextCursor = null;

    if (members.length > take) {
        members.pop();
        const last = members[members.length - 1];
        nextCursor = last
            ? { id: last.id }
            : null;
    }

    const formatedData = members.map((m) => ({
        id: m.contact.id,
        name: m.contact.name,
        groupMemberId: m.id
    }));

    return { data: formatedData, nextCursor };
};



export async function getGroups({
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

    const where: Prisma.GroupWhereInput = {
        userId: user.id
    };

    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        ];
    }

    const groups = await prisma.group.findMany({
        where,
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
        }
    });

    let nextCursor = null;

    if (groups.length > take) {
        groups.pop();
        const last = groups[groups.length - 1];
        nextCursor = last
            ? { name: last.name, id: last.id }
            : null;
    }

    return { data: groups, nextCursor };
}


export async function getGroupsWithMembers({
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

    const where: Prisma.GroupWhereInput = {
        userId: user.id
    };

    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                members: {
                    some: {
                        contact: {
                            name: {
                                contains: search,
                                mode: "insensitive"
                            }
                        }
                    }
                }
            }
        ];
    }

    const groups = await prisma.group.findMany({
        where,
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

    let nextCursor = null;

    if (groups.length > take) {
        groups.pop();
        const last = groups[groups.length - 1];
        nextCursor = last
            ? { name: last.name, id: last.id }
            : null;
    }

    return { data: groups, nextCursor };
}