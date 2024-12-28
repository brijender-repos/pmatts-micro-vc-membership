import { useParams } from "react-router-dom";
import { AdminInvestmentForm } from "@/components/manage/investments/AdminInvestmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddInvestment() {
  const { userId, investmentId } = useParams<{ userId: string; investmentId?: string }>();
  console.log("Retrieved userId from params:", userId);

  const { data: profile, isLoading, error } = useQuery({
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

  if (isLoading) {
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

  if (error) {
    console.error("Error in component:", error);
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          Error loading user details: {error.message}
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