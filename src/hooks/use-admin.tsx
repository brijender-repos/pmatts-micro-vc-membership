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
        
        if (session?.user?.email) {
          // First, check if user is admin using the is_admin function
          const { data: adminCheck } = await supabase
            .rpc('is_admin', { user_email: session.user.email });
          console.log("Admin check result:", adminCheck);

          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('admin_role')
            .eq('user_id', session.user.id)
            .maybeSingle();
          console.log("Existing profile:", existingProfile);

          if (!existingProfile) {
            // Create profile if it doesn't exist
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: session.user.id,
                  user_id: session.user.id,
                  email: session.user.email,
                  admin_role: adminCheck
                }
              ])
              .select()
              .single();

            if (createError) {
              console.error("Error creating profile:", createError);
              setIsAdmin(false);
            } else {
              console.log("New profile created:", newProfile);
              setIsAdmin(!!newProfile?.admin_role);
            }
          } else {
            // Use existing profile
            setIsAdmin(!!existingProfile.admin_role);
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