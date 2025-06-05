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
      clinic_records: {
        Row: {
          address: string | null
          birth_date: string
          consent_date: string | null
          consent_obtained: boolean | null
          consent_type: string | null
          created_at: string | null
          district: string | null
          email: string | null
          first_name: string
          health_facility: string | null
          id: string
          identifiers: Json | null
          last_name: string
          last_visit: string | null
          metadata: Json | null
          middle_name: string | null
          never_in_dss: boolean | null
          patient_id: string | null
          phone_number: string | null
          residency_timeline: Json | null
          sex: string | null
          sub_village: string | null
          telephone: string | null
          updated_at: string | null
          user_id: string | null
          village: string | null
          visits: Json | null
          year_moved_in: string | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          consent_date?: string | null
          consent_obtained?: boolean | null
          consent_type?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          first_name: string
          health_facility?: string | null
          id?: string
          identifiers?: Json | null
          last_name: string
          last_visit?: string | null
          metadata?: Json | null
          middle_name?: string | null
          never_in_dss?: boolean | null
          patient_id?: string | null
          phone_number?: string | null
          residency_timeline?: Json | null
          sex?: string | null
          sub_village?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          visits?: Json | null
          year_moved_in?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          consent_date?: string | null
          consent_obtained?: boolean | null
          consent_type?: string | null
          created_at?: string | null
          district?: string | null
          email?: string | null
          first_name?: string
          health_facility?: string | null
          id?: string
          identifiers?: Json | null
          last_name?: string
          last_visit?: string | null
          metadata?: Json | null
          middle_name?: string | null
          never_in_dss?: boolean | null
          patient_id?: string | null
          phone_number?: string | null
          residency_timeline?: Json | null
          sex?: string | null
          sub_village?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          visits?: Json | null
          year_moved_in?: string | null
        }
        Relationships: []
      }
      community_records: {
        Row: {
          address: string | null
          balozi_first_name: string | null
          balozi_last_name: string | null
          balozi_middle_name: string | null
          birth_date: string
          created_at: string | null
          district: string | null
          email: string | null
          first_name: string
          household_head: string | null
          household_members: string[] | null
          id: string
          identifiers: Json | null
          last_name: string
          metadata: Json | null
          middle_name: string | null
          mother_name: string | null
          never_in_dss: boolean | null
          oldest_member_first_name: string | null
          oldest_member_last_name: string | null
          oldest_member_middle_name: string | null
          patient_id: string | null
          phone_number: string | null
          sex: string | null
          sub_village: string | null
          telephone: string | null
          updated_at: string | null
          user_id: string | null
          village: string | null
          year_moved_in: string | null
        }
        Insert: {
          address?: string | null
          balozi_first_name?: string | null
          balozi_last_name?: string | null
          balozi_middle_name?: string | null
          birth_date: string
          created_at?: string | null
          district?: string | null
          email?: string | null
          first_name: string
          household_head?: string | null
          household_members?: string[] | null
          id?: string
          identifiers?: Json | null
          last_name: string
          metadata?: Json | null
          middle_name?: string | null
          mother_name?: string | null
          never_in_dss?: boolean | null
          oldest_member_first_name?: string | null
          oldest_member_last_name?: string | null
          oldest_member_middle_name?: string | null
          patient_id?: string | null
          phone_number?: string | null
          sex?: string | null
          sub_village?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          year_moved_in?: string | null
        }
        Update: {
          address?: string | null
          balozi_first_name?: string | null
          balozi_last_name?: string | null
          balozi_middle_name?: string | null
          birth_date?: string
          created_at?: string | null
          district?: string | null
          email?: string | null
          first_name?: string
          household_head?: string | null
          household_members?: string[] | null
          id?: string
          identifiers?: Json | null
          last_name?: string
          metadata?: Json | null
          middle_name?: string | null
          mother_name?: string | null
          never_in_dss?: boolean | null
          oldest_member_first_name?: string | null
          oldest_member_last_name?: string | null
          oldest_member_middle_name?: string | null
          patient_id?: string | null
          phone_number?: string | null
          sex?: string | null
          sub_village?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          year_moved_in?: string | null
        }
        Relationships: []
      }
      match_attempts: {
        Row: {
          created_at: string | null
          id: string
          query: string
          results_count: number | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          results_count?: number | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          results_count?: number | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      match_results: {
        Row: {
          confidence: number
          consent_date: string | null
          consent_obtained: boolean | null
          created_at: string | null
          field_scores: Json | null
          id: string
          match_id: string | null
          matched_at: string
          matched_by: string
          notes: string | null
          source_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          confidence: number
          consent_date?: string | null
          consent_obtained?: boolean | null
          created_at?: string | null
          field_scores?: Json | null
          id?: string
          match_id?: string | null
          matched_at: string
          matched_by: string
          notes?: string | null
          source_id: string
          status: string
          user_id?: string | null
        }
        Update: {
          confidence?: number
          consent_date?: string | null
          consent_obtained?: boolean | null
          created_at?: string | null
          field_scores?: Json | null
          id?: string
          match_id?: string | null
          matched_at?: string
          matched_by?: string
          notes?: string | null
          source_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      matching_thresholds: {
        Row: {
          auto_match_threshold: number | null
          created_at: string
          id: string
          low_confidence_threshold: number | null
          no_match_threshold: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_match_threshold?: number | null
          created_at?: string
          id?: string
          low_confidence_threshold?: number | null
          no_match_threshold?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_match_threshold?: number | null
          created_at?: string
          id?: string
          low_confidence_threshold?: number | null
          no_match_threshold?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      records: {
        Row: {
          address: string | null
          balozi_first_name: string | null
          balozi_last_name: string | null
          balozi_middle_name: string | null
          birth_date: string
          created_at: string | null
          district: string | null
          email: string | null
          field_scores: Json | null
          first_name: string
          fuzzy_score: number | null
          health_facility: string | null
          household_head: string | null
          household_members: string[] | null
          id: string
          identifiers: Json | null
          last_name: string
          last_visit: string | null
          matched_on: string[] | null
          metadata: Json | null
          middle_name: string | null
          mother_name: string | null
          never_in_dss: boolean | null
          oldest_member_first_name: string | null
          oldest_member_last_name: string | null
          oldest_member_middle_name: string | null
          patient_id: string | null
          phone_number: string | null
          record_type: string | null
          sex: string | null
          source_id: string | null
          sub_village: string | null
          telephone: string | null
          updated_at: string | null
          user_id: string | null
          village: string | null
          year_moved_in: string | null
        }
        Insert: {
          address?: string | null
          balozi_first_name?: string | null
          balozi_last_name?: string | null
          balozi_middle_name?: string | null
          birth_date: string
          created_at?: string | null
          district?: string | null
          email?: string | null
          field_scores?: Json | null
          first_name: string
          fuzzy_score?: number | null
          health_facility?: string | null
          household_head?: string | null
          household_members?: string[] | null
          id?: string
          identifiers?: Json | null
          last_name: string
          last_visit?: string | null
          matched_on?: string[] | null
          metadata?: Json | null
          middle_name?: string | null
          mother_name?: string | null
          never_in_dss?: boolean | null
          oldest_member_first_name?: string | null
          oldest_member_last_name?: string | null
          oldest_member_middle_name?: string | null
          patient_id?: string | null
          phone_number?: string | null
          record_type?: string | null
          sex?: string | null
          source_id?: string | null
          sub_village?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          year_moved_in?: string | null
        }
        Update: {
          address?: string | null
          balozi_first_name?: string | null
          balozi_last_name?: string | null
          balozi_middle_name?: string | null
          birth_date?: string
          created_at?: string | null
          district?: string | null
          email?: string | null
          field_scores?: Json | null
          first_name?: string
          fuzzy_score?: number | null
          health_facility?: string | null
          household_head?: string | null
          household_members?: string[] | null
          id?: string
          identifiers?: Json | null
          last_name?: string
          last_visit?: string | null
          matched_on?: string[] | null
          metadata?: Json | null
          middle_name?: string | null
          mother_name?: string | null
          never_in_dss?: boolean | null
          oldest_member_first_name?: string | null
          oldest_member_last_name?: string | null
          oldest_member_middle_name?: string | null
          patient_id?: string | null
          phone_number?: string | null
          record_type?: string | null
          sex?: string | null
          source_id?: string | null
          sub_village?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          year_moved_in?: string | null
        }
        Relationships: []
      }
      unmatched_records: {
        Row: {
          clinic_record_id: string | null
          created_at: string
          id: string
          patient_data: Json
          reason: string
          reviewed: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clinic_record_id?: string | null
          created_at?: string
          id?: string
          patient_data: Json
          reason: string
          reviewed?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clinic_record_id?: string | null
          created_at?: string
          id?: string
          patient_data?: Json
          reason?: string
          reviewed?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unmatched_records_clinic_record_id_fkey"
            columns: ["clinic_record_id"]
            isOneToOne: false
            referencedRelation: "clinic_records"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
