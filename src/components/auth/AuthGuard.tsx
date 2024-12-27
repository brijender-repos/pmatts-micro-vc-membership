import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to access this page",
            variant: "destructive",
          });
          navigate("/auth/login", { state: { from: location.pathname } });
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
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Error",
          description: "An error occurred while checking authentication",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        navigate("/auth/login");
      } else if (!session) {
        setIsAuthenticated(false);
        navigate("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, location]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};