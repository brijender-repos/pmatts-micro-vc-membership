import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ManageUserProfileProps {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    is_active: boolean | null;
  };
}

export function ManageUserProfile({ profile }: ManageUserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone || "");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneUpdate = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({ phone: phoneNumber })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Phone number updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error("Failed to update phone number");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
          <p className="text-base">{profile.full_name || "Not provided"}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-base">{profile.email || "Not provided"}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Phone</p>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                disabled={isLoading}
              />
              <Button 
                onClick={handlePhoneUpdate}
                disabled={isLoading}
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-base">{profile.phone || "Not provided"}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Account Status</p>
          <p className="text-base">
            {profile.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </Card>
  );
}