import { Mail } from "lucide-react";

interface ProfileEmailProps {
  email: string;
}

export function ProfileEmail({ email }: ProfileEmailProps) {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <Mail className="h-4 w-4" />
      <span>{email}</span>
    </div>
  );
}