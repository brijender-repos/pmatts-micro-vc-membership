import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface AdminUserHeaderProps {
  fullName: string | null;
  email: string | null;
}

export function AdminUserHeader({ fullName, email }: AdminUserHeaderProps) {
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
          <p className="text-lg font-medium">{fullName}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
    </div>
  );
}