import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean | null;
  email: string | null;
}

export default function UserDetails() {
  const { userId } = useParams();

  const { data: profile } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          phone,
          is_active,
          user:auth.users!profiles_user_id_fkey (
            email
          )
        `)
        .eq("id", userId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        full_name: data.full_name,
        phone: data.phone,
        is_active: data.is_active,
        email: data.user?.email,
      } as UserProfile;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        <p className="text-muted-foreground">
          View user profile and investment details
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-2">
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
                  <p>{profile?.phone || "N/A"}</p>
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
      </Tabs>
    </div>
  );
}