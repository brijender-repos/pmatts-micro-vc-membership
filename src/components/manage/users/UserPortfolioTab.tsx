import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserPortfolioTabProps {
  userId: string;
}

export function UserPortfolioTab({ userId }: UserPortfolioTabProps) {
  const { data: investments, isLoading } = useQuery({
    queryKey: ["user-investments", userId],
    queryFn: async () => {
      console.log("Fetching investments for user:", userId);
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          projects (
            name,
            status
          )
        `)
        .eq("user_id", userId)
        .order("investment_date", { ascending: false });

      if (error) {
        console.error("Error fetching investments:", error);
        throw error;
      }
      
      console.log("Fetched investments:", data);
      return data || [];
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading investment data...</p>
      </Card>
    );
  }

  if (!investments || investments.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No investment data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <InvestmentSummary investments={investments} />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <ProjectTiles investments={investments} />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Investment History</h2>
        <InvestmentHistory investments={investments} />
      </div>
    </div>
  );
}