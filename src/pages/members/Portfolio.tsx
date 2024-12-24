import { useQuery } from "@tanstack/react-query";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";
import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { InvestmentReport } from "@/components/members/portfolio/InvestmentReport";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function Portfolio() {
  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from("investments")
        .select("*, projects(name, status)")
        .eq("user_id", session.user.id)
        .order("investment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Investment Portfolio</h1>
        <PDFDownloadLink
          document={<InvestmentReport investments={investments || []} />}
          fileName={`investment-report-${new Date().toISOString().split('T')[0]}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading} type="button">
              <Download className="mr-2 h-4 w-4" />
              {loading ? "Generating PDF..." : "Download Report"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <InvestmentSummary investments={investments || []} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Investments</h2>
        <ProjectTiles investments={investments || []} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Investment History</h2>
        <InvestmentHistory investments={investments || []} />
      </div>
    </div>
  );
}