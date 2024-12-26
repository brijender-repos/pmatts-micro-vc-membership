export interface InvestmentWithUser {
  id: string;
  project_name: string;
  investment_type: "investment" | "follow_on" | "distribution" | "exit" | "dividend";
  investment_date: string;
  amount: number;
  units: number | null;
  user_id: string;
  transaction_status: string;
  profiles: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
}