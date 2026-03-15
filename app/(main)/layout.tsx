
import React from "react";
import MainShell from "@/components/layout/mainShell";
import { prisma } from "@/lib/prisma";
import { AccountSafeType, TransactionAccountPayloadType, TransactionCategoryType } from "@/types/transaction";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/currentUser";
import { User } from "@/generated/prisma/client";
import { serializeDecimal } from "@/lib/utils/formats";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {

    const user = await getCurrentUser();
    if (!user) return redirect('/sign-up')

    const [rawAccounts, category, userData] = await Promise.all([
        prisma.account.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                name: true,
                accountNumber: true,
                balance: true,
                countMeInTotal: true
            }
        }),
        prisma.category.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                name: true
            },
        }),
        prisma.user.findUnique({
            where: { id: user.id }
        })
    ]);

    const accounts: AccountSafeType[] = rawAccounts.map(acc => ({
        ...acc,
        balance: acc.balance.toString()
    }));

    return (
        <MainShell accounts={accounts} category={category} userData={userData}>
            {children}
        </MainShell>
    );
}
export default MainLayout;