import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns";

type TimeFrame = "monthly" | "quarterly" | "yearly";

export function MemberGrowth() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("monthly");

  const { data: growthData } = useQuery({
    queryKey: ["member-growth", timeFrame],
    queryFn: async () => {
      const endDate = new Date();
      let startDate = subMonths(endDate, 2); // Always fetch at least 3 months

      if (timeFrame === "quarterly") {
        startDate = subMonths(endDate, 9); // Last 4 quarters
      } else if (timeFrame === "yearly") {
        startDate = subMonths(endDate, 12); // Last 12 months
      }

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

      // Ensure we have at least 3 months of data points for monthly view
      if (timeFrame === "monthly") {
        const months = [];
        for (let i = 2; i >= 0; i--) {
          const date = subMonths(endDate, i);
          const key = format(date, "MMM yyyy");
          if (!groupedData?.[key]) {
            groupedData[key] = { period: key, count: 0 };
          }
          months.push(key);
        }
        // Sort the data by date
        return Object.values(groupedData)
          .filter(item => months.includes(item.period))
          .sort((a, b) => {
            const dateA = new Date(a.period);
            const dateB = new Date(b.period);
            return dateA.getTime() - dateB.getTime();
          });
      }

      return Object.values(groupedData || {});
    },
  });

  const chartConfig = {
    count: {
      color: "#6366F1", // Using primary color from tailwind config
      label: "New Members",
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
      <CardContent className="h-[250px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={growthData || []} 
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <XAxis 
                dataKey="period" 
                angle={-45}
                textAnchor="end"
                height={40}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                width={50}
                tick={{ fontSize: 12 }}
                domain={[25, 'auto']}
                allowDataOverflow={true}
              />
              <Tooltip />
              <Bar 
                dataKey="count" 
                fill={chartConfig.count.color}
                name={chartConfig.count.label}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
