import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface AadharFormValues {
  number: string;
  name: string;
}

interface AadharStepProps {
  onComplete: (data: { number: string; name: string; imageUrl: string }) => void;
}

export function AadharStep({ onComplete }: AadharStepProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<AadharFormValues>({
    defaultValues: {
      number: "",
      name: "",
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/aadhar.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kyc_documents')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast({
        title: "Success",
        description: "Aadhar image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: AadharFormValues) => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload your Aadhar image",
        variant: "destructive",
      });
      return;
    }
    onComplete({ ...data, imageUrl });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Aadhar Details</h3>
        <p className="text-sm text-muted-foreground">
          Please enter your Aadhar card details and upload a clear image of your Aadhar card.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhar Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your 12-digit Aadhar number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (as per Aadhar)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Upload Aadhar Image</FormLabel>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <Upload className="h-4 w-4 animate-spin" />}
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Aadhar Preview"
                className="mt-2 max-w-xs rounded border"
              />
            )}
          </div>

          <Button type="submit" disabled={uploading}>
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}