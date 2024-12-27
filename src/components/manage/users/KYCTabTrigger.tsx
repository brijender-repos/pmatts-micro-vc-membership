import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KYCTabTriggerProps {
  kycStatus: string | null;
}

export function KYCTabTrigger({ kycStatus }: KYCTabTriggerProps) {
  const getBadgeContent = () => {
    switch (kycStatus) {
      case 'verified':
        return {
          text: 'Completed',
          className: 'bg-green-500'
        };
      case 'verification_pending':
        return {
          text: 'Pending',
          className: 'bg-yellow-500'
        };
      case 'rejected':
        return {
          text: 'Rejected',
          className: 'bg-destructive'
        };
      default:
        return {
          text: 'Not Started',
          className: 'bg-gray-500'
        };
    }
  };

  const badgeContent = getBadgeContent();

  return (
    <div className="flex items-center gap-2">
      <Shield className="h-4 w-4" />
      <span>KYC</span>
      <Badge className={`${badgeContent.className}`}>
        {badgeContent.text}
      </Badge>
    </div>
  );
}