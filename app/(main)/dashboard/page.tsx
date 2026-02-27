
"use client";

import HeaderCard from "@/components/dashboard/headerCard";
import { CardSkeleton } from "@/components/ui/card/cardSkeleton";
import { useMainShellContext } from "../context/mainShellContext";
import { useMemo } from "react";


const Dashboard = () => {

    const { accounts } = useMainShellContext();

    const balance = useMemo(() => {
        return accounts.reduce((sum, acc) => {
            if (acc.countMeInTotal) {
                return sum + acc.balance;
            }
            return sum;
        }, 0);
    }, [accounts]);

    return (
        <div className="flex justify-center items-center flex-col">
            <div className="w-full">
                <HeaderCard balance={balance} expense={100} income={800} showBalance={true} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-4">
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
                <CardSkeleton className="w-full" />
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