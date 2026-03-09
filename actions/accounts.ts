'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { prisma } from "@/lib/prisma";
import { createAccountSchema } from "@/schemas/account.schema";
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