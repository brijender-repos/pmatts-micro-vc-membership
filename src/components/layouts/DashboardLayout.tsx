import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";
import { MembersFooter } from "./MembersFooter";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <MembersFooter />
    </div>
  );
};