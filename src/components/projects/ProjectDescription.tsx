import { Card, CardContent } from "@/components/ui/card";

interface ProjectDescriptionProps {
  description: string;
}

export const ProjectDescription = ({ description }: ProjectDescriptionProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">About this Project</h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};