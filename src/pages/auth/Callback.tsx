import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle the OAuth callback
    const handleOAuthCallback = async () => {
      try {
        // Get the session to confirm the user is authenticated
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
          navigate("/members/dashboard");
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message,
        });
        navigate("/auth/login");
      }
    };

    handleOAuthCallback();
  }, [navigate, toast]);

  // Show a loading state while processing
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-center">
        <h2 className="text-2xl font-semibold mb-2">Processing...</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign in.</p>
      </div>
    </div>
  );
};

export default Callback;