export interface InvestmentWithUser {
  id: string;
  project_name: string;
  investment_type: "investment" | "follow_on" | "distribution" | "exit" | "dividend";
  investment_date: string;
  amount: number;
  units: number | null;
  equity_percentage: number | null;
  notes: string | null;
  user_id: string;
  transaction_status: string;
  payment_mode: "Bank Transfer" | "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Others" | null;
  transaction_id: string | null;
  transaction_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export type PaymentMode = "Bank Transfer" | "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Others";