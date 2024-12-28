import { BaseRow } from "./base";

export interface InvestmentRow extends BaseRow {
  user_id: string;
  project_name: string;
  investment_type: "investment" | "follow_on" | "distribution" | "exit" | "dividend";
  amount: number;
  units: number | null;
  equity_percentage: number | null;
  notes: string | null;
  investment_date: string;
  transaction_id: string | null;
  transaction_status: string;
  payment_mode: string | null;
  transaction_notes: string | null;
}

export type InvestmentInsert = Omit<InvestmentRow, "id" | "created_at" | "updated_at">;
export type InvestmentUpdate = Partial<InvestmentInsert>;