import { useParams } from "react-router-dom";
import { AdminInvestmentForm } from "@/components/manage/investments/AdminInvestmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AddInvestment() {
  const { userId } = useParams<{ userId: string }>();
  console.log("Retrieved userId from params:", userId); // Added debug log

  const { data: profile } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      console.log("Fetching profile for userId:", userId); // Added debug log
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error); // Added debug log
        throw error;
      }
      console.log("Retrieved profile:", data); // Added debug log
      return data;
    },
    enabled: !!userId,
  });

  if (!userId) {
    console.log("No userId provided"); // Added debug log
    return <div>User ID is required</div>;
  }

  if (!profile) {
    console.log("No profile found"); // Added debug log
    return <div>Loading user details...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Investment for {profile.full_name}</h1>
      <AdminInvestmentForm 
        userId={userId} 
        projectName="Missing Matters"
        onSuccess={() => {
          window.location.href = `/manage/users/${userId}`;
        }}
      />
    </div>
  );
}