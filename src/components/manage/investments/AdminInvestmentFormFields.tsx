import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { UNIT_PRICE, MAX_UNITS } from "@/types/payment";
import { 
  PaymentMode, 
  InvestmentType,
  InvestmentStatus,
  PAYMENT_MODES,
  INVESTMENT_TYPES,
  INVESTMENT_STATUSES 
} from "@/types/investment";
import { ProjectNameField } from "./form-fields/ProjectNameField";
import { InvestmentTypeField } from "./form-fields/InvestmentTypeField";
import { InvestmentStatusField } from "./form-fields/InvestmentStatusField";
import { UnitsField } from "./form-fields/UnitsField";
import { PaymentModeField } from "./form-fields/PaymentModeField";
import { FormLabel } from "@/components/ui/form";

// Convert arrays to tuples for Zod
const PaymentModesEnum = PAYMENT_MODES as unknown as [PaymentMode, ...PaymentMode[]];
const InvestmentTypesEnum = INVESTMENT_TYPES as unknown as [InvestmentType, ...InvestmentType[]];
const InvestmentStatusesEnum = INVESTMENT_STATUSES as unknown as [InvestmentStatus, ...InvestmentStatus[]];

export const formSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  units: z.number()
    .min(1, "Minimum 1 unit required")
    .max(MAX_UNITS, `Maximum ${MAX_UNITS} units allowed`),
  notes: z.string().optional(),
  payment_mode: z.enum(PaymentModesEnum),
  investment_type: z.enum(InvestmentTypesEnum).default("Pre-Seed"),
  investment_status: z.enum(InvestmentStatusesEnum).default("Outstanding"),
});

export type FormFields = z.infer<typeof formSchema>;

interface AdminInvestmentFormFieldsProps {
  form: UseFormReturn<FormFields>;
}

export function AdminInvestmentFormFields({ form }: AdminInvestmentFormFieldsProps) {
  const units = form.watch("units");
  const totalAmount = units * UNIT_PRICE;

  return (
    <div className="space-y-6">
      <ProjectNameField form={form} />
      <InvestmentTypeField form={form} />
      <InvestmentStatusField form={form} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UnitsField form={form} />
        <div>
          <FormLabel>Total Amount</FormLabel>
          <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted">
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <PaymentModeField form={form} />
    </div>
  );
}