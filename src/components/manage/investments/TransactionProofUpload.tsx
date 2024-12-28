import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TransactionProofUploadProps {
  investmentId: string;
  onUploadComplete: () => void;
}

export function TransactionProofUpload({ 
  investmentId, 
  onUploadComplete 
}: TransactionProofUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${investmentId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('transaction_proofs')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('transaction_proofs')
          .insert({
            investment_id: investmentId,
            file_url: filePath,
            file_name: file.name,
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: "Transaction proof(s) uploaded successfully",
      });
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload transaction proof",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="transaction-proof" className="block text-sm font-medium">
        Transaction Proof (Optional)
      </label>
      <input
        id="transaction-proof"
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('transaction-proof')?.click()}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Proof"}
      </Button>
    </div>
  );
}