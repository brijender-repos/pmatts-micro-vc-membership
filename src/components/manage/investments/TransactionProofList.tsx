import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionProofListProps {
  investmentId: string;
}

export function TransactionProofList({ investmentId }: TransactionProofListProps) {
  const { data: proofs, isLoading } = useQuery({
    queryKey: ['transaction-proofs', investmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transaction_proofs')
        .select('*')
        .eq('investment_id', investmentId);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading proofs...</div>;
  }

  if (!proofs?.length) {
    return <div>No transaction proofs uploaded yet.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Proofs</CardTitle>
        <CardDescription>
          View uploaded transaction proofs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proofs.map((proof) => (
              <TableRow key={proof.id}>
                <TableCell>
                  {new Date(proof.transaction_date).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{proof.transaction_amount.toLocaleString('en-IN')}</TableCell>
                <TableCell>{proof.payment_mode}</TableCell>
                <TableCell>{proof.transaction_id || 'N/A'}</TableCell>
                <TableCell>{proof.transaction_status || 'Pending'}</TableCell>
                <TableCell>
                  <a
                    href={proof.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                  >
                    View
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}