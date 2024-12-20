import { ProjectCard } from "./ProjectCard";

const projects = [
  {
    title: "Missing Matters",
    description: "A tech-driven solution for lost-and-found management.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    slug: "missing-matters",
    status: "active" as const,
  },
  {
    title: "Agri-Matts",
    description: "Sustainable land utilization for agriculture and energy.",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    slug: "agri-matts",
    status: "active" as const,
  },
  {
    title: "Solar Energy-Matts",
    description: "Integrating solar panels with agriculture for sustainable energy.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    slug: "solar-energy-matts",
    status: "active" as const,
  },
  {
    title: "Taxpayer-Matts",
    description: "Simplifying taxes and advocating for reforms.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    slug: "taxpayer-matts",
    status: "active" as const,
  },
  {
    title: "EmpowerHer",
    description: "Empowering women economically and socially.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    slug: "empowerher",
    status: "active" as const,
  },
  {
    title: "Edu-Matts",
    description: "Revolutionizing education through technology and accessibility.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    slug: "edu-matts",
    status: "upcoming" as const,
  },
  {
    title: "Health-Matts",
    description: "Community health initiatives focused on rural healthcare solutions.",
    image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e",
    slug: "health-matts",
    status: "upcoming" as const,
  },
  {
    title: "Tech-Matts",
    description: "A platform for advancing tech-driven innovations for societal impact.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    slug: "tech-matts",
    status: "upcoming" as const,
  },
  {
    title: "Water-Matts",
    description: "Sustainable water management for agricultural and household use.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    slug: "water-matts",
    status: "upcoming" as const,
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects-section" className="py-24 bg-gradient-to-b from-background to-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Projects</h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Discover our innovative initiatives making a real impact in communities.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              image={project.image}
              link={`/projects/${project.slug}`}
              status={project.status}
            />
          ))}
        </div>
      </div>
    </section>
  );
};