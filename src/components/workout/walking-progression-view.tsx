"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  WALKING_13_WEEK_PLAN,
  WalkingWeekPlan,
} from "@/lib/data/workout-catalog";
import {
  getWorkoutScheduleConfig,
  updateWorkoutScheduleConfig,
} from "@/lib/workout-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Footprints,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  HeartPulse,
  Sparkles,
  Info,
  Flame,
} from "lucide-react";

interface WalkingProgressionViewProps {
  onLogWalkClick?: (week: WalkingWeekPlan) => void;
}

export function WalkingProgressionView({ onLogWalkClick }: WalkingProgressionViewProps) {
  const { locale, t } = useI18n();
  const scheduleConfig = getWorkoutScheduleConfig();
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(
    scheduleConfig.activeWeek || 1
  );

  const selectedWeek =
    WALKING_13_WEEK_PLAN.find((w) => w.weekNumber === selectedWeekNum) ||
    WALKING_13_WEEK_PLAN[0];

  const handleSetActiveWeek = (weekNum: number) => {
    updateWorkoutScheduleConfig({ activeWeek: weekNum });
    setSelectedWeekNum(weekNum);
  };

  const phases = [
    { id: 1, nameEn: "Phase 1: Foundation (W1-3)", nameTe: "దశ 1: అలవాటు (వారాలు 1-3)" },
    { id: 2, nameEn: "Phase 2: Aerobic Build (W4-6)", nameTe: "దశ 2: సామర్థ్యం (వారాలు 4-6)" },
    { id: 3, nameEn: "Phase 3: Acceleration (W7-9)", nameTe: "దశ 3: వేగవంతం (వారాలు 7-9)" },
    { id: 4, nameEn: "Phase 4: Peak Fat-Loss (W10-13)", nameTe: "దశ 4: స్థిరత్వం (వారాలు 10-13)" },
  ];

  return (
    <div className="space-y-4">
      {/* Active Week Hero Card */}
      <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-r from-emerald-500/10 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                  {locale === "te"
                    ? `13 వారాలలో ${selectedWeek.weekNumber}వ వారం`
                    : `Week ${selectedWeek.weekNumber} of 13`}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {locale === "te" ? selectedWeek.phaseNameTe : selectedWeek.phaseNameEn}
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                <Footprints className="h-5 w-5 text-emerald-600" />
                <span>
                  {locale === "te"
                    ? `రోజూ ${selectedWeek.targetMinutesDaily} నిమిషాల నడక (~${selectedWeek.targetStepsDaily.toLocaleString()} అడుగులు)`
                    : `${selectedWeek.targetMinutesDaily} Mins Daily Walk (~${selectedWeek.targetStepsDaily.toLocaleString()} Steps)`}
                </span>
              </CardTitle>
            </div>

            <Button
              size="sm"
              onClick={() => onLogWalkClick && onLogWalkClick(selectedWeek)}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs shrink-0"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {locale === "te" ? "నేటి నడకను నమోదు చేయండి" : "Log Today's Walk"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Metric Chips */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
              <Clock className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">
                {locale === "te" ? "సమయం" : "Duration"}
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {selectedWeek.targetMinutesDaily} {locale === "te" ? "నిమిషాలు" : "mins"}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
              <Footprints className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">
                {locale === "te" ? "రోజువారీ అడుగులు" : "Daily Target"}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {selectedWeek.targetStepsDaily.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
              <Calendar className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">
                {locale === "te" ? "వారపు రోజులు" : "Frequency"}
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {selectedWeek.daysPerWeek} {locale === "te" ? "రోజులు" : "days/wk"}
              </span>
            </div>
          </div>

          {/* Form and Clinical Advice */}
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                👟 {locale === "te" ? "నడక సూచనలు & భంగిమ:" : "Stride & Posture Guidance:"}
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {locale === "te" ? selectedWeek.instructionsTe : selectedWeek.instructionsEn}
              </p>
            </div>

            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5 flex items-center gap-1">
                <HeartPulse className="h-3.5 w-3.5 text-emerald-600" />
                {locale === "te" ? "వైద్య & జీవక్రియ ప్రయోజనం:" : "Clinical & Metabolic Rationale:"}
              </span>
              <p className="text-emerald-900/90 dark:text-emerald-300/90 leading-relaxed">
                {locale === "te" ? selectedWeek.clinicalNoteTe : selectedWeek.clinicalNoteEn}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Selector Grid (1 to 13) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {locale === "te" ? "13 వారాల ప్రయాణ ప్రణాళిక" : "13-Week Walking Progression Roadmap"}
          </h4>
          <span className="text-xs text-slate-500">
            {locale === "te" ? "వారాన్ని ఎంచుకోండి" : "Select a week to review"}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {WALKING_13_WEEK_PLAN.map((plan) => {
            const isSelected = plan.weekNumber === selectedWeekNum;
            const isCurrentActive = plan.weekNumber === (scheduleConfig.activeWeek || 1);

            return (
              <button
                key={plan.weekNumber}
                onClick={() => setSelectedWeekNum(plan.weekNumber)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="text-[10px] font-medium opacity-80">
                  {locale === "te" ? "వారం" : "Wk"}
                </div>
                <div className="text-base font-black">{plan.weekNumber}</div>
                <div className="text-[10px] mt-0.5 truncate">
                  {plan.targetMinutesDaily}m • {Math.round(plan.targetStepsDaily / 1000)}k
                </div>
              </button>
            );
          })}
        </div>

        {selectedWeekNum !== scheduleConfig.activeWeek && (
          <div className="mt-3 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetActiveWeek(selectedWeekNum)}
              className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400"
            >
              {locale === "te"
                ? `వారం ${selectedWeekNum}ని నా ప్రస్తుత వారంగా సెట్ చేయి`
                : `Set Week ${selectedWeekNum} as My Current Active Week`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

