import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminUserHeader } from "@/components/admin/users/AdminUserHeader";
import { AdminUserTabs } from "@/components/admin/users/AdminUserTabs";

export default function UserDetails() {
  const params = useParams();
  const userId = params.userId;

  // Return early with a better UI if no userId is provided
  if (!userId) {
    return (
      <div className="space-y-6">
        <AdminUserHeader fullName={null} email={null} />
        <Alert variant="destructive">
          <AlertDescription>No user ID provided</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { data: profile, error: profileError, refetch: refetchProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["admin-user-profile", userId],
    queryFn: async () => {
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

  const { data: investments, isLoading: isInvestmentsLoading } = useQuery({
    queryKey: ["admin-user-investments", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", userId)
        .order("investment_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const { data: kycDetails, isLoading: isKycLoading } = useQuery({
    queryKey: ["admin-user-kyc", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kyc_details")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: nominee, isLoading: isNomineeLoading } = useQuery({
    queryKey: ["admin-user-nominee", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: newsletterSubscription, isLoading: isNewsletterLoading } = useQuery({
    queryKey: ["admin-user-newsletter", userId],
    queryFn: async () => {
      if (!profile?.email) return null;
      
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .eq("email", profile.email)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.email,
  });

  // Handle profile loading and error states
  if (isProfileLoading) {
    return (
      <div className="space-y-6">
        <AdminUserHeader fullName={null} email={null} />
        <div className="p-6">Loading user details...</div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="space-y-6">
        <AdminUserHeader fullName={null} email={null} />
        <Alert variant="destructive">
          <AlertDescription>
            {profileError ? "Error loading user details" : "User not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminUserHeader
        fullName={profile.full_name}
        email={profile.email}
      />
      <AdminUserTabs
        profile={profile}
        investments={investments || []}
        kycDetails={kycDetails}
        nominee={nominee}
        isProfileLoading={isProfileLoading}
        isInvestmentsLoading={isInvestmentsLoading}
        isKycLoading={isKycLoading}
        isNomineeLoading={isNomineeLoading}
        isNewsletterLoading={isNewsletterLoading}
        onProfileUpdate={refetchProfile}
        newsletterSubscription={newsletterSubscription}
      />
    </div>
  );
}