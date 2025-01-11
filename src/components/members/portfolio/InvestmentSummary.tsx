import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Investment {
  id: string;
  project_name: string;
  investment_type: string;
  amount: number;
  units?: number;
  equity_percentage?: number;
  investment_date: string;
  transaction_status: string;
  projects: {
    name: string;
    status: string;
  };
}

interface InvestmentSummaryProps {
  investments: Investment[];
}

export function InvestmentSummary({ investments }: InvestmentSummaryProps) {
  // Filter valid investments (both 'success' and 'completed' statuses)
  const validInvestments = investments.filter(inv => 
    ['success', 'completed'].includes(inv.transaction_status.toLowerCase())
  );

  const totalInvested = validInvestments.reduce((total, inv) => {
    if (inv.investment_type === 'Pre-Seed' || inv.investment_type === 'Seed' || inv.investment_type === 'Post-Seed') {
      return total + inv.amount;
    }
    return total;
  }, 0);

  const totalReturns = validInvestments.reduce((total, inv) => {
    if (inv.investment_type === 'Revenue-Based' || inv.investment_type === 'Convertible-Notes or SAFEs' || inv.investment_type === 'Equity-Crowdfunding') {
      return total + inv.amount;
    }
    return total;
  }, 0);

  const activeProjects = new Set(
    validInvestments
      .filter(inv => inv.projects?.status === 'active')
      .map(inv => inv.project_name)
  ).size;

  console.log('Summary - All investments:', investments);
  console.log('Summary - Valid investments:', validInvestments);
  console.log('Summary - Totals:', { totalInvested, totalReturns, activeProjects });

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalReturns)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
        </CardContent>
      </Card>
    </div>
  );
}