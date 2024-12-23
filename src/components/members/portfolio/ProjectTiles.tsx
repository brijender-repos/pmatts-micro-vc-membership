import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProjectInvestment {
  project_name: string;
  total_invested: number;
  total_units: number;
}

interface ProjectTilesProps {
  investments: {
    project_name: string;
    amount: number;
    units?: number;
    investment_type: string;
  }[];
}

export function ProjectTiles({ investments }: ProjectTilesProps) {
  // Calculate totals per project
  const projectTotals = investments.reduce((acc: Record<string, ProjectInvestment>, inv) => {
    if (!acc[inv.project_name]) {
      acc[inv.project_name] = {
        project_name: inv.project_name,
        total_invested: 0,
        total_units: 0,
      };
    }
    
    if (inv.investment_type === 'investment' || inv.investment_type === 'follow_on') {
      acc[inv.project_name].total_invested += inv.amount;
      acc[inv.project_name].total_units += inv.units || 0;
    }
    
    return acc;
  }, {});

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {Object.values(projectTotals).map((project) => (
        <Card key={project.project_name}>
          <CardHeader>
            <CardTitle className="text-lg">{project.project_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-2xl font-bold">{formatCurrency(project.total_invested)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Units</p>
              <p className="text-2xl font-bold">{project.total_units}</p>
            </div>
            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Invest
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}