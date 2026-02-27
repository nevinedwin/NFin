
import React from "react";
import MainShell from "@/components/layout/mainShell";
import { prisma } from "@/lib/prisma";
import { TransactionAccountType, TransactionCategoryType } from "@/types/transaction";
import { getCurrentUser } from "@/lib/db";


const MainLayout = async ({ children }: { children: React.ReactNode }) => {

    const user = await getCurrentUser();
    if (!user) return <div>UnAuthorized</div>

    let accounts: TransactionAccountType[] = [];
    let category: TransactionCategoryType[] = [];

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
    }

    return (
        <MainShell accounts={accounts} category={category}>
            {children}
        </MainShell>
    );
}

export default MainLayout;