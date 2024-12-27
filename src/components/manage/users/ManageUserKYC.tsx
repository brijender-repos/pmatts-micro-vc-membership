import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, CreditCard } from "lucide-react";

interface KYCDetails {
  status: string;
  aadhar_number: string | null;
  aadhar_name: string | null;
  aadhar_image_url: string | null;
  pan_number: string | null;
  pan_name: string | null;
  pan_image_url: string | null;
  verification_notes: string | null;
}

interface ManageUserKYCProps {
  kycDetails: KYCDetails | null;
}

export function ManageUserKYC({ kycDetails }: ManageUserKYCProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "verification_pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!kycDetails) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No KYC details found</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">KYC Status</h3>
          <Badge className={getStatusColor(kycDetails.status)}>
            {kycDetails.status.replace(/_/g, " ").toUpperCase()}
          </Badge>
        </div>

        <div className="grid gap-6">
          {kycDetails.aadhar_number && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Aadhar Details</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Number</p>
                  <p>{kycDetails.aadhar_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{kycDetails.aadhar_name}</p>
                </div>
              </div>
              {kycDetails.aadhar_image_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(kycDetails.aadhar_image_url!, "_blank")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
              )}
            </div>
          )}

          {kycDetails.pan_number && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">PAN Details</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Number</p>
                  <p>{kycDetails.pan_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{kycDetails.pan_name}</p>
                </div>
              </div>
              {kycDetails.pan_image_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(kycDetails.pan_image_url!, "_blank")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
              )}
            </div>
          )}

          {kycDetails.verification_notes && (
            <div>
              <p className="text-sm text-muted-foreground">Verification Notes</p>
              <p className="mt-1">{kycDetails.verification_notes}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}