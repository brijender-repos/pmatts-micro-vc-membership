import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}