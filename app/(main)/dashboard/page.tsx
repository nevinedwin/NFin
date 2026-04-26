'use server';


import OverviewServer from "@/components/dashboard/overviewServer";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
    return <Dashboard overview={<OverviewServer />} />;
}