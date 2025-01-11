import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormFields } from "../AdminInvestmentFormFields";
import { INVESTMENT_TYPES } from "@/types/investment";

interface InvestmentTypeFieldProps {
  form: UseFormReturn<FormFields>;
}

export function InvestmentTypeField({ form }: InvestmentTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="investment_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Investment Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select investment type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {INVESTMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
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