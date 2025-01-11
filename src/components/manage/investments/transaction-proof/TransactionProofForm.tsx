import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAYMENT_MODES = [
  "NEFT/RTGS/IMPS",
  "Cheque or DD",
  "UPI",
  "Debit Card",
  "Credit Card",
  "Cash",
  "Other"
] as const;

interface TransactionProofFormProps {
  form: UseFormReturn<any>;
}

export function TransactionProofForm({ form }: TransactionProofFormProps) {
  return (
    <div className="grid gap-4">
      <FormField
        control={form.control}
        name="payment_mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Mode</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} required>
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="transaction_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  required
                  step="0.01"
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transaction_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Date</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="transaction_details"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transaction Details</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Enter transaction details (max 1000 characters)"
                maxLength={1000}
                required
                rows={2}
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}