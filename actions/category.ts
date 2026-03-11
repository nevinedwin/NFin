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
            name,
            type,
            forType,
            parentId: parentId || null,
            userId: user!.id
        }
    });
}