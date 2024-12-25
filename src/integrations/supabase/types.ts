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
          project_name: string
          transaction_id: string | null
          transaction_status: string
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
          project_name: string
          transaction_id?: string | null
          transaction_status?: string
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
          project_name?: string
          transaction_id?: string | null
          transaction_status?: string
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
          },
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
          created_at: string
          date_of_birth: string
          full_name: string
          id: string
          relationship: Database["public"]["Enums"]["nominee_relationship"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          full_name: string
          id?: string
          relationship: Database["public"]["Enums"]["nominee_relationship"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          full_name?: string
          id?: string
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
      investment_type:
        | "investment"
        | "follow_on"
        | "distribution"
        | "exit"
        | "dividend"
      kyc_status:
        | "not_started"
        | "aadhar_submitted"
        | "pan_submitted"
        | "verification_pending"
        | "verified"
        | "rejected"
      nominee_relationship:
        | "Husband"
        | "Wife"
        | "Son"
        | "Daughter"
        | "Father"
        | "Mother"
        | "Other"
      project_status: "active" | "completed" | "upcoming"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
