import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/members/ProfileSettings";
import { NewsletterSettings } from "@/components/members/NewsletterSettings";
import { KYCSettings } from "@/components/members/KYCSettings";
import { NomineeSettings } from "@/components/members/NomineeSettings";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const Settings = () => {
  const [kycStatus, setKYCStatus] = useState<string | null>(null);

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('kyc_details')
        .select('status')
        .eq('user_id', user.id)
        .single();

      setKYCStatus(data?.status || null);
    } catch (error) {
      console.error('Error loading KYC status:', error);
    }
  };

  const KYCTabTrigger = () => {
    const getBadgeContent = () => {
      switch (kycStatus) {
        case 'verified':
          return {
            icon: <CheckCircle2 className="h-3 w-3" />,
            text: 'Completed',
            className: 'bg-green-500'
          };
        case 'verification_pending':
          return {
            icon: <Clock className="h-3 w-3" />,
            text: 'Pending',
            className: 'bg-yellow-500'
          };
        default:
          return {
            icon: <AlertCircle className="h-3 w-3" />,
            text: 'Not Started',
            className: 'bg-gray-500'
          };
      }
    };

    const badgeContent = getBadgeContent();

    return (
      <div className="flex items-center gap-2">
        <span>KYC</span>
        <Badge className={`flex items-center gap-1 ${badgeContent.className}`}>
          {badgeContent.icon}
          {badgeContent.text}
        </Badge>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <div className="border-b">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0 space-x-8">
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
              >
                Newsletter
              </TabsTrigger>
              <TabsTrigger 
                value="kyc"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
              >
                <KYCTabTrigger />
              </TabsTrigger>
              <TabsTrigger 
                value="nominee"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-4"
              >
                Nominee
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <NewsletterSettings />
          </TabsContent>
          <TabsContent value="kyc" className="space-y-4">
            <KYCSettings onStatusChange={loadKYCStatus} />
          </TabsContent>
          <TabsContent value="nominee" className="space-y-4">
            <NomineeSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;