import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/auth/login");
        return;
      }

      // Check if trying to access manage routes
      if (location.pathname.startsWith('/manage')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('admin_role')
          .eq('id', session.user.id)
          .single();

        if (!profile?.admin_role) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          navigate("/");
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth/login");
      } else if (!session) {
        navigate("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, location]);

  return <>{children}</>;
};