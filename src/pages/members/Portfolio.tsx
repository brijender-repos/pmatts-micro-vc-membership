import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { InvestmentReport } from "@/components/members/portfolio/InvestmentReport";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import type { BlobProvider } from "@react-pdf/renderer";

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

  // Calculate summary data for the PDF report
  const calculateSummaryData = () => {
    if (!investments) return { totalInvested: 0, totalReturns: 0, activeProjects: 0 };

    const totalInvested = investments.reduce((total, inv) => {
      if (inv.investment_type === 'investment' || inv.investment_type === 'follow_on') {
        return total + inv.amount;
      }
      return total;
    }, 0);

    const totalReturns = investments.reduce((total, inv) => {
      if (inv.investment_type === 'distribution' || inv.investment_type === 'dividend' || inv.investment_type === 'exit') {
        return total + inv.amount;
      }
      return total;
    }, 0);

    const activeProjects = new Set(
      investments
        .filter(inv => inv.projects.status === 'active')
        .map(inv => inv.project_name)
    ).size;

    return { totalInvested, totalReturns, activeProjects };
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Investment Portfolio</h1>
          {!isLoading && investments && (
            <PDFDownloadLink
              document={
                <InvestmentReport
                  investments={investments}
                  {...calculateSummaryData()}
                />
              }
              fileName={`investment-report-${new Date().toISOString().split('T')[0]}.pdf`}
            >
              {({ loading }) => (
                <Button disabled={loading} type="button">
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? "Generating PDF..." : "Download Report"}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            <InvestmentSummary investments={investments || []} />
            <h2 className="text-2xl font-semibold mb-4">Investment History</h2>
            <InvestmentHistory investments={investments || []} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}