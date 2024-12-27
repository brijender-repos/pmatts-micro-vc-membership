import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, UserRound } from "lucide-react";
import { UserProfileTab } from "@/components/manage/users/UserProfileTab";
import { UserPortfolioTab } from "@/components/manage/users/UserPortfolioTab";
import { UserKYCTab } from "@/components/manage/users/UserKYCTab";
import { UserNomineeTab } from "@/components/manage/users/UserNomineeTab";
import { UserNewsletterTab } from "@/components/manage/users/UserNewsletterTab";
import { KYCTabTrigger } from "@/components/manage/users/KYCTabTrigger";

export default function UserDetails() {
  const { id: userId } = useParams();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          is_active,
          email
        `)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      if (data?.phone) setPhoneNumber(data.phone);
      return data;
    },
    enabled: !!userId,
  });

  const { data: investments } = useQuery({
    queryKey: ["user-investments", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select("*, projects(name, status)")
        .eq("user_id", userId)
        .order("investment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: nominee } = useQuery({
    queryKey: ["user-nominee", userId],
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

  const { data: kycDetails } = useQuery({
    queryKey: ["user-kyc", userId],
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

  const { data: newsletterSubscription } = useQuery({
    queryKey: ["user-newsletter", userId],
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

  const handlePhoneUpdate = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ phone: phoneNumber })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("Phone number updated successfully");
      setIsEditingPhone(false);
      refetchProfile();
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error("Failed to update phone number");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        {profile && (
          <div className="flex flex-col space-y-1">
            <p className="text-lg font-medium">{profile.full_name}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <div className="border-b">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 space-x-8">
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
            >
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                Profile
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="portfolio"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Portfolio
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="kyc"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
            >
              <KYCTabTrigger kycStatus={kycDetails?.status} />
            </TabsTrigger>
            <TabsTrigger 
              value="nominee"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
            >
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                Nominee
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="newsletter"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Newsletter
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          {profile && (
            <UserProfileTab
              profile={profile}
              isEditingPhone={isEditingPhone}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              setIsEditingPhone={setIsEditingPhone}
              handlePhoneUpdate={handlePhoneUpdate}
            />
          )}
        </TabsContent>

        <TabsContent value="portfolio">
          {investments && <UserPortfolioTab investments={investments} />}
        </TabsContent>

        <TabsContent value="kyc">
          <UserKYCTab kycDetails={kycDetails} />
        </TabsContent>

        <TabsContent value="nominee">
          <UserNomineeTab nominee={nominee} />
        </TabsContent>

        <TabsContent value="newsletter">
          {profile && (
            <UserNewsletterTab
              profile={profile}
              newsletterSubscription={newsletterSubscription}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
