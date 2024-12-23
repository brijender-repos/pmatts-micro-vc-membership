import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/members/ProfileSettings";
import { NewsletterSettings } from "@/components/members/NewsletterSettings";
import { KYCSettings } from "@/components/members/KYCSettings";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock } from "lucide-react";

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

  const KYCTabTrigger = () => (
    <div className="flex items-center gap-2">
      <span>KYC</span>
      {kycStatus && (
        kycStatus === 'verified' ? (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      )}
    </div>
  );

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
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="kyc">
              <KYCTabTrigger />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <NewsletterSettings />
          </TabsContent>
          <TabsContent value="kyc" className="space-y-4">
            <KYCSettings onStatusChange={loadKYCStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;