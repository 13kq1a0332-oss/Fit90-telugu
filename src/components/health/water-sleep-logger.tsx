"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  getWaterTotalForDate,
  addWaterLog,
  resetWaterForDate,
  getSleepLogForDate,
  saveSleepLog,
} from "@/lib/health-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Droplet,
  Moon,
  Plus,
  RotateCcw,
  Star,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

interface WaterSleepLoggerProps {
  onDataChanged?: () => void;
}

export function WaterSleepLogger({ onDataChanged }: WaterSleepLoggerProps) {
  const { locale, t } = useI18n();
  const today = new Date().toISOString().slice(0, 10);

  // Water state
  const [waterTotalMl, setWaterTotalMl] = useState<number>(0);
  const waterTargetMl = 3500; // Calibrated hydration target for high-BMI profile

  // Sleep state
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepQuality, setSleepQuality] = useState<number>(4);
  const [snoringReported, setSnoringReported] = useState<boolean>(false);
  const [sleepSavedToast, setSleepSavedToast] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      const water = await getWaterTotalForDate(today);
      setWaterTotalMl(water);

      const sleep = await getSleepLogForDate(today);
      if (sleep) {
        setSleepHours(sleep.durationHours);
        setSleepQuality(sleep.qualityScore);
        setSnoringReported(sleep.snoringReported);
      }
    }
    loadData();
  }, [today]);

  const handleAddWater = async (amount: number) => {
    const newTotal = await addWaterLog(amount, today);
    setWaterTotalMl(newTotal);
    if (onDataChanged) onDataChanged();
  };

  const handleResetWater = async () => {
    await resetWaterForDate(today);
    setWaterTotalMl(0);
    if (onDataChanged) onDataChanged();
  };

  const handleSaveSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSleepLog({
      durationHours: sleepHours,
      qualityScore: sleepQuality,
      snoringReported,
      loggedDate: today,
    });
    setSleepSavedToast(true);
    setTimeout(() => setSleepSavedToast(false), 3000);
    if (onDataChanged) onDataChanged();
  };

  const waterPct = Math.min(Math.round((waterTotalMl / waterTargetMl) * 100), 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Daily Hydration Card */}
      <Card className="border-blue-200 dark:border-blue-900 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500 fill-blue-500" />
              <span>{t.health.waterGoal}</span>
            </CardTitle>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              {waterTotalMl} / {waterTargetMl} ml
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${waterPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{waterPct}%</span>
              <span>
                {waterTotalMl < waterTargetMl
                  ? `${waterTargetMl - waterTotalMl} ml remaining`
                  : "Target Met!"}
              </span>
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex items-center gap-2">
            <Button
              id="addWaterGlassBtn"
              size="sm"
              onClick={() => handleAddWater(250)}
              className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t.health.waterGlass}
            </Button>

            <Button
              id="addWaterBottleBtn"
              size="sm"
              variant="outline"
              onClick={() => handleAddWater(500)}
              className="flex-1 text-xs text-blue-700 border-blue-300 hover:bg-blue-50 dark:text-blue-400"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t.health.waterBottle}
            </Button>

            {waterTotalMl > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleResetWater}
                className="h-9 w-9 p-0 text-slate-400 hover:text-slate-600"
                title={t.health.waterReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Sleep & Snoring Card */}
      <Card className="border-indigo-200 dark:border-indigo-900 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-500" />
            <span>{locale === "te" ? "నిద్ర & శ్వాస ట్రాకర్" : "Sleep & Airway Quality"}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSaveSleep} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              {/* Duration */}
              <div>
                <Label htmlFor="sleepHoursInput" className="font-semibold mb-1 block">
                  {t.health.sleepHours}
                </Label>
                <Input
                  id="sleepHoursInput"
                  type="number"
                  step="0.5"
                  min={1}
                  max={16}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  required
                />
              </div>

              {/* Quality 1-5 Stars */}
              <div>
                <Label className="font-semibold mb-1 block">
                  {t.health.sleepQuality}
                </Label>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSleepQuality(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= sleepQuality ? "fill-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Snoring Checkbox */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="snoringCheck"
                  type="checkbox"
                  checked={snoringReported}
                  onChange={(e) => setSnoringReported(e.target.checked)}
                  className="h-4 w-4 rounded accent-indigo-600"
                />
                <Label
                  htmlFor="snoringCheck"
                  className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer mb-0"
                >
                  {t.health.snoringQuestion}
                </Label>
              </div>

              {snoringReported && (
                <div className="text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5 pt-1">
                  <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <p className="leading-relaxed">{t.health.snoringNotice}</p>
                </div>
              )}
            </div>

            <Button
              id="saveSleepBtn"
              type="submit"
              size="sm"
              className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {sleepSavedToast ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-emerald-300" />
                  {locale === "te" ? "సేవ్ చేయబడింది!" : "Sleep Logged!"}
                </>
              ) : (
                t.health.logSleep
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
