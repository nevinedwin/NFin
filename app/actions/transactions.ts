'use server';

import { TransactionType } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const amount = Number(formData.get("amount"));
    const type = formData.get("type") as TransactionType;
    // const category = formData.get("category") as string;
    // const account = formData.get("account") as string;
    const category = '1';
    const account = '1';
    const repeat = formData.get("repeat") === "true";
    const description = formData.get("description") as string;
    const date = formData.get("date");


    if (!amount || amount <= 0) {
        throw new Error("Invalid Amount");
    }

    await prisma.transaction.create({
        data: {
            amount,
            description,
            category: { connect: { id: category } },
            account: { connect: { id: account } },
            date: date ? new Date(date.toString()) : undefined,
            repeat,
            type,
            user: { connect: { id: user.id } }
        }
    });

    revalidatePath('/dashboard');
}