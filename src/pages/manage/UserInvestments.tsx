import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AdminInvestmentForm } from "@/components/manage/investments/AdminInvestmentForm";
import { InvestmentsTable } from "@/components/manage/investments/InvestmentsTable";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentWithUser, PaymentMode } from "@/types/investment";

export default function UserInvestments() {
  const { userId } = useParams();
  const { toast } = useToast();

  const { data: investments, isLoading, refetch } = useQuery({
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

      return (data || []).map(investment => ({
        ...investment,
        payment_mode: (investment.payment_mode || "NEFT/RTGS/IMPS") as PaymentMode,
      })) as InvestmentWithUser[];
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Investments</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AdminInvestmentForm 
              userId={userId} 
              onSuccess={() => {
                refetch();
                toast({
                  title: "Success",
                  description: "Investment added successfully",
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <InvestmentsTable 
        investments={investments}
        isLoading={isLoading}
        toggleSort={() => {}}
      />
    </div>
  );
}