export interface ProjectInvestment {
  project_name: string;
  total_invested: number;
  total_units: number;
}

export interface Investment {
  id: string;
  project_name: string;
  amount: number;
  units?: number;
  investment_type: string;
  investment_date: string;
  notes?: string;
  transaction_id?: string;
  projects?: {
    name: string;
    status: string;
  };
}