import { useParams } from "react-router-dom";
import { AdminInvestmentForm } from "@/components/manage/investments/AdminInvestmentForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AddInvestment() {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (!userId) {
    return <div>User ID is required</div>;
  }

  if (!profile) {
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