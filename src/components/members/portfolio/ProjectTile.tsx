import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ProjectInvestmentStats } from "./ProjectInvestmentStats";
import { ProjectInvestment } from "@/types/portfolio";
import { paymentLogger } from "@/utils/paymentLogger";
import { useToast } from "@/components/ui/use-toast";

interface ProjectTileProps {
  title: string;
  status: string;
  investment: ProjectInvestment;
}

export function ProjectTile({ title, status, investment }: ProjectTileProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isUpcoming = status === "upcoming";
  const projectSlug = title.toLowerCase().replace(/\s+/g, '-');
  
  const handleInvestClick = () => {
    if (title === "Missing Matters") {
      paymentLogger.log('Opening PayU payment link from portfolio', { title });
      window.open("https://pmny.in/PAYUMN/yrJqKQpnMTBF", "_blank");
    } else {
      toast({
        title: "Coming Soon",
        description: "This project is not yet available for investment.",
      });
    }
  };

  const handleProjectClick = () => {
    navigate(`/members/portfolio?project=${encodeURIComponent(title)}`);
  };
  
  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
        investment.total_invested > 0 
          ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' 
          : 'bg-gradient-to-br from-muted/50 to-muted border-muted/20'
      }`}
      onClick={handleProjectClick}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium leading-tight group">
          <div className="hover:text-primary flex items-center justify-between">
            {title}
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2">
        <ProjectInvestmentStats 
          totalInvested={investment.total_invested}
          totalUnits={investment.total_units}
        />
        {!isUpcoming && (
          <Button 
            className="w-full h-8 text-xs"
            variant={investment.total_invested > 0 ? "outline" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              handleInvestClick();
            }}
          >
            <Plus className="mr-1 h-3 w-3" />
            {investment.total_invested > 0 ? 'Invest More' : 'Invest'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}