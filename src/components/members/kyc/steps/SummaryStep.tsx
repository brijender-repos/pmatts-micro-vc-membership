import { CheckCircle } from "lucide-react";

interface SummaryStepProps {
  formData: {
    aadhar: { number: string; name: string; imageUrl: string };
    pan: { number: string; name: string; imageUrl: string };
  };
  onComplete: () => void;
}

export function SummaryStep({ formData }: SummaryStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Verification Pending</h3>
        <p className="text-sm text-muted-foreground">
          Your KYC documents have been submitted successfully and are pending verification.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h4 className="font-medium">Aadhar Details Submitted</h4>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Name: {formData.aadhar.name}</p>
            <p>Number: {formData.aadhar.number}</p>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h4 className="font-medium">PAN Details Submitted</h4>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Name: {formData.pan.name}</p>
            <p>Number: {formData.pan.number}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Our team will verify your documents and update your KYC status within 24-48 hours.
          You will be notified once the verification is complete.
        </p>
      </div>
    </div>
  );
}