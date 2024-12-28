import { BaseRow } from "./base";

export interface ProfileRow extends BaseRow {
  user_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean | null;
  admin_role: boolean | null;
  email: string | null;
}

export type ProfileInsert = Omit<ProfileRow, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<ProfileInsert>;