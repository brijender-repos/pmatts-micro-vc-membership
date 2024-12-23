import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/members/UserMenu";
import { Grid, Archive } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Pmatts
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/members/dashboard" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/members/portfolio" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Portfolio
              </Link>
            </Button>
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  );
};