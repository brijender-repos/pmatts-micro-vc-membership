import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";
import { Card } from "@/components/ui/card";

interface UserPortfolioTabProps {
  investments: any[];
}

export function UserPortfolioTab({ investments }: UserPortfolioTabProps) {
  if (!investments || investments.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No investment data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <InvestmentSummary investments={investments} />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <ProjectTiles investments={investments} />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Investment History</h2>
        <InvestmentHistory investments={investments} />
      </div>
    </div>
  );
}