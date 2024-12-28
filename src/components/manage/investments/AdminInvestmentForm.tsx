import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TransactionProofUpload } from "./TransactionProofUpload";
import { AdminInvestmentFormFields, formSchema, type FormFields } from "./AdminInvestmentFormFields";
import { useAdminInvestmentSubmit } from "./useAdminInvestmentSubmit";

interface AdminInvestmentFormProps {
  userId: string;
  projectName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function AdminInvestmentForm({ 
  userId, 
  projectName, 
  onSuccess, 
  onError 
}: AdminInvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: 1,
      notes: "",
      payment_mode: "Bank Transfer",
      transaction_notes: "",
    },
  });

  const { handleSubmit: submitInvestment } = useAdminInvestmentSubmit({
    userId,
    projectName,
    onSuccess,
    onError,
  });

  const onSubmit = async (values: FormFields) => {
    try {
      setIsSubmitting(true);
      await submitInvestment(values);
      toast({
        title: "Investment Added",
        description: "Investment details have been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Investment Error",
        description: error instanceof Error ? error.message : "Failed to process investment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AdminInvestmentFormFields form={form} />
        
        <TransactionProofUpload 
          investmentId={userId} 
          onUploadComplete={() => {}} 
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Add Investment"}
        </Button>
      </form>
    </Form>
  );
}