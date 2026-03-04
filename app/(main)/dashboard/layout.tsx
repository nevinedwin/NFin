import { getServerUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getServerUser();

    console.log(user, 'dashboard');

    if (!user) {
        redirect("/sign-up");
    }

    return <>{children}</>;
}