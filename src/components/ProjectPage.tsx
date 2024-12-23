import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProjectHero } from "./projects/ProjectHero";
import { ProjectDescription } from "./projects/ProjectDescription";
import { ProjectFeatures } from "./projects/ProjectFeatures";
import { ProjectActions } from "./projects/ProjectActions";
import missingMattersData from "../data/missing-matters.json";
import agriMattsData from "../data/agri-matts.json";
import solarEnergyMattsData from "../data/solar-energy-matts.json";
import taxpayerMattsData from "../data/taxpayer-matts.json";
import empowerherData from "../data/empowerher.json";
import eduMattsData from "../data/edu-matts.json";
import healthMattsData from "../data/health-matts.json";
import techMattsData from "../data/tech-matts.json";
import waterMattsData from "../data/water-matts.json";

interface ProjectDetails {
  title: string;
  description: string;
  image: string;
  fullDescription: string;
  features: string[];
  externalLink: string;
}

const projectsData: Record<string, ProjectDetails> = {
  "missing-matters": missingMattersData,
  "agri-matts": agriMattsData,
  "solar-energy-matts": solarEnergyMattsData,
  "taxpayer-matts": taxpayerMattsData,
  "empowerher": empowerherData,
  "edu-matts": eduMattsData,
  "health-matts": healthMattsData,
  "tech-matts": techMattsData,
  "water-matts": waterMattsData
};

export const ProjectPage = () => {
  const { slug } = useParams();
  const project = slug ? projectsData[slug] : null;

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
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
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