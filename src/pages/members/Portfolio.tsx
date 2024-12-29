import { useQuery } from "@tanstack/react-query";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";
import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { InvestmentReport } from "@/components/members/portfolio/InvestmentReport";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function Portfolio() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectFilter = searchParams.get('project');

  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments", projectFilter],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const query = supabase
        .from("investments")
        .select("*, projects(name, status)")
        .eq("user_id", session.user.id)
        .order("investment_date", { ascending: false });

      if (projectFilter) {
        query.eq("project_name", projectFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleResetFilter = () => {
    navigate('/members/portfolio');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate summary values for the report

  const totalInvested = investments?.reduce((total, inv) => {
    if (["Pre-Seed", "Seed", "Post-Seed"].includes(inv.investment_type)) {
      return total + inv.amount;
    }
    return total;
  }, 0) || 0;

  const totalReturns = investments?.reduce((total, inv) => {
    if (["Revenue-Based", "Convertible-Notes/SAFEs", "Equity-Crowdfunding"].includes(inv.investment_type)) {
      return total + inv.amount;
    }
    return total;
  }, 0) || 0;

  const activeProjects = new Set(
    investments?.filter(inv => inv.projects?.status === 'active')
      .map(inv => inv.project_name)
  ).size || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Investment Portfolio</h1>
            {projectFilter && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">
                  Filtered by project: {projectFilter}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={handleResetFilter}
                >
                  <X className="h-4 w-4" />
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
          <BlobProvider
            document={
              <InvestmentReport 
                investments={investments || []}
                totalInvested={totalInvested}
                totalReturns={totalReturns}
                activeProjects={activeProjects}
              />
            }
          >
            {({ url, loading }) => (
              <Button 
                disabled={loading} 
                asChild
              >
                <a href={url || '#'} download={`investment-report-${new Date().toISOString().split('T')[0]}.pdf`}>
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? "Generating PDF..." : "Download Report"}
                </a>
              </Button>
            )}
          </BlobProvider>
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
    </DashboardLayout>
  );
}
