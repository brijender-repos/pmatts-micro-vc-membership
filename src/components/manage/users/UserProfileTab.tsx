import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

interface UserProfileTabProps {
  profile: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    is_active: boolean | null;
  };
  isEditingPhone: boolean;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  setIsEditingPhone: (value: boolean) => void;
  handlePhoneUpdate: () => void;
}

export function UserProfileTab({
  profile,
  isEditingPhone,
  phoneNumber,
  setPhoneNumber,
  setIsEditingPhone,
  handlePhoneUpdate,
}: UserProfileTabProps) {
  if (!profile) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No profile data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p>{profile.full_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{profile.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            {isEditingPhone ? (
              <div className="flex items-center gap-2">
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
                <Button onClick={handlePhoneUpdate}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditingPhone(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p>{profile.phone || "N/A"}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingPhone(true)}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p>{profile.is_active ? "Active" : "Inactive"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}