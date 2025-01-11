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

type SortField = 'investment_date' | 'project_name' | 'investment_type' | 'amount';
type SortOrder = 'asc' | 'desc';

export function InvestmentHistory({ investments }: InvestmentHistoryProps) {
  const [sortField, setSortField] = useState<SortField>('investment_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter only completed investments
  const successfulInvestments = investments.filter(inv => inv.transaction_status === 'completed');

  const sortedInvestments = [...successfulInvestments].sort((a, b) => {
    const aValue = sortField === 'amount' ? Number(a[sortField]) : String(a[sortField]);
    const bValue = sortField === 'amount' ? Number(b[sortField]) : String(b[sortField]);
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

  console.log('Investments received:', investments);
  console.log('Successful investments:', successfulInvestments);
  console.log('Sorted investments:', sortedInvestments);

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
            <TableHead>
              <Button 
                variant="ghost" 
                className="p-0 font-bold hover:bg-transparent"
                onClick={() => toggleSort('investment_type')}
              >
                Type
                <SortIcon field="investment_type" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button 
                variant="ghost" 
                className="p-0 font-bold hover:bg-transparent"
                onClick={() => toggleSort('amount')}
              >
                Amount
                <SortIcon field="amount" />
              </Button>
            </TableHead>
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
          {sortedInvestments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                No investment history available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}