import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";

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
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl max-w-2xl mx-auto">{project.description}</p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>

        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About this Project</h2>
                <p className="text-gray-600 dark:text-gray-400">{project.fullDescription}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button className="w-full" asChild>
              <a href={project.externalLink} target="_blank" rel="noopener noreferrer">
                Visit Project Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="w-full">
              Subscribe to Access Details
            </Button>
            <Button variant="secondary" className="w-full">
              Invest Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
