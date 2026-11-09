"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { FoodCategory } from "@/lib/data/food-catalog";
import { saveCustomFood, CustomFoodInput } from "@/lib/data/custom-food-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import {
  X,
  Plus,
  Utensils,
  Sparkles,
  Flame,
  Dumbbell,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

interface AddCustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAdded: () => void;
}

export function AddCustomFoodModal({
  isOpen,
  onClose,
  onFoodAdded,
}: AddCustomFoodModalProps) {
  const { locale } = useI18n();

  const [nameEn, setNameEn] = useState("");
  const [nameTe, setNameTe] = useState("");
  const [category, setCategory] = useState<FoodCategory>("curry");
  const [state, setState] = useState<"cooked" | "raw">("cooked");
  const [servingUnitEn, setServingUnitEn] = useState("1 medium bowl (150g)");
  const [servingUnitTe, setServingUnitTe] = useState("1 గిన్నె (150గ్రా)");
  const [standardServingG, setStandardServingG] = useState<number>(150);

  const [calories, setCalories] = useState<number>(140);
  const [proteinG, setProteinG] = useState<number>(6);
  const [carbsG, setCarbsG] = useState<number>(18);
  const [fatG, setFatG] = useState<number>(5);
  const [fiberG, setFiberG] = useState<number>(3);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [estimatedCostInr, setEstimatedCostInr] = useState<number>(20);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset Auto-fill for Quick Estimation
  const applyPreset = (type: "veg_curry" | "dal" | "non_veg" | "tiffin" | "snack") => {
    if (type === "veg_curry") {
      setCategory("curry");
      setIsVegetarian(true);
      setStandardServingG(120);
      setServingUnitEn("1 katori / bowl (120g)");
      setServingUnitTe("1 గిన్నె (120గ్రా)");
      setCalories(110);
      setProteinG(3);
      setCarbsG(12);
      setFatG(6);
      setFiberG(3.5);
    } else if (type === "dal") {
      setCategory("dal");
      setIsVegetarian(true);
      setStandardServingG(150);
      setServingUnitEn("1 bowl (150g)");
      setServingUnitTe("1 గిన్నె (150గ్రా)");
      setCalories(165);
      setProteinG(9.5);
      setCarbsG(21);
      setFatG(4.5);
      setFiberG(5);
    } else if (type === "non_veg") {
      setCategory("curry");
      setIsVegetarian(false);
      setStandardServingG(150);
      setServingUnitEn("1 bowl / 3-4 pieces (150g)");
      setServingUnitTe("1 గిన్నె (150గ్రా)");
      setCalories(195);
      setProteinG(18.5);
      setCarbsG(4);
      setFatG(11);
      setFiberG(1);
    } else if (type === "tiffin") {
      setCategory("breakfast");
      setIsVegetarian(true);
      setStandardServingG(100);
      setServingUnitEn("1 piece / plate (100g)");
      setServingUnitTe("1 ప్లేట్ / ముక్క (100గ్రా)");
      setCalories(170);
      setProteinG(5);
      setCarbsG(30);
      setFatG(4);
      setFiberG(2);
    } else if (type === "snack") {
      setCategory("snack");
      setIsVegetarian(true);
      setStandardServingG(80);
      setServingUnitEn("1 small cup / bowl (80g)");
      setServingUnitTe("1 చిన్న కప్పు (80గ్రా)");
      setCalories(130);
      setProteinG(4);
      setCarbsG(18);
      setFatG(5);
      setFiberG(2);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!nameEn.trim()) {
      setErrorMsg(
        locale === "te"
          ? "దయచేసి వంటకం పేరు నమోదు చేయండి."
          : "Please enter the food name in English or Telugu."
      );
      return;
    }

    setIsSaving(true);
    try {
      const input: CustomFoodInput = {
        nameEn: nameEn.trim(),
        nameTe: nameTe.trim() || nameEn.trim(),
        category,
        state,
        calories: Number(calories) || 0,
        proteinG: Number(proteinG) || 0,
        carbsG: Number(carbsG) || 0,
        fatG: Number(fatG) || 0,
        fiberG: Number(fiberG) || 0,
        standardServingG: Number(standardServingG) || 100,
        servingUnitEn,
        servingUnitTe,
        estimatedCostInr: Number(estimatedCostInr) || 15,
        isVegetarian,
      };

      await saveCustomFood(input);
      setIsSaving(false);
      onFoodAdded();
      onClose();
    } catch (err) {
      setIsSaving(false);
      setErrorMsg("Failed to save custom food. Please check your inputs.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {locale === "te" ? "కొత్త ఇంటి వంటకం జోడించండి" : "Add Custom Home Food"}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {locale === "te"
                  ? "మీ ఇంట్లో వండుకునే ఏ వంటకమైనా నమోదు చేసి క్యాలరీలను లెక్కించండి"
                  : "Add any homemade South Indian dish for accurate calorie logging"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <Alert variant="destructive" className="py-2 text-xs font-semibold">
              <span>{errorMsg}</span>
            </Alert>
          )}

          {/* Quick Preset Buttons */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>{locale === "te" ? "త్వరిత ఆటో-ఫిల్ (1-క్లిక్ మోడల్)" : "Quick Preset (Auto-fills ICMR estimates)"}:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset("veg_curry")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                🥗 {locale === "te" ? "వెజ్ కూర" : "Veg Curry"}
              </button>
              <button
                type="button"
                onClick={() => applyPreset("dal")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                🍲 {locale === "te" ? "పప్పు / సాంబార్" : "Dal / Pappu"}
              </button>
              <button
                type="button"
                onClick={() => applyPreset("non_veg")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                🍗 {locale === "te" ? "చికెన్ / చేప కూర" : "Chicken / Fish"}
              </button>
              <button
                type="button"
                onClick={() => applyPreset("tiffin")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border border-cyan-200 hover:bg-cyan-100 transition-colors"
              >
                🥞 {locale === "te" ? "టిఫిన్ (దోస/ఇడ్లీ)" : "Tiffin / Dosa"}
              </button>
              <button
                type="button"
                onClick={() => applyPreset("snack")}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 hover:bg-slate-200 transition-colors"
              >
                🥜 {locale === "te" ? "స్నాక్ / గుగ్గిళ్ళు" : "Snack / Sundal"}
              </button>
            </div>
          </div>

          <form id="custom-food-form" onSubmit={handleSave} className="space-y-4">
            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="customNameEn" required>
                  {locale === "te" ? "వంటకం పేరు (English)" : "Dish Name (English)"}
                </Label>
                <Input
                  id="customNameEn"
                  placeholder="e.g. Tomato Pachadi, Pachi Pulusu"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customNameTe">
                  {locale === "te" ? "వంటకం పేరు (తెలుగు)" : "Dish Name (Telugu)"}
                </Label>
                <Input
                  id="customNameTe"
                  placeholder="ఉదా: టమోటా పచ్చడి, పచ్చి పులుసు"
                  value={nameTe}
                  onChange={(e) => setNameTe(e.target.value)}
                />
              </div>
            </div>

            {/* Category & State */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="customCategory">Category</Label>
                <Select
                  id="customCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                >
                  <option value="curry">Curry / కూర</option>
                  <option value="dal">Pappu & Dal / పప్పు</option>
                  <option value="breakfast">Tiffin / అల్పాహారం</option>
                  <option value="rice_grain">Rice & Grain / అన్నం</option>
                  <option value="snack">Snack / స్నాక్స్</option>
                  <option value="drink">Drink / పానీయాలు</option>
                  <option value="fruit_vegetable">Fruit & Salad / పండ్లు</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="customServingG">Serving Weight (g)</Label>
                <Input
                  id="customServingG"
                  type="number"
                  value={standardServingG}
                  onChange={(e) => setStandardServingG(Number(e.target.value))}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="customServingLabel">Portion Label</Label>
                <Input
                  id="customServingLabel"
                  placeholder="1 bowl (150g)"
                  value={servingUnitEn}
                  onChange={(e) => {
                    setServingUnitEn(e.target.value);
                    setServingUnitTe(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Macros Card for this serving */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-200 tracking-wide flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>
                    {locale === "te"
                      ? "ఈ మోతాదులోని పోషక విలువలు (Nutrition per Serving)"
                      : "Nutrition per Serving"}
                  </span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {standardServingG}g serving
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <Label htmlFor="customCalories" className="text-xs">
                    🔥 Calories (kcal)
                  </Label>
                  <Input
                    id="customCalories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="customProtein" className="text-xs">
                    💪 Protein (g)
                  </Label>
                  <Input
                    id="customProtein"
                    type="number"
                    step="0.1"
                    value={proteinG}
                    onChange={(e) => setProteinG(Number(e.target.value))}
                    className="font-bold text-emerald-700 dark:text-emerald-400"
                  />
                </div>

                <div>
                  <Label htmlFor="customCarbs" className="text-xs">
                    🌾 Carbs (g)
                  </Label>
                  <Input
                    id="customCarbs"
                    type="number"
                    step="0.1"
                    value={carbsG}
                    onChange={(e) => setCarbsG(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="customFat" className="text-xs">
                    🥑 Fat (g)
                  </Label>
                  <Input
                    id="customFat"
                    type="number"
                    step="0.1"
                    value={fatG}
                    onChange={(e) => setFatG(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => setIsVegetarian(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>🌿 {locale === "te" ? "శాకాహారం (Vegetarian)" : "Vegetarian Food"}</span>
              </label>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-2.5">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
            {locale === "te" ? "రద్దు చేయండి" : "Cancel"}
          </Button>
          <Button
            type="submit"
            form="custom-food-form"
            variant="primary"
            isLoading={isSaving}
            className="px-5 font-bold"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            <span>{locale === "te" ? "వంటకం సేవ్ చేయండి" : "Save & Add to Catalog"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
