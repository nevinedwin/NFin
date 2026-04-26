
"use client";

import HeaderCard from "@/components/dashboard/headerCard";
import { CardSkeleton } from "@/components/ui/card/cardSkeleton";
import { useMainShellContext } from "../context/mainShellContext";
import React, { useMemo } from "react";
import RecentTransaction from "@/components/transaction/recentTransactions.tsx/recentTransaction";
import WalletCard from "@/components/dashboard/walletCard";


const Dashboard = ({ overview }: { overview: React.ReactNode }) => {

    const { accounts, recentTransaction } = useMainShellContext();

    const balance = useMemo(() => {
        return accounts.reduce((sum, acc) => {
            if (acc.countMeInTotal) {
                return sum + Number(acc.balance);
            }
            return sum;
        }, 0);
    }, [accounts]);

    return (
        <div className="flex justify-center space-y-6 items-center flex-col">
            <div className="w-full">
                <HeaderCard balance={balance} expense={100} income={800} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full p-4 gap-4">
                {overview}
                <RecentTransaction recentTransaction={recentTransaction} />
                <WalletCard />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
            </div>
        </div>
    )
}

export default Dashboard;