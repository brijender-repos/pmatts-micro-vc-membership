import { useParams } from "react-router-dom";
import { AdminInvestmentForm } from "@/components/manage/investments/AdminInvestmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AddInvestment() {
  const { userId } = useParams<{ userId: string }>();
  console.log("Retrieved userId from params:", userId);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      console.log("Fetching profile for userId:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
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

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          Error loading user details: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-[400px] bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Add Investment for {profile?.full_name || "User"}
      </h1>
      <AdminInvestmentForm 
        userId={userId} 
        projectName="Missing Matters"
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