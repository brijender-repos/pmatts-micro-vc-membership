import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "./ProfileForm";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No user found");
      }

      setEmail(user.email || "");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No user found");
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile(); // Reset form to original values
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