import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function NewsletterSettings() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    async function checkSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) return;

        setUserEmail(user.email);

        const { data: subscription } = await supabase
          .from("newsletter_subscriptions")
          .select()
          .eq("email", user.email)
          .maybeSingle();

        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error("Error checking subscription:", error);
        toast.error("Failed to load newsletter subscription status");
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, []);

  const handleToggleSubscription = async () => {
    if (!userEmail) return;

    try {
      setIsLoading(true);

      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .delete()
          .eq("email", userEmail);

        if (error) throw error;
        toast.success("Successfully unsubscribed from the newsletter");
        setIsSubscribed(false);
      } else {
        // Subscribe
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .insert([{ email: userEmail }]);

        if (error) throw error;
        toast.success("Successfully subscribed to the newsletter");
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
      toast.error("Failed to update newsletter subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Newsletter Subscription</CardTitle>
        <CardDescription>
          Manage your newsletter subscription preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{userEmail}</span>
          </div>
          <Button
            onClick={handleToggleSubscription}
            disabled={isLoading}
            variant={isSubscribed ? "outline" : "default"}
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"} from Newsletter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}