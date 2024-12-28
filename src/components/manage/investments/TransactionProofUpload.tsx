import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, X } from "lucide-react";

interface TransactionProofUploadProps {
  investmentId: string;
  onUploadComplete: (fileUrl: string) => void;
  existingFiles?: Array<{
    id: string;
    file_url: string;
    file_name: string;
  }>;
}

export function TransactionProofUpload({ 
  investmentId, 
  onUploadComplete,
  existingFiles = []
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

        const { data: urlData } = await supabase.storage
          .from('transaction_proofs')
          .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry

        if (!urlData?.signedUrl) throw new Error('Failed to generate file URL');

        const { error: dbError } = await supabase
          .from('transaction_proofs')
          .insert({
            investment_id: investmentId,
            file_url: urlData.signedUrl,
            file_name: file.name,
          });

        if (dbError) throw dbError;

        onUploadComplete(urlData.signedUrl);
      }

      toast({
        title: "Success",
        description: "Transaction proof(s) uploaded successfully",
      });
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Transaction Proof
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

      {existingFiles && existingFiles.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Uploaded Files</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 p-2 border rounded-md bg-muted"
              >
                <FileText className="h-4 w-4" />
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex-1 truncate"
                >
                  {file.file_name}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}