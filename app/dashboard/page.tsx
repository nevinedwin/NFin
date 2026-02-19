
"use client";

import { SignOutButton } from "@clerk/nextjs";


const Dashboard = () => {
    return (
        <div className="flex justify-center items-center flex-col">
            <h1 className="text-white font-semibold">Nevin Finance App</h1>

            <SignOutButton redirectUrl="/">
                <button className="px-4 py-1.5 text-sm bg-white text-black rounded-lg hover:bg-zinc-200 transition">
                    Logout
                </button>
            </SignOutButton>

        </div>
    )
}

export default Dashboard;