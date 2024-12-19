import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProjectHero } from "./projects/ProjectHero";
import { ProjectDescription } from "./projects/ProjectDescription";
import { ProjectFeatures } from "./projects/ProjectFeatures";
import { ProjectActions } from "./projects/ProjectActions";

interface ProjectDetails {
  title: string;
  description: string;
  image: string;
  fullDescription: string;
  features: string[];
  externalLink: string;
}

const projectsData: Record<string, ProjectDetails> = {
  "missing-matters": {
    title: "Missing Matters",
    description: "A tech-driven solution for lost-and-found management.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    fullDescription: "Redefining lost-item management with AI smart boxes, fostering social responsibility, and easing law enforcement workloads.",
    features: [
      "AI-driven item deposit and retrieval",
      "Community recognition for depositors",
      "Multilingual and tourist-friendly system"
    ],
    externalLink: "http://pmattscatalysts.com/missing-matters"
  },
  "agri-matts": {
    title: "Agri-Matts",
    description: "Sustainable land utilization for agriculture and energy.",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    fullDescription: "Transforming underutilized land for agriculture and energy, creating sustainable solutions for rural communities.",
    features: [
      "Dual-use land for food and solar energy",
      "Economic upliftment of rural communities",
      "Sustainable farming practices"
    ],
    externalLink: "https://pmattscatalysts.com/portfolio/agri-matts/"
  },
  "solar-energy-matts": {
    title: "Solar Energy-Matts",
    description: "Integrating solar panels with agriculture.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    fullDescription: "Clean energy generation through solar-agriculture synergy, contributing to sustainable development goals.",
    features: [
      "Efficient use of land for renewable energy",
      "Contribution to SDG goals for sustainability",
      "Integration with agricultural practices"
    ],
    externalLink: "https://pmattscatalysts.com/portfolio/solar-energy-matts/"
  },
  // Add more projects here following the same pattern
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
