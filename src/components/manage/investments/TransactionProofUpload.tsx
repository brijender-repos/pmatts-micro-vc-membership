import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TransactionProofForm } from "./transaction-proof/TransactionProofForm";
import { FileUploader } from "./transaction-proof/FileUploader";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const transactionProofSchema = z.object({
  transaction_details: z.string().min(1).max(1000),
  transaction_date: z.string().min(1),
  transaction_amount: z.number().min(0),
  payment_mode: z.enum([
    "NEFT/RTGS/IMPS",
    "Cheque or DD",
    "UPI",
    "Debit Card",
    "Credit Card",
    "Cash",
    "Other"
  ]),
});

interface TransactionProofUploadProps {
  investmentId: string;
  onUploadComplete: (fileUrl: string) => void;
  existingFiles?: Array<{
    id: string;
    file_url: string;
    file_name: string;
    transaction_details: string;
    transaction_date: string;
    transaction_amount: number;
    payment_mode: string;
  }>;
  form: UseFormReturn<any>;
}

export function TransactionProofUpload({ 
  investmentId, 
  onUploadComplete,
  existingFiles = [],
  form
}: TransactionProofUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleUploadComplete = async (fileUrl: string) => {
    try {
      const formData = {
        transaction_details: form.getValues('transaction_details'),
        transaction_date: form.getValues('transaction_date'),
        transaction_amount: form.getValues('transaction_amount'),
        payment_mode: form.getValues('payment_mode'),
      };

      // Validate form data
      const validationResult = transactionProofSchema.safeParse(formData);
      
      if (!validationResult.success) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly",
          variant: "destructive",
        });
        return;
      }

      const { error: dbError } = await supabase
        .from('transaction_proofs')
        .insert({
          investment_id: investmentId,
          file_url: fileUrl,
          file_name: fileUrl.split('/').pop() || 'unknown',
          ...formData,
        });

      if (dbError) throw dbError;

      setUploadedFiles(prev => [...prev, fileUrl]);
      onUploadComplete(fileUrl);
      
      toast({
        title: "Success",
        description: "Transaction proof uploaded successfully",
      });

      // Reset form fields after successful upload
      form.reset({
        transaction_details: '',
        transaction_date: '',
        transaction_amount: undefined,
        payment_mode: '',
      });
    } catch (error) {
      console.error('Database error:', error);
      toast({
        title: "Error",
        description: "Failed to save transaction proof",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <TransactionProofForm form={form} />
      
      <FileUploader 
        investmentId={investmentId}
        onUploadComplete={handleUploadComplete}
      />

      {existingFiles && existingFiles.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Uploaded Proofs</label>
          <div className="grid grid-cols-1 gap-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 p-4 border rounded-md bg-muted hover:bg-muted/80 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <div className="flex-1 space-y-1">
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block"
                  >
                    {file.file_name}
                  </a>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Details: {file.transaction_details}</p>
                    <p>Date: {new Date(file.transaction_date).toLocaleString()}</p>
                    <p>Amount: ₹{file.transaction_amount.toLocaleString('en-IN')}</p>
                    <p>Payment Mode: {file.payment_mode}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}