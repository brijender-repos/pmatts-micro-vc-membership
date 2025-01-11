export interface InvestmentWithUser {
  id: string;
  project_name: string;
  investment_type: InvestmentType;
  investment_date: string;
  amount: number;
  units: number | null;
  equity_percentage: number | null;
  notes: string | null;
  user_id: string;
  transaction_status: string;
  payment_mode: PaymentMode | null;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
  investment_status: InvestmentStatus;
  profiles: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export type InvestmentType = 
  | "Pre-Seed"
  | "Seed"
  | "Post-Seed"
  | "Revenue-Based"
  | "Convertible-Notes or SAFEs"
  | "Equity-Crowdfunding"
  | "Syndicate"
  | "SPVs"
  | "Royality-based";

export type PaymentMode = 
  | "NEFT/RTGS/IMPS"
  | "Cheque or DD"
  | "UPI"
  | "Debit Card"
  | "Credit Card"
  | "Cash"
  | "Other";

export type InvestmentStatus = 
  | "Outstanding"
  | "Partially Settled"
  | "Fully Settled"
  | "Over Paid"
  | "Voided"
  | "Refunded"
  | "Write Off";