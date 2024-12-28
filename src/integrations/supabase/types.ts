// Database generated types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      investments: {
        Row: {
          amount: number
          created_at: string
          equity_percentage: number | null
          id: string
          investment_date: string
          investment_type: Database["public"]["Enums"]["investment_type"]
          notes: string | null
          payment_mode: string | null
          project_name: string
          transaction_id: string | null
          transaction_status: string
          transaction_notes: string | null
          units: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          equity_percentage?: number | null
          id?: string
          investment_date?: string
          investment_type: Database["public"]["Enums"]["investment_type"]
          notes?: string | null
          payment_mode?: string | null
          project_name: string
          transaction_id?: string | null
          transaction_status?: string
          transaction_notes?: string | null
          units?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          equity_percentage?: number | null
          id?: string
          investment_date?: string
          investment_type?: Database["public"]["Enums"]["investment_type"]
          notes?: string | null
          payment_mode?: string | null
          project_name?: string
          transaction_id?: string | null
          transaction_status?: string
          transaction_notes?: string | null
          units?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_project_name_fkey"
            columns: ["project_name"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "investments_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      kyc_details: {
        Row: {
          aadhar_image_url: string | null
          aadhar_name: string | null
          aadhar_number: string | null
          created_at: string
          id: string
          pan_image_url: string | null
          pan_name: string | null
          pan_number: string | null
          status: Database["public"]["Enums"]["kyc_status"] | null
          updated_at: string
          user_id: string | null
          verification_notes: string | null
        }
        Insert: {
          aadhar_image_url?: string | null
          aadhar_name?: string | null
          aadhar_number?: string | null
          created_at?: string
          id?: string
          pan_image_url?: string | null
          pan_name?: string | null
          pan_number?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          updated_at?: string
          user_id?: string | null
          verification_notes?: string | null
        }
        Update: {
          aadhar_image_url?: string | null
          aadhar_name?: string | null
          aadhar_number?: string | null
          created_at?: string
          id?: string
          pan_image_url?: string | null
          pan_name?: string | null
          pan_number?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          updated_at?: string
          user_id?: string | null
          verification_notes?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      nominees: {
        Row: {
          aadhar_document_url: string | null
          aadhar_number: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          relationship: Database["public"]["Enums"]["nominee_relationship"]
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhar_document_url?: string | null
          aadhar_number?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          relationship: Database["public"]["Enums"]["nominee_relationship"]
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhar_document_url?: string | null
          aadhar_number?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          relationship?: Database["public"]["Enums"]["nominee_relationship"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_role: boolean | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_role?: boolean | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_role?: boolean | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          start_date: string
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: []
      }
      transaction_proofs: {
        Row: {
          created_at: string
          file_name: string
          file_url: string
          id: string
          investment_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          investment_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          investment_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_proofs_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
    }
    Enums: {
      investment_type: "investment" | "follow_on" | "distribution" | "exit" | "dividend"
      kyc_status: "not_started" | "aadhar_submitted" | "pan_submitted" | "verification_pending" | "verified" | "rejected"
      nominee_relationship: "Husband" | "Wife" | "Son" | "Daughter" | "Father" | "Mother" | "Other"
      project_status: "active" | "completed" | "upcoming"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
