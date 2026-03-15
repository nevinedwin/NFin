'use server';

import React from "react";
import MainShell from "@/components/layout/mainShell";
import { prisma } from "@/lib/prisma";
import { AccountSafeType } from "@/types/transaction";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/currentUser";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {

    const user = await getCurrentUser();
    if (!user) return redirect('/sign-up')

    const [rawAccounts, category, userData, recentTransactions] = await Promise.all([
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
        }),
        prisma.transaction.findMany({
            where: { userId: user.id },
            orderBy: { date: 'desc' },
            take: 3,
            select: {
                id: true,
                amount: true,
                description: true,
                type: true,
                date: true,
                category: { select: { name: true } },
                account: { select: { name: true } }
            }
        })
    ]);

    function serializeTransaction(tx: any) {
        return {
            ...tx,
            amount: tx.amount.toString(),
            description: tx.description ?? undefined
        };
    }

    const transactions = recentTransactions.map(serializeTransaction);

    const accounts: AccountSafeType[] = rawAccounts.map(acc => ({
        ...acc,
        balance: acc.balance.toString()
    }));

    return (
        <MainShell
            accounts={accounts}
            category={category}
            userData={userData}
            recentTransaction={transactions}
        >
            {children}
        </MainShell>
    );
}
export default MainLayout;