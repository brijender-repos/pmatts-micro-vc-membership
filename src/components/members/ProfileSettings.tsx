import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileEmail } from "./profile/ProfileEmail";
import { ProfileForm } from "./profile/ProfileForm";
import { useProfile } from "./profile/useProfile";

export function ProfileSettings() {
  const {
    loading,
    isEditing,
    setIsEditing,
    avatarUrl,
    email,
    form,
    loadProfile,
    handleSubmit,
    handleCancel,
  } = useProfile();

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your profile information and settings.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfileAvatar avatarUrl={avatarUrl} />
        <ProfileEmail email={email} />
        <ProfileForm
          form={form}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </CardContent>
    </Card>
  );
}