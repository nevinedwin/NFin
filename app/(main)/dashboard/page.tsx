'use server';


import Dashboard from "./dashboard";
// import OverviewServer from "@/components/dashboard/overviewServer";
// import CategoryOverviewServer from "@/components/dashboard/catgeoryOverviewServer";

export default async function DashboardPage() {
    // return <Dashboard overview={<OverviewServer />} categoryOverView={<CategoryOverviewServer />} />;
    return <Dashboard />;
}