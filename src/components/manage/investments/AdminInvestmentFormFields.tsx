import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UNIT_PRICE, MAX_UNITS } from "@/types/payment";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  units: z.number()
    .min(1, "Minimum 1 unit required")
    .max(MAX_UNITS, `Maximum ${MAX_UNITS} units allowed`),
  notes: z.string().optional(),
  payment_mode: z.enum([
    "Bank Transfer",
    "UPI",
    "Credit Card",
    "Debit Card",
    "Cash",
    "Others"
  ]),
  transaction_notes: z.string().optional(),
});

type FormFields = z.infer<typeof formSchema>;

interface AdminInvestmentFormFieldsProps {
  form: UseFormReturn<FormFields>;
}

export function AdminInvestmentFormFields({ form }: AdminInvestmentFormFieldsProps) {
  return (
    <>
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
              Cost per unit: ₹{UNIT_PRICE.toLocaleString('en-IN')} | 
              Total: ₹{(field.value * UNIT_PRICE).toLocaleString('en-IN')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transaction_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transaction Details</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter transaction/transfer details"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any additional notes"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export { formSchema };
export type { FormFields };