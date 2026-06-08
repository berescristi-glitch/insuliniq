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
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          country: "US" | "GB" | "AU" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          country?: "US" | "GB" | "AU" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          country?: "US" | "GB" | "AU" | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          lemon_squeezy_subscription_id: string;
          lemon_squeezy_customer_id: string;
          plan_id: string;
          status: "active" | "cancelled" | "expired" | "paused" | "past_due";
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lemon_squeezy_subscription_id: string;
          lemon_squeezy_customer_id: string;
          plan_id: string;
          status: "active" | "cancelled" | "expired" | "paused" | "past_due";
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "active" | "cancelled" | "expired" | "paused" | "past_due";
          current_period_end?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          answers: Json;
          metabolic_profile: string | null;
          risk_score: number | null;
          recommendations: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          answers: Json;
          metabolic_profile?: string | null;
          risk_score?: number | null;
          recommendations?: Json | null;
          created_at?: string;
        };
        Update: {
          metabolic_profile?: string | null;
          risk_score?: number | null;
          recommendations?: Json | null;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          category: string;
          tags: string[];
          author: string;
          published: boolean;
          featured_image: string | null;
          reading_time_minutes: number | null;
          sources: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content: string;
          category: string;
          tags?: string[];
          author?: string;
          published?: boolean;
          featured_image?: string | null;
          reading_time_minutes?: number | null;
          sources?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          excerpt?: string | null;
          content?: string;
          category?: string;
          tags?: string[];
          published?: boolean;
          featured_image?: string | null;
          reading_time_minutes?: number | null;
          sources?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          ingredients_us: Json;
          ingredients_uk: Json;
          ingredients_au: Json;
          instructions: string;
          prep_time_minutes: number | null;
          cook_time_minutes: number | null;
          servings: number | null;
          nutrition_per_serving: Json | null;
          tags: string[];
          category: string;
          featured_image: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          ingredients_us: Json;
          ingredients_uk: Json;
          ingredients_au: Json;
          instructions: string;
          prep_time_minutes?: number | null;
          cook_time_minutes?: number | null;
          servings?: number | null;
          nutrition_per_serving?: Json | null;
          tags?: string[];
          category: string;
          featured_image?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          content: string;
          metadata: Json;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          metadata?: Json;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          metadata?: Json;
          embedding?: string | null;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          confirmed: boolean;
          country: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          confirmed?: boolean;
          country?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          confirmed?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
