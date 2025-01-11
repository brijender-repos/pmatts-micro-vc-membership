import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Pencil, RefreshCw, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { TransactionProofDialog } from "./transaction-proof/TransactionProofDialog";
import { useForm } from "react-hook-form";

interface TransactionProofListProps {
  investmentId: string;
}

export function TransactionProofList({ investmentId }: TransactionProofListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProof, setEditingProof] = useState<any>(null);
  const form = useForm();

  const { data: proofs, isLoading, refetch } = useQuery({
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

  const handleDelete = async (proofId: string) => {
    try {
      const { error } = await supabase
        .from('transaction_proofs')
        .delete()
        .eq('id', proofId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction proof deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['transaction-proofs', investmentId] });
    } catch (error) {
      console.error('Error deleting proof:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction proof",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Updating transaction proofs list...",
    });
  };

  const handleEdit = (proof: any) => {
    form.reset({
      transaction_details: proof.transaction_details,
      transaction_date: new Date(proof.transaction_date).toISOString().slice(0, 16),
      transaction_amount: proof.transaction_amount,
      payment_mode: proof.payment_mode,
    });
    setEditingProof(proof);
  };

  const handleEditComplete = () => {
    setEditingProof(null);
    form.reset();
    queryClient.invalidateQueries({ queryKey: ['transaction-proofs', investmentId] });
  };

  if (isLoading) {
    return <div>Loading proofs...</div>;
  }

  if (!proofs?.length) {
    return <div>No transaction proofs uploaded yet.</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction Proofs</CardTitle>
          <CardDescription>
            View uploaded transaction proofs
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className="h-8 w-8"
          title="Refresh proofs"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
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
              <TableHead>Actions</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(proof)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(proof.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {editingProof && (
        <TransactionProofDialog
          investmentId={investmentId}
          onUploadComplete={handleEditComplete}
          form={form}
          editMode={true}
          proofId={editingProof.id}
          open={!!editingProof}
          onOpenChange={(open) => !open && setEditingProof(null)}
        />
      )}
    </Card>
  );
}