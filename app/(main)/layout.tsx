
import React from "react";
import MainShell from "@/components/layout/mainShell";
import { prisma } from "@/lib/prisma";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/currentUser";
import { User } from "@/generated/prisma/client";


const MainLayout = async ({ children }: { children: React.ReactNode }) => {

    const user = await getCurrentUser();
    if (!user) return redirect('/sign-up')

    let accounts: TransactionAccountType[] = [];
    let category: TransactionCategoryType[] = [];
    let userData: User | null = null;

    if (user) {
        accounts = await prisma.account.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                name: true,
                accountNumber: true,
                balance: true,
                countMeInTotal: true
            },
        });

        category = await prisma.category.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                name: true
            },
        });

        userData = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })
    }

    return (
        <MainShell accounts={accounts} category={category} userData={userData}>
            {children}
        </MainShell>
    );
}

export default MainLayout;