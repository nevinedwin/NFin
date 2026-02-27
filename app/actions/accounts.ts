'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createAccountAction(formData: FormData) {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const accountNumber = formData.get("accountNumber") as string | null;
    const balance = parseFloat(formData.get("balance") as string) || 0;
    const ifscCode = formData.get("ifscCode") as string | null;
    const branch = formData.get("branch") as string | null;
    const atmNumber = formData.get("atmNumber") as string | null;
    const cvv = formData.get("cvv") as string | null;
    const expiryDateRaw = formData.get("expiryDate") as string | null;
    const type = 'CREDIT';

    if (!name) throw new Error("Account name is required");

    await prisma.account.create({
        data: {
            type,
            name,
            accountNumber,
            balance,
            ifscCode,
            branch,
            atmNumber,
            userId,
            cvv,
            expiryDate: expiryDateRaw ? new Date(expiryDateRaw) : null
        },
    });

    revalidatePath('/wallet');

    redirect('/wallet');
}