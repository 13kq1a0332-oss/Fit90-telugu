"use client";

import React, { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  FoodItemNutrition,
  calculatePortionNutrition,
} from "@/lib/data/food-catalog";
import { MealType } from "@/lib/diet-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { X, Flame, Dumbbell, IndianRupee, Sparkles, Scale, Info } from "lucide-react";

interface PortionCalculatorModalProps {
  food: FoodItemNutrition | null;
  isOpen: boolean;
  onClose: () => void;
  onLog: (data: {
    food: FoodItemNutrition;
    portionG: number;
    unitLabel: string;
    mealType: MealType;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
    estimatedCostInr: number;
  }) => void;
  initialMealType?: MealType;
}

export function PortionCalculatorModal({
  food,
  isOpen,
  onClose,
  onLog,
  initialMealType = "lunch",
}: PortionCalculatorModalProps) {
  const { locale } = useI18n();

  const [portionGrams, setPortionGrams] = useState<number>(food?.standardServingG || 100);
  const [selectedUnitLabel, setSelectedUnitLabel] = useState<string>(
    food ? (locale === "te" ? food.servingUnitTe : food.servingUnitEn) : "100g"
  );
  const [mealType, setMealType] = useState<MealType>(initialMealType);

  // Update defaults when food changes
  React.useEffect(() => {
    if (food) {
      setPortionGrams(food.standardServingG);
      setSelectedUnitLabel(locale === "te" ? food.servingUnitTe : food.servingUnitEn);
    }
  }, [food, locale]);

  const nutrition = useMemo(() => {
    if (!food) return null;
    return calculatePortionNutrition(food, portionGrams);
  }, [food, portionGrams]);

  if (!isOpen || !food || !nutrition) return null;

  const handleSelectMeasure = (grams: number, label: string) => {
    setPortionGrams(grams);
    setSelectedUnitLabel(label);
  };

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    onLog({
      food,
      portionG: portionGrams,
      unitLabel: selectedUnitLabel,
      mealType,
      calories: nutrition.calories,
      proteinG: nutrition.proteinG,
      carbsG: nutrition.carbsG,
      fatG: nutrition.fatG,
      fiberG: nutrition.fiberG,
      estimatedCostInr: nutrition.estimatedCostInr,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                food.state === "cooked"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {food.state === "cooked" ? "Cooked / వండినది" : "Raw / పచ్చిది"}
            </span>
            <span className="text-xs text-slate-400 font-medium capitalize">
              {food.category.replace("_", " ")}
            </span>
          </div>

          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            {locale === "te" ? food.nameTe : food.nameEn}
          </CardTitle>
          <p className="text-xs text-slate-500">
            {locale === "te" ? food.nameEn : food.nameTe}
          </p>
        </CardHeader>

        <form onSubmit={handleLog}>
          <CardContent className="space-y-4 pt-1">
            {/* Meal Type Selector */}
            <div>
              <Label htmlFor="portionMealType">
                {locale === "te" ? "భోజన సమయం ఎంచుకోండి" : "Select Meal Time"}
              </Label>
              <Select
                id="portionMealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
              >
                <option value="breakfast">
                  {locale === "te" ? "అల్పాహారం / టిఫిన్ (Breakfast)" : "Breakfast"}
                </option>
                <option value="lunch">
                  {locale === "te" ? "మధ్యాహ్న భోజనం (Lunch)" : "Lunch"}
                </option>
                <option value="evening_snack">
                  {locale === "te" ? "సాయంత్రం స్నాక్స్ (Evening Snack)" : "Evening Snack"}
                </option>
                <option value="dinner">
                  {locale === "te" ? "రాత్రి భోజనం (Dinner)" : "Dinner"}
                </option>
              </Select>
            </div>

            {/* Traditional Household Measurement Buttons */}
            <div>
              <Label className="text-xs text-slate-600 block mb-1.5 font-semibold">
                {locale === "te"
                  ? "సాంప్రదాయ ఇంటి కొలతలు (త్వరిత ఎంపిక)"
                  : "Traditional Indian Household Measures"}
              </Label>
              <div className="flex flex-wrap gap-2">
                {food.householdMeasures.map((m) => {
                  const isSelected = portionGrams === m.grams;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        handleSelectMeasure(
                          m.grams,
                          locale === "te" ? m.nameTe : m.nameEn
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {locale === "te" ? m.nameTe : m.nameEn} ({m.grams}g)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exact Gram Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="exactGrams" className="mb-0">
                  {locale === "te" ? "ఖచ్చితమైన గ్రాములు (గ్రా)" : "Exact Portion (grams)"}
                </Label>
                <span className="text-xs text-slate-400">
                  {portionGrams}g portion
                </span>
              </div>
              <Input
                id="exactGrams"
                type="number"
                step="5"
                min={10}
                max={1500}
                value={portionGrams}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPortionGrams(val);
                  setSelectedUnitLabel(`${val}g`);
                }}
              />
            </div>

            {/* Dynamically Scaled Calculated Nutrition Preview Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-3 border-b border-emerald-200/60 pb-2">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                  {locale === "te" ? "లెక్కింపబడిన పోషక విలువలు" : "Calculated Portion Nutrition"}
                </span>
                <span className="text-xs font-bold text-emerald-800 flex items-center">
                  <IndianRupee className="h-3.5 w-3.5 inline" />
                  <span>{nutrition.estimatedCostInr} est. cost</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-center gap-1 text-orange-600 text-[10px] font-bold">
                    <Flame className="h-3 w-3" />
                    <span>CALORIES</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {nutrition.calories} <span className="text-[10px] font-normal text-slate-400">kcal</span>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 text-[10px] font-bold">
                    <Dumbbell className="h-3 w-3" />
                    <span>PROTEIN</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {nutrition.proteinG} <span className="text-[10px] font-normal text-slate-400">g</span>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-bold text-amber-600">CARBS</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {nutrition.carbsG} <span className="text-[10px] font-normal text-slate-400">g</span>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-bold text-indigo-600">FIBER</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {nutrition.fiberG} <span className="text-[10px] font-normal text-slate-400">g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Educational Note on Cooked vs Raw */}
            {food.notesEn && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 dark:bg-slate-800/60 dark:border-slate-700">
                <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>{locale === "te" ? food.notesTe : food.notesEn}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {locale === "te" ? "రద్దు చేయండి" : "Cancel"}
            </Button>
            <Button type="submit" variant="primary" className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>
                {locale === "te" ? "డైరీలో నమోదు చేయండి" : "Log to Food Diary"}
              </span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

