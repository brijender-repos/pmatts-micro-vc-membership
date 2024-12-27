import { Button } from "@/components/ui/button";
import { UserPlus, Globe, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const scrollToProjects = () => {
    const projectsSection = document.querySelector('#projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMembersAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/members/dashboard');
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the members area",
      });
      navigate('/auth/login');
    }
  };

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
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="h-11 px-8" size="lg">
              <UserPlus className="mr-2 h-5 w-5" />
              Join Us
            </Button>
            <Button 
              variant="outline" 
              className="h-11 px-8" 
              size="lg"
              onClick={scrollToProjects}
            >
              <Globe className="mr-2 h-5 w-5" />
              Explore Our Projects
            </Button>
            <Button
              variant="secondary"
              className="h-11 px-8"
              size="lg"
              onClick={handleMembersAccess}
            >
              <Lock className="mr-2 h-5 w-5" />
              Members Access
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};