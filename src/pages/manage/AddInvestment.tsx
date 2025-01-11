import { useParams } from "react-router-dom";
import { AdminInvestmentForm } from "@/components/manage/investments/AdminInvestmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InvestmentsTable } from "@/components/manage/investments/InvestmentsTable";
import { InvestmentWithUser, PaymentMode, InvestmentType } from "@/types/investment";

export default function AddInvestment() {
  const { userId, investmentId } = useParams<{ userId: string; investmentId?: string }>();
  console.log("Retrieved userId from params:", userId);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      console.log("Fetching profile for userId:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      console.log("Retrieved profile:", data);
      return data;
    },
    enabled: !!userId,
  });

  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ["user-investments", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          )
        `)
        .eq("user_id", userId)
        .order("investment_date", { ascending: false });

      if (error) throw error;

      // Transform the data to match InvestmentWithUser type
      return (data || []).map(investment => ({
        ...investment,
        payment_mode: (investment.payment_mode || "NEFT/RTGS/IMPS") as PaymentMode,
        investment_type: investment.investment_type as InvestmentType,
        investment_status: investment.investment_status || "Outstanding"
      })) as InvestmentWithUser[];
    },
    enabled: !!userId,
  });

  if (!userId) {
    console.log("No userId provided");
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          User ID is required
        </div>
      </div>
    );
  }

  if (profileLoading || investmentsLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
          </div>
        </Card>
      </div>
    );
  }

  if (profileError) {
    console.error("Error in component:", profileError);
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          Error loading user details: {profileError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            {investmentId ? "Update" : "Add"} Investment
          </h1>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{profile?.full_name || "User"}</h2>
            <p className="text-muted-foreground">{profile?.email || "N/A"}</p>
            <p className="text-muted-foreground">{profile?.phone || "No phone number"}</p>
          </div>
        </div>
      </Card>

      {investments && investments.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Investments</h2>
          <InvestmentsTable 
            investments={investments}
            isLoading={investmentsLoading}
            toggleSort={() => {}}
          />
        </Card>
      )}
      
      <AdminInvestmentForm 
        userId={userId}
        investmentId={investmentId}
        onSuccess={() => {
          window.location.href = `/manage/users/${userId}`;
        }}
        onError={(error) => {
          console.error("Investment submission error:", error);
        }}
      />
    </div>
  );
}