import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileEmail } from "./profile/ProfileEmail";
import { ProfileForm } from "./profile/ProfileForm";
import { useProfile } from "./profile/useProfile";

export function ProfileSettings() {
  const {
    loading,
    avatarUrl,
    email,
    form,
    loadProfile,
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
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            View your profile information and settings.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfileAvatar avatarUrl={avatarUrl} />
        <ProfileEmail email={email} />
        <ProfileForm form={form} />
      </CardContent>
    </Card>
  );
}