import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "./types";

export function useProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      full_name: "",
      phone: "",
    },
  });

  const loadProfile = async () => {
    try {
      console.log("[Profile] Starting profile load");
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[Profile] Session retrieved:", session?.user.id);
      
      if (!session?.user) {
        throw new Error("No user found");
      }

      setEmail(session.user.email || "");
      console.log("[Profile] Email set from session:", session.user.email);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone, avatar_url')
        .eq('id', session.user.id)
        .maybeSingle();

      console.log("[Profile] Profile data retrieved:", profile);
      
      if (error) {
        console.error("[Profile] Error fetching profile:", error);
        throw error;
      }

      if (profile) {
        console.log("[Profile] Setting form values:", {
          full_name: profile.full_name || "",
          phone: profile.phone || "",
        });
        
        form.reset({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
        });
        setAvatarUrl(profile.avatar_url);
      }
    } catch (error) {
      console.error('[Profile] Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    avatarUrl,
    email,
    form,
    loadProfile,
  };
}