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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          display_order: number | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string
          title: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          display_order?: number | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          title: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          display_order?: number | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          title?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          display_order: number | null
          end_date: string | null
          field: string | null
          id: string
          institution: string
          is_current: boolean | null
          location: string | null
          start_date: string | null
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          field?: string | null
          id?: string
          institution: string
          is_current?: boolean | null
          location?: string | null
          start_date?: string | null
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          field?: string | null
          id?: string
          institution?: string
          is_current?: boolean | null
          location?: string | null
          start_date?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string | null
          display_order: number | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          position: string
          start_date: string | null
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position: string
          start_date?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position?: string
          start_date?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          dob: string | null
          email: string | null
          full_name: string
          github: string | null
          id: string
          instagram: string | null
          linkedin: string | null
          location: string | null
          phone: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          full_name?: string
          github?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          full_name?: string
          github?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          github_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          preview_url: string | null
          tech_stack: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          preview_url?: string | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          preview_url?: string | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          character_name: string | null
          created_at: string
          id: string
          quote: string
        }
        Insert: {
          character_name?: string | null
          created_at?: string
          id?: string
          quote: string
        }
        Update: {
          character_name?: string | null
          created_at?: string
          id?: string
          quote?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          name: string
          proficiency: number | null
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
          proficiency?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
          proficiency?: number | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
