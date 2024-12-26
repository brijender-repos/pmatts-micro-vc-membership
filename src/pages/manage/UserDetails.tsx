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

export default function UserDetails() {
  const { userId } = useParams();

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["admin-user-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: investments } = useQuery({
    queryKey: ["admin-user-investments", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", userId)
        .order("investment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: kycDetails } = useQuery({
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
  });

  const { data: nominee } = useQuery({
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
  });

  const { data: newsletterSubscription } = useQuery({
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

  if (!profile) {
    return <div>Loading...</div>;
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
            <AdminUserProfile
              profile={profile}
              onProfileUpdate={refetchProfile}
            />
          </TabsContent>

          <TabsContent value="portfolio">
            <AdminUserPortfolio
              investments={investments || []}
            />
          </TabsContent>

          <TabsContent value="kyc">
            <AdminUserKYC
              kycDetails={kycDetails}
            />
          </TabsContent>

          <TabsContent value="nominee">
            <AdminUserNominee
              nominee={nominee}
            />
          </TabsContent>

          <TabsContent value="newsletter">
            <AdminUserNewsletter
              email={profile.email}
              isSubscribed={!!newsletterSubscription}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}