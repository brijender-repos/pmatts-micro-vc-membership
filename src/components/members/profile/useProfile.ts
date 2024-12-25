import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues, Profile } from "./types";

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
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No user found");
      }

      // Get email from session only
      setEmail(session.user.email || "");

      // Get profile data from profiles table only
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone, avatar_url')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (profile) {
        form.reset({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
        });
        setAvatarUrl(profile.avatar_url);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No user found");
      }

      // Explicitly define which profile fields we update
      const profileUpdate = {
        full_name: data.full_name,
        phone: data.phone,
        updated_at: new Date().toISOString(),
      };

      // Update profiles table only, using user_id
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      await loadProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
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