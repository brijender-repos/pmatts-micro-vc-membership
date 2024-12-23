import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

export const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate email
      emailSchema.parse(email);
      
      // Check if email already exists
      const { data: existingSubscription } = await supabase
        .from("newsletter_subscriptions")
        .select()
        .eq("email", email)
        .maybeSingle();

      if (existingSubscription) {
        toast.error("This email is already subscribed to our newsletter.");
        return;
      }

      // Insert new subscription
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([{ email }]);

      if (error) throw error;

      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Subscription error:", error);
        toast.error("Failed to subscribe. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="mt-2 flex max-w-md gap-2">
      <Input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        <Mail className="mr-2 h-4 w-4" />
        Subscribe
      </Button>
    </form>
  );
};