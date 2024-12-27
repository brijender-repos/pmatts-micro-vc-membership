import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/components/manage/dashboard/DashboardStats";
import { TopInvestors } from "@/components/manage/dashboard/TopInvestors";
import { InvestmentTrends } from "@/components/manage/dashboard/InvestmentTrends";
import { MemberGrowth } from "@/components/manage/dashboard/MemberGrowth";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform statistics and trends
        </p>
      </div>

      <DashboardStats />
      
      <div className="grid gap-4 md:grid-cols-3">
        <TopInvestors />
        <Card className="col-span-1">
          {/* Reserved for future widget */}
        </Card>
      </div>

      <InvestmentTrends />
      <MemberGrowth />
    </div>
  );
}