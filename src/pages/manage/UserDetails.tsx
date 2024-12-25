import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";
import { useState } from "react";
import { toast } from "sonner";
import { KYCStatus } from "@/components/members/kyc/KYCStatus";
import { Mail, Phone, Shield, UserRound } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean | null;
  email: string | null;
}

export default function UserDetails() {
  const { userId } = useParams();
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
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      if (data?.phone) setPhoneNumber(data.phone);
      return data as UserProfile;
    },
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
        .eq("id", userId);

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        <p className="text-muted-foreground">
          View and manage user information
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="kyc" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            KYC Status
          </TabsTrigger>
          <TabsTrigger value="nominee" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            Nominee
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Newsletter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{profile?.full_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{profile?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  {isEditingPhone ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                      />
                      <Button onClick={handlePhoneUpdate}>Save</Button>
                      <Button variant="outline" onClick={() => setIsEditingPhone(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p>{profile?.phone || "N/A"}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingPhone(true)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>{profile?.is_active ? "Active" : "Inactive"}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-8">
          {investments && (
            <>
              <InvestmentSummary investments={investments} />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Projects</h2>
                <ProjectTiles investments={investments} />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Investment History</h2>
                <InvestmentHistory investments={investments} />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <Card className="p-6">
            <KYCStatus kycDetails={kycDetails} />
          </Card>
        </TabsContent>

        <TabsContent value="nominee" className="space-y-4">
          <Card className="p-6">
            {nominee ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{nominee.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                    <p>{new Date(nominee.date_of_birth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                    <p>{nominee.relationship}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No nominee details found</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.email}</span>
              </div>
              <p>
                Subscription Status:{" "}
                <span className="font-medium">
                  {newsletterSubscription ? "Subscribed" : "Not Subscribed"}
                </span>
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}