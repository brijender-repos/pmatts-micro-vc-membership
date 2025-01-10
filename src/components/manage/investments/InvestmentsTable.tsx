import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { InvestmentWithUser } from "@/types/investment";
import { TransactionProofList } from "./TransactionProofList";
import { TransactionProofUpload } from "./TransactionProofUpload";
import { useForm } from "react-hook-form";

interface InvestmentsTableProps {
  investments: InvestmentWithUser[] | undefined;
  isLoading: boolean;
  toggleSort: (field: "investment_date" | "full_name") => void;
  onManageInvestment?: (investmentId: string) => void;
}

export function InvestmentsTable({ 
  investments, 
  isLoading, 
  toggleSort,
  onManageInvestment 
}: InvestmentsTableProps) {
  const form = useForm();

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("investment_date")}
                className="flex items-center gap-2"
              >
                Date
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("full_name")}
                className="flex items-center gap-2"
              >
                Investor
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : investments?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No investments found
              </TableCell>
            </TableRow>
          ) : (
            investments?.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell>
                  {format(new Date(investment.investment_date), "PP")}
                </TableCell>
                <TableCell>
                  <div>
                    <p>{investment.profiles?.full_name || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">
                      {investment.profiles?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {investment.profiles?.phone || "No phone"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{investment.project_name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {investment.investment_type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(investment.amount)}</TableCell>
                <TableCell>{investment.units || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      investment.transaction_status === "completed"
                        ? "default"
                        : investment.transaction_status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {investment.transaction_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Transaction Proofs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <div className="space-y-4">
                        <TransactionProofList investmentId={investment.id} />
                        <TransactionProofUpload 
                          investmentId={investment.id}
                          onUploadComplete={() => {}}
                          form={form}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}