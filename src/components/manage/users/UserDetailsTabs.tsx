import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, UserRound } from "lucide-react";
import { KYCTabTrigger } from "./KYCTabTrigger";

interface UserDetailsTabsProps {
  kycStatus: string | null;
}

export function UserDetailsTabs({ kycStatus }: UserDetailsTabsProps) {
  return (
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
          <KYCTabTrigger kycStatus={kycStatus} />
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
  );
}