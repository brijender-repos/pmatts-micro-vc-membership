import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, User, Phone, Mail, CreditCard } from "lucide-react";

interface Nominee {
  full_name: string;
  date_of_birth: string;
  relationship: string;
  phone: string | null;
  email: string | null;
  aadhar_number: string | null;
  aadhar_document_url: string | null;
}

interface AdminUserNomineeProps {
  nominee: Nominee | null;
}

export function AdminUserNominee({ nominee }: AdminUserNomineeProps) {
  if (!nominee) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No nominee details found</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="text-base">{nominee.full_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p className="text-base">
              {new Date(nominee.date_of_birth).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Relationship</p>
            <p className="text-base">{nominee.relationship}</p>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-base">{nominee.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{nominee.email || "Not provided"}</p>
            </div>
          </div>

          {nominee.aadhar_number && (
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Aadhar Number
                  </p>
                  <p className="text-base">{nominee.aadhar_number}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {nominee.aadhar_document_url && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(nominee.aadhar_document_url!, "_blank")}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Aadhar Document
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}