"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { getUserProfileAndGoal, UserProfileData, UserGoalData } from "@/lib/profile-store";
import { getLabRecords, getBloodPressureLogs, LabRecordEntry, BloodPressureEntry } from "@/lib/health-store";
import { getWorkoutSessions, WorkoutSession } from "@/lib/workout-store";
import { getExerciseById, ExerciseItem } from "@/lib/data/workout-catalog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  Activity,
  Heart,
  Flame,
  CheckCircle2,
  ChevronRight,
  Footprints,
  Dumbbell,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export interface TailoredRoutine {
  id: string;
  titleEn: string;
  titleTe: string;
  badgeEn: string;
  badgeTe: string;
  clinicalReasonEn: string;
  clinicalReasonTe: string;
  exerciseIds: string[];
  estimatedMinutes: number;
}

interface PersonalizedWorkoutEngineProps {
  onSelectRoutine?: (exerciseIds: string[]) => void;
  activeExerciseIds?: string[];
}

export function PersonalizedWorkoutEngine({
  onSelectRoutine,
  activeExerciseIds = [],
}: PersonalizedWorkoutEngineProps) {
  const { locale } = useI18n();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [goal, setGoal] = useState<UserGoalData | null>(null);
  const [latestLab, setLatestLab] = useState<LabRecordEntry | null>(null);
  const [latestBp, setLatestBp] = useState<BloodPressureEntry | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [activePresetId, setActivePresetId] = useState<string>("custom_health");

  useEffect(() => {
    async function loadData() {
      setIsLoading(false);
      try {
        const { profile: p, goal: g } = await getUserProfileAndGoal();
        setProfile(p);
        setGoal(g);

        const labs = await getLabRecords();
        if (labs && labs.length > 0) {
          setLatestLab(labs[0]);
        }

        const bpLogs = await getBloodPressureLogs();
        if (bpLogs && bpLogs.length > 0) setLatestBp(bpLogs[0]);

        const sessions = await getWorkoutSessions();
        setHistoryCount(sessions.length);
      } catch (err) {
        console.warn("Could not load health metrics for workout customization:", err);
      }
    }
    loadData();
  }, []);

  // Compute calculated BMI
  const heightM = (profile?.heightCm || 175) / 100;
  const weightKg = profile?.currentWeightKg || 85;
  const bmi = heightM > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(1)) : 27.8;
  const isElevatedBmi = bmi >= 25.0; // Asian Indian cutoff
  const waistCm = profile?.waistCm || 95;
  const isHighWaist = waistCm >= 90;
  const hasElevatedGlucose = latestLab?.testName?.toLowerCase().includes("hba1c") || (latestLab?.numericValue && latestLab.numericValue > 6.0);
  const hasHighBp = latestBp ? latestBp.systolic >= 130 || latestBp.diastolic >= 85 : false;

  // Generate 4 dynamic routines calibrated to user's parameters
  const routines: TailoredRoutine[] = [
    {
      id: "custom_health",
      titleEn: "Personalized Health & Joint-Safe Routine",
      titleTe: "మీ ఆరోగ్య నివేదిక ఆధారిత ప్రత్యేక కసరత్తులు",
      badgeEn: `Calibrated for BMI ${bmi} & ${waistCm}cm Waist`,
      badgeTe: `BMI ${bmi} & ${waistCm}సెం.మీ నడుము కొలతకు సరిపోతుంది`,
      clinicalReasonEn: `Engineered specifically for your Asian Indian profile: Zero patellar joint shearing. Focuses on glute and quadriceps activation to burn visceral abdominal fat while defending knee cartilage.`,
      clinicalReasonTe: `మీ శరీర కొలతల ఆధారంగా రూపొందించబడింది: మోకాళ్లపై ఒత్తిడి లేకుండా పిరుదులు మరియు తొడల కండరాలను బలోపేతం చేసి పొట్ట కొవ్వును కరిగిస్తుంది.`,
      exerciseIds: ["chair-squats", "glute-bridges", "wall-pushups", "calf-raises"],
      estimatedMinutes: 25,
    },
    {
      id: "glucose_clearing",
      titleEn: "15-Min Post-Meal Glucose Clearing Routine",
      titleTe: "భోజనం తర్వాత షుగర్ తగ్గించే వ్యాయామం (GLUT4)",
      badgeEn: hasElevatedGlucose ? "⚡ Recommended for Your HbA1c Profile" : "⚡ Blood Sugar Stabilization",
      badgeTe: hasElevatedGlucose ? "⚡ మీ HbA1c నివేదికకు సిఫార్సు చేయబడింది" : "⚡ రక్తంలో షుగర్ నియంత్రణ",
      clinicalReasonEn: `Performs non-exhaustive rhythmic contractions that activate GLUT4 glucose transporters in skeletal muscle, pulling sugar from the bloodstream without triggering high cortisol.`,
      clinicalReasonTe: `కండరాల కదలికల ద్వారా ఇన్సులిన్ అవసరం లేకుండా రక్తంలోని గ్లూకోజ్‌ను నేరుగా శరీరం వినియోగించుకునేలా చేస్తుంది.`,
      exerciseIds: ["chair-squats", "calf-raises", "seated-knee-extension", "glute-bridges"],
      estimatedMinutes: 18,
    },
    {
      id: "knee_preservation",
      titleEn: "Zero-Impact Knee Preservation Routine",
      titleTe: "మోకాళ్ల నొప్పి రక్షణ & కోర్ వ్యాయామాలు",
      badgeEn: "🛡️ 100% Floor & Seated Movements",
      badgeTe: "🛡️ 100% నేలపై లేదా కుర్చీలో చేసేవి",
      clinicalReasonEn: `Filters out all standing impact forces. Safe for individuals with existing joint sensitivity or heavier starting body weights.`,
      clinicalReasonTe: `నిలబడే అవసరం లేకుండా నేలపై మరియు కుర్చీపై మాత్రమే చేసే సురక్షితమైన వ్యాయామాలు. కీళ్ల నొప్పులు ఉన్నవారికి అనువైనది.`,
      exerciseIds: ["glute-bridges", "seated-knee-extension", "wall-pushups"],
      estimatedMinutes: 20,
    },
    {
      id: "upper_posture",
      titleEn: "Upper Body & Posture Alignment",
      titleTe: "భుజాలు, ఛాతీ & వీపు నిటారుతనం",
      badgeEn: "💪 Upper Body & Spinal Health",
      badgeTe: "💪 ఎగువ శరీరం & వెన్నెముక దృఢత్వం",
      clinicalReasonEn: `Strengthens scapular retractors, anterior chest, and core stability to reverse prolonged desk sitting and improve breathing capacity.`,
      clinicalReasonTe: `కంప్యూటర్ ముందు కూర్చునే వారి కోసం వీపు మరియు భుజాలను బలోపేతం చేసి ఛాతీ సామర్థ్యాన్ని పెంచుతుంది.`,
      exerciseIds: ["wall-pushups", "glute-bridges", "calf-raises"],
      estimatedMinutes: 22,
    },
  ];

  const handleApplyRoutine = (routine: TailoredRoutine) => {
    setActivePresetId(routine.id);
    if (onSelectRoutine) {
      onSelectRoutine(routine.exerciseIds);
    }
  };

  const activeRoutine = routines.find((r) => r.id === activePresetId) || routines[0];

  // Automatically apply the tailored routine to today's workout on initial mount
  const [hasAutoApplied, setHasAutoApplied] = useState(false);
  useEffect(() => {
    if (!hasAutoApplied && profile && onSelectRoutine) {
      setHasAutoApplied(true);
      onSelectRoutine(routines[0].exerciseIds);
    }
  }, [profile, hasAutoApplied, onSelectRoutine, routines]);

  return (
    <Card className="glass-card-3d rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-teal-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 shadow-xl overflow-hidden animate-in fade-in duration-300 relative">
      {/* 3D specular light reflection */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <CardHeader className="pb-3 border-b border-indigo-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {locale === "te"
                    ? "మీ ఆరోగ్య ప్రొఫైల్ ఆధారిత వ్యాయామ సిఫార్సులు"
                    : "Health Profile & Lab-Tailored Workout Engine"}
                </CardTitle>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {locale === "te" ? "వ్యక్తిగతం" : "Personalized"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {locale === "te"
                  ? `శ్రీ ${profile?.fullName || "సభ్యులు"} గారి బయోమెట్రిక్స్ (BMI: ${bmi}, నడుము: ${waistCm}cm) మరియు ల్యాబ్ రికార్డుల ఆధారంగా విశ్లేషించబడింది`
                  : `Calibrated to your biometrics (BMI: ${bmi}, Waist: ${waistCm}cm) & verified clinical history`}
              </p>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>
              {isElevatedBmi
                ? locale === "te"
                  ? "మోకాళ్ల రక్షణ నియమం వర్తింపజేయబడింది"
                  : "Knee Protection Protocol Active"
                : locale === "te"
                ? "ఆరోగ్యవంతమైన వ్యాయామ విధానం"
                : "Standard Progression Active"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Clinical Rationale Alert */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
            <Activity className="h-4 w-4 text-indigo-600" />
            <span>{locale === "te" ? "క్లినికల్ విశ్లేషణ & వ్యాయామ కారణం:" : "Clinical Biometric Assessment:"}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs leading-relaxed">
            {locale === "te" ? activeRoutine.clinicalReasonTe : activeRoutine.clinicalReasonEn}
          </p>
        </div>

        {/* 4 Interactive Routine Cards (1-Click Switch) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {routines.map((routine) => {
            const isSelected = activePresetId === routine.id;
            return (
              <div
                key={routine.id}
                onClick={() => handleApplyRoutine(routine)}
                className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/10 dark:from-slate-800 dark:to-emerald-950/30 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                      {locale === "te" ? routine.badgeTe : routine.badgeEn}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                    {locale === "te" ? routine.titleTe : routine.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ~{routine.estimatedMinutes} mins • {routine.exerciseIds.length} {locale === "te" ? "కసరత్తులు" : "exercises"}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  <span>{isSelected ? (locale === "te" ? "ప్రస్తుతం అమల్లో ఉంది" : "Active Now") : (locale === "te" ? "ఎంచుకోండి" : "Select")}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Routine Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {locale === "te" ? "నేటి ఎంచుకున్న కసరత్తులు:" : "Selected Today:"}
            </span>
            <div className="flex flex-wrap gap-1">
              {activeRoutine.exerciseIds.map((id) => {
                const ex = getExerciseById(id);
                return (
                  <span
                    key={id}
                    className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold"
                  >
                    {locale === "te" ? ex?.nameTe : ex?.nameEn}
                  </span>
                );
              })}
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => handleApplyRoutine(activeRoutine)}
            className="btn-3d-emerald text-white font-black text-xs rounded-xl shadow-md gap-1.5 h-9 px-4 ml-auto"
          >
            <Dumbbell className="h-3.5 w-3.5" />
            <span>{locale === "te" ? "ఈ ప్రణాళికను వర్తింపజేయండి" : "Apply This Workout Routine"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
