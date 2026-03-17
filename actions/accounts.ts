'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { prisma } from "@/lib/prisma";
import { createAccountSchema, updateAccountSchema } from "@/schemas/account.schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createAccountAction(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) throw new Error("Unauthorized");


    const rawData = Object.fromEntries(formData.entries());

    const parsed = createAccountSchema.safeParse(rawData);

    if (!parsed.success) {
        throw new Error(parsed.error.message);
    };

    const data = parsed.data;


    await prisma.account.create({
        data: {
            ...data,
            userId: user.id
        },
    });

    revalidatePath('/wallet');

    redirect('/wallet');
}


export async function updateAccountAction(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) throw new Error("Unauthorized");


    const rawData = Object.fromEntries(formData.entries());

    const parsed = updateAccountSchema.safeParse(rawData);

    if (!parsed.success) {
        throw new Error(parsed.error.message);
    };

    const { id, ...data } = parsed.data;

    const account = await prisma.account.update({
        where: {
            id,
            userId: user.id
        },
        data
    });

    revalidatePath(`/wallet/${id}`);

    redirect(`/wallet/${id}`);
}

export const getAccounts = async () => {

    const user = await getCurrentUser();
    if (!user) throw new Error('unAuthorized');

    const account = await prisma.account.findMany({
        where: { userId: user.id },
        select: { id: true, name: true, accountNumber: true },
    })

    return account;
};
