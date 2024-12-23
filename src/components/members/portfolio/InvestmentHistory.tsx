import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Investment {
  id: string;
  project_name: string;
  investment_type: string;
  amount: number;
  units?: number;
  equity_percentage?: number;
  investment_date: string;
  notes?: string;
  projects: {
    name: string;
    status: string;
  };
}

interface InvestmentHistoryProps {
  investments: Investment[];
}

export function InvestmentHistory({ investments }: InvestmentHistoryProps) {
  const sortedInvestments = [...investments].sort(
    (a, b) => new Date(b.investment_date).getTime() - new Date(a.investment_date).getTime()
  );

  const getInvestmentTypeColor = (type: string) => {
    switch (type) {
      case 'investment':
      case 'follow_on':
        return 'bg-green-500';
      case 'distribution':
      case 'dividend':
        return 'bg-blue-500';
      case 'exit':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Equity %</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvestments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell>
                {format(new Date(investment.investment_date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {investment.project_name}
                <Badge variant="outline" className="ml-2">
                  {investment.projects.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getInvestmentTypeColor(investment.investment_type)}>
                  {investment.investment_type}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(investment.amount)}</TableCell>
              <TableCell>{investment.units || '-'}</TableCell>
              <TableCell>{investment.equity_percentage ? `${investment.equity_percentage}%` : '-'}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {investment.notes || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}