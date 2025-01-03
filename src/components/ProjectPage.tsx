import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Project Components
import { ProjectHero } from "./projects/ProjectHero";
import { ProjectDescription } from "./projects/ProjectDescription";
import { ProjectFeatures } from "./projects/ProjectFeatures";
import { ProjectActions } from "./projects/ProjectActions";

// Project Data
import missingMattersData from "../data/projects/missing-matters.json";
import agriMattsData from "../data/projects/agri-matts.json";
import solarEnergyMattsData from "../data/projects/solar-energy-matts.json";
import taxpayerMattsData from "../data/projects/taxpayer-matts.json";
import empowerherData from "../data/projects/empowerher.json";
import eduMattsData from "../data/projects/edu-matts.json";
import healthMattsData from "../data/projects/health-matts.json";
import techMattsData from "../data/projects/tech-matts.json";
import waterMattsData from "../data/projects/water-matts.json";

// Types
interface ProjectDetails {
  title: string;
  description: string;
  image: string;
  fullDescription: string;
  features: string[];
  externalLink: string;
}

// Project Data Map
const projectsData: Record<string, ProjectDetails> = {
  "missing-matters": missingMattersData,
  "agri-matts": agriMattsData,
  "solar-energy-matts": solarEnergyMattsData,
  "taxpayer-matts": taxpayerMattsData,
  "empowerher": empowerherData,
  "edu-matts": eduMattsData,
  "health-matts": healthMattsData,
  "tech-matts": techMattsData,
  "water-matts": waterMattsData,
};

// Helper function to get project data
const getProjectData = (slug: string): ProjectDetails | null => {
  return projectsData[slug] || null;
};

export const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectData(slug) : null;

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ProjectHero
        title={project.title}
        description={project.description}
        image={project.image}
      />

      <div className="container px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>

        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <ProjectDescription description={project.fullDescription} />
            <ProjectFeatures features={project.features} />
          </div>
          <ProjectActions externalLink={project.externalLink} />
        </div>
      </div>
    </div>
  );
};