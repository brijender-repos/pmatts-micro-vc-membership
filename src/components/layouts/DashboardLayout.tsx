import { DashboardHeader } from "./DashboardHeader";
import { MembersFooter } from "./MembersFooter";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <MembersFooter />
    </div>
  );
};