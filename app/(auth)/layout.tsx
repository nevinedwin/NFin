import { getCurrentUser } from "@/auth/currentUser";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({ children }: { children: React.ReactNode; }) {

    // const user = await getCurrentUser();
    // if (user) return redirect('/dashboard')


    return (
        <div className="h-full">
            {children}
        </div>
    )
}