interface ProjectHeroProps {
  title: string;
  description: string;
  image: string;
}

export const ProjectHero = ({ title, description, image }: ProjectHeroProps) => {
  return (
    <div className="relative h-[50vh] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-2xl mx-auto">{description}</p>
        </div>
      </div>
    </div>
  );
};