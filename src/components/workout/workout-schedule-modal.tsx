"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  WorkoutScheduleConfig,
  getWorkoutScheduleConfig,
  updateWorkoutScheduleConfig,
} from "@/lib/workout-store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, X, Settings2, Check, Info } from "lucide-react";

interface WorkoutScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function WorkoutScheduleModal({
  isOpen,
  onClose,
  onSaved,
}: WorkoutScheduleModalProps) {
  const { locale, t } = useI18n();
  const currentConfig = getWorkoutScheduleConfig();

  const [daysPerWeek, setDaysPerWeek] = useState<number>(currentConfig.daysPerWeek);
  const [preferredDays, setPreferredDays] = useState<number[]>(currentConfig.preferredDays);
  const [activeWeek, setActiveWeek] = useState<number>(currentConfig.activeWeek);

  if (!isOpen) return null;

  const daysOfWeek = [
    { num: 1, labelEn: "Mon", labelTe: "సోమ" },
    { num: 2, labelEn: "Tue", labelTe: "మంగళ" },
    { num: 3, labelEn: "Wed", labelTe: "బుధ" },
    { num: 4, labelEn: "Thu", labelTe: "గురు" },
    { num: 5, labelEn: "Fri", labelTe: "శుక్ర" },
    { num: 6, labelEn: "Sat", labelTe: "శని" },
    { num: 0, labelEn: "Sun", labelTe: "ఆది" },
  ];

  const handleToggleDay = (dayNum: number) => {
    if (preferredDays.includes(dayNum)) {
      if (preferredDays.length > 2) {
        setPreferredDays(preferredDays.filter((d) => d !== dayNum));
      }
    } else {
      setPreferredDays([...preferredDays, dayNum]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkoutScheduleConfig({
      daysPerWeek,
      preferredDays,
      activeWeek,
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handleSave}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-emerald-600" />
              <span>{t.workouts.scheduleTitle}</span>
            </CardTitle>
            <p className="text-xs text-slate-500">
              {locale === "te"
                ? "మీ సౌలభ్యాన్ని బట్టి వారానికి ఎన్ని రోజులు వ్యాయామం చేయాలో ఎంచుకోండి"
                : "Customize your weekly movement frequency to fit your lifestyle"}
            </p>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            {/* Days per week buttons */}
            <div>
              <Label className="block mb-1.5 font-semibold">
                {t.workouts.daysPerWeek}
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDaysPerWeek(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      daysPerWeek === num
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {num} {locale === "te" ? "రోజులు" : "Days"}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Days Picker */}
            <div>
              <Label className="block mb-1.5 font-semibold">
                {locale === "te" ? "ఇష్టపడే రోజులు (ఎంచుకోండి)" : "Preferred Active Days"}
              </Label>
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map((d) => {
                  const isSelected = preferredDays.includes(d.num);
                  return (
                    <button
                      key={d.num}
                      type="button"
                      onClick={() => handleToggleDay(d.num)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {locale === "te" ? d.labelTe : d.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Progression Week Dropdown */}
            <div>
              <Label htmlFor="activeWeekSelect" className="block mb-1.5 font-semibold">
                {locale === "te" ? "ప్రస్తుత నడక వారం (1 నుండి 13)" : "Current Active Progression Week"}
              </Label>
              <select
                id="activeWeekSelect"
                value={activeWeek}
                onChange={(e) => setActiveWeek(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {Array.from({ length: 13 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {locale === "te" ? `వారం ${i + 1} / 13` : `Week ${i + 1} of 13`}
                  </option>
                ))}
              </select>
            </div>

            {/* Rest Day Explanation */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 flex items-start gap-2 text-blue-900 dark:text-blue-200">
              <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
              <p className="leading-relaxed">
                {locale === "te"
                  ? "కనీసం 1-2 రోజులు విశ్రాంతి రోజులుగా ఉండాలి. విశ్రాంతి సమయంలోనే కండరాలు బలపడతాయి మరియు కీళ్ల అలసట తగ్గుతుంది."
                  : "Adequate recovery (at least 1-2 rest days/week) is essential for muscle glycogen replenishment and connective tissue adaptation."}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {locale === "te" ? "రద్దు చేయండి" : "Cancel"}
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {locale === "te" ? "సేవ్ చేయండి" : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

