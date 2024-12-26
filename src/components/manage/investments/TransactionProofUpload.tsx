import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TransactionProofUploadProps {
  investmentId: string;
  onUploadComplete?: () => void;
}

export function TransactionProofUpload({ 
  investmentId, 
  onUploadComplete 
}: TransactionProofUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (files.length + newFiles.length > 3) {
      toast({
        title: "Maximum files exceeded",
        description: "You can only upload up to 3 files",
        variant: "destructive",
      });
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('investmentId', investmentId);

        const { data, error } = await supabase.functions.invoke(
          'upload-transaction-proof',
          {
            body: formData,
          }
        );

        if (error) throw error;
        return data;
      });

      await Promise.all(uploadPromises);
      
      toast({
        title: "Upload successful",
        description: "All files have been uploaded successfully",
      });
      
      setFiles([]);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Proofs</CardTitle>
        <CardDescription>
          Upload up to 3 files as proof of transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span className="truncate max-w-[200px]">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading || files.length >= 3}
          >
            Select Files
          </Button>
          <Button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </CardContent>
    </Card>
  );
}