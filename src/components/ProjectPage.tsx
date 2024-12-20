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
  "taxpayer-matts": {
    title: "Taxpayer-Matts",
    description: "Simplifying taxes and advocating for reforms.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    fullDescription: "Empowering taxpayers with reforms and work-from-home advocacy, simplifying tax processes for everyone.",
    features: [
      "Simplified tax processes",
      "Incentives for remote work opportunities",
      "Tax reform advocacy"
    ],
    externalLink: "https://pmattscatalysts.com/portfolio/tax-payer-matts/"
  },
  "empowerher": {
    title: "EmpowerHer",
    description: "Empowering women economically and socially.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    fullDescription: "Boosting women's economic contributions through skill development and entrepreneurial opportunities.",
    features: [
      "Skill-building for freelancing",
      "Home business development",
      "Women's workforce inclusion programs"
    ],
    externalLink: "https://pmattscatalysts.com/portfolio/pmatts-for-women/"
  },
  "edu-matts": {
    title: "Edu-Matts",
    description: "Revolutionizing education through technology and accessibility.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    fullDescription: "Enhancing education through accessible technology and resources for underprivileged communities.",
    features: [
      "Smart learning solutions",
      "Educational resource accessibility",
      "Technology integration in learning"
    ],
    externalLink: "https://pmattscatalysts.com/portfolio/edu-matts/"
  },
  "health-matts": {
    title: "Health-Matts",
    description: "Community health initiatives focused on rural healthcare solutions.",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e",
    fullDescription: "Improving rural healthcare with tech-based solutions and community engagement.",
    features: [
      "Mobile health clinics",
      "Telemedicine services",
      "Community health awareness"
    ],
    externalLink: "https://pmattscatalysts.com/portfolio/health-matts/"
  },
  "tech-matts": {
    title: "Tech-Matts",
    description: "A platform for advancing tech-driven innovations for societal impact.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    fullDescription: "Advancing technological innovations that create meaningful societal impact.",
    features: [
      "Innovation incubation",
      "Tech solution development",
      "Social impact assessment"
    ],
    externalLink: "https://pmattscatalysts.com/portfolio/tech-matts/"
  },
  "water-matts": {
    title: "Water-Matts",
    description: "Sustainable water management for agricultural and household use.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    fullDescription: "Implementing sustainable water management solutions for agriculture and domestic use.",
    features: [
      "Smart irrigation systems",
      "Water conservation techniques",
      "Sustainable water management"
    ],
    externalLink: "https://pmattscatalysts.com/portfolio/water-matts/"
  }
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