import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/members/UserMenu";

export const DashboardHeader = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/members/dashboard" className="text-xl font-bold">
            PMatts Dashboard
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  );
};