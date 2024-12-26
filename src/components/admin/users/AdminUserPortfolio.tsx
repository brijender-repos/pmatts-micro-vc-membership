import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface Investment {
  id: string;
  project_name: string;
  investment_type: string;
  amount: number;
  investment_date: string;
  transaction_status: string;
}

interface AdminUserPortfolioProps {
  investments: Investment[];
}

export function AdminUserPortfolio({ investments }: AdminUserPortfolioProps) {
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Investment Summary</h3>
          <p className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Investment History</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell className="font-medium">{investment.project_name}</TableCell>
                <TableCell>{investment.investment_type}</TableCell>
                <TableCell>₹{investment.amount.toLocaleString()}</TableCell>
                <TableCell>{formatDate(investment.investment_date)}</TableCell>
                <TableCell>{investment.transaction_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}