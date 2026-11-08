"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  GroceryItem,
  getActiveMealPlan,
  generateGroceryList,
  toggleGroceryItemCheck,
} from "@/lib/diet-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  RotateCcw,
  IndianRupee,
  Calendar,
  Share2,
} from "lucide-react";

export function GroceryListView() {
  const { locale, t } = useI18n();
  const [duration, setDuration] = useState<"weekly" | "monthly">("weekly");
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const refreshList = () => {
    const plan = getActiveMealPlan();
    const grocery = generateGroceryList(plan);
    setItems(grocery);
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleToggle = (foodItemId: string, currentChecked: boolean) => {
    const nextState = !currentChecked;
    toggleGroceryItemCheck(foodItemId, nextState);
    setItems((prev) =>
      prev.map((item) =>
        item.foodItemId === foodItemId ? { ...item, checked: nextState } : item
      )
    );
  };

  const handleClearChecked = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("fit90_grocery_checked_items");
    }
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  const totalCost = items.reduce(
    (sum, item) =>
      sum +
      (duration === "weekly"
        ? item.estimatedCostInrWeekly
        : item.estimatedCostInrMonthly),
    0
  );

  const checkedCount = items.filter((i) => i.checked).length;

  const handleCopyList = async () => {
    const title =
      locale === "te"
        ? `🛒 ఫిట్90 కిరాణా జాబితా (${duration === "weekly" ? "వారం - 7 రోజులు" : "నెల - 30 రోజులు"}):`
        : `🛒 Fit90 Grocery List (${duration === "weekly" ? "7 Days - Weekly" : "30 Days - Monthly"}):`;

    const lines = items.map((item) => {
      const grams =
        duration === "weekly" ? item.totalGramsWeekly : item.totalGramsMonthly;
      const weightDisplay =
        grams >= 1000
          ? `${(grams / 1000).toFixed(1)} kg`
          : `${grams} g`;
      const cost =
        duration === "weekly"
          ? item.estimatedCostInrWeekly
          : item.estimatedCostInrMonthly;
      const name = locale === "te" ? item.nameTe : item.nameEn;
      const checkMark = item.checked ? "✅" : "▫️";

      return `${checkMark} ${name} — ${weightDisplay} (~₹${cost})`;
    });

    const budgetText =
      locale === "te"
        ? `\n💰 అంచనా మొత్తం ఖర్చు: ₹${totalCost}`
        : `\n💰 Total Estimated Budget: ₹${totalCost}`;

    const fullText = [title, ...lines, budgetText].join("\n");

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Budget Card */}
      <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-r from-emerald-500/10 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                {t.diet.groceryTitle}
              </CardTitle>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {t.diet.grocerySubtitle}
              </p>
            </div>

            {/* Weekly / Monthly Toggle Buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs shrink-0">
              <button
                onClick={() => setDuration("weekly")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  duration === "weekly"
                    ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {t.diet.groceryDurationWeekly}
              </button>
              <button
                onClick={() => setDuration("monthly")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  duration === "monthly"
                    ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {t.diet.groceryDurationMonthly}
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-500 block">
                {t.diet.groceryBudgetTotal} ({duration === "weekly" ? "7 Days" : "30 Days"})
              </span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                ₹{totalCost}
              </span>
            </div>

            <div className="text-xs text-slate-500 text-right">
              <span className="block">
                {checkedCount} / {items.length} {locale === "te" ? "సరుకులు కొనుగోలు అయ్యాయి" : "items checked off"}
              </span>
              {checkedCount > 0 && (
                <button
                  onClick={handleClearChecked}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline mt-1 inline-flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  {t.diet.clearChecked}
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copy / Share Actions */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {items.length} {locale === "te" ? "కిరాణా సరుకులు" : "Required Ingredients"}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyList}
          className="text-xs h-8 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-700"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              {t.diet.groceryCopied}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              {t.diet.copyGrocery}
            </>
          )}
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => {
          const grams =
            duration === "weekly" ? item.totalGramsWeekly : item.totalGramsMonthly;
          const weightDisplay =
            grams >= 1000
              ? `${(grams / 1000).toFixed(1)} kg`
              : `${grams} g`;
          const cost =
            duration === "weekly"
              ? item.estimatedCostInrWeekly
              : item.estimatedCostInrMonthly;

          return (
            <div
              key={item.foodItemId}
              onClick={() => handleToggle(item.foodItemId, item.checked)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                item.checked
                  ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="shrink-0 text-emerald-600"
                  aria-label={item.checked ? "Mark unbought" : "Mark bought"}
                >
                  {item.checked ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div>
                  <h5
                    className={`font-semibold text-sm ${
                      item.checked
                        ? "line-through text-slate-500"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {locale === "te" ? item.nameTe : item.nameEn}
                  </h5>
                  <p className="text-xs text-slate-400">
                    {locale === "te" ? item.nameEn : item.nameTe}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                  {weightDisplay}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  ~₹{cost}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

