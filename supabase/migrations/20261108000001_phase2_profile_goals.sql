-- Fit90 Telugu - Phase 2 Profile & Dashboard Helper Functions
-- Migration: 20261108000001_phase2_profile_goals.sql

-- Helper function to return user dashboard profile & active goal atomically
CREATE OR REPLACE FUNCTION public.get_user_dashboard_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_profile RECORD;
    v_goal RECORD;
    v_result JSONB;
BEGIN
    -- Verify ownership (security check)
    IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
    SELECT * INTO v_goal FROM public.goals WHERE user_id = p_user_id AND is_active = TRUE ORDER BY created_at DESC LIMIT 1;

    v_result := jsonb_build_object(
        'profile', to_jsonb(v_profile),
        'goal', to_jsonb(v_goal)
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

