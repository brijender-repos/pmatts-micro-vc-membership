import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectInvestmentStats } from "./ProjectInvestmentStats";
import { ProjectInvestment } from "@/types/portfolio";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { InvestmentForm } from "@/components/InvestmentForm";
import { useToast } from "@/components/ui/use-toast";

interface ProjectTileProps {
  title: string;
  status: string;
  investment: ProjectInvestment;
}

export function ProjectTile({ title, status, investment }: ProjectTileProps) {
  const [isInvestmentDialogOpen, setIsInvestmentDialogOpen] = useState(false);
  const { toast } = useToast();
  const isUpcoming = status === "upcoming";
  const projectSlug = title.toLowerCase().replace(/\s+/g, '-');
  
  const handleInvestmentSuccess = () => {
    setIsInvestmentDialogOpen(false);
    toast({
      title: "Investment Initiated",
      description: "You will be redirected to the payment gateway.",
    });
  };

  const handleInvestmentError = (error: Error) => {
    toast({
      title: "Investment Error",
      description: error.message,
      variant: "destructive",
    });
  };
  
  return (
    <>
      <Card 
        className={`overflow-hidden transition-all hover:shadow-lg ${
          investment.total_invested > 0 
            ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' 
            : 'bg-gradient-to-br from-muted/50 to-muted border-muted/20'
        }`}
      >
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium leading-tight group">
            <Link 
              to={`/projects/${projectSlug}`}
              className="hover:text-primary flex items-center justify-between"
            >
              {title}
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-2">
          <ProjectInvestmentStats 
            totalInvested={investment.total_invested}
            totalUnits={investment.total_units}
          />
          <Button 
            className="w-full h-8 text-xs"
            variant={investment.total_invested > 0 ? "outline" : "default"}
            disabled={isUpcoming}
            onClick={() => setIsInvestmentDialogOpen(true)}
          >
            <Plus className="mr-1 h-3 w-3" />
            {investment.total_invested > 0 ? 'Invest More' : 'Invest'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isInvestmentDialogOpen} onOpenChange={setIsInvestmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in {title}</DialogTitle>
          </DialogHeader>
          <InvestmentForm 
            projectName={title}
            onSuccess={handleInvestmentSuccess}
            onError={handleInvestmentError}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}