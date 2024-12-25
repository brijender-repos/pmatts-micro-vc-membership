import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface InvestmentWithUser {
  id: string;
  project_name: string;
  investment_type: "investment" | "follow_on" | "distribution" | "exit" | "dividend";
  investment_date: string;
  amount: number;
  units: number | null;
  user_id: string;
  transaction_status: string;
  profiles: {
    full_name: string | null;
    user: {
      email: string | null;
    };
  };
}

export default function Investments() {
  const { data: investments } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          id,
          project_name,
          investment_type,
          investment_date,
          amount,
          units,
          user_id,
          transaction_status,
          profiles:profiles!investments_user_id_profiles_fkey (
            full_name,
            user:auth.users!profiles_user_id_fkey (
              email
            )
          )
        `)
        .order("investment_date", { ascending: false });

      if (error) throw error;
      return data as InvestmentWithUser[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
        <p className="text-muted-foreground">
          View and manage all investments made by users
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Investor</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments?.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell>
                  {format(new Date(investment.investment_date), "PP")}
                </TableCell>
                <TableCell>
                  <div>
                    <p>{investment.profiles?.full_name || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">
                      {investment.profiles?.user?.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{investment.project_name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {investment.investment_type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(investment.amount)}</TableCell>
                <TableCell>{investment.units || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      investment.transaction_status === "completed"
                        ? "success"
                        : investment.transaction_status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {investment.transaction_status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}