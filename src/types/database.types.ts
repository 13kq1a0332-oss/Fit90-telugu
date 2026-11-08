export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Locale = "te" | "en";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          preferred_locale: Locale;
          gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
          date_of_birth: string | null;
          height_cm: number | null;
          current_weight_kg: number | null;
          waist_cm: number | null;
          activity_level: "sedentary" | "light" | "moderate" | "very_active" | null;
          dietary_preference: "veg" | "non_veg" | "egg_only" | "vegan" | "mixed" | null;
          health_notes: string | null;
          avatar_url: string | null;
          is_onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          preferred_locale?: Locale;
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
          date_of_birth?: string | null;
          height_cm?: number | null;
          current_weight_kg?: number | null;
          waist_cm?: number | null;
          activity_level?: "sedentary" | "light" | "moderate" | "very_active" | null;
          dietary_preference?: "veg" | "non_veg" | "egg_only" | "vegan" | "mixed" | null;
          health_notes?: string | null;
          avatar_url?: string | null;
          is_onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          target_weight_kg: number;
          target_date: string;
          calorie_target_min: number;
          calorie_target_max: number;
          protein_target_min_g: number;
          protein_target_max_g: number;
          daily_water_target_ml: number;
          daily_step_target: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_weight_kg: number;
          target_date: string;
          calorie_target_min: number;
          calorie_target_max: number;
          protein_target_min_g?: number;
          protein_target_max_g?: number;
          daily_water_target_ml?: number;
          daily_step_target?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Insert"]>;
      };
      food_items: {
        Row: {
          id: string;
          name_en: string;
          name_te: string;
          category: "breakfast" | "curry" | "rice_grain" | "dal" | "snack" | "drink" | "sweet" | "fruit_vegetable" | "protein_supplement";
          state: "cooked" | "raw";
          serving_unit: string;
          serving_size_g: number;
          calories_per_100g: number;
          protein_per_100g: number;
          carbs_per_100g: number;
          fat_per_100g: number;
          fiber_per_100g: number;
          estimated_cost_inr: number;
          image_url: string | null;
          is_verified: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["food_items"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["food_items"]["Insert"]>;
      };
      food_logs: {
        Row: {
          id: string;
          user_id: string;
          food_item_id: string | null;
          custom_food_name: string | null;
          meal_type: "breakfast" | "lunch" | "evening_snack" | "dinner" | "other";
          portion_g: number;
          calculated_calories: number;
          calculated_protein_g: number;
          calculated_carbs_g: number;
          calculated_fat_g: number;
          logged_date: string;
          logged_time: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["food_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["food_logs"]["Insert"]>;
      };
      weight_logs: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number;
          logged_date: string;
          time_of_day: "fasting_morning" | "post_meal" | "evening" | "night" | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["weight_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["weight_logs"]["Insert"]>;
      };
      waist_logs: {
        Row: {
          id: string;
          user_id: string;
          waist_cm: number;
          logged_date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["waist_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["waist_logs"]["Insert"]>;
      };
      water_logs: {
        Row: {
          id: string;
          user_id: string;
          amount_ml: number;
          logged_date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["water_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["water_logs"]["Insert"]>;
      };
      step_logs: {
        Row: {
          id: string;
          user_id: string;
          step_count: number;
          logged_date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["step_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["step_logs"]["Insert"]>;
      };
      sleep_logs: {
        Row: {
          id: string;
          user_id: string;
          duration_hours: number;
          quality_score: number | null;
          snoring_reported: boolean;
          logged_date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sleep_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sleep_logs"]["Insert"]>;
      };
      blood_pressure_logs: {
        Row: {
          id: string;
          user_id: string;
          systolic: number;
          diastolic: number;
          pulse: number | null;
          logged_date: string;
          logged_time: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blood_pressure_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blood_pressure_logs"]["Insert"]>;
      };
      lab_records: {
        Row: {
          id: string;
          user_id: string;
          test_name: string;
          test_date: string;
          numeric_value: number | null;
          unit: string;
          reference_range_text: string | null;
          document_storage_path: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lab_records"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lab_records"]["Insert"]>;
      };
      audit_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          ip_address: string | null;
          user_agent: string | null;
          payload: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_events"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_events"]["Insert"]>;
      };
    };
  };
}

