"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { DailyFoodLog } from "@/components/diet/daily-food-log";
import { MealPlanView } from "@/components/diet/meal-plan-view";
import { FoodSearchCatalog } from "@/components/diet/food-search-catalog";
import { GroceryListView } from "@/components/diet/grocery-list-view";
import { MealType } from "@/lib/diet-store";
import {
  CalendarDays,
  ClipboardList,
  Search,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";

type DietTab = "log" | "plan" | "catalog" | "grocery";

export default function DietPage() {
  const { locale, t } = useI18n();
  const [activeTab, setActiveTab] = useState<DietTab>("log");
  const [selectedMealForCatalog, setSelectedMealForCatalog] = useState<MealType>("lunch");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleOpenCatalogForMeal = (meal: MealType) => {
    setSelectedMealForCatalog(meal);
    setActiveTab("catalog");
  };

  const handleDataChanged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const tabs: {
    id: DietTab;
    labelEn: string;
    labelTe: string;
    icon: any;
  }[] = [
    {
      id: "log",
      labelEn: t.diet.tabDailyLog,
      labelTe: t.diet.tabDailyLog,
      icon: CalendarDays,
    },
    {
      id: "plan",
      labelEn: t.diet.tabMealPlan,
      labelTe: t.diet.tabMealPlan,
      icon: ClipboardList,
    },
    {
      id: "catalog",
      labelEn: t.diet.tabFoodCatalog,
      labelTe: t.diet.tabFoodCatalog,
      icon: Search,
    },
    {
      id: "grocery",
      labelEn: t.diet.tabGroceryList,
      labelTe: t.diet.tabGroceryList,
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-emerald-600" />
          {t.diet.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.diet.subtitle}
        </p>
      </div>

      {/* Segmented Tab Controls */}
      <div className="grid grid-cols-4 bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
              <span className="truncate">{tab.labelTe}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "log" && (
          <DailyFoodLog
            refreshTrigger={refreshTrigger}
            onOpenCatalogForMeal={handleOpenCatalogForMeal}
          />
        )}

        {activeTab === "plan" && (
          <MealPlanView
            onPlanChanged={handleDataChanged}
            onItemLogged={handleDataChanged}
          />
        )}

        {activeTab === "catalog" && (
          <FoodSearchCatalog
            defaultMealType={selectedMealForCatalog}
            onFoodLogged={handleDataChanged}
          />
        )}

        {activeTab === "grocery" && <GroceryListView />}
      </div>
    </div>
  );
}

