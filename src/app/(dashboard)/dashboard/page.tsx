"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import {
  getUserProfileAndGoal,
  saveUserProfileAndGoal,
  UserProfileData,
  UserGoalData,
  DEFAULT_NEW_USER_PROFILE,
  DEFAULT_GOAL_DATA,
} from "@/lib/profile-store";
import {
  calculateBMI,
  checkHealthRiskMarkers,
} from "@/lib/health-calculations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { QuickLogModal } from "@/components/dashboard/quick-log-modal";
import {
  Flame,
  Dumbbell,
  Droplets,
  Footprints,
  Scale,
  Ruler,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  TrendingDown,
  Sparkles,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const { t, locale } = useI18n();

  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_NEW_USER_PROFILE);
  const [goal, setGoal] = useState<UserGoalData>(DEFAULT_GOAL_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Quick log modal state
  const [quickLogType, setQuickLogType] = useState<"weight" | "waist" | null>(null);

  // Water quick-logged in session
  const [loggedWaterMl, setLoggedWaterMl] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      const data = await getUserProfileAndGoal();
      setProfile(data.profile);
      setGoal(data.goal);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Calculate day difference
  const dayNumber = Math.min(
    Math.max(
      Math.floor(
        (Date.now() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1,
      1
    ),
    90
  );

  const bmi = calculateBMI(profile.currentWeightKg, profile.heightCm);
  const riskMarkers = checkHealthRiskMarkers(
    profile.gender,
    profile.waistCm,
    profile.snoringReported
  );

  const weightDeltaToLose = Math.max(
    0,
    Math.round((profile.currentWeightKg - goal.targetWeightKg) * 10) / 10
  );

  const handleSaveBiometric = async (val: number) => {
    if (quickLogType === "weight") {
      const updatedProfile = { ...profile, currentWeightKg: val };
      setProfile(updatedProfile);
      await saveUserProfileAndGoal(updatedProfile, goal);
    } else if (quickLogType === "waist") {
      const updatedProfile = { ...profile, waistCm: val };
      setProfile(updatedProfile);
      await saveUserProfileAndGoal(updatedProfile, goal);
    }
  };

  const handleAddWater = () => {
    setLoggedWaterMl((prev) => prev + 250);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* If user has not onboarded yet, show friendly banner */}
      {!profile.isOnboarded && (
        <Alert variant="warning" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-700 shrink-0" />
            <span className="text-xs font-semibold">
              {locale === "te"
                ? "మీ శరీర కొలతలు మరియు 90 రోజుల లక్ష్యాలను ఇంకా సెట్ చేయలేదు."
                : "Personalize your calorie targets and 90-day weight goal."}
            </span>
          </div>
          <Link href="/onboarding">
            <Button size="sm" variant="primary" className="h-8 text-xs shrink-0">
              {locale === "te" ? "ప్రారంభించండి" : "Start Onboarding"}
            </Button>
          </Link>
        </Alert>
      )}

      {/* 21st.dev Hero Welcome Card */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/30 glow-emerald">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-black tracking-wide uppercase text-emerald-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span>{t.dashboard.dayCounter.replace("{day}", String(dayNumber))}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-teal-200">
              {t.dashboard.welcome}, {profile.fullName}!
            </span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
            {locale === "te"
              ? "స్థిరమైన ఆహారం మరియు క్రమమైన నడకతో మీ 90 రోజుల ప్రయాణాన్ని కొనసాగించండి. రోజువారీ క్రమశిక్షణే విజయం."
              : "Stick to your calorie target and daily steps for sustainable results. Consistency compounds daily."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link href="/profile">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl backdrop-blur-md shadow-sm transition-all active:scale-95 min-h-[44px] px-4"
            >
              {t.nav.profile}
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black border-0 text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 min-h-[44px] px-4"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              {t.profile.recalculateButton}
            </Button>
          </Link>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 90-Day Weight Goal Progress Card */}
      <div className="glass-card card-spotlight rounded-3xl p-6 sm:p-7 border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.dashboard.progressTitle}
            </span>
            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {profile.currentWeightKg} <span className="text-base font-semibold text-slate-400">kg</span>
              </span>
              <span className="text-slate-400 font-black text-xl">→</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {goal.targetWeightKg} <span className="text-base font-semibold text-slate-400">kg</span>
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-extrabold border border-emerald-500/25 shadow-xs">
              <TrendingDown className="h-4 w-4 text-emerald-600 animate-bounce" />
              <span>
                {weightDeltaToLose > 0
                  ? t.dashboard.toLose.replace("{amount}", String(weightDeltaToLose))
                  : t.dashboard.goalAchieved}
              </span>
            </span>
          </div>
        </div>

        {/* Progress Bar with Shimmer */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden dark:bg-slate-800 relative">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-3.5 rounded-full transition-all duration-700 shadow-xs relative shimmer-active"
            style={{ width: `${Math.min((dayNumber / 90) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
          <span>Day {dayNumber} of 90</span>
          <span>Target Date: {goal.targetDate}</span>
        </div>
      </div>

      {/* Target overview metrics grid */}
      <div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-600" />
          <span>{t.dashboard.overviewTitle}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card card-spotlight rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-orange-500/10 to-transparent border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.dashboard.calories}</span>
              <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-xs">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              0 <span className="text-xs font-semibold text-slate-400">kcal</span>
            </div>
            <p className="text-[11px] text-orange-700 dark:text-orange-400 font-bold mt-1.5">
              Target: {goal.calorieTargetMin}-{goal.calorieTargetMax}
            </p>
          </div>

          <div className="glass-card card-spotlight rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-emerald-500/10 to-transparent border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.dashboard.protein}</span>
              <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                <Dumbbell className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              0 <span className="text-xs font-semibold text-slate-400">g</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1.5">
              Target: {goal.proteinTargetMinG}-{goal.proteinTargetMaxG}g
            </p>
          </div>

          <div className="glass-card card-spotlight rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-cyan-500/10 to-transparent border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.dashboard.water}</span>
              <div className="h-8 w-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs">
                <Droplets className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {loggedWaterMl} <span className="text-xs font-semibold text-slate-400">ml</span>
            </div>
            <p className="text-[11px] text-cyan-700 dark:text-cyan-400 font-bold mt-1.5">
              Target: {goal.dailyWaterTargetMl} ml
            </p>
          </div>

          <div className="glass-card card-spotlight rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-amber-500/10 to-transparent border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.dashboard.steps}</span>
              <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
                <Footprints className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              0 <span className="text-xs font-semibold text-slate-400">steps</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold mt-1.5">
              Target: {goal.dailyStepTarget}
            </p>
          </div>
        </div>
      </div>

      {/* Asian Indian BMI & Waist Metabolic Reference Card */}
      <div className="glass-card card-spotlight rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {t.dashboard.bmiTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locale === "te" ? "భారతీయ జీవక్రియ ప్రమాణాలు (ICMR / WHO Asian Indian)" : "ICMR / Asian Indian Metabolic Cutoffs"}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                BMI: <strong className="text-slate-900 dark:text-white text-sm">{bmi.bmi} kg/m²</strong>
              </span>
              <span
                className={`text-[11px] font-black px-3 py-1 rounded-full ${
                  bmi.category === "normal"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                    : bmi.category === "overweight"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                }`}
              >
                {bmi.category.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {locale === "te"
                ? `భారతీయుల సాధారణ బరువు పరిధి: ${bmi.healthyWeightRangeKg.min} - ${bmi.healthyWeightRangeKg.max} కిలోలు`
                : `Asian Indian Normal Weight: ${bmi.healthyWeightRangeKg.min} - ${bmi.healthyWeightRangeKg.max} kg`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {t.dashboard.waist}: <strong className="text-slate-900 dark:text-white text-sm">{profile.waistCm} cm</strong>
              </span>
              <span
                className={`text-[11px] font-black px-3 py-1 rounded-full ${
                  riskMarkers.hasWaistRisk
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {riskMarkers.hasWaistRisk ? "VISCERAL RISK" : "NORMAL"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {locale === "te"
                ? "పురుషుల పరిమితి: < 90 సెం.మీ | స్త్రీల పరిమితి: < 80 సెం.మీ"
                : "Asian Indian Cutoff: < 90 cm (Men) | < 80 cm (Women)"}
            </p>
          </div>
        </div>

        {/* Personalized Health Precaution Notes */}
        {(riskMarkers.hasWaistRisk || profile.snoringReported) && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <span>{t.dashboard.healthNoticeTitle}</span>
            </div>
            {riskMarkers.hasWaistRisk && (
              <p className="leading-relaxed">{locale === "te" ? riskMarkers.waistRiskMessageTe : riskMarkers.waistRiskMessageEn}</p>
            )}
            {profile.snoringReported && (
              <p className="leading-relaxed">{locale === "te" ? riskMarkers.snoringRiskMessageTe : riskMarkers.snoringRiskMessageEn}</p>
            )}
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>{t.dashboard.quickActions}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            className="glass-card card-spotlight flex flex-col items-center justify-center h-28 text-center gap-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/30 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95 group min-h-[44px]"
            onClick={() => setQuickLogType("weight")}
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{t.dashboard.logWeight}</span>
          </button>

          <button
            type="button"
            className="glass-card card-spotlight flex flex-col items-center justify-center h-28 text-center gap-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 hover:bg-teal-500/10 dark:hover:bg-teal-950/30 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95 group min-h-[44px]"
            onClick={() => setQuickLogType("waist")}
          >
            <div className="h-10 w-10 rounded-xl bg-teal-500/15 group-hover:bg-teal-500/25 flex items-center justify-center text-teal-600 dark:text-teal-400 transition-colors shadow-xs">
              <Ruler className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{t.dashboard.logWaist}</span>
          </button>

          <button
            type="button"
            className="glass-card card-spotlight flex flex-col items-center justify-center h-28 text-center gap-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 hover:bg-cyan-500/10 dark:hover:bg-cyan-950/30 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95 group min-h-[44px]"
            onClick={handleAddWater}
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-500/15 group-hover:bg-cyan-500/25 flex items-center justify-center text-cyan-600 dark:text-cyan-400 transition-colors shadow-xs">
              <Droplets className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{t.dashboard.logWater}</span>
          </button>

          <Link href="/onboarding" className="w-full">
            <div className="glass-card card-spotlight flex flex-col items-center justify-center h-28 text-center gap-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 hover:bg-amber-500/10 dark:hover:bg-amber-950/30 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95 group w-full min-h-[44px]">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 group-hover:bg-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 transition-colors shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {locale === "te" ? "లక్ష్యాలు సవరించండి" : "Edit Goals"}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Meaningful Empty State for Recent Logs (no fake success states) */}
      <Card className="border-dashed border-2 border-slate-300 dark:border-slate-800 bg-white/50 text-center py-10 px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-3">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
          {t.dashboard.recentLogs}
        </h4>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          {t.dashboard.noDataYet}
        </p>
      </Card>

      {/* Quick Log Modal */}
      <QuickLogModal
        type={quickLogType || "weight"}
        isOpen={quickLogType !== null}
        onClose={() => setQuickLogType(null)}
        onSave={handleSaveBiometric}
        currentValue={quickLogType === "weight" ? profile.currentWeightKg : profile.waistCm}
      />
    </div>
  );
}
