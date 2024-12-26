import { useQuery } from "@tanstack/react-query";
import { FileText, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TransactionProofListProps {
  investmentId: string;
}

export function TransactionProofList({ investmentId }: TransactionProofListProps) {
  const { data: proofs, isLoading } = useQuery({
    queryKey: ['transaction-proofs', investmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transaction_proofs')
        .select('*')
        .eq('investment_id', investmentId);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading proofs...</div>;
  }

  if (!proofs?.length) {
    return <div>No transaction proofs uploaded yet.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Proofs</CardTitle>
        <CardDescription>
          View uploaded transaction proofs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {proofs.map((proof) => (
            <div
              key={proof.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{proof.file_name}</span>
              </div>
              <a
                href={proof.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
              >
                View
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}