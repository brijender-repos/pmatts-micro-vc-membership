import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/members/ProfileSettings";
import { NewsletterSettings } from "@/components/members/NewsletterSettings";
import { KYCSettings } from "@/components/members/KYCSettings";

const Settings = () => {
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
            <TabsTrigger value="kyc">KYC</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <NewsletterSettings />
          </TabsContent>
          <TabsContent value="kyc" className="space-y-4">
            <KYCSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;