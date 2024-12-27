import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns";

type TimeFrame = "monthly" | "quarterly" | "yearly";

export function InvestmentTrends() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("monthly");

  const { data: trendsData } = useQuery({
    queryKey: ["investment-trends", timeFrame],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subMonths(endDate, 12); // Last 12 months

      const { data: investments } = await supabase
        .from("investments")
        .select("amount, investment_date")
        .eq("transaction_status", "success")
        .gte("investment_date", startDate.toISOString())
        .lte("investment_date", endDate.toISOString());

      // Group data by time frame
      const groupedData = investments?.reduce((acc, inv) => {
        const date = new Date(inv.investment_date);
        let key = "";
        
        if (timeFrame === "monthly") {
          key = format(date, "MMM yyyy");
        } else if (timeFrame === "quarterly") {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `Q${quarter} ${date.getFullYear()}`;
        } else {
          key = `FY ${date.getFullYear()}`;
        }

        if (!acc[key]) {
          acc[key] = { period: key, amount: 0, count: 0 };
        }
        acc[key].amount += Number(inv.amount);
        acc[key].count += 1;
        return acc;
      }, {} as Record<string, { period: string; amount: number; count: number }>);

      return Object.values(groupedData || {});
    },
  });

  const chartConfig = {
    amount: {
      color: "#2563eb",
    },
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Investment Trends</CardTitle>
        <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <BarChart data={trendsData || []}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" name="Investment Amount" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}