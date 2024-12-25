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
  // Filter only successful investments
  const successfulInvestments = investments.filter(inv => inv.transaction_status === 'success');

  const totalInvested = successfulInvestments.reduce((total, inv) => {
    if (inv.investment_type === 'investment' || inv.investment_type === 'follow_on') {
      return total + inv.amount;
    }
    return total;
  }, 0);

  const totalReturns = successfulInvestments.reduce((total, inv) => {
    if (inv.investment_type === 'distribution' || inv.investment_type === 'dividend' || inv.investment_type === 'exit') {
      return total + inv.amount;
    }
    return total;
  }, 0);

  const activeProjects = new Set(
    successfulInvestments
      .filter(inv => inv.projects.status === 'active')
      .map(inv => inv.project_name)
  ).size;

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