export type NomineeRelationship = "Husband" | "Wife" | "Son" | "Daughter" | "Father" | "Mother" | "Other";

export interface NomineeFormValues {
  full_name: string;
  date_of_birth: string;
  relationship: NomineeRelationship;
  phone: string;
  email: string;
  aadhar_number: string;
  aadhar_document?: File;
}