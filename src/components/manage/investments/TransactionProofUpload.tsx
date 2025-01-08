import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TransactionProofForm } from "./transaction-proof/TransactionProofForm";
import { FileUploader } from "./transaction-proof/FileUploader";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";

interface TransactionProofUploadProps {
  investmentId: string;
  onUploadComplete: (fileUrl: string) => void;
  existingFiles?: Array<{
    id: string;
    file_url: string;
    file_name: string;
    transaction_id?: string;
    transaction_date?: string;
    transaction_amount?: number;
    transaction_details?: string;
    transaction_status?: string;
    payment_mode?: string;
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

  const handleUploadComplete = async (fileUrl: string) => {
    try {
      const { error: dbError } = await supabase
        .from('transaction_proofs')
        .insert({
          investment_id: investmentId,
          file_url: fileUrl,
          file_name: fileUrl.split('/').pop() || 'unknown',
          transaction_id: form.getValues('transaction_id'),
          transaction_date: form.getValues('transaction_date'),
          transaction_amount: form.getValues('transaction_amount'),
          transaction_details: form.getValues('transaction_details'),
          transaction_status: form.getValues('transaction_status'),
          payment_mode: form.getValues('payment_mode'),
        });

      if (dbError) throw dbError;

      setUploadedFiles(prev => [...prev, fileUrl]);
      onUploadComplete(fileUrl);
      
      // Reset form fields after successful upload
      form.reset({
        transaction_id: '',
        transaction_date: '',
        transaction_amount: undefined,
        transaction_details: '',
        transaction_status: 'pending',
        payment_mode: '',
      });
    } catch (error) {
      console.error('Database error:', error);
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
          <label className="block text-sm font-medium">Uploaded Files</label>
          <div className="grid grid-cols-1 gap-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 p-2 border rounded-md bg-muted hover:bg-muted/80 transition-colors"
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
                  {file.transaction_id && (
                    <p className="text-xs text-muted-foreground">
                      Transaction ID: {file.transaction_id}
                    </p>
                  )}
                  {file.transaction_amount && (
                    <p className="text-xs text-muted-foreground">
                      Amount: ₹{file.transaction_amount.toLocaleString('en-IN')}
                    </p>
                  )}
                  {file.payment_mode && (
                    <p className="text-xs text-muted-foreground">
                      Payment Mode: {file.payment_mode}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}