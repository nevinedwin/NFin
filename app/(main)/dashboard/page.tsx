
"use client";

import { RUPEE_SYMBOL } from "@/app/constants";
import HeaderCard from "@/components/dashboard/headerCard";
import { Card } from "@/components/ui/card/card";
import CardContent from "@/components/ui/card/cardContent";
import { CardSkeleton } from "@/components/ui/card/cardSkeleton";
import { ArrowDown, ArrowUp, Wallet2 } from "lucide-react";


const Dashboard = () => {
    return (
        <div className="flex justify-center items-center flex-col">
            <div className="w-full">
                <HeaderCard balance={200} expense={100} income={800} showBalance={true}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-4">
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                 <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                 <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
                <CardSkeleton className="w-full"/>
            </div>
        </div>
    )
}

export default Dashboard;