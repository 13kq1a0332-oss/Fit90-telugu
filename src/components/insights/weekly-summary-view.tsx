"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  WeeklyDigest,
  computeWeeklyDigest,
  generateShareableDigestText,
} from "@/lib/insights-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsAppShareButton } from "@/components/shared/whatsapp-share-button";
import {
  Trophy,
  Flame,
  Footprints,
  Scale,
  Ruler,
  Droplet,
  Moon,
  HeartPulse,
  Share2,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Info,
  Calendar,
  TrendingDown,
} from "lucide-react";

export function WeeklySummaryView() {
  const { locale, t } = useI18n();
  const [digest, setDigest] = useState<WeeklyDigest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await computeWeeklyDigest();
        setDigest(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleCopyDigest = async () => {
    if (!digest) return;
    const text = generateShareableDigestText(digest, locale as "en" | "te");
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {}
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  if (isLoading || !digest) {
    return (
      <div className="py-12 text-center text-slate-500 animate-pulse">
        <Sparkles className="h-8 w-8 text-emerald-500 mx-auto mb-2 animate-spin" />
        <p className="text-sm">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card with Date Range & Share Button */}
      <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-50/60 to-indigo-50/60 dark:from-emerald-950/20 dark:to-indigo-950/20 shadow-sm">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <Calendar className="h-4 w-4" />
              <span>
                {digest.startDate} {locale === "te" ? "నుండి" : "to"} {digest.endDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {t.insights.weeklyDigestTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {t.insights.weeklyDigestSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <WhatsAppShareButton
              dayNumber={7}
              weightLossKg={Math.max(0, -digest.weightDeltaKg)}
              stepsToday={Math.round(digest.totalSteps / 7)}
              caloriesToday={digest.avgCalories}
              proteinGToday={digest.avgProteinG}
              targetCalories={digest.targetCaloriesMax || 2000}
              metabolicScore={Math.min(100, Math.max(30, Math.round(
                (digest.avgCalories > 0 ? 25 : 10) +
                Math.min(25, (digest.avgProteinG / (digest.targetProteinMinG || 90)) * 25) +
                Math.min(20, (digest.totalSteps / (digest.targetWeeklySteps || 49000)) * 20) +
                Math.min(15, (digest.avgWaterMl / (digest.targetWaterMl || 3000)) * 15) +
                15
              )))}
            />
            <Button
              id="shareWeeklyDigestBtn"
              onClick={handleCopyDigest}
              variant="outline"
              className="gap-2 shadow-xs"
            >
              {copiedToast ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{locale === "te" ? "కాపీ చేయబడింది!" : "Copied to Clipboard!"}</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>{locale === "te" ? "సారాంశం కాపీ చేయి" : "Share Weekly Digest"}</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 6 Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Calories */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{t.insights.avgCalories}</span>
          </div>
          <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {digest.avgCalories}{" "}
            <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {digest.targetCaloriesMin}-{digest.targetCaloriesMax} target
          </span>
        </div>

        {/* 2. Protein */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>{t.insights.avgProtein}</span>
          </div>
          <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {digest.avgProteinG} <span className="text-xs font-normal text-slate-400">g</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {digest.targetProteinMinG}-{digest.targetProteinMaxG}g target
          </span>
        </div>

        {/* 3. Steps */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Footprints className="h-4 w-4 text-emerald-500" />
            <span>{t.insights.totalSteps}</span>
          </div>
          <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {digest.totalSteps.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">
            {digest.activeWorkoutDays} {locale === "te" ? "రోజులు" : "active days"}
          </span>
        </div>

        {/* 4. Weight Delta */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Scale className="h-4 w-4 text-emerald-600" />
            <span>{t.insights.weightTrend}</span>
          </div>
          <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {digest.latestWeightKg}{" "}
            <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
            <TrendingDown className="h-3 w-3" />
            {digest.weightDeltaKg > 0 ? `+${digest.weightDeltaKg}` : digest.weightDeltaKg} kg
          </span>
        </div>

        {/* 5. Waist Delta */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Ruler className="h-4 w-4 text-indigo-600" />
            <span>{t.insights.waistTrend}</span>
          </div>
          <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {digest.latestWaistCm}{" "}
            <span className="text-xs font-normal text-slate-400">cm</span>
          </div>
          <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400">
            {digest.waistDeltaCm > 0 ? `+${digest.waistDeltaCm}` : digest.waistDeltaCm} cm
          </span>
        </div>

        {/* 6. Blood Pressure */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <HeartPulse className="h-4 w-4 text-rose-500" />
            <span>{locale === "te" ? "రక్తపోటు సగటు" : "Avg BP"}</span>
          </div>
          <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
            {digest.avgSystolic}/{digest.avgDiastolic}
          </div>
          <span className="text-[10px] text-slate-500">resting mmHg</span>
        </div>
      </div>

      {/* Clinical Notices: Safe Fat-Loss Rate & Visceral Fat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t.insights.safeRateNotice}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800/50 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
          <Ruler className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t.insights.visceralNotice}</p>
        </div>
      </div>

      {/* Adherence Wins Section */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>{t.insights.adherenceWinsTitle}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {digest.adherenceWins.length === 0 ? (
            <p className="text-xs text-slate-500">
              {locale === "te"
                ? "లాగ్‌లు నమోదు చేయడం ప్రారంభించండి; మీ వారపు విజయాలు ఇక్కడ కనిపిస్తాయి."
                : "Keep logging daily; your habit consistency milestones will celebrate here."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="adherenceWinsList">
              {digest.adherenceWins.map((win) => (
                <div
                  key={win.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {locale === "te" ? win.titleTe : win.titleEn}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                    {locale === "te" ? win.detailTe : win.detailEn}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gentle Course Corrections Section */}
      {digest.courseCorrections.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span>{t.insights.courseCorrectionTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3" id="courseCorrectionsList">
              {digest.courseCorrections.map((cc) => (
                <div
                  key={cc.id}
                  className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 space-y-1"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                    {locale === "te" ? cc.titleTe : cc.titleEn}
                  </h4>
                  <p className="text-xs text-amber-800/90 dark:text-amber-200/80 leading-relaxed">
                    {locale === "te" ? cc.adviceTe : cc.adviceEn}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
