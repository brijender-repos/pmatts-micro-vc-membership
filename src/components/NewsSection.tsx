import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

// News data structure
interface NewsItem {
  id: number;
  date: string;
  title: string;
  description: string;
  project: string;
}

// Sample news data (in a real app, this would come from an API)
const newsItems: NewsItem[] = [
  {
    id: 1,
    date: "2024-03-15",
    title: "Missing Matters Launches in New Delhi",
    description: "Our smart box solution for lost items is now operational in 5 locations across New Delhi.",
    project: "Missing Matters",
  },
  {
    id: 2,
    date: "2024-03-10",
    title: "Agri-Matts Expands Solar Integration",
    description: "Successfully integrated solar panels across 50 acres of agricultural land in Punjab.",
    project: "Agri-Matts",
  },
  {
    id: 3,
    date: "2024-03-05",
    title: "EmpowerHer Reaches Milestone",
    description: "Over 1000 women trained in digital skills through our online platform.",
    project: "EmpowerHer",
  },
  {
    id: 4,
    date: "2024-02-28",
    title: "Water-Matts Pilot Program",
    description: "Initiated smart irrigation systems in 10 farms, showing 40% water savings.",
    project: "Water-Matts",
  },
  {
    id: 5,
    date: "2024-02-20",
    title: "Tech-Matts Innovation Hub",
    description: "New innovation center opened in Bangalore to support tech startups.",
    project: "Tech-Matts",
  },
];

export const NewsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/50 relative">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Latest Updates</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Stay informed about our latest initiatives and project milestones
          </p>
          <div className="flex items-center gap-8 text-muted-foreground">
            <button className="group p-2 hover:bg-muted/80 rounded-full transition-colors">
              <ChevronLeft className="h-6 w-6 group-hover:text-primary transition-colors" />
            </button>
            <button className="group p-2 hover:bg-muted/80 rounded-full transition-colors">
              <ChevronRight className="h-6 w-6 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto relative group"
        >
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10 hidden md:block" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10 hidden md:block" />
          
          <CarouselContent className="-ml-2 md:-ml-4">
            {newsItems.map((item) => (
              <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 h-full group/card">
                  <CardContent className="flex flex-col p-6 h-full">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-4">
                      <CalendarDays className="h-4 w-4" />
                      <time dateTime={item.date}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover/card:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground flex-grow">{item.description}</p>
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-sm font-medium text-primary">{item.project}</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-12 bg-background/80 backdrop-blur-sm hover:bg-background" />
          <CarouselNext className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 -right-12 bg-background/80 backdrop-blur-sm hover:bg-background" />
          
          <div className="mt-8 flex justify-center gap-2">
            <div className="flex gap-1">
              {[...Array(Math.ceil(newsItems.length / 3))].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted-foreground/20"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};