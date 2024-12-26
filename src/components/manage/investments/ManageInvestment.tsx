import { TransactionProofUpload } from "./TransactionProofUpload";
import { TransactionProofList } from "./TransactionProofList";

interface ManageInvestmentProps {
  investmentId: string;
}

export function ManageInvestment({ investmentId }: ManageInvestmentProps) {
  return (
    <div className="space-y-6">
      <TransactionProofList investmentId={investmentId} />
      <TransactionProofUpload 
        investmentId={investmentId}
        onUploadComplete={() => {
          // Trigger a refetch of the transaction proofs list
          window.location.reload();
        }}
      />
    </div>
  );
}