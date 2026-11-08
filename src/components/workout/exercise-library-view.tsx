"use client";

import React, { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import { EXERCISE_LIBRARY, ExerciseItem, getExerciseById } from "@/lib/data/workout-catalog";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, ShieldCheck, Dumbbell, ArrowRightLeft, Sparkles, Info } from "lucide-react";

export function ExerciseLibraryView() {
  const { locale, t } = useI18n();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", labelEn: "All Exercises", labelTe: "అన్ని కసరత్తులు" },
    { id: "knee_friendly", labelEn: "Knee-Safe", labelTe: "మోకాలికి రక్షణ" },
    { id: "strength", labelEn: "Upper & Lower Body", labelTe: "శరీర దారుఢ్యం" },
  ];

  const filtered = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      if (selectedCategory !== "all" && ex.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const mEn = ex.nameEn.toLowerCase().includes(q) || ex.targetMusclesEn.toLowerCase().includes(q);
        const mTe = ex.nameTe.includes(q) || ex.targetMusclesTe.includes(q);
        return mEn || mTe;
      }
      return true;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder={
            locale === "te"
              ? "కసరత్తు పేరు లేదా కండరాన్ని వెతకండి (ఉదా: కుర్చీ, భుజాలు, పుష్-అప్)..."
              : "Search exercises by name or muscle (e.g. squat, wall, core)..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {locale === "te" ? cat.labelTe : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((exercise) => {
          const alternative = exercise.kneeAlternativeId
            ? getExerciseById(exercise.kneeAlternativeId)
            : null;

          return (
            <Card
              key={exercise.id}
              className="border-slate-200 dark:border-slate-800 hover:border-emerald-300 shadow-xs"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {locale === "te" ? exercise.nameTe : exercise.nameEn}
                    </h4>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      {locale === "te" ? exercise.nameEn : exercise.nameTe}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {exercise.defaultSets} × {exercise.defaultReps} {locale === "te" ? "రెప్స్" : "reps"}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    🎯 {locale === "te" ? "ప్రభావిత కండరాలు:" : "Target Muscles:"}
                  </span>{" "}
                  {locale === "te" ? exercise.targetMusclesTe : exercise.targetMusclesEn}
                </div>

                {/* Step Instructions */}
                <div className="text-xs space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                    {locale === "te" ? "చేసే విధానం:" : "Instructions:"}
                  </span>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {(locale === "te" ? exercise.instructionsTe : exercise.instructionsEn).map(
                      (inst, i) => (
                        <li key={i}>{inst}</li>
                      )
                    )}
                  </ol>
                </div>

                {/* Knee Pain Alternative note if present */}
                {alternative && (
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <ArrowRightLeft className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>
                      {locale === "te"
                        ? `మోకాలి నొప్పి ఉంటే: ${alternative.nameTe} కు మారండి.`
                        : `Knee pain alternative: ${alternative.nameEn}`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

