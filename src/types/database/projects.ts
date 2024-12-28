import { BaseRow } from "./base";

export interface ProjectRow extends BaseRow {
  name: string;
  description: string | null;
  category: string;
  start_date: string;
  status: "active" | "completed" | "upcoming";
}

export type ProjectInsert = Omit<ProjectRow, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectInsert>;