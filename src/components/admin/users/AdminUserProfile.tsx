import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, User, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminUserProfileProps {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    is_active: boolean | null;
  };
  onProfileUpdate: () => void;
}

export function AdminUserProfile({ profile, onProfileUpdate }: AdminUserProfileProps) {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone || "");

  const handlePhoneUpdate = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ phone: phoneNumber })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Phone number updated successfully");
      setIsEditingPhone(false);
      onProfileUpdate();
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error("Failed to update phone number");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="text-base">{profile.full_name || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-base">{profile.email || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            {isEditingPhone ? (
              <div className="flex items-center gap-2 mt-1">
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="max-w-[200px]"
                />
                <Button size="sm" onClick={handlePhoneUpdate}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingPhone(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-base">{profile.phone || "Not provided"}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingPhone(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Account Status</p>
            <div className="flex items-center gap-2">
              {profile.is_active ? (
                <span className="text-green-600 flex items-center gap-1">
                  <Check className="h-4 w-4" /> Active
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <X className="h-4 w-4" /> Inactive
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}