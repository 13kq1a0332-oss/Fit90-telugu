"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  LoggedFoodEntry,
  MealType,
  getFoodLogsForDate,
  deleteFoodLogEntry,
  computeDailyNutritionTotals,
  getTodayDateString,
} from "@/lib/diet-store";
import { getUserProfileAndGoal } from "@/lib/profile-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  IndianRupee,
  Utensils,
  Sun,
  Sunrise,
  Sunset,
  Moon,
} from "lucide-react";

interface DailyFoodLogProps {
  onOpenCatalogForMeal?: (meal: MealType) => void;
  refreshTrigger?: number;
}

export function DailyFoodLog({
  onOpenCatalogForMeal,
  refreshTrigger = 0,
}: DailyFoodLogProps) {
  const { locale, t } = useI18n();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [logs, setLogs] = useState<LoggedFoodEntry[]>([]);
  const [calorieTarget, setCalorieTarget] = useState<number>(2100);
  const [proteinTarget, setProteinTarget] = useState<number>(110);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user profile targets
  useEffect(() => {
    async function loadTargets() {
      try {
        const { goal } = await getUserProfileAndGoal();
        if (goal?.calorieTargetMin && goal?.calorieTargetMax) {
          setCalorieTarget(
            Math.round((goal.calorieTargetMin + goal.calorieTargetMax) / 2)
          );
        }
        if (goal?.proteinTargetMinG && goal?.proteinTargetMaxG) {
          setProteinTarget(
            Math.round((goal.proteinTargetMinG + goal.proteinTargetMaxG) / 2)
          );
        }
      } catch {
        // use default fallback
      }
    }
    loadTargets();
  }, []);

  // Fetch logs for current date
  const loadLogs = useCallback(async () => {
    setLoading(true);
    const dayLogs = await getFoodLogsForDate(selectedDate);
    setLogs(dayLogs);
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs, refreshTrigger]);

  const handleDelete = async (id: string) => {
    await deleteFoodLogEntry(id, selectedDate);
    await loadLogs();
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const totals = computeDailyNutritionTotals(logs);

  const mealSections: {
    type: MealType;
    titleEn: string;
    titleTe: string;
    icon: any;
    color: string;
  }[] = [
    {
      type: "breakfast",
      titleEn: "Breakfast",
      titleTe: "ఉదయం అల్పాహారం (టిఫిన్)",
      icon: Sunrise,
      color: "text-amber-500",
    },
    {
      type: "lunch",
      titleEn: "Lunch",
      titleTe: "మధ్యాహ్న భోజనం",
      icon: Sun,
      color: "text-emerald-600",
    },
    {
      type: "evening_snack",
      titleEn: "Evening Snack",
      titleTe: "సాయంత్రం అల్పాహారం",
      icon: Sunset,
      color: "text-orange-500",
    },
    {
      type: "dinner",
      titleEn: "Dinner",
      titleTe: "రాత్రి భోజనం",
      icon: Moon,
      color: "text-indigo-500",
    },
  ];

  const caloriePct = Math.min(Math.round((totals.calories / calorieTarget) * 100), 100);
  const proteinPct = Math.min(Math.round((totals.proteinG / proteinTarget) * 100), 100);

  return (
    <div className="space-y-5">
      {/* Date Header Switcher */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevDay}
          className="h-8 w-8 p-0"
          aria-label="Previous Day"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            {selectedDate === getTodayDateString()
              ? locale === "te"
                ? `ఈరోజు (${selectedDate})`
                : `Today (${selectedDate})`
              : selectedDate}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextDay}
          className="h-8 w-8 p-0"
          aria-label="Next Day"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Daily Progress Summary Card */}
      <Card className="border-emerald-100 dark:border-emerald-950/40 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/10 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>{t.diet.dailyTotal}</span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              ₹{totals.estimatedCostInr} {locale === "te" ? "నేటి ఖర్చు" : "estimated today"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Calorie & Protein Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Calories Progress */}
            <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Flame className="h-4 w-4 text-amber-500" />
                  {t.diet.calorieGoal}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {totals.calories} / {calorieTarget} kcal
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    totals.calories > calorieTarget
                      ? "bg-amber-500"
                      : "bg-emerald-600"
                  }`}
                  style={{ width: `${caloriePct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{caloriePct}%</span>
                <span>
                  {totals.calories < calorieTarget
                    ? `${calorieTarget - totals.calories} kcal remaining`
                    : "Target met"}
                </span>
              </div>
            </div>

            {/* Protein Progress */}
            <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Dumbbell className="h-4 w-4 text-emerald-600" />
                  {t.diet.proteinGoal}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {totals.proteinG}g / {proteinTarget}g
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${proteinPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{proteinPct}%</span>
                <span>
                  {totals.proteinG < proteinTarget
                    ? `${Math.round(proteinTarget - totals.proteinG)}g remaining`
                    : "Target met"}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Macro Stats: Carbs, Fat, Fiber */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">{t.diet.carbs}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totals.carbsG}g
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">{t.diet.fat}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totals.fatG}g
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">{t.diet.fiber}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totals.fiberG}g
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Breakdown Sections */}
      <div className="space-y-4">
        {mealSections.map((meal) => {
          const Icon = meal.icon;
          const mealLogs = logs.filter((l) => l.mealType === meal.type);
          const mealCalories = mealLogs.reduce((acc, cur) => acc + cur.calories, 0);
          const mealProtein = Math.round(
            mealLogs.reduce((acc, cur) => acc + cur.proteinG, 0) * 10
          ) / 10;

          return (
            <Card
              key={meal.type}
              className="border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
            >
              <CardHeader className="py-3 px-4 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${meal.color}`} />
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {locale === "te" ? meal.titleTe : meal.titleEn}
                  </span>
                  {mealLogs.length > 0 && (
                    <span className="text-xs text-slate-500 font-normal">
                      ({mealCalories} kcal • {mealProtein}g protein)
                    </span>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenCatalogForMeal && onOpenCatalogForMeal(meal.type)}
                  className="h-8 px-2.5 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  {t.diet.addFood}
                </Button>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/60">
                {mealLogs.length > 0 ? (
                  mealLogs.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {locale === "te" ? entry.foodNameTe : entry.foodNameEn}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {entry.portionG}g ({entry.portionUnitLabel}) • {entry.loggedTime}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {entry.calories} kcal
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {entry.proteinG}g protein
                          </span>
                        </div>

                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label={t.diet.deleteFood}
                          title={t.diet.deleteFood}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 px-4 text-center text-xs text-slate-400">
                    <p>{t.diet.emptyMeal}</p>
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
