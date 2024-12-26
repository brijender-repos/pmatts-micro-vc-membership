import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AdminUserProfile } from "@/components/admin/users/AdminUserProfile";
import { AdminUserPortfolio } from "@/components/admin/users/AdminUserPortfolio";
import { AdminUserKYC } from "@/components/admin/users/AdminUserKYC";
import { AdminUserNominee } from "@/components/admin/users/AdminUserNominee";
import { AdminUserNewsletter } from "@/components/admin/users/AdminUserNewsletter";
import { User, Briefcase, Shield, Users, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserDetails() {
  const { userId } = useParams();

  // Return early if no userId is provided
  if (!userId) {
    return (
      <Alert variant="destructive">
        <AlertDescription>No user ID provided</AlertDescription>
      </Alert>
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
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        <div className="flex flex-col space-y-1">
          <p className="text-lg font-medium">{profile.full_name}</p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="kyc" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            KYC Status
          </TabsTrigger>
          <TabsTrigger value="nominee" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Nominee
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Newsletter
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="profile">
            {isProfileLoading ? (
              <div>Loading profile...</div>
            ) : (
              <AdminUserProfile
                profile={profile}
                onProfileUpdate={refetchProfile}
              />
            )}
          </TabsContent>

          <TabsContent value="portfolio">
            {isInvestmentsLoading ? (
              <div>Loading investments...</div>
            ) : (
              <AdminUserPortfolio
                investments={investments || []}
              />
            )}
          </TabsContent>

          <TabsContent value="kyc">
            {isKycLoading ? (
              <div>Loading KYC details...</div>
            ) : (
              <AdminUserKYC
                kycDetails={kycDetails}
              />
            )}
          </TabsContent>

          <TabsContent value="nominee">
            {isNomineeLoading ? (
              <div>Loading nominee details...</div>
            ) : (
              <AdminUserNominee
                nominee={nominee}
              />
            )}
          </TabsContent>

          <TabsContent value="newsletter">
            {isNewsletterLoading ? (
              <div>Loading newsletter status...</div>
            ) : (
              <AdminUserNewsletter
                email={profile.email}
                isSubscribed={!!newsletterSubscription}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}