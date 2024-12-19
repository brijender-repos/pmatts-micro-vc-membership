import { Card, CardContent } from "@/components/ui/card";

interface ProjectFeaturesProps {
  features: string[];
}

export const ProjectFeatures = ({ features }: ProjectFeaturesProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};