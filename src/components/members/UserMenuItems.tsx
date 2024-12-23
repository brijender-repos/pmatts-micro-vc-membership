import { Mail, Phone, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserMenuItemsProps {
  email: string;
  phone?: string;
  onSignOut: () => void;
}

export const UserMenuItems = ({ email, phone, onSignOut }: UserMenuItemsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenuItem className="py-3 focus:bg-accent">
        <Mail className="mr-3 h-4 w-4" />
        <div className="flex flex-col">
          <span className="text-sm">Email</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      </DropdownMenuItem>
      {phone && (
        <DropdownMenuItem className="py-3 focus:bg-accent">
          <Phone className="mr-3 h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-sm">Phone</span>
            <span className="text-xs text-muted-foreground">{phone}</span>
          </div>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem className="py-3 focus:bg-accent" onClick={() => navigate('/members/settings')}>
        <Settings className="mr-3 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border" />
      <DropdownMenuItem className="py-3 focus:bg-accent" onClick={onSignOut}>
        <LogOut className="mr-3 h-4 w-4" />
        <span>Sign out</span>
      </DropdownMenuItem>
    </>
  );
};