import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TransactionProofUpload } from "./TransactionProofUpload";
import { AdminInvestmentFormFields, formSchema, type FormFields } from "./AdminInvestmentFormFields";
import { useAdminInvestmentSubmit } from "./useAdminInvestmentSubmit";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PaymentMode, InvestmentStatus } from "@/types/investment";

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
  const [savedInvestmentId, setSavedInvestmentId] = useState<string | undefined>(investmentId);
  
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
    queryKey: ["proofs", savedInvestmentId],
    queryFn: async () => {
      if (!savedInvestmentId) return [];
      const { data, error } = await supabase
        .from("transaction_proofs")
        .select("*")
        .eq("investment_id", savedInvestmentId);

      if (error) throw error;
      return data;
    },
    enabled: !!savedInvestmentId,
  });

  // Define valid default values that match our type definitions
  const defaultPaymentMode = "Bank Transfer" as PaymentMode;
  const defaultInvestmentStatus = "Outstanding" as InvestmentStatus;
  
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: existingInvestment?.project_name || "",
      units: existingInvestment?.units || 1,
      notes: existingInvestment?.notes || "",
      payment_mode: existingInvestment?.payment_mode 
        ? (existingInvestment.payment_mode as PaymentMode) 
        : defaultPaymentMode,
      investment_type: existingInvestment?.investment_type || "Pre-Seed",
      investment_status: existingInvestment?.investment_status 
        ? (existingInvestment.investment_status as InvestmentStatus)
        : defaultInvestmentStatus,
    },
  });

  useEffect(() => {
    if (existingInvestment) {
      form.reset({
        project_name: existingInvestment.project_name,
        units: existingInvestment.units,
        notes: existingInvestment.notes,
        payment_mode: existingInvestment.payment_mode 
          ? (existingInvestment.payment_mode as PaymentMode)
          : defaultPaymentMode,
        investment_type: existingInvestment.investment_type,
        investment_status: existingInvestment.investment_status 
          ? (existingInvestment.investment_status as InvestmentStatus)
          : defaultInvestmentStatus,
      });
    }
  }, [existingInvestment, form]);

  const { handleSubmit: submitInvestment } = useAdminInvestmentSubmit({
    userId,
    investmentId,
    onSuccess,
    onError: (error) => {
      toast({
        title: "Investment Error",
        description: error.message,
        variant: "destructive",
      });
      onError?.(error);
    },
  });

  const onSubmit = async (values: FormFields) => {
    try {
      setIsSubmitting(true);
      const result = await submitInvestment(values);
      setSavedInvestmentId(result.id);
      toast({
        title: `Investment ${investmentId ? 'Updated' : 'Added'} Successfully`,
        description: `The investment has been ${investmentId ? 'updated' : 'saved'} successfully. You can now add transaction proofs.`,
      });
    } catch (error) {
      // Error is handled by useAdminInvestmentSubmit's onError callback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AdminInvestmentFormFields form={form} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : investmentId ? "Update Investment" : "Add Investment"}
            </Button>
          </form>
        </Form>
      </Card>

      {savedInvestmentId && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Proofs</h3>
          <TransactionProofUpload 
            investmentId={savedInvestmentId} 
            onUploadComplete={(fileUrl) => {
              setUploadedFiles(prev => [...prev, fileUrl]);
            }}
            existingFiles={existingProofs}
            form={form}
          />
        </Card>
      )}
    </div>
  );
}