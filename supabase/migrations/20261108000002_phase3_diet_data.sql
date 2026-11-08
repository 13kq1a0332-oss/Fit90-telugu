-- Fit90 Telugu - Phase 3 Diet Schema & Nutrition Views
-- Migration: 20261108000002_phase3_diet_data.sql

-- Helper view for aggregating daily nutrition totals per user per date
CREATE OR REPLACE VIEW public.view_user_daily_nutrition AS
SELECT 
    user_id,
    logged_date,
    COUNT(id) AS total_items_logged,
    COALESCE(SUM(calculated_calories), 0) AS total_calories,
    COALESCE(SUM(calculated_protein_g), 0) AS total_protein_g,
    COALESCE(SUM(calculated_carbs_g), 0) AS total_carbs_g,
    COALESCE(SUM(calculated_fat_g), 0) AS total_fat_g
FROM public.food_logs
GROUP BY user_id, logged_date;

-- Function to get daily nutrition summary atomically
CREATE OR REPLACE FUNCTION public.get_daily_nutrition_summary(p_user_id UUID, p_date DATE)
RETURNS JSONB AS $$
DECLARE
    v_summary RECORD;
BEGIN
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    SELECT 
        COUNT(id) AS total_items,
        COALESCE(SUM(calculated_calories), 0) AS total_calories,
        COALESCE(SUM(calculated_protein_g), 0) AS total_protein_g,
        COALESCE(SUM(calculated_carbs_g), 0) AS total_carbs_g,
        COALESCE(SUM(calculated_fat_g), 0) AS total_fat_g
    INTO v_summary
    FROM public.food_logs
    WHERE user_id = p_user_id AND logged_date = p_date;

    RETURN to_jsonb(v_summary);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

