import { ProjectCard } from "./ProjectCard";

const projects = [
  {
    title: "Missing Matters",
    description: "A tech-driven solution for lost-and-found management.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    link: "http://pmattscatalysts.com/missing-matters",
    status: "active",
  },
  {
    title: "Agri-Matts",
    description: "Sustainable land utilization for agriculture and energy.",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    link: "https://pmattscatalysts.com/portfolio/agri-matts/",
    status: "active",
  },
  // ... Add more projects here
];

export const ProjectsSection = () => {
  return (
    <section className="py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Projects</h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Discover our innovative initiatives making a real impact in communities.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};