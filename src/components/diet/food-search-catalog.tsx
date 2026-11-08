"use client";

import React, { useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  FOOD_CATALOG,
  FoodItemNutrition,
  FoodCategory,
} from "@/lib/data/food-catalog";
import { PortionCalculatorModal } from "./portion-calculator-modal";
import { MealType } from "@/lib/diet-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Flame,
  Dumbbell,
  Scale,
  Sparkles,
  Info,
  Check,
} from "lucide-react";

interface FoodSearchCatalogProps {
  onFoodLogged?: () => void;
  defaultMealType?: MealType;
}

export function FoodSearchCatalog({
  onFoodLogged,
  defaultMealType = "lunch",
}: FoodSearchCatalogProps) {
  const { locale, t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<"all" | "cooked" | "raw">("all");
  const [selectedFood, setSelectedFood] = useState<FoodItemNutrition | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories: { id: string; labelEn: string; labelTe: string }[] = [
    { id: "all", labelEn: "All Foods", labelTe: "అన్ని ఆహారాలు" },
    { id: "breakfast", labelEn: "Tiffins / Breakfast", labelTe: "అల్పాహారాలు" },
    { id: "rice_grain", labelEn: "Rice & Grains", labelTe: "అన్నం & ధాన్యాలు" },
    { id: "dal", labelEn: "Pappu & Dals", labelTe: "పప్పులు" },
    { id: "curry", labelEn: "Curries & Protein", labelTe: "కూరలు & మాంసం" },
    { id: "snack", labelEn: "Snacks", labelTe: "చిరుతిళ్ళు" },
    { id: "drink", labelEn: "Majjiga & Drinks", labelTe: "మజ్జిగ & పానీయాలు" },
    { id: "fruit_vegetable", labelEn: "Fruits & Salads", labelTe: "పండ్లు & సలాడ్స్" },
    { id: "protein_supplement", labelEn: "Protein Supplements", labelTe: "సప్లిమెంట్స్" },
  ];

  const filteredFoods = useMemo(() => {
    return FOOD_CATALOG.filter((food) => {
      // Category filter
      if (selectedCategory !== "all" && food.category !== selectedCategory) {
        return false;
      }

      // State filter (cooked vs raw)
      if (stateFilter !== "all" && food.state !== stateFilter) {
        return false;
      }

      // Search term filter (English and Telugu)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesEn = food.nameEn.toLowerCase().includes(query);
        const matchesTe = food.nameTe.includes(query);
        const matchesNotesEn = food.notesEn?.toLowerCase().includes(query);
        const matchesNotesTe = food.notesTe?.includes(query);
        return matchesEn || matchesTe || matchesNotesEn || matchesNotesTe;
      }

      return true;
    });
  }, [selectedCategory, stateFilter, searchTerm]);

  const handleOpenCalculator = (food: FoodItemNutrition) => {
    setSelectedFood(food);
    setIsCalculatorOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder={t.diet.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          aria-label="Search foods"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-0.5"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scrollable) */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {locale === "te" ? cat.labelTe : cat.labelEn}
          </button>
        ))}
      </div>

      {/* State Filter Pills & Cooked Water Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => setStateFilter("all")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              stateFilter === "all"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {t.diet.filterStateAll}
          </button>
          <button
            onClick={() => setStateFilter("cooked")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              stateFilter === "cooked"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            🍳 {t.diet.filterStateCooked}
          </button>
          <button
            onClick={() => setStateFilter("raw")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              stateFilter === "raw"
                ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            🌾 {t.diet.filterStateRaw}
          </button>
        </div>

        <span className="text-slate-500 dark:text-slate-400 font-medium">
          {filteredFoods.length} {locale === "te" ? "ఆహారాలు కనుగొనబడ్డాయి" : "foods found"}
        </span>
      </div>

      {/* Measurement Educational Notice */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
        <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="leading-relaxed">
          {t.diet.cookedNote}
        </p>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredFoods.map((food) => (
          <Card
            key={food.id}
            className="hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-xs"
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div>
                {/* Header row: Name, Veg badge, Cooked/Raw */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-base leading-tight">
                      {locale === "te" ? food.nameTe : food.nameEn}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      {locale === "te" ? food.nameEn : food.nameTe}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Veg/Non-veg mark */}
                    <span
                      title={food.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}
                      className={`inline-block w-3 h-3 rounded-full border ${
                        food.isVegetarian
                          ? "bg-emerald-500 border-emerald-700"
                          : "bg-red-500 border-red-700"
                      }`}
                    />
                    {/* Cooked/Raw Badge */}
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        food.state === "cooked"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                      }`}
                    >
                      {food.state === "cooked"
                        ? locale === "te" ? "వండినది" : "Cooked"
                        : locale === "te" ? "పచ్చిది" : "Raw"}
                    </span>
                  </div>
                </div>

                {/* Per-100g Macro Grid */}
                <div className="grid grid-cols-4 gap-1 bg-slate-50 dark:bg-slate-800/60 rounded-md p-2 my-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Kcal</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {food.per100g.calories}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Protein</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {food.per100g.proteinG}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Carbs</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {food.per100g.carbsG}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Fat</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {food.per100g.fatG}g
                    </span>
                  </div>
                </div>

                {/* Standard serving & Cost info */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
                  <span>
                    🥣 {locale === "te" ? food.servingUnitTe : food.servingUnitEn} (~{food.standardServingG}g)
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    ₹{food.estimatedCostInr} / 100g
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenCalculator(food)}
                className="w-full text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-700 dark:hover:bg-emerald-950/40"
              >
                <Scale className="h-3.5 w-3.5 mr-1.5" />
                {t.diet.calculatePortion}
              </Button>
            </CardContent>
          </Card>
        ))}

        {filteredFoods.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
            <Search className="h-8 w-8 mx-auto text-slate-400 mb-2 opacity-50" />
            <p className="font-medium">
              {locale === "te" ? "ఎటువంటి ఆహారాలు కనుగొనబడలేదు" : "No matching foods found"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {locale === "te"
                ? "వేరే పదాన్ని వెతకండి లేదా ఫిల్టర్‌లను మార్చండి"
                : "Try searching for a different keyword or resetting filters"}
            </p>
          </div>
        )}
      </div>

      {/* Calculator Modal */}
      <PortionCalculatorModal
        food={selectedFood}
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        initialMealType={defaultMealType}
        onLog={async (entry) => {
          const { addFoodLogEntry, getTodayDateString } = await import("@/lib/diet-store");
          await addFoodLogEntry({
            foodItemId: entry.food.id,
            foodNameEn: entry.food.nameEn,
            foodNameTe: entry.food.nameTe,
            mealType: entry.mealType,
            portionG: entry.portionG,
            portionUnitLabel: entry.unitLabel,
            calories: entry.calories,
            proteinG: entry.proteinG,
            carbsG: entry.carbsG,
            fatG: entry.fatG,
            fiberG: entry.fiberG,
            estimatedCostInr: entry.estimatedCostInr,
            loggedDate: getTodayDateString(),
            loggedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });

          showToast(
            locale === "te"
              ? `${entry.food.nameTe} (${entry.portionG}g) విజయవంతంగా నమోదైంది!`
              : `Logged ${entry.food.nameEn} (${entry.portionG}g) successfully!`
          );

          if (onFoodLogged) onFoodLogged();
        }}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

