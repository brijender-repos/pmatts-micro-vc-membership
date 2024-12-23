import { Investment } from "@/types/portfolio";
import { ProjectTile } from "./ProjectTile";

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

interface ProjectTilesProps {
  investments: Investment[];
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
  const projectTotals = investments.reduce((acc, inv) => {
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
  }, {} as Record<string, { project_name: string; total_invested: number; total_units: number; }>);

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-8">
      {allProjects.map((project) => {
        const investment = projectTotals[project.title] || {
          total_invested: 0,
          total_units: 0,
        };
        
        return (
          <ProjectTile
            key={project.title}
            title={project.title}
            status={project.status}
            investment={investment}
          />
        );
      })}
    </div>
  );
}