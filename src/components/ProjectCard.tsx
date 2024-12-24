import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { paymentLogger } from "@/utils/paymentLogger";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  status: "active" | "upcoming";
}

export const ProjectCard = ({ title, description, image, link, status }: ProjectCardProps) => {
  const { toast } = useToast();

  const handleInvestClick = () => {
    if (title === "Missing Matters") {
      paymentLogger.log('Opening PayU payment link', { title });
      window.open("https://pmny.in/PAYUMN/yrJqKQpnMTBF", "_blank");
    } else {
      toast({
        title: "Coming Soon",
        description: "This project is not yet available for investment.",
      });
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-all hover:scale-105"
        />
        {status === "upcoming" && (
          <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm">
            Upcoming
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
          <a href={link} className="flex items-center">
            Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button 
          onClick={handleInvestClick}
          disabled={status === "upcoming"}
        >
          Invest Now
        </Button>
      </CardContent>
    </Card>
  );
};