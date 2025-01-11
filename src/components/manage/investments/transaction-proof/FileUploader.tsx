import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploaderProps {
  investmentId: string;
  onUploadComplete: (fileUrl: string) => void;
}

export function FileUploader({ investmentId, onUploadComplete }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'application/pdf'
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file types
    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only images (JPG, PNG, BMP) and PDF files are allowed",
          variant: "destructive",
        });
        return;
      }
    }

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
          Upload Proof
        </label>
        <input
          id="transaction-proof"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.bmp,.pdf"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('transaction-proof')?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Choose File"}
        </Button>
      </div>
      
      <Button type="submit" className="w-full">
        Submit Transaction Proof
      </Button>
    </div>
  );
}