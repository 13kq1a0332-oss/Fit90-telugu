"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  ActiveMealPlan,
  getActiveMealPlan,
  updateMealPlanItemSubstitution,
  calculateMealPlanTotals,
  addFoodLogEntry,
  getTodayDateString,
  DEFAULT_SAMPLE_MEAL_PLAN,
} from "@/lib/diet-store";
import {
  getFoodItemById,
  calculatePortionNutrition,
} from "@/lib/data/food-catalog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Sparkles,
  Flame,
  Dumbbell,
  ArrowRightLeft,
  Check,
  RotateCcw,
  PlusCircle,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Info,
} from "lucide-react";

interface MealPlanViewProps {
  onPlanChanged?: () => void;
  onItemLogged?: () => void;
}

export function MealPlanView({ onPlanChanged, onItemLogged }: MealPlanViewProps) {
  const { locale, t } = useI18n();
  const [mealPlan, setMealPlan] = useState<ActiveMealPlan>(getActiveMealPlan());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMealPlan(getActiveMealPlan());
  }, []);

  const totals = calculateMealPlanTotals(mealPlan);

  const handleSubstitution = (planItemId: string, newFoodItemId: string) => {
    const updated = updateMealPlanItemSubstitution(planItemId, newFoodItemId);
    setMealPlan(updated);
    if (onPlanChanged) onPlanChanged();

    const newFood = getFoodItemById(newFoodItemId);
    showToast(
      locale === "te"
        ? `ప్రత్యామ్నాయం మార్చబడింది: ${newFood?.nameTe}`
        : `Swapped to: ${newFood?.nameEn}`
    );
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fit90_active_meal_plan");
    }
    setMealPlan(DEFAULT_SAMPLE_MEAL_PLAN);
    if (onPlanChanged) onPlanChanged();
    showToast(
      locale === "te"
        ? "భోజన ప్రణాళిక ప్రారంభ స్థితికి రీసెట్ చేయబడింది"
        : "Meal plan reset to default recommendations"
    );
  };

  const handleLogPlanItem = async (planItem: ActiveMealPlan["items"][0]) => {
    const food = getFoodItemById(planItem.activeFoodItemId);
    if (!food) return;

    const nut = calculatePortionNutrition(food, planItem.activePortionG);

    await addFoodLogEntry({
      foodItemId: food.id,
      foodNameEn: food.nameEn,
      foodNameTe: food.nameTe,
      mealType: planItem.mealType,
      portionG: planItem.activePortionG,
      portionUnitLabel: locale === "te" ? planItem.defaultUnitTe : planItem.defaultUnitEn,
      calories: nut.calories,
      proteinG: nut.proteinG,
      carbsG: nut.carbsG,
      fatG: nut.fatG,
      fiberG: nut.fiberG,
      estimatedCostInr: nut.estimatedCostInr,
      loggedDate: getTodayDateString(),
      loggedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    showToast(
      locale === "te"
        ? `${food.nameTe} నేటి డైరీలో నమోదు చేయబడింది!`
        : `Logged ${food.nameEn} to today's diary!`
    );

    if (onItemLogged) onItemLogged();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const mealGroups = [
    {
      type: "breakfast",
      titleEn: "Breakfast (~8:00 AM)",
      titleTe: "ఉదయం అల్పాహారం (~8:00 AM)",
      icon: Sunrise,
      color: "text-amber-500",
      items: mealPlan.items.filter((i) => i.mealType === "breakfast"),
    },
    {
      type: "lunch",
      titleEn: "Lunch (~1:00 PM)",
      titleTe: "మధ్యాహ్న భోజనం (~1:00 PM)",
      icon: Sun,
      color: "text-emerald-600",
      items: mealPlan.items.filter((i) => i.mealType === "lunch"),
    },
    {
      type: "evening_snack",
      titleEn: "Evening Snack (~5:00 PM)",
      titleTe: "సాయంత్రం అల్పాహారం (~5:00 PM)",
      icon: Sunset,
      color: "text-orange-500",
      items: mealPlan.items.filter((i) => i.mealType === "evening_snack"),
    },
    {
      type: "dinner",
      titleEn: "Dinner (~8:00 PM)",
      titleTe: "రాత్రి భోజనం (~8:00 PM)",
      icon: Moon,
      color: "text-indigo-500",
      items: mealPlan.items.filter((i) => i.mealType === "dinner"),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Plan Header Card */}
      <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-r from-emerald-500/10 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                {locale === "te" ? mealPlan.titleTe : mealPlan.titleEn}
              </CardTitle>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t.diet.mealPlanSubtitle}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs h-8 text-slate-600 border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:border-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              {locale === "te" ? "రీసెట్" : "Reset"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Plan Macro Summary Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-400 block">{t.diet.calorieGoal}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {totals.calories} kcal
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                Target: {mealPlan.targetCaloriesMin}-{mealPlan.targetCaloriesMax}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-400 block">{t.diet.proteinGoal}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {totals.proteinG}g
              </span>
              <span className="text-[10px] text-slate-400 block">
                Target: 100-120g
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-400 block">{t.diet.carbs}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {totals.carbsG}g
              </span>
              <span className="text-[10px] text-slate-400 block">Complex</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-400 block">{t.diet.fat} & {t.diet.fiber}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {totals.fatG}g / {totals.fiberG}g
              </span>
              <span className="text-[10px] text-slate-400 block">Healthy Lipids</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block">{t.diet.cost}</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                ₹{totals.costInrDaily} / day
              </span>
              <span className="text-[10px] text-slate-400 block">
                ~₹{totals.costInrDaily * 30} / month
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions callout */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          {locale === "te"
            ? "మీ ఆహార ప్రాధాన్యతలకు తగినట్లుగా కింద ఉన్న 'ప్రత్యామ్నాయాలు' డ్రాప్‌డౌన్ ద్వారా ఆహారాలను మార్చుకోవచ్చు. మీ క్యాలరీలు మరియు కిరాణా బడ్జెట్ స్వయంచాలకంగా సర్దుబాటు అవుతాయి."
            : "Customize your meals using the substitution dropdowns below. Daily calories, protein, and grocery lists will dynamically recalculate."}
        </p>
      </div>

      {/* Meal Groups */}
      <div className="space-y-4">
        {mealGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <Card key={group.type} className="border-slate-200 dark:border-slate-800 shadow-xs">
              <CardHeader className="py-2.5 px-4 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <GroupIcon className={`h-4 w-4 ${group.color}`} />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {locale === "te" ? group.titleTe : group.titleEn}
                  </h4>
                </div>
              </CardHeader>

              <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/60">
                {group.items.map((item) => {
                  const food = getFoodItemById(item.activeFoodItemId);
                  if (!food) return null;
                  const nut = calculatePortionNutrition(food, item.activePortionG);

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full border ${
                              food.isVegetarian
                                ? "bg-emerald-500 border-emerald-700"
                                : "bg-red-500 border-red-700"
                            }`}
                          />
                          <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {locale === "te" ? food.nameTe : food.nameEn}
                          </h5>
                          <span className="text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {item.activePortionG}g
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>{nut.calories} kcal</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">{nut.proteinG}g protein</span>
                          <span>•</span>
                          <span>₹{nut.estimatedCostInr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Substitution Dropdown */}
                        {item.allowedSubstitutionIds.length > 0 && (
                          <div className="flex items-center gap-1">
                            <ArrowRightLeft className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <select
                              value={item.activeFoodItemId}
                              onChange={(e) => handleSubstitution(item.id, e.target.value)}
                              className="text-xs py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[160px] sm:max-w-[200px]"
                              aria-label="Substitute Food"
                            >
                              <option value={item.foodItemId}>
                                {(() => {
                                  const original = getFoodItemById(item.foodItemId);
                                  return (locale === "te" ? original?.nameTe : original?.nameEn) || "Original";
                                })()}
                              </option>
                              {item.allowedSubstitutionIds.map((subId) => {
                                const subFood = getFoodItemById(subId);
                                if (!subFood) return null;
                                return (
                                  <option key={subId} value={subId}>
                                    {locale === "te" ? subFood.nameTe : subFood.nameEn}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}

                        {/* Quick Log button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLogPlanItem(item)}
                          className="text-xs h-8 px-2.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-700"
                        >
                          <PlusCircle className="h-3.5 w-3.5 mr-1" />
                          {locale === "te" ? "లాగ్ చేయి" : "Log"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

