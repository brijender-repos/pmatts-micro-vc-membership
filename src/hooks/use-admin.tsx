import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
        if (session) {
          // Query using user_id instead of id
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('admin_role')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          console.log("User profile:", profile);
          console.log("Profile error:", error);
          
          if (error) {
            console.error("Error fetching profile:", error);
            setIsAdmin(false);
          } else {
            // If profile exists and has admin_role set to true
            setIsAdmin(!!profile?.admin_role);
            console.log("Admin status set to:", !!profile?.admin_role);
          }
        } else {
          console.log("No active session found");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error in checkAdminStatus:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin, loading };
};