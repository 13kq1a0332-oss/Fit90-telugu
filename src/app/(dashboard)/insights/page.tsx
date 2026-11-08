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
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto px-2 sm:px-4 animate-in fade-in duration-300">
      {/* 21st.dev Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-400">
                {t.insights.title}
              </span>
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {t.insights.subtitle}
          </p>
        </div>

        {/* Safety & Non-Diagnostic Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center text-xs font-semibold px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{locale === "te" ? "వాస్తవ డేటా అంతర్దృష్టులు" : "Verified Real-Data Insights"}</span>
        </div>
      </div>

      {/* 21st.dev Navigation Tabs */}
      <div className="glass-card p-1.5 rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`insights-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 min-h-[44px] ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.01]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform ${isActive ? "text-white scale-110" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panes */}
      <div className="mt-4 transition-all duration-300">
        {activeTab === "summary" && <WeeklySummaryView />}
        {activeTab === "trends" && <TrendAnalysisView />}
        {activeTab === "coach" && <AiCoachCard />}
        {activeTab === "notifications" && <NotificationPreferencesView />}
      </div>
    </div>
  );
}

