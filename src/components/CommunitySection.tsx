import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const CommunitySection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Join a movement dedicated to creating positive societal transformation. Together, we can catalyze meaningful change for a brighter future.
          </p>
          <Button size="lg" className="h-11 px-8">
            <UserPlus className="mr-2 h-5 w-5" />
            Join PMatts Today
          </Button>
        </div>
      </div>
    </section>
  );
};