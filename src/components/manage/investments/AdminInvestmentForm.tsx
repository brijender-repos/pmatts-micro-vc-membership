import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { UNIT_PRICE, MAX_UNITS } from "@/types/payment";
import { TransactionProofUpload } from "./TransactionProofUpload";

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

interface AdminInvestmentFormProps {
  userId: string;
  projectName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function AdminInvestmentForm({ 
  userId, 
  projectName, 
  onSuccess, 
  onError 
}: AdminInvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: 1,
      notes: "",
      payment_mode: "Bank Transfer",
      transaction_notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
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

      toast({
        title: "Investment Added",
        description: "Investment details have been saved successfully",
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Investment submission error:', error);
      toast({
        title: "Investment Error",
        description: error instanceof Error ? error.message : "Failed to process investment",
        variant: "destructive",
      });
      onError?.(error instanceof Error ? error : new Error("Investment failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <TransactionProofUpload 
          investmentId={userId} 
          onUploadComplete={() => {}} 
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Add Investment"}
        </Button>
      </form>
    </Form>
  );
}