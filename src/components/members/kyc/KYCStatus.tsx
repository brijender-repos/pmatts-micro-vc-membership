import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface KYCStatusProps {
  kycDetails: any;
}

export function KYCStatus({ kycDetails }: KYCStatusProps) {
  if (!kycDetails) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline">Not Started</Badge>
        <span className="text-muted-foreground">Please complete your KYC verification</span>
      </div>
    );
  }

  const getStatusDisplay = () => {
    switch (kycDetails.status) {
      case 'verified':
        return (
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500">Verified</Badge>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        );
      case 'verification_pending':
        return (
          <div className="flex items-center space-x-2">
            <Badge className="bg-yellow-500">Pending Verification</Badge>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-2">
            <Badge variant="destructive">Rejected</Badge>
            <XCircle className="h-5 w-5 text-destructive" />
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2">
            <Badge variant="outline">In Progress</Badge>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-medium">KYC Status:</span>
        {getStatusDisplay()}
      </div>
      {kycDetails.verification_notes && (
        <div className="text-sm text-muted-foreground">
          Note: {kycDetails.verification_notes}
        </div>
      )}
    </div>
  );
}