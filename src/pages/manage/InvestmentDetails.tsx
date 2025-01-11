import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionProofForm } from "@/components/manage/investments/transaction-proof/TransactionProofForm";
import { TransactionProofList } from "@/components/manage/investments/TransactionProofList";
import { TransactionProofUpload } from "@/components/manage/investments/TransactionProofUpload";

export default function InvestmentDetails() {
  const { id } = useParams<{ id: string }>();
  const form = useForm();

  const { data: investment, isLoading: isLoadingInvestment } = useQuery({
    queryKey: ['investment', id],
    queryFn: async () => {
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
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: proofs } = useQuery({
    queryKey: ['transaction-proofs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transaction_proofs')
        .select('*')
        .eq('investment_id', id);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoadingInvestment) {
    return <div>Loading investment details...</div>;
  }

  if (!investment) {
    return <div>Investment not found</div>;
  }

  const handleUploadComplete = () => {
    // Refresh the transaction proofs list
  };

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

      <TransactionProofList investmentId={id!} />

      <Card>
        <CardHeader>
          <CardTitle>Add Transaction Proof</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionProofUpload
            investmentId={id!}
            onUploadComplete={handleUploadComplete}
            existingFiles={proofs}
            form={form}
          />
        </CardContent>
      </Card>
    </div>
  );
}