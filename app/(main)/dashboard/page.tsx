
"use client";

import { CardSkeleton } from "@/components/ui/card/cardSkeleton";
import { SignOutButton } from "@clerk/nextjs";


const Dashboard = () => {
    return (
        <div className="flex justify-center items-center flex-col">
            <h1 className="text-white font-semibold">Nevin Finance App</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-4">
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