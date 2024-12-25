import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues, Profile } from "./types";
import { paymentLogger } from "@/utils/paymentLogger";

export function useProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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

      // Get email from session only
      setEmail(session.user.email || "");
      console.log("[Profile] Email set from session:", session.user.email);

      // Get profile data from profiles table only
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone, avatar_url')
        .eq('user_id', session.user.id)
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

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      console.log("[Profile Update] Starting profile update with data:", data);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[Profile Update] Session retrieved:", session?.user.id);
      
      if (!session?.user) {
        throw new Error("No user found");
      }

      // Log the exact update operation we're about to perform
      console.log("[Profile Update] Preparing update for profiles table:", {
        full_name: data.full_name,
        phone: data.phone,
        updated_at: new Date().toISOString(),
        user_id: session.user.id
      });

      // Explicitly define which profile fields we update
      const profileUpdate = {
        full_name: data.full_name,
        phone: data.phone,
        updated_at: new Date().toISOString(),
      };

      // Update profiles table only, using user_id
      const { error, data: updatedProfile } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('user_id', session.user.id)
        .select();

      console.log("[Profile Update] Update response:", { error, updatedProfile });

      if (error) {
        console.error('[Profile Update] Profile update error:', error);
        throw error;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      // Log successful update
      paymentLogger.log('profile_update_success', {
        user_id: session.user.id,
        updated_fields: Object.keys(profileUpdate),
        timestamp: new Date().toISOString()
      });

      console.log("[Profile Update] Reloading profile after update");
      await loadProfile();
    } catch (error: any) {
      console.error('[Profile Update] Error updating profile:', error);
      paymentLogger.log('profile_update_error', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    console.log("[Profile] Cancelling edit mode");
    setIsEditing(false);
    loadProfile();
  };

  return {
    loading,
    isEditing,
    setIsEditing,
    avatarUrl,
    email,
    form,
    loadProfile,
    handleSubmit,
    handleCancel,
  };
}