import { formatCurrency } from "@/lib/utils";

interface ProjectInvestmentStatsProps {
  totalInvested: number;
  totalUnits: number;
}

export function ProjectInvestmentStats({ totalInvested, totalUnits }: ProjectInvestmentStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-xs text-muted-foreground">Total Invested</p>
        <p className={`text-lg font-semibold ${
          totalInvested > 0 ? 'text-primary' : 'text-muted-foreground'
        }`}>
          {formatCurrency(totalInvested)}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Units</p>
        <p className={`text-lg font-semibold ${
          totalUnits > 0 ? 'text-primary' : 'text-muted-foreground'
        }`}>
          {totalUnits}
        </p>
      </div>
    </div>
  );
}