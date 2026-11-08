"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { BiometricsOverview } from "@/components/health/biometrics-overview";
import { WeightWaistCharts } from "@/components/health/weight-waist-charts";
import { LabRecordsView } from "@/components/health/lab-records-view";
import { RemindersManager } from "@/components/health/reminders-manager";
import {
  HeartPulse,
  Activity,
  LineChart,
  FileText,
  Bell,
  ShieldCheck,
} from "lucide-react";

type HealthTab = "overview" | "trends" | "labs" | "reminders";

export default function HealthPage() {
  const { locale, t } = useI18n();
  const [activeTab, setActiveTab] = useState<HealthTab>("overview");

  const tabs: {
    id: HealthTab;
    label: string;
    icon: any;
  }[] = [
    {
      id: "overview",
      label: t.health.tabOverview,
      icon: Activity,
    },
    {
      id: "trends",
      label: t.health.tabTrends,
      icon: LineChart,
    },
    {
      id: "labs",
      label: t.health.tabLabs,
      icon: FileText,
    },
    {
      id: "reminders",
      label: t.health.tabReminders,
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto px-2 sm:px-4 animate-in fade-in duration-300">
      {/* 21st.dev Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
              <HeartPulse className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 dark:from-rose-400 dark:via-orange-300 dark:to-amber-300">
                {t.health.title}
              </span>
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {t.health.subtitle}
          </p>
        </div>

        {/* Safety & Non-Diagnostic Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center text-xs font-semibold px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>{locale === "te" ? "వ్యక్తిగత ట్రాకింగ్ రక్షణ" : "Private Health Tracking"}</span>
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
                id={`health-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 min-h-[44px] ${
                  isActive
                    ? "bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-500/25 scale-[1.01]"
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
        {activeTab === "overview" && <BiometricsOverview />}
        {activeTab === "trends" && <WeightWaistCharts />}
        {activeTab === "labs" && <LabRecordsView />}
        {activeTab === "reminders" && <RemindersManager />}
      </div>
    </div>
  );
}
