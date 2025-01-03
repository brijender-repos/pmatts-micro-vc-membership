export interface PaymentDetails {
  key: string;
  txnid: string;
  amount: string;
  firstname: string;
  email: string;
  phone: string;
  productinfo: string;
  surl: string;
  furl: string;
  hash: string;
}

export interface InvestmentFormData {
  projectName: string;
  units: number;
  amount: number;
  notes?: string;
}

export const UNIT_PRICE = 100; // INR 100 per unit
export const MAX_UNITS = 5;