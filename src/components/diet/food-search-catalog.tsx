"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  FoodItemNutrition,
  FoodCategory,
} from "@/lib/data/food-catalog";
import { getAllFoods } from "@/lib/data/custom-food-store";
import { PortionCalculatorModal } from "./portion-calculator-modal";
import { AddCustomFoodModal } from "./add-custom-food-modal";
import { MealType, addFoodLogEntry, getTodayDateString } from "@/lib/diet-store";
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
  Plus,
  Home,
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
  const [foodsList, setFoodsList] = useState<FoodItemNutrition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<"all" | "cooked" | "raw">("all");
  const [selectedFood, setSelectedFood] = useState<FoodItemNutrition | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setFoodsList(getAllFoods());
  }, []);

  const refreshFoods = () => {
    setFoodsList(getAllFoods());
    showToast(
      locale === "te"
        ? "కొత్త ఇంటి వంటకం కేటలాగ్‌లో విజయవంతంగా చేర్చబడింది!"
        : "Home food added to catalog successfully!"
    );
  };

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
    return foodsList.filter((food) => {
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
  }, [foodsList, selectedCategory, stateFilter, searchTerm]);

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
      {/* Search Bar & Add Custom Food Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
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

        <Button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition-all shrink-0 flex items-center justify-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>{locale === "te" ? "కొత్త వంటకం జోడించండి" : "Add Custom Food"}</span>
        </Button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          {filteredFoods.length} {locale === "te" ? "ఆహారాలు అందుబాటులో ఉన్నాయి" : "foods available"}
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
        {filteredFoods.map((food) => {
          const isCustom = food.id.startsWith("custom_");
          return (
            <Card
              key={food.id}
              className="hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-xs"
            >
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  {/* Header row: Name, Veg badge, Cooked/Raw */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-base leading-tight">
                          {locale === "te" ? food.nameTe : food.nameEn}
                        </h4>
                        {isCustom && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 flex items-center gap-0.5">
                            <Home className="h-2.5 w-2.5" />
                            <span>{locale === "te" ? "ఇంటి వంట" : "Custom"}</span>
                          </span>
                        )}
                      </div>
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

                  {/* Standard Serving Size Note */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {locale === "te" ? food.servingUnitTe : food.servingUnitEn}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">
                      ₹{food.estimatedCostInr} / 100g
                    </span>
                  </div>

                  {/* Macro Badges Grid */}
                  <div className="grid grid-cols-4 gap-1 text-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg mb-3">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Kcal</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {food.per100g.calories}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Protein</div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {food.per100g.proteinG}g
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Carbs</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {food.per100g.carbsG}g
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Fat</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {food.per100g.fatG}g
                      </div>
                    </div>
                  </div>

                  {/* Notes / Metabolic Guidance */}
                  {(food.notesEn || food.notesTe) && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-3">
                      {locale === "te" ? food.notesTe : food.notesEn}
                    </p>
                  )}
                </div>

                {/* Calculate & Log Button */}
                <Button
                  onClick={() => handleOpenCalculator(food)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                >
                  <Scale className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  {t.diet.calculatePortion}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 font-medium">
            {locale === "te"
              ? "ఏ ఆహారాలు కనుగొనబడలేదు. 'కొత్త వంటకం జోడించండి' బటన్ ద్వారా జోడించవచ్చు."
              : "No food items found matching your filters. You can add it using 'Add Custom Food'!"}
          </p>
          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 text-xs font-bold"
            variant="outline"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {locale === "te" ? "కొత్త వంటకం జోడించండి" : "Add Custom Food"}
          </Button>
        </div>
      )}

      {/* Portion Calculator Modal */}
      {selectedFood && (
        <PortionCalculatorModal
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          food={selectedFood}
          initialMealType={defaultMealType}
          onLog={async (logData) => {
            await addFoodLogEntry({
              foodItemId: logData.food.id,
              foodNameEn: logData.food.nameEn,
              foodNameTe: logData.food.nameTe,
              mealType: logData.mealType,
              portionG: logData.portionG,
              portionUnitLabel: logData.unitLabel,
              calories: logData.calories,
              proteinG: logData.proteinG,
              carbsG: logData.carbsG,
              fatG: logData.fatG,
              fiberG: logData.fiberG,
              estimatedCostInr: logData.estimatedCostInr,
              loggedDate: getTodayDateString(),
              loggedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            });
            showToast(
              locale === "te"
                ? `${logData.food.nameTe} విజయవంతంగా డైలీ లాగ్‌లో చేర్చబడింది!`
                : `${logData.food.nameEn} added to daily log!`
            );
            if (onFoodLogged) onFoodLogged();
            setIsCalculatorOpen(false);
          }}
        />
      )}

      {/* Add Custom Home Food Modal */}
      <AddCustomFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFoodAdded={refreshFoods}
      />
    </div>
  );
}
