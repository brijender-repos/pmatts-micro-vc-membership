import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ManageUserHeader } from "@/components/manage/users/ManageUserHeader";
import { ManageUserTabs } from "@/components/manage/users/ManageUserTabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ManageUserDetails() {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile, error: profileError, isLoading: isProfileLoading } = useQuery({
    queryKey: ["manage-user-profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID provided");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("User not found");
      return data;
    },
  });

  if (!userId) {
    return (
      <Alert variant="destructive">
        <AlertDescription>No user ID provided</AlertDescription>
      </Alert>
    );
  }

  if (isProfileLoading) {
    return <div className="p-6">Loading user details...</div>;
  }

  if (profileError || !profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {profileError ? "Error loading user details" : "User not found"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <ManageUserHeader profile={profile} />
      <ManageUserTabs userId={userId} profile={profile} />
    </div>
  );
}