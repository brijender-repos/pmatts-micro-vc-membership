import { BaseRow } from "./base";

export interface NomineeRow extends BaseRow {
  user_id: string;
  full_name: string;
  date_of_birth: string;
  relationship: "Husband" | "Wife" | "Son" | "Daughter" | "Father" | "Mother" | "Other";
  phone: string | null;
  email: string | null;
  aadhar_number: string | null;
  aadhar_document_url: string | null;
}

export type NomineeInsert = Omit<NomineeRow, "id" | "created_at" | "updated_at">;
export type NomineeUpdate = Partial<NomineeInsert>;