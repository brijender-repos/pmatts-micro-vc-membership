import { Button } from "@/components/ui/button";
import { UserPlus, Globe } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Empowering Communities Through{" "}
            <span className="text-primary">Innovation</span> and{" "}
            <span className="text-secondary">Responsibility</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Join us in creating positive societal transformation through innovative technologies and community initiatives.
          </p>
          <div className="space-x-4">
            <Button className="h-11 px-8" size="lg">
              <UserPlus className="mr-2 h-5 w-5" />
              Join Us
            </Button>
            <Button variant="outline" className="h-11 px-8" size="lg">
              <Globe className="mr-2 h-5 w-5" />
              Explore Our Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};