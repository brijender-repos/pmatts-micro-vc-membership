import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TransactionProofUpload } from "./TransactionProofUpload";
import { AdminInvestmentFormFields, formSchema, type FormFields } from "./AdminInvestmentFormFields";
import { useAdminInvestmentSubmit } from "./useAdminInvestmentSubmit";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PaymentMode } from "@/types/investment";

interface AdminInvestmentFormProps {
  userId: string;
  investmentId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function AdminInvestmentForm({ 
  userId, 
  investmentId,
  onSuccess, 
  onError 
}: AdminInvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const { data: existingInvestment } = useQuery({
    queryKey: ["investment", investmentId],
    queryFn: async () => {
      if (!investmentId) return null;
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("id", investmentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!investmentId,
  });

  const { data: existingProofs } = useQuery({
    queryKey: ["proofs", investmentId],
    queryFn: async () => {
      if (!investmentId) return [];
      const { data, error } = await supabase
        .from("transaction_proofs")
        .select("*")
        .eq("investment_id", investmentId);

      if (error) throw error;
      return data;
    },
    enabled: !!investmentId,
  });
  
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: existingInvestment?.project_name || "",
      units: existingInvestment?.units || 1,
      notes: existingInvestment?.notes || "",
      payment_mode: (existingInvestment?.payment_mode as PaymentMode) || "Bank Transfer",
      investment_type: existingInvestment?.investment_type || "Pre-Seed",
      transaction_id: "",
      transaction_date: "",
      transaction_amount: undefined,
      transaction_details: "",
      transaction_status: "pending",
    },
  });

  useEffect(() => {
    if (existingInvestment) {
      form.reset({
        project_name: existingInvestment.project_name,
        units: existingInvestment.units,
        notes: existingInvestment.notes,
        payment_mode: existingInvestment.payment_mode as PaymentMode,
        investment_type: existingInvestment.investment_type,
        transaction_id: "",
        transaction_date: "",
        transaction_amount: undefined,
        transaction_details: "",
        transaction_status: "pending",
      });
    }
  }, [existingInvestment, form]);

  const { handleSubmit: submitInvestment } = useAdminInvestmentSubmit({
    userId,
    investmentId,
    onSuccess,
    onError,
  });

  const onSubmit = async (values: FormFields) => {
    try {
      setIsSubmitting(true);
      await submitInvestment(values);
      toast({
        title: `Investment ${investmentId ? 'Updated' : 'Added'}`,
        description: `Investment details have been ${investmentId ? 'updated' : 'saved'} successfully`,
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
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <AdminInvestmentFormFields form={form} />
          
          <TransactionProofUpload 
            investmentId={investmentId || userId} 
            onUploadComplete={(fileUrl) => {
              setUploadedFiles(prev => [...prev, fileUrl]);
            }}
            existingFiles={existingProofs}
            form={form}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : investmentId ? "Update Investment" : "Add Investment"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
