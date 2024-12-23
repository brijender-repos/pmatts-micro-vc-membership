import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuHeaderProps {
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export const UserMenuHeader = ({ fullName, email, avatarUrl }: UserMenuHeaderProps) => {
  return (
    <div className="flex items-center gap-4 p-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          <User className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className="text-sm font-medium">{fullName || 'User'}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  );
};