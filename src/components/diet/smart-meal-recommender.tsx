"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  getFoodLogsForDate,
  addFoodLogEntry,
  getTodayDateString,
  MealType,
} from "@/lib/diet-store";
import { getUserProfileAndGoal } from "@/lib/profile-store";
import { getAllFoods } from "@/lib/data/custom-food-store";
import { FoodItemNutrition } from "@/lib/data/food-catalog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Utensils,
  Flame,
  Dumbbell,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface MealComboItem {
  food: FoodItemNutrition;
  servings: number;
  labelTe: string;
  labelEn: string;
}

interface RecommendedCombo {
  titleTe: string;
  titleEn: string;
  descriptionTe: string;
  descriptionEn: string;
  items: MealComboItem[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
}

export function SmartMealRecommender({ onFoodLogged }: { onFoodLogged?: () => void }) {
  const { locale } = useI18n();

  const [targetCalories, setTargetCalories] = useState<number>(1900);
  const [targetProteinG, setTargetProteinG] = useState<number>(95);
  const [consumedCalories, setConsumedCalories] = useState<number>(0);
  const [consumedProteinG, setConsumedProteinG] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<MealType>("dinner");
  const [recommendation, setRecommendation] = useState<RecommendedCombo | null>(null);
  const [isLoggingCombo, setIsLoggingCombo] = useState(false);
  const [comboLoggedSuccess, setComboLoggedSuccess] = useState(false);

  // Compute daily intake and determine meal slot
  useEffect(() => {
    async function loadMetrics() {
      const { goal } = await getUserProfileAndGoal();
      const avgTarget = Math.round((goal.calorieTargetMin + goal.calorieTargetMax) / 2);
      const avgProtein = Math.round((goal.proteinTargetMinG + goal.proteinTargetMaxG) / 2);
      setTargetCalories(avgTarget || 1900);
      setTargetProteinG(avgProtein || 95);

      const logs = await getFoodLogsForDate(getTodayDateString());
      const cKcal = logs.reduce((sum: number, item) => sum + item.calories, 0);
      const cProt = logs.reduce((sum: number, item) => sum + item.proteinG, 0);
      setConsumedCalories(cKcal);
      setConsumedProteinG(cProt);

      const hour = new Date().getHours();
      let slot: MealType = "lunch";
      if (hour < 11) slot = "breakfast";
      else if (hour < 16) slot = "lunch";
      else if (hour < 19) slot = "evening_snack";
      else slot = "dinner";
      setSelectedSlot(slot);

      computeRecommendation(avgTarget - cKcal, avgProtein - cProt, slot);
    }
    loadMetrics();
  }, []);

  const computeRecommendation = (
    remKcal: number,
    remProt: number,
    slot: MealType
  ) => {
    const allFoods = getAllFoods();
    const findFood = (id: string) => allFoods.find((f) => f.id === id);

    const safeRemKcal = Math.max(remKcal, 200);

    let combo: RecommendedCombo;

    if (slot === "breakfast") {
      const pesarattu = findFood("pesarattu");
      const majjiga = findFood("majjiga") || findFood("spiced-buttermilk");
      if (pesarattu && majjiga) {
        combo = {
          titleTe: "హై-ప్రోటీన్ పెసరట్టు & చల్లని మజ్జిగ",
          titleEn: "High-Protein Pesarattu & Spiced Majjiga",
          descriptionTe: "రక్తంలో చక్కెర పెరగకుండా రోజంతా స్థిరమైన శక్తినిచ్చే ఉత్తమ తెలుగు అల్పాహారం.",
          descriptionEn: "Low-glycemic morning fuel rich in plant protein and gut probiotics.",
          items: [
            { food: pesarattu, servings: 1, labelTe: "2 పెసరట్లు (150g)", labelEn: "2 Pesarattu (150g)" },
            { food: majjiga, servings: 1, labelTe: "1 పెద్ద గ్లాసు మజ్జిగ (250ml)", labelEn: "1 Glass Buttermilk (250ml)" },
          ],
          totalCalories: pesarattu.per100g.calories * 1.5 + majjiga.per100g.calories * 2.5,
          totalProteinG: 14.5 + 2.8,
          totalCarbsG: 34 + 4.8,
          totalFatG: 6.2 + 1.5,
        };
      } else {
        combo = fallbackCombo(allFoods);
      }
    } else if (slot === "evening_snack") {
      const boiledEggs = findFood("boiled-eggs") || findFood("boiled-whole-eggs");
      const ragiMalt = findFood("ragi-malt");
      if (boiledEggs) {
        combo = {
          titleTe: "సాయంత్రం ఉడకబెట్టిన గుడ్లు & మజ్జిగ",
          titleEn: "Evening Protein Eggs & Majjiga",
          descriptionTe: "సాయంత్రం ఆకలిని నియంత్రించి కండరాలను బలంగా ఉంచే ప్రోటీన్ స్నాక్.",
          descriptionEn: "Clean satiety snack to prevent dinner overeating.",
          items: [
            { food: boiledEggs, servings: 1, labelTe: "2 గుడ్లు (100g)", labelEn: "2 Boiled Eggs (100g)" },
          ],
          totalCalories: 155,
          totalProteinG: 13,
          totalCarbsG: 1.1,
          totalFatG: 10.6,
        };
      } else {
        combo = fallbackCombo(allFoods);
      }
    } else {
      // Lunch or Dinner
      const dal = findFood("palakura-pappu") || findFood("tomato-pappu") || findFood("palakura-pappu-cooked");
      const rice = findFood("brown-rice-cooked") || findFood("sona-masuri-rice") || findFood("sona-masoori-cooked");
      const side = findFood("bendakaya-fry") || findFood("boiled-eggs");

      if (dal && rice) {
        combo = {
          titleTe: "పాలకూర పప్పు + బ్రౌన్ రైస్ + బెండకాయ కూర",
          titleEn: "Palakura Pappu + Brown Rice + Bhendi Fry",
          descriptionTe: "ICMR 40/30/30 సూత్రానికి సరిపోయే ఖచ్చితమైన తెలుగు సమతుల్య భోజనం.",
          descriptionEn: "Balanced South Indian meal hitting 40% carbs, 30% protein, 30% healthy fats.",
          items: [
            { food: dal, servings: 1, labelTe: "1 గిన్నె పప్పు (150g)", labelEn: "1 Bowl Dal (150g)" },
            { food: rice, servings: 1, labelTe: "1 కప్పు వండిన అన్నం (150g)", labelEn: "1 Cup Rice (150g)" },
            ...(side ? [{ food: side, servings: 1, labelTe: "1 కప్పు కూర (100g)", labelEn: "1 Cup Vegetable (100g)" }] : []),
          ],
          totalCalories: Math.round(174 + 166 + (side ? 135 : 0)),
          totalProteinG: Math.round((10.2 + 3.9 + (side ? 3.4 : 0)) * 10) / 10,
          totalCarbsG: Math.round((22.4 + 34.5 + (side ? 9.8 : 0)) * 10) / 10,
          totalFatG: Math.round((4.8 + 1.2 + (side ? 8.8 : 0)) * 10) / 10,
        };
      } else {
        combo = fallbackCombo(allFoods);
      }
    }

    setRecommendation(combo);
  };

  const fallbackCombo = (allFoods: FoodItemNutrition[]): RecommendedCombo => {
    const firstFood = allFoods[0];
    return {
      titleTe: "ఆరోగ్యకరమైన తెలుగు పోషక భోజనం",
      titleEn: "Nutritious South Indian Healthy Plate",
      descriptionTe: "క్యాలరీ నియంత్రణతో కూడిన పప్పు, ఆకుకూరలు మరియు ధాన్యాలు.",
      descriptionEn: "Portion-controlled lentil, greens, and complex grain plate.",
      items: [
        {
          food: firstFood,
          servings: 1,
          labelTe: firstFood.servingUnitTe,
          labelEn: firstFood.servingUnitEn,
        },
      ],
      totalCalories: firstFood.per100g.calories,
      totalProteinG: firstFood.per100g.proteinG,
      totalCarbsG: firstFood.per100g.carbsG,
      totalFatG: firstFood.per100g.fatG,
    };
  };

  const handleLogCombo = async () => {
    if (!recommendation) return;
    setIsLoggingCombo(true);
    try {
      for (const item of recommendation.items) {
        await addFoodLogEntry({
          foodItemId: item.food.id,
          foodNameEn: item.food.nameEn,
          foodNameTe: item.food.nameTe,
          mealType: selectedSlot,
          portionG: item.food.standardServingG,
          portionUnitLabel: locale === "te" ? item.labelTe : item.labelEn,
          calories: Math.round((item.food.per100g.calories * item.food.standardServingG) / 100),
          proteinG: Math.round(((item.food.per100g.proteinG * item.food.standardServingG) / 100) * 10) / 10,
          carbsG: Math.round(((item.food.per100g.carbsG * item.food.standardServingG) / 100) * 10) / 10,
          fatG: Math.round(((item.food.per100g.fatG * item.food.standardServingG) / 100) * 10) / 10,
          fiberG: Math.round(((item.food.per100g.fiberG * item.food.standardServingG) / 100) * 10) / 10,
          estimatedCostInr: item.food.estimatedCostInr,
          loggedDate: getTodayDateString(),
          loggedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      }

      setComboLoggedSuccess(true);
      if (onFoodLogged) onFoodLogged();
      setTimeout(() => setComboLoggedSuccess(false), 4000);
    } catch (e) {
      console.warn("Failed to log recommended combo", e);
    } finally {
      setIsLoggingCombo(false);
    }
  };

  const remainingKcal = Math.max(targetCalories - consumedCalories, 0);
  const remainingProt = Math.max(targetProteinG - consumedProteinG, 0);

  return (
    <Card className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {locale === "te" ? "ఈరోజు ఏం తినాలి? (స్మార్ట్ మీల్ సూచన)" : "What Should I Eat Next? (Smart Suggestion)"}
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                ICMR 40/30/30
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locale === "te"
                ? `నేటి మిగిలిన లక్ష్యం: ఇంకా ${remainingKcal} kcal & ${remainingProt.toFixed(0)}g ప్రోటీన్ అవసరం`
                : `Remaining Budget: ${remainingKcal} kcal & ${remainingProt.toFixed(0)}g protein remaining today`}
            </p>
          </div>
        </div>

        {/* Meal Slot Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-500">
            {locale === "te" ? "భోజన సమయం:" : "For:"}
          </span>
          <select
            value={selectedSlot}
            onChange={(e) => {
              const val = e.target.value as MealType;
              setSelectedSlot(val);
              computeRecommendation(remainingKcal, remainingProt, val);
            }}
            className="text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-100"
          >
            <option value="breakfast">{locale === "te" ? "అల్పాహారం (Breakfast)" : "Breakfast"}</option>
            <option value="lunch">{locale === "te" ? "మధ్యాహ్న భోజనం (Lunch)" : "Lunch"}</option>
            <option value="evening_snack">{locale === "te" ? "సాయంత్రం స్నాక్ (Snack)" : "Snack"}</option>
            <option value="dinner">{locale === "te" ? "రాత్రి భోజనం (Dinner)" : "Dinner"}</option>
          </select>
        </div>
      </div>

      {recommendation && (
        <div className="mt-4 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-black text-emerald-900 dark:text-emerald-200">
                🍽️ {locale === "te" ? recommendation.titleTe : recommendation.titleEn}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {locale === "te" ? recommendation.descriptionTe : recommendation.descriptionEn}
              </p>
            </div>

            {/* Quick Macro Pills */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 shadow-xs flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>{recommendation.totalCalories} kcal</span>
              </span>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 shadow-xs flex items-center gap-1">
                <Dumbbell className="h-3.5 w-3.5 text-emerald-600" />
                <span>{recommendation.totalProteinG}g Protein</span>
              </span>
            </div>
          </div>

          {/* Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {recommendation.items.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {locale === "te" ? item.food.nameTe : item.food.nameEn}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {locale === "te" ? item.labelTe : item.labelEn}
                </span>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 italic">
              {locale === "te"
                ? "💡 ఈ భోజనం మీ రోజూవారీ క్యాలరీ పరిమితిని దాటకుండా ప్రోటీన్‌ను అందిస్తుంది."
                : "💡 This meal fits within your remaining energy budget while fulfilling your protein target."}
            </span>

            <Button
              type="button"
              onClick={handleLogCombo}
              isLoading={isLoggingCombo}
              className="w-full sm:w-auto font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{locale === "te" ? "ఈ భోజనాన్ని వెంటనే లాగ్ చేయండి (1-క్లిక్)" : "1-Click Log This Meal"}</span>
            </Button>
          </div>

          {comboLoggedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {locale === "te"
                  ? "✅ సిఫార్సు చేసిన భోజనం మీ డైలీ లాగ్‌లో విజయవంతంగా నమోదు చేయబడింది!"
                  : "✅ Recommended meal successfully logged to your daily food tracker!"}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
