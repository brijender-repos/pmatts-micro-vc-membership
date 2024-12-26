import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Shield, Users, Mail } from "lucide-react";
import { AdminUserProfile } from "./AdminUserProfile";
import { AdminUserPortfolio } from "./AdminUserPortfolio";
import { AdminUserKYC } from "./AdminUserKYC";
import { AdminUserNominee } from "./AdminUserNominee";
import { AdminUserNewsletter } from "./AdminUserNewsletter";

interface AdminUserTabsProps {
  profile: any;
  investments: any[];
  kycDetails: any;
  nominee: any;
  isProfileLoading: boolean;
  isInvestmentsLoading: boolean;
  isKycLoading: boolean;
  isNomineeLoading: boolean;
  isNewsletterLoading: boolean;
  onProfileUpdate: () => void;
  newsletterSubscription: any;
}

export function AdminUserTabs({
  profile,
  investments,
  kycDetails,
  nominee,
  isProfileLoading,
  isInvestmentsLoading,
  isKycLoading,
  isNomineeLoading,
  isNewsletterLoading,
  onProfileUpdate,
  newsletterSubscription,
}: AdminUserTabsProps) {
  return (
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
              onProfileUpdate={onProfileUpdate}
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
  );
}