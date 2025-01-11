import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TransactionProofList } from "@/components/manage/investments/TransactionProofList";
import { TransactionProofDialog } from "@/components/manage/investments/transaction-proof/TransactionProofDialog";

export default function InvestmentDetails() {
  const { investmentId } = useParams<{ investmentId: string }>();
  const form = useForm();

  const { data: investment, isLoading: isLoadingInvestment } = useQuery({
    queryKey: ['investment', investmentId],
    queryFn: async () => {
      if (!investmentId) throw new Error('Investment ID is required');
      
      const { data, error } = await supabase
        .from('investments')
        .select(`
          *,
          profiles (
            full_name,
            email,
            phone
          )
        `)
        .eq('id', investmentId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Investment not found');
      return data;
    },
    retry: false,
  });

  const handleUploadComplete = () => {
    // Refresh the transaction proofs list
  };

  if (isLoadingInvestment) {
    return <div>Loading investment details...</div>;
  }

  if (!investment) {
    return (
      <Card className="mx-auto max-w-2xl mt-8">
        <CardHeader>
          <CardTitle className="text-center text-red-500">Investment Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            The investment you're looking for could not be found. Please check the URL and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium">Investor Details</h4>
              <p className="text-sm text-muted-foreground">
                Name: {investment.profiles?.full_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {investment.profiles?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: {investment.profiles?.phone}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Investment Information</h4>
              <p className="text-sm text-muted-foreground">
                Project: {investment.project_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Amount: ₹{investment.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-muted-foreground">
                Units: {investment.units}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(investment.investment_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {investment.investment_status}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle>Transaction Proofs</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View uploaded transaction proofs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TransactionProofDialog
                investmentId={investmentId!}
                onUploadComplete={handleUploadComplete}
                form={form}
              />
            </div>
          </div>
          <TransactionProofList investmentId={investmentId!} />
        </CardContent>
      </Card>
    </div>
  );
}