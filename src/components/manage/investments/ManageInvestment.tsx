import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransactionProofUpload } from "./TransactionProofUpload";
import { TransactionProofList } from "./TransactionProofList";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  transaction_details: z.string().min(1).max(1000),
  transaction_date: z.string().min(1),
  transaction_amount: z.number().min(0).optional(),
  payment_mode: z.enum([
    "NEFT/RTGS/IMPS",
    "Cheque or DD",
    "UPI",
    "Debit Card",
    "Credit Card",
    "Cash",
    "Other"
  ]),
});

interface ManageInvestmentProps {
  investmentId: string;
}

export function ManageInvestment({ investmentId }: ManageInvestmentProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_details: "",
      transaction_date: "",
      transaction_amount: undefined,
      payment_mode: "NEFT/RTGS/IMPS",
    },
  });

  return (
    <div className="space-y-6">
      <TransactionProofList investmentId={investmentId} />
      <Form {...form}>
        <TransactionProofUpload 
          investmentId={investmentId}
          onUploadComplete={() => {
            // Trigger a refetch of the transaction proofs list
            window.location.reload();
          }}
          form={form}
        />
      </Form>
    </div>
  );
}