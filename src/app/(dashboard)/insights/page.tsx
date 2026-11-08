"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { WeeklySummaryView } from "@/components/insights/weekly-summary-view";
import { TrendAnalysisView } from "@/components/insights/trend-analysis-view";
import { NotificationPreferencesView } from "@/components/insights/notification-preferences-view";
import { AiCoachCard } from "@/components/insights/ai-coach-card";
import {
  Sparkles,
  BarChart3,
  LineChart,
  Bot,
  Bell,
  ShieldCheck,
} from "lucide-react";

type InsightsTab = "summary" | "trends" | "coach" | "notifications";

export default function InsightsPage() {
  const { locale, t } = useI18n();
  const [activeTab, setActiveTab] = useState<InsightsTab>("summary");

  const tabs: {
    id: InsightsTab;
    label: string;
    icon: any;
  }[] = [
    {
      id: "summary",
      label: t.insights.tabSummary,
      icon: BarChart3,
    },
    {
      id: "trends",
      label: t.insights.tabTrends,
      icon: LineChart,
    },
    {
      id: "coach",
      label: t.insights.tabCoach,
      icon: Bot,
    },
    {
      id: "notifications",
      label: t.insights.tabNotifications,
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto px-2 sm:px-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.insights.title}
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            {t.insights.subtitle}
          </p>
        </div>

        {/* Safety & Non-Diagnostic Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-center text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{locale === "te" ? "వాస్తవ డేటా అంతర్దృష్టులు" : "Verified Real-Data Insights"}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`insights-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="mt-4">
        {activeTab === "summary" && <WeeklySummaryView />}
        {activeTab === "trends" && <TrendAnalysisView />}
        {activeTab === "coach" && <AiCoachCard />}
        {activeTab === "notifications" && <NotificationPreferencesView />}
      </div>
    </div>
  );
}

