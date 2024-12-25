import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
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

interface InvestmentHistoryProps {
  investments: Investment[];
}

type SortField = 'investment_date' | 'project_name';
type SortOrder = 'asc' | 'desc';

export function InvestmentHistory({ investments }: InvestmentHistoryProps) {
  const [sortField, setSortField] = useState<SortField>('investment_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter only successful investments
  const successfulInvestments = investments.filter(inv => inv.transaction_status === 'success');

  const sortedInvestments = [...successfulInvestments].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    return aValue < bValue ? -1 * multiplier : aValue > bValue ? 1 * multiplier : 0;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                className="p-0 font-bold hover:bg-transparent"
                onClick={() => toggleSort('investment_date')}
              >
                Date
                <SortIcon field="investment_date" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                className="p-0 font-bold hover:bg-transparent"
                onClick={() => toggleSort('project_name')}
              >
                Project
                <SortIcon field="project_name" />
              </Button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Units</TableHead>
            <TableHead className="text-right">Equity %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvestments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell>{new Date(investment.investment_date).toLocaleDateString()}</TableCell>
              <TableCell>{investment.project_name}</TableCell>
              <TableCell className="capitalize">{investment.investment_type.replace('_', ' ')}</TableCell>
              <TableCell className="text-right">{formatCurrency(investment.amount)}</TableCell>
              <TableCell className="text-right">{investment.units || '-'}</TableCell>
              <TableCell className="text-right">{investment.equity_percentage ? `${investment.equity_percentage}%` : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}