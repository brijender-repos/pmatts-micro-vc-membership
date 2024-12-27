import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building2, Globe, Heart, Mail, UserPlus } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { NewsSection } from "@/components/NewsSection";
import { CommunitySection } from "@/components/CommunitySection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { Footer } from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AboutSection />
      <NewsSection />
      <CommunitySection />
      <ProjectsSection />
      <Footer />
    </div>
  );
};

export default Home;