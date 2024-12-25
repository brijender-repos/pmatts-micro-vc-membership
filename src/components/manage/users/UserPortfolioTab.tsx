import { InvestmentHistory } from "@/components/members/portfolio/InvestmentHistory";
import { InvestmentSummary } from "@/components/members/portfolio/InvestmentSummary";
import { ProjectTiles } from "@/components/members/portfolio/ProjectTiles";

interface UserPortfolioTabProps {
  investments: any[];
}

export function UserPortfolioTab({ investments }: UserPortfolioTabProps) {
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