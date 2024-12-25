import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('admin_role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(!!profile?.admin_role);
      }
      
      setLoading(false);
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin, loading };
};