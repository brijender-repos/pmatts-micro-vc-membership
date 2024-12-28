import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserNomineeTabProps {
  nominee: {
    full_name: string;
    date_of_birth: string;
    relationship: string;
    phone: string | null;
    email: string | null;
    aadhar_number: string | null;
    aadhar_document_url: string | null;
  } | null;
}

export function UserNomineeTab({ nominee }: UserNomineeTabProps) {
  if (!nominee) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No nominee details found</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
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
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Phone Number
            </p>
            <p>{nominee.phone || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{nominee.email || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Aadhar Number
            </p>
            <p>{nominee.aadhar_number || "Not provided"}</p>
          </div>
          {nominee.aadhar_document_url && (
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Aadhar Document
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(nominee.aadhar_document_url!, '_blank')}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview Document
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}