import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";

export function TopInvestors() {
  const { data: topInvestors } = useQuery({
    queryKey: ["top-investors"],
    queryFn: async () => {
      const { data } = await supabase
        .from("investments")
        .select(`
          amount,
          profiles (
            full_name,
            email,
            phone
          )
        `)
        .eq("transaction_status", "success");

      // Calculate total investment per user
      const investmentsByUser = data?.reduce((acc, inv) => {
        const key = inv.profiles.email;
        if (!acc[key]) {
          acc[key] = {
            name: inv.profiles.full_name,
            email: inv.profiles.email,
            phone: inv.profiles.phone,
            total: 0,
          };
        }
        acc[key].total += Number(inv.amount);
        return acc;
      }, {} as Record<string, { name: string; email: string; phone: string; total: number }>);

      // Convert to array and sort by total investment
      return Object.values(investmentsByUser || {})
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
    },
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top 5 Investors</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Total Investment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topInvestors?.map((investor) => (
              <TableRow key={investor.email}>
                <TableCell>{investor.name}</TableCell>
                <TableCell>{investor.email}</TableCell>
                <TableCell>{investor.phone}</TableCell>
                <TableCell className="text-right">{formatCurrency(investor.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}