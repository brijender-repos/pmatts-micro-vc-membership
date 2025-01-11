import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { TransactionProofList } from "@/components/manage/investments/TransactionProofList";
import { TransactionProofUpload } from "@/components/manage/investments/TransactionProofUpload";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

export default function InvestmentDetails() {
  const { investmentId } = useParams();
  const form = useForm({
    defaultValues: {
      transaction_details: "",
      transaction_date: "",
      transaction_amount: 0,
      payment_mode: "",
    },
  });

  const { data: investment } = useQuery({
    queryKey: ["investment-details", investmentId],
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
        .eq("id", investmentId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!investment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Investor</div>
              <div className="font-medium">{investment.profiles?.full_name}</div>
              <div className="text-sm text-gray-500">{investment.profiles?.email}</div>
              <div className="text-sm text-gray-500">{investment.profiles?.phone || "No phone"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Project</div>
              <div className="font-medium">{investment.project_name}</div>
              <div className="text-sm text-gray-500">
                <Badge variant="outline" className="capitalize">
                  {investment.investment_type.replace("_", " ")}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Investment Details</div>
              <div className="font-medium">{formatCurrency(investment.amount)}</div>
              <div className="text-sm text-gray-500">
                {investment.units ? `${investment.units} units` : "N/A"}
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(investment.investment_date), "PP")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Proofs</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <TransactionProofList investmentId={investment.id} />
              <TransactionProofUpload 
                investmentId={investment.id}
                onUploadComplete={() => {}}
                form={form}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}