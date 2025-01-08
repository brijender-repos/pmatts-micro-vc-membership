import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/bmp',
  'application/pdf'
];

const PAYMENT_MODES = [
  "Bank Transfer",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Cash",
  "Others"
];

const TRANSACTION_STATUSES = [
  "pending",
  "completed",
  "failed",
  "refunded"
];

export function TransactionProofUpload({ 
  investmentId, 
  onUploadComplete,
  existingFiles = [],
  form
}: TransactionProofUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

        const { error: dbError } = await supabase
          .from('transaction_proofs')
          .insert({
            investment_id: investmentId,
            file_url: urlData.signedUrl,
            file_name: file.name,
            transaction_id: form.getValues('transaction_id'),
            transaction_date: form.getValues('transaction_date'),
            transaction_amount: form.getValues('transaction_amount'),
            transaction_details: form.getValues('transaction_details'),
            transaction_status: form.getValues('transaction_status'),
            payment_mode: form.getValues('payment_mode'),
          });

        if (dbError) throw dbError;

        onUploadComplete(urlData.signedUrl);
        
        // Reset form fields after successful upload
        form.reset({
          transaction_id: '',
          transaction_date: '',
          transaction_amount: '',
          transaction_details: '',
          transaction_status: 'pending',
          payment_mode: '',
        });
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
    <div className="space-y-6">
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="transaction_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter transaction ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transaction_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Date</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transaction_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Mode</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transaction_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TRANSACTION_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transaction_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Details</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter transaction details" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          >
            {isUploading ? "Uploading..." : "Upload Proof"}
          </Button>
        </div>
      </div>

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