import { Building2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const AboutSection = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About PMatts</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                PMatts Innovative Catalysts Federation, a Section 8 not-for-profit company, is dedicated to driving positive societal transformation through innovative technologies and community initiatives.
              </p>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center gap-4 lg:max-w-none">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Building2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Our Mission</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  To inspire and empower individuals to act responsibly and create meaningful change.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Heart className="h-12 w-12 text-secondary" />
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
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