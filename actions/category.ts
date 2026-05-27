"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/auth/currentUser";
import { CategoryType, TransactionType } from "@/generated/prisma/client";

export async function createCategory(data: FormData) {

    const user = await getCurrentUser();

    const name = data.get("name") as string;
    const type = data.get("type") as CategoryType;
    const forType = data.get("forType") as TransactionType;
    const parentId = data.get("parentId") as string;

    await prisma.category.create({
        data: {
            name: name.toLowerCase(),
            type,
            forType,
            parentId: parentId || null,
            userId: user!.id
        }
    });
}

export const getCategories = async ({
    cursor = null,
    search,
    take = 20,
    filters,
    groupedBy = false
}: {
    cursor?: { name: string; id: string } | null;
    search?: string;
    take?: number;
    filters?: Record<string, unknown>;
    groupedBy?: boolean;
}) => {

    const user = await getCurrentUser();

    if (!user) {
        return {
            data: [],
            nextCursor: null
        };
    }

    const where: any = {
        userId: user.id,
        isDeleted: { not: true }
    };

    if (search?.trim()) {
        where.name = {
            contains: search.trim(),
            mode: "insensitive"
        };
    }

    if (filters?.onlyParent) {
        where.type = CategoryType.MAIN;
    }

    if (
        filters?.type &&
        (
            filters.type === TransactionType.EXPENSE ||
            filters.type === TransactionType.INCOME
        )
    ) {
        where.forType = filters.type;
    }

    if (filters?.parent) {
        where.parentId = filters.parent;
    }

    const categories = await prisma.category.findMany({
        where,

        orderBy: groupedBy
            ? [
                { parentId: "asc" },
                { name: "asc" },
                { id: "asc" }
            ]
            : [
                { name: "asc" },
                { id: "asc" }
            ],

        take: take + 1,

        ...(cursor && {
            cursor: {
                userId: user.id,
                name: cursor.name,
                id: cursor.id
            }
        }),

        select: {
            id: true,
            name: true,
            type: true,
            forType: true,
            icon: true,

            ...(groupedBy && {
                parentId: true,

                parent: {
                    select: {
                        id: true,
                        name: true,
                        icon: true
                    }
                }
            })
        }
    });

    let nextCursor = null;

    if (categories.length > take) {
        categories.pop();

        const last = categories[categories.length - 1];

        nextCursor = last
            ? {
                name: last.name,
                id: last.id
            }
            : null;
    }

    if (!groupedBy) {
        return {
            data: categories,
            nextCursor
        };
    }

    const groupedCategories = categories.reduce((acc, category) => {

        const parentKey = category.parent?.id || "ungrouped";

        if (!acc[parentKey]) {
            acc[parentKey] = {
                parent: category.parent || null,
                categories: []
            };
        }

        acc[parentKey].categories.push(category);

        return acc;

    }, {} as Record<string, {
        parent: any;
        categories: typeof categories;
    }>);

    return {
        data: Object.values(groupedCategories),
        nextCursor
    };
};
