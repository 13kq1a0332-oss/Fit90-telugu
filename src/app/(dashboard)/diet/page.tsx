"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { DailyFoodLog } from "@/components/diet/daily-food-log";
import { MealPlanView } from "@/components/diet/meal-plan-view";
import { FoodSearchCatalog } from "@/components/diet/food-search-catalog";
import { GroceryListView } from "@/components/diet/grocery-list-view";
import { TeluguVoiceLogger } from "@/components/diet/telugu-voice-logger";
import { MealType } from "@/lib/diet-store";
import {
  CalendarDays,
  ClipboardList,
  Search,
  ShoppingCart,
  UtensilsCrossed,
  Mic,
} from "lucide-react";

type DietTab = "log" | "voice" | "plan" | "catalog" | "grocery";

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
      id: "voice",
      labelEn: "Voice Logger",
      labelTe: "🎙️ వాయిస్ లాగర్",
      icon: Mic,
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
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* 21st.dev Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 glow-emerald">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                {t.diet.title}
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {t.diet.subtitle}
          </p>
        </div>

        {/* Quick Nutrition Tag */}
        <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{locale === "te" ? "రోజువారీ లక్ష్యం: ~2000-2200 kcal" : "Daily Target: ~2000-2200 kcal"}</span>
        </div>
      </div>

      {/* 21st.dev Segmented Glass Tab Controls */}
      <div className="glass-card p-1.5 rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 min-h-[44px] ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-[1.01]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform ${isActive ? "text-white scale-110" : "text-slate-400"}`} />
                <span className="truncate">{locale === "te" ? tab.labelTe : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-300">
        {activeTab === "log" && (
          <DailyFoodLog
            refreshTrigger={refreshTrigger}
            onOpenCatalogForMeal={handleOpenCatalogForMeal}
          />
        )}

        {activeTab === "voice" && (
          <div className="space-y-4">
            <TeluguVoiceLogger onEntryAdded={handleDataChanged} />
          </div>
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

