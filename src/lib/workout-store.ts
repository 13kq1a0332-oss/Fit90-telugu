import { createClient, isSupabaseConfigured } from "./supabase/client";

export interface LoggedExerciseSet {
  exerciseId: string;
  exerciseNameEn: string;
  exerciseNameTe: string;
  setsCompleted: number;
  repsPerSet: number;
  restSeconds: number;
  isCompleted: boolean;
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  type: "walking" | "strength" | "combined";
  durationMinutes: number;
  walkingMinutes?: number;
  walkingSteps?: number;
  rpeScore: number; // 1 - 10
  kneePainReported: boolean;
  kneePainNotes?: string;
  exerciseLogs: LoggedExerciseSet[];
  notes?: string;
  createdAt: string;
}

export interface WorkoutScheduleConfig {
  daysPerWeek: number;
  preferredDays: number[]; // 0 = Sun, 1 = Mon, ... 6 = Sat
  activeWeek: number; // 1 to 13
}

const SESSIONS_STORAGE_KEY = "fit90_workout_sessions";
const SCHEDULE_STORAGE_KEY = "fit90_workout_schedule";

export const DEFAULT_SCHEDULE_CONFIG: WorkoutScheduleConfig = {
  daysPerWeek: 5,
  preferredDays: [1, 2, 3, 5, 6], // Mon, Tue, Wed, Fri, Sat
  activeWeek: 1,
};

// -------------------------------------------------------------
// Schedule Configuration
// -------------------------------------------------------------
export function getWorkoutScheduleConfig(): WorkoutScheduleConfig {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return DEFAULT_SCHEDULE_CONFIG;
}

export function updateWorkoutScheduleConfig(
  config: Partial<WorkoutScheduleConfig>
): WorkoutScheduleConfig {
  const current = getWorkoutScheduleConfig();
  const updated = { ...current, ...config };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return updated;
}

// -------------------------------------------------------------
// Workout Sessions CRUD
// -------------------------------------------------------------
export async function getWorkoutSessions(): Promise<WorkoutSession[]> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
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
        const { data, error } = await supabase
          .from("workout_sessions")
          .select("*, workout_exercise_logs(*)")
          .eq("user_id", user.id)
          .order("session_date", { ascending: false });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            date: d.session_date,
            type: d.notes?.includes("walking") ? "walking" : "strength",
            durationMinutes: d.duration_minutes,
            rpeScore: d.rpe_score || 5,
            kneePainReported: !!d.knee_pain_reported,
            kneePainNotes: d.notes || "",
            exerciseLogs: (d.workout_exercise_logs || []).map((ex: any) => ({
              exerciseId: ex.exercise_id,
              exerciseNameEn: "Exercise",
              exerciseNameTe: "కసరత్తు",
              setsCompleted: ex.sets_completed,
              repsPerSet: ex.reps_per_set || 10,
              restSeconds: ex.rest_seconds || 60,
              isCompleted: ex.is_completed,
            })),
            notes: d.notes || "",
            createdAt: d.created_at,
          }));
        }
      }
    } catch (e) {
      console.warn("Supabase fetch workout sessions error:", e);
    }
  }

  return [];
}

export async function addWorkoutSession(
  session: Omit<WorkoutSession, "id" | "createdAt">
): Promise<WorkoutSession> {
  const newSession: WorkoutSession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const current = await getWorkoutSessions();
      const updated = [newSession, ...current];
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: insertedSession } = (await supabase
          .from("workout_sessions")
          .insert({
            user_id: user.id,
            session_date: newSession.date,
            duration_minutes: newSession.durationMinutes,
            rpe_score: newSession.rpeScore,
            knee_pain_reported: newSession.kneePainReported,
            notes: newSession.notes || "",
          } as any)
          .select()
          .single()) as { data: any };

        if (insertedSession && newSession.exerciseLogs.length > 0) {
          const exerciseRows = newSession.exerciseLogs.map((log) => ({
            session_id: insertedSession.id,
            exercise_id: log.exerciseId,
            sets_completed: log.setsCompleted,
            reps_per_set: log.repsPerSet,
            rest_seconds: log.restSeconds,
            is_completed: log.isCompleted,
          }));
          await supabase.from("workout_exercise_logs").insert(exerciseRows as any);
        }
      }
    } catch (e) {
      console.warn("Supabase insert workout session error:", e);
    }
  }

  return newSession;
}

export async function deleteWorkoutSession(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getWorkoutSessions();
      const updated = current.filter((s) => s.id !== id);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from("workout_sessions").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete workout session error:", e);
    }
  }
}

// -------------------------------------------------------------
// Analytics & Streak Calculation
// -------------------------------------------------------------
export function calculateWorkoutStreak(sessions: WorkoutSession[]): number {
  if (!sessions || sessions.length === 0) return 0;

  // Unique sorted dates descending
  const dates = Array.from(new Set(sessions.map((s) => s.date))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // If the most recent workout wasn't today or yesterday, streak is broken
  if (dates[0] !== today && dates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(dates[0]);

  for (const dateStr of dates) {
    const sessionDate = new Date(dateStr);
    const diffDays = Math.round(
      (expectedDate.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays === 0) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (diffDays === 1) {
      streak++;
      expectedDate = new Date(sessionDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getWeeklyWorkoutMetrics(sessions: WorkoutSession[]) {
  // Get start of current week (Monday)
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diffToMonday));
  monday.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= monday;
  });

  const totalMinutes = thisWeekSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalWalkingSteps = thisWeekSessions.reduce((acc, s) => acc + (s.walkingSteps || 0), 0);
  const kneePainCount = thisWeekSessions.filter((s) => s.kneePainReported).length;

  return {
    sessionsCompleted: thisWeekSessions.length,
    totalMinutes,
    totalWalkingSteps,
    kneePainCount,
  };
}
