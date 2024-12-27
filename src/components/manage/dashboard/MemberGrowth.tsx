import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns";

type TimeFrame = "monthly" | "quarterly" | "yearly";

export function MemberGrowth() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("monthly");

  const { data: growthData } = useQuery({
    queryKey: ["member-growth", timeFrame],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subMonths(endDate, 12); // Last 12 months

      const { data: members } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      // Group data by time frame
      const groupedData = members?.reduce((acc, member) => {
        const date = new Date(member.created_at);
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
          acc[key] = { period: key, count: 0 };
        }
        acc[key].count += 1;
        return acc;
      }, {} as Record<string, { period: string; count: number }>);

      return Object.values(groupedData || {});
    },
  });

  const chartConfig = {
    count: {
      color: "#2563eb",
    },
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Member Growth</CardTitle>
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
            <LineChart data={growthData || []}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" name="New Members" />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}