import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";
import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export default function Portfolio() {
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Investment Portfolio</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            <InvestmentSummary investments={investments || []} />
            <h2 className="text-2xl font-semibold mb-4">Project wise Investments</h2>
            <ProjectTiles investments={investments || []} />
            <h2 className="text-2xl font-semibold mb-4">Investment History</h2>
            <InvestmentHistory investments={investments || []} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}