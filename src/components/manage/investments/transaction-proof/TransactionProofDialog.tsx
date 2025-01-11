import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TransactionProofForm } from "./TransactionProofForm";
import { FileUploader } from "./FileUploader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TransactionProofDialogProps {
  investmentId: string;
  onUploadComplete: (fileUrl: string) => void;
  form: UseFormReturn<any>;
  editMode?: boolean;
  proofId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransactionProofDialog({ 
  investmentId, 
  onUploadComplete,
  form,
  editMode = false,
  proofId,
  open,
  onOpenChange
}: TransactionProofDialogProps) {
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    try {
      if (editMode && proofId) {
        const { error } = await supabase
          .from('transaction_proofs')
          .update({
            transaction_details: formData.transaction_details,
            transaction_date: formData.transaction_date,
            transaction_amount: formData.transaction_amount,
            payment_mode: formData.payment_mode,
          })
          .eq('id', proofId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Transaction proof updated successfully",
        });

        onUploadComplete("");
      }
    } catch (error) {
      console.error('Error updating proof:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction proof",
        variant: "destructive",
      });
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {editMode ? "Edit Transaction Proof" : "Add Transaction Proof"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <TransactionProofForm form={form} />
          {!editMode && (
            <FileUploader 
              investmentId={investmentId}
              onUploadComplete={onUploadComplete}
            />
          )}
          {editMode && (
            <Button type="submit" className="w-full">
              Update Transaction Proof
            </Button>
          )}
        </form>
      </Form>
    </DialogContent>
  );

  if (editMode) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Proof
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}