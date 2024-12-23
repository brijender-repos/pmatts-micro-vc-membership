export interface ProjectInvestment {
  project_name: string;
  total_invested: number;
  total_units: number;
}

export interface Investment {
  project_name: string;
  amount: number;
  units?: number;
  investment_type: string;
}