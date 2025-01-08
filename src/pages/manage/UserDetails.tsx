import { useParams } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UserProfileTab } from "@/components/manage/users/UserProfileTab";
import { UserPortfolioTab } from "@/components/manage/users/UserPortfolioTab";
import { UserKYCTab } from "@/components/manage/users/UserKYCTab";
import { UserNomineeTab } from "@/components/manage/users/UserNomineeTab";
import { UserNewsletterTab } from "@/components/manage/users/UserNewsletterTab";
import { UserDetailsTabs } from "@/components/manage/users/UserDetailsTabs";
import { useUserDetails } from "@/hooks/use-user-details";
import { usePhoneUpdate } from "@/hooks/use-phone-update";

export default function UserDetails() {
  const { userId } = useParams();
  console.log("UserDetails - userId from params:", userId);
  
  const {
    profile,
    refetchProfile,
    investments,
    nominee,
    kycDetails,
    newsletterSubscription,
  } = useUserDetails(userId);

  console.log("UserDetails - profile data:", profile);

  const {
    isEditingPhone,
    setIsEditingPhone,
    phoneNumber,
    setPhoneNumber,
    handlePhoneUpdate,
  } = usePhoneUpdate(userId, refetchProfile);

  if (!profile) {
    console.log("UserDetails - No profile data available");
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
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

      <Tabs defaultValue="profile" className="space-y-4">
        <UserDetailsTabs kycStatus={kycDetails?.status} />

        <TabsContent value="profile">
          <UserProfileTab
            profile={profile}
            isEditingPhone={isEditingPhone}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            setIsEditingPhone={setIsEditingPhone}
            handlePhoneUpdate={handlePhoneUpdate}
          />
        </TabsContent>

        <TabsContent value="portfolio">
          <UserPortfolioTab userId={userId || ''} />
        </TabsContent>

        <TabsContent value="kyc">
          <UserKYCTab kycDetails={kycDetails} />
        </TabsContent>

        <TabsContent value="nominee">
          <UserNomineeTab nominee={nominee} />
        </TabsContent>

        <TabsContent value="newsletter">
          <UserNewsletterTab
            profile={profile}
            newsletterSubscription={newsletterSubscription}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}