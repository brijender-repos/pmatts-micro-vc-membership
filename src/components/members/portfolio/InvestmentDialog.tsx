import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { UNIT_PRICE, MAX_UNITS } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";
import { paymentLogger } from "@/utils/paymentLogger";

const formSchema = z.object({
  units: z.number()
    .min(1, "Minimum 1 unit required")
    .max(MAX_UNITS, `Maximum ${MAX_UNITS} units allowed`),
  notes: z.string().optional(),
});

interface InvestmentDialogProps {
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestmentDialog({ projectName, open, onOpenChange }: InvestmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      units: 1,
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      paymentLogger.log('Starting investment submission', { projectName, values });
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Please sign in to invest");
      }

      const amount = values.units * UNIT_PRICE;
      const paymentLink = `https://pmny.in/PAYUMN/yrJqKQpnMTBF?amount=${amount}&productinfo=${encodeURIComponent(projectName)}&firstname=${encodeURIComponent(session.user.email || '')}&udf1=${encodeURIComponent(session.user.id)}&udf2=${encodeURIComponent(values.notes || '')}`;
      
      // Create initial investment record
      const { data: investment, error: investmentError } = await supabase
        .from('investments')
        .insert([{
          user_id: session.user.id,
          project_name: projectName,
          investment_type: 'investment',
          amount,
          units: values.units,
          notes: values.notes,
          transaction_status: 'initiated'
        }])
        .select()
        .single();

      if (investmentError) {
        throw investmentError;
      }

      // Update payment link with investment ID
      const finalPaymentLink = `${paymentLink}&udf3=${investment.id}`;
      paymentLogger.log('Opening payment link', { finalPaymentLink });
      
      window.open(finalPaymentLink, '_blank');
      onOpenChange(false);
      
      toast({
        title: "Investment Initiated",
        description: "You will be redirected to complete the payment.",
      });
    } catch (error) {
      paymentLogger.log('Investment submission error', error);
      toast({
        title: "Investment Error",
        description: error instanceof Error ? error.message : "Failed to process investment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invest in {projectName}</DialogTitle>
          <DialogDescription>
            Enter the number of units you want to invest in.
          </DialogDescription>
        </DialogHeader>

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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}