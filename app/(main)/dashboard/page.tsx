'use server';


import OverviewServer from "@/components/dashboard/overviewServer";
import Dashboard from "./dashboard";
import CategoryOverviewServer from "@/components/dashboard/catgeoryOverviewServer";

export default async function DashboardPage() {
    // return <Dashboard overview={<OverviewServer />} categoryOverView={<CategoryOverviewServer />} />;
    return <Dashboard />;
}