import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { NewsSection } from "@/components/NewsSection";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <NewsSection />
        <ProjectsSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}