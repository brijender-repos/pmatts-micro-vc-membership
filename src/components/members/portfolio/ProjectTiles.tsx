import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

// Import all project data
import eduMatts from "@/data/projects/edu-matts.json";
import agriMatts from "@/data/projects/agri-matts.json";
import taxpayerMatts from "@/data/projects/taxpayer-matts.json";
import empowerher from "@/data/projects/empowerher.json";
import healthMatts from "@/data/projects/health-matts.json";
import solarEnergyMatts from "@/data/projects/solar-energy-matts.json";
import waterMatts from "@/data/projects/water-matts.json";
import missingMatters from "@/data/projects/missing-matters.json";
import techMatts from "@/data/projects/tech-matts.json";

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

// Reorder projects to put Missing Matters first
const allProjects = [
  missingMatters,
  eduMatts,
  agriMatts,
  taxpayerMatts,
  empowerher,
  healthMatts,
  solarEnergyMatts,
  waterMatts,
  techMatts,
];

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
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-8">
      {allProjects.map((project) => {
        const investment = projectTotals[project.title] || {
          total_invested: 0,
          total_units: 0,
        };
        
        const isUpcoming = project.status === "upcoming";
        const projectSlug = project.title.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <Card 
            key={project.title}
            className={`overflow-hidden transition-all hover:shadow-lg ${
              investment.total_invested > 0 
                ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' 
                : 'bg-gradient-to-br from-muted/50 to-muted border-muted/20'
            }`}
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium leading-tight group">
                <Link 
                  to={`/projects/${projectSlug}`}
                  className="hover:text-primary flex items-center justify-between"
                >
                  {project.title}
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                  <p className={`text-lg font-semibold ${
                    investment.total_invested > 0 ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {formatCurrency(investment.total_invested)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Units</p>
                  <p className={`text-lg font-semibold ${
                    investment.total_units > 0 ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {investment.total_units}
                  </p>
                </div>
              </div>
              <Button 
                className="w-full h-8 text-xs"
                variant={investment.total_invested > 0 ? "outline" : "default"}
                disabled={isUpcoming}
              >
                <Plus className="mr-1 h-3 w-3" />
                {investment.total_invested > 0 ? 'Invest More' : 'Invest'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}