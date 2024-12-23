import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { NewsSection } from "@/components/NewsSection";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
        
        <NewsSection />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;