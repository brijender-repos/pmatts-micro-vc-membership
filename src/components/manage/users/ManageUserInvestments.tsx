import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InvestmentForm } from "@/components/InvestmentForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface Investment {
  id: string;
  project_name: string;
  investment_type: string;
  amount: number;
  units: number | null;
  investment_date: string;
  transaction_status: string;
  projects: {
    name: string;
    status: string;
  };
}

interface ManageUserInvestmentsProps {
  userId: string;
  investments: Investment[];
}

export function ManageUserInvestments({ userId, investments }: ManageUserInvestmentsProps) {
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Investment Summary</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalInvestment)}</p>
          </div>
          <Dialog open={isAddingInvestment} onOpenChange={setIsAddingInvestment}>
            <DialogTrigger asChild>
              <Button>Add Investment</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Investment</DialogTitle>
              </DialogHeader>
              <InvestmentForm
                projectName=""
                onSuccess={() => setIsAddingInvestment(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Investment History</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Units</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell>
                  {new Date(investment.investment_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{investment.project_name}</TableCell>
                <TableCell className="capitalize">
                  {investment.investment_type.replace("_", " ")}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(investment.amount)}
                </TableCell>
                <TableCell className="text-right">
                  {investment.units || "-"}
                </TableCell>
                <TableCell className="capitalize">
                  {investment.transaction_status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}