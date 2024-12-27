import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ManageUserSubscriptionProps {
  email: string | null;
  isSubscribed: boolean;
}

export function ManageUserSubscription({ email, isSubscribed }: ManageUserSubscriptionProps) {
  const handleToggleSubscription = async () => {
    if (!email) return;

    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .delete()
          .eq("email", email);

        if (error) throw error;
        toast.success("Successfully unsubscribed from the newsletter");
      } else {
        // Subscribe
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .insert([{ email }]);

        if (error) throw error;
        toast.success("Successfully subscribed to the newsletter");
      }

      // Refresh the page to update the subscription status
      window.location.reload();
    } catch (error) {
      console.error("Error toggling subscription:", error);
      toast.error("Failed to update newsletter subscription");
    }
  };

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
          <p className="text-sm font-medium text-muted-foreground">Newsletter Status</p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
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
            <Button
              variant={isSubscribed ? "destructive" : "default"}
              onClick={handleToggleSubscription}
              disabled={!email}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}