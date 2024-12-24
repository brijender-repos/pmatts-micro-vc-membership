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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentFormData, UNIT_PRICE, MAX_UNITS } from "@/types/payment";

const formSchema = z.object({
  units: z.number()
    .min(1, "Minimum 1 unit required")
    .max(MAX_UNITS, `Maximum ${MAX_UNITS} units allowed`),
  notes: z.string().optional(),
});

interface InvestmentFormProps {
  projectName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function InvestmentForm({ projectName, onSuccess, onError }: InvestmentFormProps) {
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
      console.log('Starting investment submission process:', { projectName, values });
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Please sign in to invest");
      }
      console.log('User session verified:', { userId: session.user.id });

      console.log('Initiating payment with edge function:', {
        user_id: session.user.id,
        project_name: projectName,
        units: values.units,
        notes: values.notes,
      });

      const { data, error } = await supabase.functions.invoke('initiate-payment', {
        body: {
          user_id: session.user.id,
          project_name: projectName,
          units: values.units,
          notes: values.notes,
        },
      });

      if (error) {
        console.error('Payment initiation error:', error);
        throw error;
      }

      console.log('Payment data received from edge function:', data);

      // Validate required PayU fields
      const requiredFields = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'surl', 'furl', 'hash'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required PayU fields:', missingFields);
        throw new Error(`Missing required PayU fields: ${missingFields.join(', ')}`);
      }

      // Show processing message
      toast({
        title: "Processing Payment",
        description: "You will be redirected to the payment gateway...",
      });

      // Create and submit PayU form
      const payuForm = document.createElement('form');
      payuForm.method = 'POST';
      payuForm.action = 'https://secure.payu.in/_payment';

      console.log('Creating PayU form with fields:', {
        ...data,
        hash: `${data.hash.substring(0, 10)}...`, // Only log part of the hash for security
      });

      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        payuForm.appendChild(input);
        if (key !== 'hash') { // Don't log the full hash
          console.log(`Added PayU form field: ${key}=${value}`);
        } else {
          console.log(`Added PayU form field: hash=${value.substring(0, 10)}...`);
        }
      });

      // Add an event listener for when the form is submitted
      window.addEventListener('payu_callback', (event: any) => {
        console.log('Received PayU callback:', event.detail);
        if (event.detail.status === 'success') {
          toast({
            title: "Payment Successful",
            description: "Your investment has been processed successfully.",
          });
        } else {
          toast({
            title: "Payment Failed",
            description: event.detail.message || "Sorry, unable to process payment. Please try again.",
            variant: "destructive",
          });
        }
      }, { once: true });

      console.log('Submitting PayU form...');
      document.body.appendChild(payuForm);
      payuForm.submit();
      
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
          {isSubmitting ? "Processing..." : "Invest Now"}
        </Button>
      </form>
    </Form>
  );
}