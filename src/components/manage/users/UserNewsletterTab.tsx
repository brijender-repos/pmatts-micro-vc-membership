import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";

interface UserNewsletterTabProps {
  profile: {
    email: string | null;
  };
  newsletterSubscription: any;
}

export function UserNewsletterTab({
  profile,
  newsletterSubscription,
}: UserNewsletterTabProps) {
  if (!profile) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No profile data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{profile.email}</span>
        </div>
        <p>
          Subscription Status:{" "}
          <span className="font-medium">
            {newsletterSubscription ? "Subscribed" : "Not Subscribed"}
          </span>
        </p>
      </div>
    </Card>
  );
}