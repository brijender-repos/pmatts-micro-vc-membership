import { BaseRow } from "./base";

export interface KycDetailsRow extends BaseRow {
  user_id: string | null;
  aadhar_number: string | null;
  aadhar_name: string | null;
  aadhar_image_url: string | null;
  pan_number: string | null;
  pan_name: string | null;
  pan_image_url: string | null;
  status: "not_started" | "aadhar_submitted" | "pan_submitted" | "verification_pending" | "verified" | "rejected" | null;
  verification_notes: string | null;
}

export type KycDetailsInsert = Omit<KycDetailsRow, "id" | "created_at" | "updated_at">;
export type KycDetailsUpdate = Partial<KycDetailsInsert>;