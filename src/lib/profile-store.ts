import { Database } from "@/types/database.types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Gender, ActivityLevel } from "@/lib/health-calculations";

export interface UserProfileData {
  id?: string;
  email: string;
  fullName: string;
  preferredLocale: "te" | "en";
  gender: Gender;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  waistCm: number;
  activityLevel: ActivityLevel;
  dietaryPreference: "veg" | "non_veg" | "egg_only" | "vegan" | "mixed";
  snoringReported: boolean;
  healthNotes?: string;
  isOnboarded: boolean;
}

export interface UserGoalData {
  id?: string;
  userId?: string;
  targetWeightKg: number;
  targetDate: string; // ISO date string
  startDate: string; // ISO date string
  calorieTargetMin: number;
  calorieTargetMax: number;
  proteinTargetMinG: number;
  proteinTargetMaxG: number;
  dailyWaterTargetMl: number;
  dailyStepTarget: number;
  isActive: boolean;
}

const PROFILE_STORAGE_KEY = "fit90_user_profile";
const GOALS_STORAGE_KEY = "fit90_user_goals";

// Initial clean un-onboarded profile for new visitors
export const DEFAULT_NEW_USER_PROFILE: UserProfileData = {
  email: "user@example.com",
  fullName: "నవీన్ కుమార్",
  preferredLocale: "te",
  gender: "male",
  age: 30,
  heightCm: 175,
  currentWeightKg: 85,
  waistCm: 95,
  activityLevel: "sedentary",
  dietaryPreference: "mixed",
  snoringReported: false,
  isOnboarded: false,
};

export const DEFAULT_GOAL_DATA: UserGoalData = {
  targetWeightKg: 80,
  startDate: new Date().toISOString().slice(0, 10),
  targetDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  calorieTargetMin: 1800,
  calorieTargetMax: 2000,
  proteinTargetMinG: 90,
  proteinTargetMaxG: 110,
  dailyWaterTargetMl: 3000,
  dailyStepTarget: 8000,
  isActive: true,
};

export async function getUserProfileAndGoal(): Promise<{
  profile: UserProfileData;
  goal: UserGoalData;
}> {
  // Check if live Supabase is configured
  if (typeof window !== "undefined") {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const savedGoal = localStorage.getItem(GOALS_STORAGE_KEY);

      if (savedProfile && savedGoal) {
        return {
          profile: JSON.parse(savedProfile),
          goal: JSON.parse(savedGoal),
        };
      }
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileRow } = (await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()) as { data: Database["public"]["Tables"]["profiles"]["Row"] | null };

        const { data: goalRow } = (await supabase
          .from("goals")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()) as { data: Database["public"]["Tables"]["goals"]["Row"] | null };

        if (profileRow) {
          const profile: UserProfileData = {
            id: profileRow.id,
            email: profileRow.email,
            fullName: profileRow.full_name,
            preferredLocale: profileRow.preferred_locale || "te",
            gender: (profileRow.gender as Gender) || "male",
            age: 31,
            heightCm: Number(profileRow.height_cm) || 176,
            currentWeightKg: Number(profileRow.current_weight_kg) || 118,
            waistCm: Number(profileRow.waist_cm) || 150,
            activityLevel: (profileRow.activity_level as ActivityLevel) || "sedentary",
            dietaryPreference: (profileRow.dietary_preference as any) || "mixed",
            snoringReported: profileRow.health_notes?.includes("snoring") || false,
            healthNotes: profileRow.health_notes || "",
            isOnboarded: profileRow.is_onboarded || false,
          };

          const goal: UserGoalData = goalRow
            ? {
                id: goalRow.id,
                userId: goalRow.user_id,
                targetWeightKg: Number(goalRow.target_weight_kg),
                targetDate: goalRow.target_date,
                startDate: goalRow.created_at.slice(0, 10),
                calorieTargetMin: goalRow.calorie_target_min,
                calorieTargetMax: goalRow.calorie_target_max,
                proteinTargetMinG: Number(goalRow.protein_target_min_g),
                proteinTargetMaxG: Number(goalRow.protein_target_max_g),
                dailyWaterTargetMl: goalRow.daily_water_target_ml,
                dailyStepTarget: goalRow.daily_step_target,
                isActive: goalRow.is_active,
              }
            : DEFAULT_GOAL_DATA;

          return { profile, goal };
        }
      }
    } catch (e) {
      console.warn("Supabase profile fetch error, using local fallback", e);
    }
  }

  return {
    profile: DEFAULT_NEW_USER_PROFILE,
    goal: DEFAULT_GOAL_DATA,
  };
}

export async function saveUserProfileAndGoal(
  profile: UserProfileData,
  goal: UserGoalData
): Promise<void> {
  // Always update localStorage for PWA offline capability
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goal));
    } catch {
      // storage unavailable
    }
  }

  // Update Supabase if configured and user is signed in
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const profileUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
          full_name: profile.fullName,
          preferred_locale: profile.preferredLocale,
          gender: profile.gender,
          height_cm: profile.heightCm,
          current_weight_kg: profile.currentWeightKg,
          waist_cm: profile.waistCm,
          activity_level: profile.activityLevel,
          dietary_preference: profile.dietaryPreference,
          health_notes: profile.snoringReported
            ? "snoring_reported: true; " + (profile.healthNotes || "")
            : profile.healthNotes || "",
          is_onboarded: true,
        };

        await (supabase.from("profiles") as any)
          .update(profileUpdate)
          .eq("id", user.id);

        // Deactivate old active goals
        await (supabase.from("goals") as any)
          .update({ is_active: false })
          .eq("user_id", user.id);

        // Insert new active goal
        const goalInsert: Database["public"]["Tables"]["goals"]["Insert"] = {
          user_id: user.id,
          target_weight_kg: goal.targetWeightKg,
          target_date: goal.targetDate,
          calorie_target_min: goal.calorieTargetMin,
          calorie_target_max: goal.calorieTargetMax,
          protein_target_min_g: goal.proteinTargetMinG,
          protein_target_max_g: goal.proteinTargetMaxG,
          daily_water_target_ml: goal.dailyWaterTargetMl,
          daily_step_target: goal.dailyStepTarget,
          is_active: true,
        };

        await (supabase.from("goals") as any).insert(goalInsert);
      }
    } catch (err) {
      console.error("Failed persisting profile/goal to Supabase", err);
    }
  }
}
