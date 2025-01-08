import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransactionProofUpload } from "./TransactionProofUpload";
import { TransactionProofList } from "./TransactionProofList";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  transaction_id: z.string().optional(),
  transaction_date: z.string().optional(),
  transaction_amount: z.number().optional(),
  transaction_details: z.string().optional(),
  transaction_status: z.string().default('pending'),
  payment_mode: z.string().optional(),
});

interface ManageInvestmentProps {
  investmentId: string;
}

export function ManageInvestment({ investmentId }: ManageInvestmentProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_id: "",
      transaction_date: "",
      transaction_amount: undefined,
      transaction_details: "",
      transaction_status: "pending",
      payment_mode: "",
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