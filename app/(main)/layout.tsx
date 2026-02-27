
import React from "react";
import MainShell from "@/components/layout/mainShell";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction";


const MainLayout = async ({ children }: { children: React.ReactNode }) => {

    const { userId } = await auth();

    let accounts: TransactionAccountType[] = [];
    let category: TransactionCategoryType[] = [];

    if (userId) {
        accounts = await prisma.account.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                accountNumber: true,
                balance: true,
                countMeInTotal: true
            },
        });

        category = await prisma.category.findMany({
            where: { userId },
            select: {
                id: true,
                name: true
            },
        });
    }

    return (
        <MainShell accounts={accounts} category={category}>
            {children}
        </MainShell>
    );
}

export default MainLayout;