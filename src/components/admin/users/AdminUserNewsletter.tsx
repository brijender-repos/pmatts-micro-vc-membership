import { Card } from "@/components/ui/card";
import { Mail, Check, X } from "lucide-react";

interface AdminUserNewsletterProps {
  email: string | null;
  isSubscribed: boolean;
}

export function AdminUserNewsletter({ email, isSubscribed }: AdminUserNewsletterProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
            <p className="text-base">{email || "Not provided"}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Newsletter Status
          </p>
          <div className="flex items-center gap-2 mt-1">
            {isSubscribed ? (
              <span className="text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" /> Subscribed
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1">
                <X className="h-4 w-4" /> Not Subscribed
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}