import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UNIT_PRICE, MAX_UNITS } from "@/types/payment";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";
import { InvestmentType } from "@/types/investment";

const PaymentModes = [
  "Bank Transfer",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Cash",
  "Others"
] as const;

const InvestmentTypes = [
  "Pre-Seed",
  "Seed",
  "Post-Seed",
  "Revenue-Based",
  "Convertible-Notes or SAFEs",
  "Equity-Crowdfunding",
  "Syndicate",
  "SPVs",
  "Royality-based"
] as const;

const InvestmentStatuses = [
  "Outstanding",
  "Partially Settled",
  "Fully Settled",
  "Over Paid",
  "Voided",
  "Refunded",
  "Write Off"
] as const;

export const formSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  units: z.number()
    .min(1, "Minimum 1 unit required")
    .max(MAX_UNITS, `Maximum ${MAX_UNITS} units allowed`),
  notes: z.string().optional(),
  payment_mode: z.enum(PaymentModes),
  investment_type: z.enum(InvestmentTypes).default("Pre-Seed"),
  investment_status: z.enum(InvestmentStatuses).default("Outstanding"),
});

export type FormFields = z.infer<typeof formSchema>;

interface AdminInvestmentFormFieldsProps {
  form: UseFormReturn<FormFields>;
}

export function AdminInvestmentFormFields({ form }: AdminInvestmentFormFieldsProps) {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("name")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const units = form.watch("units");
  const totalAmount = units * UNIT_PRICE;

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="project_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.name} value={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
                {InvestmentTypes.map((type) => (
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
                {InvestmentStatuses.map((status) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <FormLabel>Total Amount</FormLabel>
          <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted">
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

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
                {PaymentModes.map((mode) => (
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
    </div>
  );
}