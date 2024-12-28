export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface BaseRow {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseEnums {
  investment_type: "investment" | "follow_on" | "distribution" | "exit" | "dividend";
  kyc_status: "not_started" | "aadhar_submitted" | "pan_submitted" | "verification_pending" | "verified" | "rejected";
  nominee_relationship: "Husband" | "Wife" | "Son" | "Daughter" | "Father" | "Mother" | "Other";
  project_status: "active" | "completed" | "upcoming";
}

export interface InvestmentRelationships {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

export interface TransactionProofRelationships {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

export interface Database {
  public: {
    Tables: {
      investments: {
        Row: import('./investments').InvestmentRow;
        Insert: import('./investments').InvestmentInsert;
        Update: import('./investments').InvestmentUpdate;
        Relationships: InvestmentRelationships[];
      };
      kyc_details: {
        Row: import('./kyc').KycDetailsRow;
        Insert: import('./kyc').KycDetailsInsert;
        Update: import('./kyc').KycDetailsUpdate;
        Relationships: [];
      };
      newsletter_subscriptions: {
        Row: import('./newsletter').NewsletterSubscriptionRow;
        Insert: import('./newsletter').NewsletterSubscriptionInsert;
        Update: import('./newsletter').NewsletterSubscriptionUpdate;
        Relationships: [];
      };
      nominees: {
        Row: import('./nominees').NomineeRow;
        Insert: import('./nominees').NomineeInsert;
        Update: import('./nominees').NomineeUpdate;
        Relationships: [];
      };
      profiles: {
        Row: import('./profiles').ProfileRow;
        Insert: import('./profiles').ProfileInsert;
        Update: import('./profiles').ProfileUpdate;
        Relationships: [];
      };
      projects: {
        Row: import('./projects').ProjectRow;
        Insert: import('./projects').ProjectInsert;
        Update: import('./projects').ProjectUpdate;
        Relationships: [];
      };
      transaction_proofs: {
        Row: import('./transaction-proofs').TransactionProofRow;
        Insert: import('./transaction-proofs').TransactionProofInsert;
        Update: import('./transaction-proofs').TransactionProofUpdate;
        Relationships: TransactionProofRelationships[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: { user_email: string };
        Returns: boolean;
      };
    };
    Enums: DatabaseEnums;
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Re-export all types
export type * from "./investments";
export type * from "./kyc";
export type * from "./newsletter";
export type * from "./nominees";
export type * from "./profiles";
export type * from "./projects";
export type * from "./transaction-proofs";