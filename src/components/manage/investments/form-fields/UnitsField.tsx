import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormFields } from "../AdminInvestmentFormFields";
import { UNIT_PRICE, MAX_UNITS } from "@/types/payment";

interface UnitsFieldProps {
  form: UseFormReturn<FormFields>;
}

export function UnitsField({ form }: UnitsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="units"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Number of Units</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={1}
              max={MAX_UNITS}
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
          </FormControl>
          <FormDescription>
            Cost per unit: ₹{UNIT_PRICE.toLocaleString('en-IN')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}