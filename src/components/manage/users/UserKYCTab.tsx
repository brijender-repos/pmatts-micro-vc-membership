import { Card } from "@/components/ui/card";
import { KYCStatus } from "@/components/members/kyc/KYCStatus";

interface UserKYCTabProps {
  kycDetails: any;
}

export function UserKYCTab({ kycDetails }: UserKYCTabProps) {
  return (
    <Card className="p-6">
      <KYCStatus kycDetails={kycDetails} />
    </Card>
  );
}