import { createClient, isSupabaseConfigured } from "./supabase/client";
import { LabRecordEntry, SAMPLE_QA_LAB_RECORDS } from "./test-fixtures/sample-labs";

export type { LabRecordEntry };
export { SAMPLE_QA_LAB_RECORDS };

export type BpStage = "normal" | "elevated" | "stage_1" | "stage_2" | "crisis";

export interface BloodPressureEntry {
  id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  loggedDate: string;
  loggedTime: string;
  stage: BpStage;
  notes?: string;
}

export interface WaterLogEntry {
  id: string;
  amountMl: number;
  loggedDate: string;
  loggedTime: string;
}

export interface SleepLogEntry {
  id: string;
  durationHours: number;
  qualityScore: number; // 1 - 5
  snoringReported: boolean;
  loggedDate: string;
  notes?: string;
}

export interface WeightLogEntry {
  id: string;
  weightKg: number;
  loggedDate: string;
  timeOfDay: "fasting_morning" | "post_meal" | "evening" | "night";
  notes?: string;
}

export interface WaistLogEntry {
  id: string;
  waistCm: number;
  loggedDate: string;
  notes?: string;
}

export interface HealthReminder {
  id: string;
  type: "water" | "meal" | "walk" | "sleep" | "weight" | "custom";
  titleEn: string;
  titleTe: string;
  scheduledTime: string; // "07:00", "14:00"
  daysOfWeek: number[]; // 1 to 7
  isEnabled: boolean;
}

// Storage Keys
const BP_STORAGE_KEY = "fit90_bp_logs";
const WATER_STORAGE_KEY = "fit90_water_logs";
const SLEEP_STORAGE_KEY = "fit90_sleep_logs";
const WEIGHT_STORAGE_KEY = "fit90_weight_logs";
const WAIST_STORAGE_KEY = "fit90_waist_logs";
const LABS_STORAGE_KEY = "fit90_lab_records";
const REMINDERS_STORAGE_KEY = "fit90_reminders";

// -------------------------------------------------------------
// Blood Pressure Classification (AHA / Indian Guidelines Consensus)
// -------------------------------------------------------------
export function classifyBloodPressure(
  systolic: number,
  diastolic: number
): {
  stage: BpStage;
  labelEn: string;
  labelTe: string;
  isCrisis: boolean;
  colorClass: string;
} {
  if (systolic > 180 || diastolic > 120) {
    return {
      stage: "crisis",
      labelEn: "Hypertensive Crisis (> 180 / > 120)",
      labelTe: "తీవ్ర రక్తపోటు ముప్పు (> 180 / > 120)",
      isCrisis: true,
      colorClass: "text-red-700 bg-red-100 border-red-300 dark:bg-red-950 dark:text-red-300",
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      stage: "stage_2",
      labelEn: "Stage 2 Hypertension (≥ 140 / ≥ 90)",
      labelTe: "స్టేజ్ 2 హైపర్‌టెన్షన్ (≥ 140 / ≥ 90)",
      isCrisis: false,
      colorClass: "text-orange-700 bg-orange-100 border-orange-300 dark:bg-orange-950 dark:text-orange-300",
    };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      stage: "stage_1",
      labelEn: "Stage 1 Hypertension (130-139 / 80-89)",
      labelTe: "స్టేజ్ 1 హైపర్‌టెన్షన్ (130-139 / 80-89)",
      isCrisis: false,
      colorClass: "text-amber-700 bg-amber-100 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
    };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      stage: "elevated",
      labelEn: "Elevated (120-129 / < 80)",
      labelTe: "కొద్దిగా ఎక్కువ (120-129 / < 80)",
      isCrisis: false,
      colorClass: "text-yellow-800 bg-yellow-100 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300",
    };
  }
  return {
    stage: "normal",
    labelEn: "Normal (< 120 / < 80)",
    labelTe: "సాధారణం (< 120 / < 80)",
    isCrisis: false,
    colorClass: "text-emerald-700 bg-emerald-100 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
  };
}

// -------------------------------------------------------------
// Blood Pressure CRUD
// -------------------------------------------------------------
export async function getBloodPressureLogs(): Promise<BloodPressureEntry[]> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(BP_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return [];
}

export async function addBloodPressureLog(
  entry: Omit<BloodPressureEntry, "id" | "stage">
): Promise<BloodPressureEntry> {
  const { stage } = classifyBloodPressure(entry.systolic, entry.diastolic);
  const newEntry: BloodPressureEntry = {
    ...entry,
    id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    stage,
  };

  if (typeof window !== "undefined") {
    try {
      const current = await getBloodPressureLogs();
      const updated = [newEntry, ...current];
      localStorage.setItem(BP_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("blood_pressure_logs").insert({
          user_id: user.id,
          systolic: newEntry.systolic,
          diastolic: newEntry.diastolic,
          pulse: newEntry.pulse || null,
          logged_date: newEntry.loggedDate,
          logged_time: newEntry.loggedTime,
          notes: newEntry.notes || null,
        } as any);
      }
    } catch (e) {
      console.warn("Supabase BP insert warning:", e);
    }
  }

  return newEntry;
}

export async function deleteBloodPressureLog(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getBloodPressureLogs();
      const updated = current.filter((item) => item.id !== id);
      localStorage.setItem(BP_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}

// -------------------------------------------------------------
// Water Hydration CRUD
// -------------------------------------------------------------
export async function getWaterTotalForDate(date: string): Promise<number> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`${WATER_STORAGE_KEY}_${date}`);
      if (stored) {
        const entries: WaterLogEntry[] = JSON.parse(stored);
        return entries.reduce((sum, e) => sum + e.amountMl, 0);
      }
    } catch {}
  }
  return 0;
}

export async function addWaterLog(
  amountMl: number,
  date: string
): Promise<number> {
  const newEntry: WaterLogEntry = {
    id: `w_${Date.now()}`,
    amountMl,
    loggedDate: date,
    loggedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  let total = amountMl;
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(`${WATER_STORAGE_KEY}_${date}`);
      const entries: WaterLogEntry[] = existing ? JSON.parse(existing) : [];
      entries.push(newEntry);
      localStorage.setItem(`${WATER_STORAGE_KEY}_${date}`, JSON.stringify(entries));
      total = entries.reduce((sum, e) => sum + e.amountMl, 0);
    } catch {}
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("water_logs").insert({
          user_id: user.id,
          amount_ml: amountMl,
          logged_date: date,
        } as any);
      }
    } catch (e) {
      console.warn("Supabase water insert warning:", e);
    }
  }

  return total;
}

export async function resetWaterForDate(date: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`${WATER_STORAGE_KEY}_${date}`);
    } catch {}
  }
}

// -------------------------------------------------------------
// Sleep & Snoring CRUD
// -------------------------------------------------------------
export async function getSleepLogForDate(date: string): Promise<SleepLogEntry | null> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`${SLEEP_STORAGE_KEY}_${date}`);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return null;
}

export async function saveSleepLog(
  entry: Omit<SleepLogEntry, "id">
): Promise<SleepLogEntry> {
  const newEntry: SleepLogEntry = {
    ...entry,
    id: `sleep_${Date.now()}`,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`${SLEEP_STORAGE_KEY}_${entry.loggedDate}`, JSON.stringify(newEntry));
    } catch {}
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("sleep_logs").upsert(
          {
            user_id: user.id,
            duration_hours: entry.durationHours,
            quality_score: entry.qualityScore,
            snoring_reported: entry.snoringReported,
            logged_date: entry.loggedDate,
          } as any,
          { onConflict: "user_id,logged_date" }
        );
      }
    } catch (e) {
      console.warn("Supabase sleep upsert warning:", e);
    }
  }

  return newEntry;
}

// -------------------------------------------------------------
// Weight & Waist Biometrics CRUD
// -------------------------------------------------------------
export async function getWeightHistory(): Promise<WeightLogEntry[]> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(WEIGHT_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return [
    {
      id: "w-base",
      weightKg: 118.0,
      loggedDate: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
      timeOfDay: "fasting_morning",
      notes: "Baseline morning weight",
    },
    {
      id: "w-cur",
      weightKg: 117.2,
      loggedDate: new Date().toISOString().slice(0, 10),
      timeOfDay: "fasting_morning",
    },
  ];
}

export async function addWeightLog(
  weightKg: number,
  loggedDate: string,
  timeOfDay: WeightLogEntry["timeOfDay"] = "fasting_morning"
): Promise<WeightLogEntry> {
  const newEntry: WeightLogEntry = {
    id: `wt_${Date.now()}`,
    weightKg,
    loggedDate,
    timeOfDay,
  };

  if (typeof window !== "undefined") {
    try {
      const current = await getWeightHistory();
      const updated = [newEntry, ...current];
      localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("weight_logs").insert({
          user_id: user.id,
          weight_kg: weightKg,
          logged_date: loggedDate,
          time_of_day: timeOfDay,
        } as any);
      }
    } catch (e) {
      console.warn("Supabase weight insert warning:", e);
    }
  }

  return newEntry;
}

export async function getWaistHistory(): Promise<WaistLogEntry[]> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(WAIST_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return [
    {
      id: "waist-base",
      waistCm: 150.0,
      loggedDate: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
      notes: "Baseline waist circumference",
    },
    {
      id: "waist-cur",
      waistCm: 148.5,
      loggedDate: new Date().toISOString().slice(0, 10),
    },
  ];
}

export async function addWaistLog(
  waistCm: number,
  loggedDate: string
): Promise<WaistLogEntry> {
  const newEntry: WaistLogEntry = {
    id: `wst_${Date.now()}`,
    waistCm,
    loggedDate,
  };

  if (typeof window !== "undefined") {
    try {
      const current = await getWaistHistory();
      const updated = [newEntry, ...current];
      localStorage.setItem(WAIST_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("waist_logs").upsert(
          {
            user_id: user.id,
            waist_cm: waistCm,
            logged_date: loggedDate,
          } as any,
          { onConflict: "user_id,logged_date" }
        );
      }
    } catch (e) {
      console.warn("Supabase waist upsert warning:", e);
    }
  }

  return newEntry;
}

// -------------------------------------------------------------
// Lab Records CRUD (Strictly Non-Diagnostic)
// -------------------------------------------------------------
export async function getLabRecords(): Promise<LabRecordEntry[]> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LABS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return [];
}

export async function addLabRecord(
  record: Omit<LabRecordEntry, "id">
): Promise<LabRecordEntry> {
  const newRecord: LabRecordEntry = {
    ...record,
    id: `lab_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  };

  if (typeof window !== "undefined") {
    try {
      const current = await getLabRecords();
      const updated = [newRecord, ...current];
      localStorage.setItem(LABS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  return newRecord;
}

export async function deleteLabRecord(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getLabRecords();
      const updated = current.filter((r) => r.id !== id);
      localStorage.setItem(LABS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}

export async function loadSampleTestProfileLabs(): Promise<LabRecordEntry[]> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LABS_STORAGE_KEY, JSON.stringify(SAMPLE_QA_LAB_RECORDS));
    } catch {}
  }
  return SAMPLE_QA_LAB_RECORDS;
}

// -------------------------------------------------------------
// Reminders Manager
// -------------------------------------------------------------
export const DEFAULT_REMINDERS: HealthReminder[] = [
  {
    id: "rem-1",
    type: "weight",
    titleEn: "Fasting Morning Weight",
    titleTe: "ఉదయం ఖాళీ కడుపుతో బరువు నమోదు",
    scheduledTime: "07:00",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
  },
  {
    id: "rem-2",
    type: "water",
    titleEn: "Hydration Check (+250ml)",
    titleTe: "మంచి నీరు త్రాగండి (250మి.లీ)",
    scheduledTime: "11:00",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
  },
  {
    id: "rem-3",
    type: "walk",
    titleEn: "Post-Lunch 15-Minute Walk",
    titleTe: "మధ్యాహ్న భోజనం తర్వాత 15 నిమిషాల నడక",
    scheduledTime: "14:00",
    daysOfWeek: [1, 2, 3, 4, 5],
    isEnabled: true,
  },
  {
    id: "rem-4",
    type: "walk",
    titleEn: "Post-Dinner Stroll",
    titleTe: "రాత్రి భోజనం తర్వాత నడక",
    scheduledTime: "20:30",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
  },
  {
    id: "rem-5",
    type: "sleep",
    titleEn: "Wind-Down & Screen-Off for Sleep",
    titleTe: "నిద్రకు సిద్ధమవ్వండి (స్క్రీన్ ఆఫ్)",
    scheduledTime: "22:30",
    daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    isEnabled: true,
  },
];

export async function getHealthReminders(): Promise<HealthReminder[]> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(REMINDERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return DEFAULT_REMINDERS;
}

export async function toggleHealthReminder(id: string, isEnabled: boolean): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getHealthReminders();
      const updated = current.map((r) => (r.id === id ? { ...r, isEnabled } : r));
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}

export async function updateHealthReminderTime(id: string, scheduledTime: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getHealthReminders();
      const updated = current.map((r) => (r.id === id ? { ...r, scheduledTime } : r));
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}
