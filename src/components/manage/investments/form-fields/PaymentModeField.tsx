import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormFields } from "../AdminInvestmentFormFields";
import { PAYMENT_MODES } from "@/types/investment";

interface PaymentModeFieldProps {
  form: UseFormReturn<FormFields>;
}

export function PaymentModeField({ form }: PaymentModeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="payment_mode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payment Mode</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
  );
}