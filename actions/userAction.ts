'use server';

import { getCurrentUser } from "@/auth/currentUser";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const changeShowBalance = async (showBalance: boolean) => {
    const user = await getCurrentUser();

    if (!user) throw new Error("Unauthorized");

    const account = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            showBalance
        }
    });

    revalidatePath("/");

    // go back to previous page
    const referer = (await headers()).get("referer") || "/";
    redirect(referer);

}


export const getUserDetails = async (id: string) => {
    if (!id) return;
    const user = prisma.user.findUnique({
        where: {
            id
        }
    })

    return user;
}