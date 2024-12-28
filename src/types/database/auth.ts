import { Database } from "./base";

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type UserProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];