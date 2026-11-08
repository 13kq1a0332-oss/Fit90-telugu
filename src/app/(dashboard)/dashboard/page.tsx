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

      {/* Header welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 rounded-3xl p-6 text-white shadow-md">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-600/70 text-xs font-bold mb-2 tracking-wide uppercase">
            {t.dashboard.dayCounter.replace("{day}", String(dayNumber))}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.dashboard.welcome}, {profile.fullName}!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md">
            {locale === "te"
              ? "స్థిరమైన ఆహారం మరియు క్రమమైన నడకతో మీ 90 రోజుల ప్రయాణాన్ని కొనసాగించండి."
              : "Stick to your calorie target and daily steps for sustainable results."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-0 text-xs font-semibold rounded-xl"
            >
              {t.nav.profile}
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-0 text-xs font-semibold rounded-xl"
            >
              {t.profile.recalculateButton}
            </Button>
          </Link>
        </div>
      </div>

      {/* 90-Day Weight Goal Progress Card */}
      <Card className="p-5 border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.progressTitle}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {profile.currentWeightKg} <span className="text-sm font-normal text-slate-400">kg</span>
              </span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {goal.targetWeightKg} <span className="text-sm font-normal text-slate-400">kg</span>
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>
                {weightDeltaToLose > 0
                  ? t.dashboard.toLose.replace("{amount}", String(weightDeltaToLose))
                  : t.dashboard.goalAchieved}
              </span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden dark:bg-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((dayNumber / 90) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
          <span>Day {dayNumber} of 90</span>
          <span>Target Date: {goal.targetDate}</span>
        </div>
      </Card>

      {/* Target overview metrics grid */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          {t.dashboard.overviewTitle}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">{t.dashboard.calories}</span>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              0 <span className="text-xs font-normal text-slate-400">kcal</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Target: {goal.calorieTargetMin}-{goal.calorieTargetMax}
            </p>
          </Card>

          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">{t.dashboard.protein}</span>
              <Dumbbell className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              0 <span className="text-xs font-normal text-slate-400">g</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Target: {goal.proteinTargetMinG}-{goal.proteinTargetMaxG}g
            </p>
          </Card>

          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">{t.dashboard.water}</span>
              <Droplets className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {loggedWaterMl} <span className="text-xs font-normal text-slate-400">ml</span>
            </div>
            <p className="text-[11px] text-cyan-700 font-medium mt-1">
              Target: {goal.dailyWaterTargetMl} ml
            </p>
          </Card>

          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">{t.dashboard.steps}</span>
              <Footprints className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              0 <span className="text-xs font-normal text-slate-400">steps</span>
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Target: {goal.dailyStepTarget}
            </p>
          </Card>
        </div>
      </div>

      {/* Asian Indian BMI & Waist Metabolic Reference Card */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <HeartPulse className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-base font-bold">
            {t.dashboard.bmiTitle}
          </CardTitle>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                BMI: <strong className="text-slate-900 dark:text-white">{bmi.bmi} kg/m²</strong>
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  bmi.category === "normal"
                    ? "bg-emerald-100 text-emerald-800"
                    : bmi.category === "overweight"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {bmi.category.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {locale === "te"
                ? `భారతీయుల సాధారణ బరువు పరిధి: ${bmi.healthyWeightRangeKg.min} - ${bmi.healthyWeightRangeKg.max} కిలోలు`
                : `Asian Indian Normal Weight: ${bmi.healthyWeightRangeKg.min} - ${bmi.healthyWeightRangeKg.max} kg`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t.dashboard.waist}: <strong className="text-slate-900 dark:text-white">{profile.waistCm} cm</strong>
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  riskMarkers.hasWaistRisk
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {riskMarkers.hasWaistRisk ? "VISCERAL RISK" : "NORMAL"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {locale === "te"
                ? "పురుషుల పరిమితి: < 90 సెం.మీ | స్త్రీల పరిమితి: < 80 సెం.మీ"
                : "Asian Indian Cutoff: < 90 cm (Men) | < 80 cm (Women)"}
            </p>
          </div>
        </div>

        {/* Personalized Health Precaution Notes */}
        {(riskMarkers.hasWaistRisk || profile.snoringReported) && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-1.5 dark:bg-amber-950/30 dark:border-amber-900">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <span>{t.dashboard.healthNoticeTitle}</span>
            </div>
            {riskMarkers.hasWaistRisk && (
              <p>{locale === "te" ? riskMarkers.waistRiskMessageTe : riskMarkers.waistRiskMessageEn}</p>
            )}
            {profile.snoringReported && (
              <p>{locale === "te" ? riskMarkers.snoringRiskMessageTe : riskMarkers.snoringRiskMessageEn}</p>
            )}
          </div>
        )}
      </Card>

      {/* Quick Action Buttons */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          {t.dashboard.quickActions}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-20 text-center gap-1.5 rounded-2xl"
            onClick={() => setQuickLogType("weight")}
          >
            <Scale className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold">{t.dashboard.logWeight}</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-20 text-center gap-1.5 rounded-2xl"
            onClick={() => setQuickLogType("waist")}
          >
            <Ruler className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold">{t.dashboard.logWaist}</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-20 text-center gap-1.5 rounded-2xl"
            onClick={handleAddWater}
          >
            <Droplets className="h-5 w-5 text-cyan-600" />
            <span className="text-xs font-bold">{t.dashboard.logWater}</span>
          </Button>

          <Link href="/onboarding" className="w-full">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20 text-center gap-1.5 rounded-2xl w-full"
            >
              <Sparkles className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-bold">
                {locale === "te" ? "లక్ష్యాలు సవరించండి" : "Edit Goals"}
              </span>
            </Button>
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
