import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ManageUserHeaderProps {
  profile: {
    full_name: string | null;
    email: string | null;
  };
}

export function ManageUserHeader({ profile }: ManageUserHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/manage/users">
            <ChevronLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        <div className="flex flex-col space-y-1">
          <p className="text-lg font-medium">{profile.full_name}</p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </div>
    </div>
  );
}