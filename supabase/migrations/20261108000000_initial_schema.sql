-- Fit90 Telugu - Initial Complete Database Schema
-- Migration: 20261108000000_initial_schema.sql
-- Description: Complete normalized schema for Fit90 Telugu with strict RLS, constraints, triggers, and indexes.

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 2. User Profiles & Goals
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    preferred_locale TEXT NOT NULL DEFAULT 'te' CHECK (preferred_locale IN ('te', 'en')),
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    date_of_birth DATE,
    height_cm NUMERIC(5, 2) CHECK (height_cm > 50 AND height_cm < 280),
    current_weight_kg NUMERIC(5, 2) CHECK (current_weight_kg > 20 AND current_weight_kg < 350),
    waist_cm NUMERIC(5, 2) CHECK (waist_cm > 30 AND waist_cm < 250),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active')),
    dietary_preference TEXT CHECK (dietary_preference IN ('veg', 'non_veg', 'egg_only', 'vegan', 'mixed')),
    health_notes TEXT,
    avatar_url TEXT,
    is_onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_weight_kg NUMERIC(5, 2) NOT NULL CHECK (target_weight_kg > 20 AND target_weight_kg < 350),
    target_date DATE NOT NULL,
    calorie_target_min INT NOT NULL CHECK (calorie_target_min >= 1000),
    calorie_target_max INT NOT NULL CHECK (calorie_target_max >= calorie_target_min),
    protein_target_min_g NUMERIC(5, 1) NOT NULL DEFAULT 60,
    protein_target_max_g NUMERIC(5, 1) NOT NULL DEFAULT 120,
    daily_water_target_ml INT NOT NULL DEFAULT 3000 CHECK (daily_water_target_ml > 0),
    daily_step_target INT NOT NULL DEFAULT 8000 CHECK (daily_step_target > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. Food Catalog & Logs
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_te TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('breakfast', 'curry', 'rice_grain', 'dal', 'snack', 'drink', 'sweet', 'fruit_vegetable', 'protein_supplement')),
    state TEXT NOT NULL DEFAULT 'cooked' CHECK (state IN ('cooked', 'raw')),
    serving_unit TEXT NOT NULL DEFAULT '100g',
    serving_size_g NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    calories_per_100g NUMERIC(6, 2) NOT NULL,
    protein_per_100g NUMERIC(5, 2) NOT NULL,
    carbs_per_100g NUMERIC(5, 2) NOT NULL,
    fat_per_100g NUMERIC(5, 2) NOT NULL,
    fiber_per_100g NUMERIC(5, 2) DEFAULT 0,
    estimated_cost_inr NUMERIC(6, 2) DEFAULT 0,
    image_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title_en TEXT NOT NULL,
    title_te TEXT NOT NULL,
    total_estimated_calories INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.meal_plan_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
    food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE RESTRICT,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'evening_snack', 'dinner')),
    portion_g NUMERIC(6, 2) NOT NULL CHECK (portion_g > 0),
    substitution_notes TEXT,
    order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE SET NULL,
    custom_food_name TEXT,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'evening_snack', 'dinner', 'other')),
    portion_g NUMERIC(6, 2) NOT NULL CHECK (portion_g > 0),
    calculated_calories NUMERIC(6, 2) NOT NULL,
    calculated_protein_g NUMERIC(5, 2) NOT NULL,
    calculated_carbs_g NUMERIC(5, 2) NOT NULL,
    calculated_fat_g NUMERIC(5, 2) NOT NULL,
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    logged_time TIME NOT NULL DEFAULT CURRENT_TIME,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 4. Workouts & Exercises
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_te TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('walking', 'mobility', 'strength', 'stretching', 'knee_friendly')),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    instructions_en TEXT NOT NULL,
    instructions_te TEXT NOT NULL,
    is_knee_safe BOOLEAN NOT NULL DEFAULT FALSE,
    knee_alternative_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
    illustration_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    week_number INT NOT NULL CHECK (week_number BETWEEN 1 AND 13),
    title_en TEXT NOT NULL,
    title_te TEXT NOT NULL,
    weekly_target_days INT NOT NULL DEFAULT 5 CHECK (weekly_target_days BETWEEN 1 AND 7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    rpe_score INT CHECK (rpe_score BETWEEN 1 AND 10), -- Rate of Perceived Exertion
    knee_pain_reported BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workout_exercise_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
    sets_completed INT NOT NULL CHECK (sets_completed > 0),
    reps_per_set INT,
    weight_kg NUMERIC(5, 2) DEFAULT 0,
    rest_seconds INT DEFAULT 60,
    is_completed BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- 5. Daily Health & Biometric Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.weight_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5, 2) NOT NULL CHECK (weight_kg > 20 AND weight_kg < 350),
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_of_day TEXT CHECK (time_of_day IN ('fasting_morning', 'post_meal', 'evening', 'night')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_weight_date_time UNIQUE (user_id, logged_date, time_of_day)
);

CREATE TABLE IF NOT EXISTS public.waist_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    waist_cm NUMERIC(5, 2) NOT NULL CHECK (waist_cm > 30 AND waist_cm < 250),
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_waist_date UNIQUE (user_id, logged_date)
);

CREATE TABLE IF NOT EXISTS public.water_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount_ml INT NOT NULL CHECK (amount_ml > 0),
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.step_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    step_count INT NOT NULL CHECK (step_count >= 0),
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_step_date UNIQUE (user_id, logged_date)
);

CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    duration_hours NUMERIC(4, 2) NOT NULL CHECK (duration_hours >= 0 AND duration_hours <= 24),
    quality_score INT CHECK (quality_score BETWEEN 1 AND 5),
    snoring_reported BOOLEAN DEFAULT FALSE,
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_sleep_date UNIQUE (user_id, logged_date)
);

CREATE TABLE IF NOT EXISTS public.blood_pressure_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    systolic INT NOT NULL CHECK (systolic BETWEEN 60 AND 250),
    diastolic INT NOT NULL CHECK (diastolic BETWEEN 40 AND 160),
    pulse INT CHECK (pulse BETWEEN 30 AND 220),
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    logged_time TIME NOT NULL DEFAULT CURRENT_TIME,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lab_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    test_date DATE NOT NULL,
    numeric_value NUMERIC(8, 2),
    unit TEXT NOT NULL,
    reference_range_text TEXT,
    document_storage_path TEXT, -- Private Supabase Storage object path
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 6. Reminders, Preferences, & Audit Events
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('water', 'meal', 'walk', 'sleep', 'weight', 'custom')),
    title_en TEXT NOT NULL,
    title_te TEXT NOT NULL,
    scheduled_time TIME NOT NULL,
    days_of_week INT[] NOT NULL DEFAULT '{1,2,3,4,5,6,7}',
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_weekly_summary BOOLEAN DEFAULT TRUE,
    water_reminder_interval_mins INT DEFAULT 120,
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '06:00:00',
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- 7. Indexes for Query Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_locale ON public.profiles(preferred_locale);
CREATE INDEX IF NOT EXISTS idx_goals_user_active ON public.goals(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON public.food_items(category);
CREATE INDEX IF NOT EXISTS idx_food_items_name_en ON public.food_items(name_en);
CREATE INDEX IF NOT EXISTS idx_food_items_name_te ON public.food_items(name_te);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON public.food_logs(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON public.weight_logs(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_waist_logs_user_date ON public.waist_logs(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_step_logs_user_date ON public.step_logs(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_date ON public.sleep_logs(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON public.water_logs(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_bp_logs_user_date ON public.blood_pressure_logs(user_id, logged_date);
CREATE INDEX IF NOT EXISTS idx_lab_records_user ON public.lab_records(user_id, test_date);
CREATE INDEX IF NOT EXISTS idx_audit_user_event ON public.audit_events(user_id, created_at);

-- ============================================================================
-- 8. Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plan_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waist_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_pressure_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- 8.1 Profiles RLS
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 8.2 Goals RLS
CREATE POLICY "Users can CRUD own goals"
    ON public.goals FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8.3 Food Items RLS (Public read for all, write restricted)
CREATE POLICY "Anyone authenticated can view food items"
    ON public.food_items FOR SELECT
    USING (true);

CREATE POLICY "Users can create custom food items"
    ON public.food_items FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- 8.4 Meal Plans & Entries RLS
CREATE POLICY "Users can CRUD own meal plans"
    ON public.meal_plans FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view and manage their meal plan entries"
    ON public.meal_plan_entries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.meal_plans
            WHERE meal_plans.id = meal_plan_entries.meal_plan_id
            AND meal_plans.user_id = auth.uid()
        )
    );

-- 8.5 Food Logs RLS
CREATE POLICY "Users can CRUD own food logs"
    ON public.food_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8.6 Exercises RLS (Public reference data)
CREATE POLICY "Anyone can view exercises"
    ON public.exercises FOR SELECT
    USING (true);

-- 8.7 Workouts RLS
CREATE POLICY "Users can CRUD own workout plans"
    ON public.workout_plans FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own workout sessions"
    ON public.workout_sessions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own workout exercise logs"
    ON public.workout_exercise_logs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_sessions
            WHERE workout_sessions.id = workout_exercise_logs.session_id
            AND workout_sessions.user_id = auth.uid()
        )
    );

-- 8.8 Health Logs RLS (Strict user isolation)
CREATE POLICY "Users can CRUD own weight logs"
    ON public.weight_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own waist logs"
    ON public.waist_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own water logs"
    ON public.water_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own step logs"
    ON public.step_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own sleep logs"
    ON public.sleep_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own blood pressure logs"
    ON public.blood_pressure_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own lab records"
    ON public.lab_records FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8.9 Reminders & Preferences RLS
CREATE POLICY "Users can CRUD own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own notification preferences"
    ON public.notification_preferences FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8.10 Audit Events RLS (Insert allowed for own actions, select own events, no update/delete)
CREATE POLICY "Users can view own audit events"
    ON public.audit_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System and users can insert audit events"
    ON public.audit_events FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- ============================================================================
-- 9. Automatic Profile Creation on Signup Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
    user_locale TEXT;
BEGIN
    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    user_locale := COALESCE(NEW.raw_user_meta_data->>'preferred_locale', 'te');

    INSERT INTO public.profiles (id, email, full_name, preferred_locale)
    VALUES (NEW.id, NEW.email, user_name, user_locale)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

