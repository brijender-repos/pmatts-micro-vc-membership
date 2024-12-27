import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Shield, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ManageUserProfile } from "./ManageUserProfile";
import { ManageUserInvestments } from "./ManageUserInvestments";
import { ManageUserKYC } from "./ManageUserKYC";
import { ManageUserSubscription } from "./ManageUserSubscription";

interface ManageUserTabsProps {
  userId: string;
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    is_active: boolean | null;
  };
}

export function ManageUserTabs({ userId, profile }: ManageUserTabsProps) {
  const { data: investments, isLoading: isInvestmentsLoading } = useQuery({
    queryKey: ["manage-user-investments", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          projects (
            name,
            status
          )
        `)
        .eq("user_id", userId)
        .order("investment_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: kycDetails, isLoading: isKycLoading } = useQuery({
    queryKey: ["manage-user-kyc", userId],
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

  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["manage-user-subscription", profile.email],
    queryFn: async () => {
      if (!profile.email) return null;
      
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .eq("email", profile.email)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!profile.email,
  });

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="investments" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Investments
        </TabsTrigger>
        <TabsTrigger value="kyc" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          KYC Status
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Newsletter
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="profile">
          <ManageUserProfile profile={profile} />
        </TabsContent>

        <TabsContent value="investments">
          {isInvestmentsLoading ? (
            <div>Loading investments...</div>
          ) : (
            <ManageUserInvestments 
              userId={userId}
              investments={investments || []}
            />
          )}
        </TabsContent>

        <TabsContent value="kyc">
          {isKycLoading ? (
            <div>Loading KYC details...</div>
          ) : (
            <ManageUserKYC kycDetails={kycDetails} />
          )}
        </TabsContent>

        <TabsContent value="subscription">
          {isSubscriptionLoading ? (
            <div>Loading subscription status...</div>
          ) : (
            <ManageUserSubscription
              email={profile.email}
              isSubscribed={!!subscription}
            />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}