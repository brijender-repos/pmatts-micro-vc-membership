import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormFields } from "../AdminInvestmentFormFields";
import { INVESTMENT_STATUSES } from "@/types/investment";

interface InvestmentStatusFieldProps {
  form: UseFormReturn<FormFields>;
}

export function InvestmentStatusField({ form }: InvestmentStatusFieldProps) {
  return (
    <FormField
      control={form.control}
      name="investment_status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Investment Status</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select investment status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {INVESTMENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
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