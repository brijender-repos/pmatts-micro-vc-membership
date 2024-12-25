import { Card } from "@/components/ui/card";

interface UserNomineeTabProps {
  nominee: {
    full_name: string;
    date_of_birth: string;
    relationship: string;
  } | null;
}

export function UserNomineeTab({ nominee }: UserNomineeTabProps) {
  return (
    <Card className="p-6">
      {nominee ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{nominee.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date of Birth
              </p>
              <p>{new Date(nominee.date_of_birth).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Relationship
              </p>
              <p>{nominee.relationship}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No nominee details found</p>
      )}
    </Card>
  );
}