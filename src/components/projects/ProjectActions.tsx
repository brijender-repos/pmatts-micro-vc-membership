import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ProjectActionsProps {
  externalLink: string;
}

export const ProjectActions = ({ externalLink }: ProjectActionsProps) => {
  return (
    <div className="space-y-4">
      <Button className="w-full" asChild>
        <a href={externalLink} target="_blank" rel="noopener noreferrer">
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
  );
};