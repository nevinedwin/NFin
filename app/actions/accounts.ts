'use server';

import { AccountType } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function createAccountAction(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const accountNumber = formData.get("accountNumber") as string | null;
    const balance = parseFloat(formData.get("balance") as string) || 0;
    const ifscCode = formData.get("ifscCode") as string | null;
    const branch = formData.get("branch") as string | null;
    const atmNumber = formData.get("atmNumber") as string | null;
    const cvv = formData.get("cvv") as string | null;
    const expiryDateRaw = formData.get("expiryDate") as string | '';
    const type = AccountType.BANK;

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
            userId: user.id,
            cvv,
            expiryDate: expiryDateRaw
        },
    });

    revalidatePath('/wallet');

    redirect('/wallet');
}