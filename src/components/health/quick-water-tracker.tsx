"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { getTodayDateString } from "@/lib/diet-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Droplets,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  Award,
  RotateCcw,
} from "lucide-react";

interface QuickWaterTrackerProps {
  dailyTargetMl?: number;
  onWaterUpdated?: (newTotal: number) => void;
}

export function QuickWaterTracker({
  dailyTargetMl = 3000,
  onWaterUpdated,
}: QuickWaterTrackerProps) {
  const { locale } = useI18n();

  const [waterMl, setWaterMl] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const storageKey = `fit90_water_${getTodayDateString()}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const val = Number(saved);
        setWaterMl(val);
        if (val >= dailyTargetMl) setShowCelebration(true);
      }
    }
  }, [storageKey, dailyTargetMl]);

  const playDropletChime = () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      // High frequency upward droplet sound
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  };

  const updateWater = (delta: number) => {
    const newTotal = Math.max(waterMl + delta, 0);
    setWaterMl(newTotal);

    if (delta > 0) {
      playDropletChime();
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, String(newTotal));
    }

    if (newTotal >= dailyTargetMl && waterMl < dailyTargetMl) {
      setShowCelebration(true);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate([80, 50, 80]);
        } catch {}
      }
    }

    if (onWaterUpdated) onWaterUpdated(newTotal);
  };

  const percentage = Math.min(Math.round((waterMl / dailyTargetMl) * 100), 100);

  return (
    <Card className="rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-slate-50 dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-5 shadow-lg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {locale === "te" ? "రోజువారీ నీటి వినియోగం (1-ట్యాప్ ట్రాకర్)" : "Daily Hydration Tracker (1-Tap)"}
              </h3>
              {percentage >= 100 && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Target Met!
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {locale === "te"
                ? "మెటబాలిజం చురుగ్గా ఉండటానికి రోజుకు 3 లీటర్ల నీరు అవసరం"
                : "3 Liters daily to support metabolic rate and flush visceral toxins"}
            </p>
          </div>
        </div>

        {/* Total Display */}
        <div className="text-right">
          <span className="text-base sm:text-lg font-black text-cyan-700 dark:text-cyan-300">
            {waterMl} <span className="text-xs font-semibold text-slate-400">/ {dailyTargetMl} ml</span>
          </span>
          <span className="block text-[10px] font-bold text-slate-500">
            ({(waterMl / 1000).toFixed(1)}L / {(dailyTargetMl / 1000).toFixed(1)}L)
          </span>
        </div>
      </div>

      {/* Animated Fluid Progress Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-300">
            {locale === "te" ? "హైడ్రేషన్ స్థాయి" : "Hydration Level"}
          </span>
          <span className="text-cyan-700 dark:text-cyan-300">{percentage}%</span>
        </div>
        <div className="h-3.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 1-Tap Quick Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => updateWater(250)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-cyan-300 hover:border-cyan-500 text-cyan-800 dark:text-cyan-300 font-bold text-xs shadow-xs hover:bg-cyan-50 transition-all flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            <span>+250ml {locale === "te" ? "(గ్లాసు)" : "(Glass)"}</span>
          </button>

          <button
            type="button"
            onClick={() => updateWater(500)}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm shadow-cyan-600/20 active:scale-95 transition-all flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            <span>+500ml {locale === "te" ? "(బాటిల్)" : "(Bottle)"}</span>
          </button>

          <button
            type="button"
            onClick={() => updateWater(1000)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 hover:border-cyan-400 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-xs transition-all flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            <span>+1L</span>
          </button>
        </div>

        {waterMl > 0 && (
          <button
            type="button"
            onClick={() => updateWater(-250)}
            className="px-2 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center gap-0.5"
            title="Subtract 250ml"
          >
            <Minus className="h-3 w-3" />
            <span>250ml</span>
          </button>
        )}
      </div>

      {/* Target Met Celebration Notification */}
      {showCelebration && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Award className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            {locale === "te"
              ? "🎉 అభినందనలు! నేటి 3 లీటర్ల హైడ్రేషన్ లక్ష్యం విజయవంతంగా పూర్తయింది!"
              : "🎉 Congratulations! Daily 3-liter hydration target achieved!"}
          </span>
        </div>
      )}
    </Card>
  );
}
