import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { NewsSection } from "@/components/NewsSection";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select("*, projects(*)")
        .order('investment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Project wise Investments</h2>
          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ProjectTiles investments={investments || []} />
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Latest Updates</h2>
          <NewsSection />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;