export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      investments: {
        Row: InvestmentRow;
        Insert: InvestmentInsert;
        Update: InvestmentUpdate;
        Relationships: InvestmentRelationships[];
      };
      kyc_details: {
        Row: KycDetailsRow;
        Insert: KycDetailsInsert;
        Update: KycDetailsUpdate;
        Relationships: [];
      };
      newsletter_subscriptions: {
        Row: NewsletterSubscriptionRow;
        Insert: NewsletterSubscriptionInsert;
        Update: NewsletterSubscriptionUpdate;
        Relationships: [];
      };
      nominees: {
        Row: NomineeRow;
        Insert: NomineeInsert;
        Update: NomineeUpdate;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
      transaction_proofs: {
        Row: TransactionProofRow;
        Insert: TransactionProofInsert;
        Update: TransactionProofUpdate;
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

// Base interfaces for all tables
interface BaseRow {
  id: string;
  created_at: string;
  updated_at: string;
}

// Enums
interface DatabaseEnums {
  investment_type: "investment" | "follow_on" | "distribution" | "exit" | "dividend";
  kyc_status: "not_started" | "aadhar_submitted" | "pan_submitted" | "verification_pending" | "verified" | "rejected";
  nominee_relationship: "Husband" | "Wife" | "Son" | "Daughter" | "Father" | "Mother" | "Other";
  project_status: "active" | "completed" | "upcoming";
}

// Relationships
interface InvestmentRelationships {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

interface TransactionProofRelationships {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

// Re-export all types
export type * from "./investments";
export type * from "./kyc";
export type * from "./newsletter";
export type * from "./nominees";
export type * from "./profiles";
export type * from "./projects";
export type * from "./transaction-proofs";