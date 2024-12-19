import { Building2, Heart, Users, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const AboutSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl">
                About PMatts
              </h2>
              <p className="text-lg text-muted-foreground md:text-xl">
                PMatts Innovative Catalysts Federation, a Section 8 not-for-profit company, is dedicated to driving positive societal transformation through innovative technologies and community initiatives.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Globe className="h-5 w-5 text-primary" />
                <span>Global Impact</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-5 w-5 text-primary" />
                <span>Community Driven</span>
              </div>
            </div>
          </div>

          {/* Right Column - Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Building2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Our Mission</h3>
                <p className="text-center text-muted-foreground">
                  To inspire and empower individuals to act responsibly and create meaningful change.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Heart className="h-12 w-12 text-secondary" />
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="text-center text-muted-foreground">
                  Building smarter, sustainable, and empathetic communities for a better tomorrow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};