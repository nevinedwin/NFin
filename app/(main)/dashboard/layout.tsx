import { getCurrentUser } from "@/auth/currentUser";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    return <>{children}</>;
}