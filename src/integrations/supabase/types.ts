export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_areas: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          level: string
          name_en: string
          name_ti: string | null
          parent_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          level: string
          name_en: string
          name_ti?: string | null
          parent_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          level?: string
          name_en?: string
          name_ti?: string | null
          parent_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_areas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "admin_areas"
            referencedColumns: ["id"]
          },
        ]
      }
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
          father_name: string | null
          first_name: string
          grandfather_name: string | null
          health_facility: string | null
          house_number: string | null
          id: string
          identifiers: Json | null
          kushet: string | null
          last_name: string
          last_visit: string | null
          metadata: Json | null
          middle_name: string | null
          mother_name: string | null
          mother_record_id: string | null
          never_in_dss: boolean | null
          patient_id: string | null
          phone_number: string | null
          residency_timeline: Json | null
          sex: string | null
          sub_village: string | null
          tabia: string | null
          telephone: string | null
          updated_at: string | null
          user_id: string | null
          village: string | null
          visit_type: string | null
          visits: Json | null
          woreda: string | null
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
          father_name?: string | null
          first_name: string
          grandfather_name?: string | null
          health_facility?: string | null
          house_number?: string | null
          id?: string
          identifiers?: Json | null
          kushet?: string | null
          last_name: string
          last_visit?: string | null
          metadata?: Json | null
          middle_name?: string | null
          mother_name?: string | null
          mother_record_id?: string | null
          never_in_dss?: boolean | null
          patient_id?: string | null
          phone_number?: string | null
          residency_timeline?: Json | null
          sex?: string | null
          sub_village?: string | null
          tabia?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          visit_type?: string | null
          visits?: Json | null
          woreda?: string | null
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
          father_name?: string | null
          first_name?: string
          grandfather_name?: string | null
          health_facility?: string | null
          house_number?: string | null
          id?: string
          identifiers?: Json | null
          kushet?: string | null
          last_name?: string
          last_visit?: string | null
          metadata?: Json | null
          middle_name?: string | null
          mother_name?: string | null
          mother_record_id?: string | null
          never_in_dss?: boolean | null
          patient_id?: string | null
          phone_number?: string | null
          residency_timeline?: Json | null
          sex?: string | null
          sub_village?: string | null
          tabia?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          visit_type?: string | null
          visits?: Json | null
          woreda?: string | null
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
          father_name: string | null
          first_name: string
          grandfather_name: string | null
          house_number: string | null
          household_head: string | null
          household_members: string[] | null
          id: string
          identifiers: Json | null
          kushet: string | null
          last_name: string
          metadata: Json | null
          middle_name: string | null
          mother_name: string | null
          mother_record_id: string | null
          never_in_dss: boolean | null
          oldest_member_first_name: string | null
          oldest_member_last_name: string | null
          oldest_member_middle_name: string | null
          patient_id: string | null
          phone_number: string | null
          sex: string | null
          sub_village: string | null
          tabia: string | null
          telephone: string | null
          updated_at: string | null
          user_id: string | null
          village: string | null
          visit_type: string | null
          woreda: string | null
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
          father_name?: string | null
          first_name: string
          grandfather_name?: string | null
          house_number?: string | null
          household_head?: string | null
          household_members?: string[] | null
          id?: string
          identifiers?: Json | null
          kushet?: string | null
          last_name: string
          metadata?: Json | null
          middle_name?: string | null
          mother_name?: string | null
          mother_record_id?: string | null
          never_in_dss?: boolean | null
          oldest_member_first_name?: string | null
          oldest_member_last_name?: string | null
          oldest_member_middle_name?: string | null
          patient_id?: string | null
          phone_number?: string | null
          sex?: string | null
          sub_village?: string | null
          tabia?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          visit_type?: string | null
          woreda?: string | null
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
          father_name?: string | null
          first_name?: string
          grandfather_name?: string | null
          house_number?: string | null
          household_head?: string | null
          household_members?: string[] | null
          id?: string
          identifiers?: Json | null
          kushet?: string | null
          last_name?: string
          metadata?: Json | null
          middle_name?: string | null
          mother_name?: string | null
          mother_record_id?: string | null
          never_in_dss?: boolean | null
          oldest_member_first_name?: string | null
          oldest_member_last_name?: string | null
          oldest_member_middle_name?: string | null
          patient_id?: string | null
          phone_number?: string | null
          sex?: string | null
          sub_village?: string | null
          tabia?: string | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string | null
          village?: string | null
          visit_type?: string | null
          woreda?: string | null
          year_moved_in?: string | null
        }
        Relationships: []
      }
      export_log: {
        Row: {
          created_at: string
          export_type: string
          filters: Json
          id: string
          row_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          export_type: string
          filters?: Json
          id?: string
          row_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          export_type?: string
          filters?: Json
          id?: string
          row_count?: number
          user_id?: string
        }
        Relationships: []
      }
      health_facilities: {
        Row: {
          created_at: string
          created_by: string | null
          facility_type: string
          id: string
          name: string
          name_ti: string | null
          status: string
          updated_at: string
          woreda: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          facility_type?: string
          id?: string
          name: string
          name_ti?: string | null
          status?: string
          updated_at?: string
          woreda?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          facility_type?: string
          id?: string
          name?: string
          name_ti?: string | null
          status?: string
          updated_at?: string
          woreda?: string | null
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
      match_decision_history: {
        Row: {
          candidate_id: string | null
          collector_name: string
          created_at: string
          decision: string
          id: string
          match_result_id: string
          reason: string | null
          source_id: string
          user_id: string
        }
        Insert: {
          candidate_id?: string | null
          collector_name: string
          created_at?: string
          decision: string
          id?: string
          match_result_id: string
          reason?: string | null
          source_id: string
          user_id: string
        }
        Update: {
          candidate_id?: string | null
          collector_name?: string
          created_at?: string
          decision?: string
          id?: string
          match_result_id?: string
          reason?: string | null
          source_id?: string
          user_id?: string
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
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
