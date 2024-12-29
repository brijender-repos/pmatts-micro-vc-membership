import { supabase } from "@/integrations/supabase/client";
import { UNIT_PRICE } from "@/types/payment";
import { FormFields } from "./AdminInvestmentFormFields";

interface UseAdminInvestmentSubmitProps {
  userId: string;
  investmentId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAdminInvestmentSubmit({
  userId,
  investmentId,
  onSuccess,
  onError,
}: UseAdminInvestmentSubmitProps) {
  const handleSubmit = async (values: FormFields) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Admin authentication required");
      }

      const { data: adminCheck } = await supabase
        .from('profiles')
        .select('admin_role')
        .eq('id', session.user.id)
        .single();

      if (!adminCheck?.admin_role) {
        throw new Error("Admin privileges required");
      }

      const investmentData = {
        user_id: userId,
        project_name: values.project_name,
        units: values.units,
        amount: values.units * UNIT_PRICE,
        investment_type: values.investment_type,
        notes: values.notes,
        payment_mode: values.payment_mode,
      };

      let result;
      if (investmentId) {
        const { data, error } = await supabase
          .from('investments')
          .update(investmentData)
          .eq('id', investmentId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('investments')
          .insert([investmentData])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      onSuccess?.();
      return result;
    } catch (error) {
      console.error('Investment submission error:', error);
      onError?.(error instanceof Error ? error : new Error("Investment failed"));
      throw error;
    }
  };

  return { handleSubmit };
}