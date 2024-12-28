import { supabase } from "@/integrations/supabase/client";
import { UNIT_PRICE } from "@/types/payment";
import { FormFields } from "./AdminInvestmentFormFields";

interface UseAdminInvestmentSubmitProps {
  userId: string;
  projectName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAdminInvestmentSubmit({
  userId,
  projectName,
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

      const { data, error } = await supabase
        .from('investments')
        .insert([
          {
            user_id: userId,
            project_name: projectName,
            units: values.units,
            amount: values.units * UNIT_PRICE,
            investment_type: 'investment',
            notes: values.notes,
            payment_mode: values.payment_mode,
            transaction_notes: values.transaction_notes,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      onSuccess?.();
      return data;
    } catch (error) {
      console.error('Investment submission error:', error);
      onError?.(error instanceof Error ? error : new Error("Investment failed"));
      throw error;
    }
  };

  return { handleSubmit };
}