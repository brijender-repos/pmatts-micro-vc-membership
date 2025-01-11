import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { TransactionProofDialog } from "./transaction-proof/TransactionProofDialog";
import { useForm } from "react-hook-form";
import { TransactionProofsTable } from "./transaction-proof/TransactionProofsTable";

interface TransactionProofListProps {
  investmentId: string;
}

export function TransactionProofList({ investmentId }: TransactionProofListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProof, setEditingProof] = useState<any>(null);
  const form = useForm();

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

  return (
    <div>
      <TransactionProofsTable
        proofs={proofs || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
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
    </div>
  );
}