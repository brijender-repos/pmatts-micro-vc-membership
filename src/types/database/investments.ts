import { BaseRow } from "./base";
import { InvestmentType } from "../investment";

export interface InvestmentRow extends BaseRow {
  user_id: string;
  project_name: string;
  investment_type: InvestmentType;
  amount: number;
  units: number | null;
  equity_percentage: number | null;
  notes: string | null;
  investment_date: string;
  transaction_id: string | null;
  transaction_status: string;
  payment_mode: string | null;
}

export type InvestmentInsert = Omit<InvestmentRow, "id" | "created_at" | "updated_at">;
export type InvestmentUpdate = Partial<InvestmentInsert>;