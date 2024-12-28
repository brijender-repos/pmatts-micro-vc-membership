import { BaseRow } from "./base";

export interface TransactionProofRow extends BaseRow {
  investment_id: string;
  file_url: string;
  file_name: string;
}

export type TransactionProofInsert = Omit<TransactionProofRow, "id" | "created_at" | "updated_at">;
export type TransactionProofUpdate = Partial<TransactionProofInsert>;