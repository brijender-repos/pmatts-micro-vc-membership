import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export default function Portfolio() {
  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select("*, projects(*)");
      
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
            <InvestmentHistory investments={investments || []} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}