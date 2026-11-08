"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  computeRollingMovingAverage,
  RollingAveragePoint,
} from "@/lib/insights-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  TrendingDown,
  Info,
  Footprints,
  HeartPulse,
  Droplet,
  Moon,
  Sparkles,
} from "lucide-react";

export function TrendAnalysisView() {
  const { locale, t } = useI18n();
  const [points, setPoints] = useState<RollingAveragePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await computeRollingMovingAverage(7);
        setPoints(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* 7-Day Rolling Moving Average Section */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.insights.rollingAvgTitle}</span>
            </div>
            <span className="text-xs text-slate-500 font-normal">
              7-Day Window Smoothing
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Explanation Alert */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{t.insights.rollingAvgExplanation}</p>
          </div>

          {/* Recharts Rolling Average */}
          <div className="h-72 w-full pt-2" id="rollingAvgChartContainer">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  domain={["dataMin - 1.5", "dataMax + 1.5"]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: number, name: string) => [
                    `${val} kg`,
                    name === "actualWeight" ? "Daily Scale" : "7-Day Moving Avg",
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(val) => (
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {val === "actualWeight"
                        ? locale === "te"
                          ? "రోజువారీ బరువు"
                          : "Daily Scale Weight"
                        : locale === "te"
                        ? "7 రోజుల రోలింగ్ సగటు"
                        : "7-Day Rolling Trend"}
                    </span>
                  )}
                />
                <ReferenceLine
                  y={113}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: "90-Day Goal", fill: "#10b981", fontSize: 10 }}
                />
                {/* Daily jitter line */}
                <Line
                  type="monotone"
                  dataKey="actualWeight"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={{ r: 3, fill: "#94a3b8" }}
                  name="actualWeight"
                />
                {/* 7-day smooth trend */}
                <Line
                  type="monotone"
                  dataKey="rollingAvgWeight"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#059669" }}
                  activeDot={{ r: 6 }}
                  name="rollingAvgWeight"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Metric Correlations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Correlation 1: Walking & Blood Pressure */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Footprints className="h-4 w-4 text-emerald-600" />
              <span>{t.insights.correlationWalkingBp}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.insights.correlationWalkingBpDesc}
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                {locale === "te" ? "నడక రోజుల్లో సగటు BP" : "On Walking Days"}
              </span>
              <span className="font-black text-emerald-700 dark:text-emerald-400">
                122 / 80 mmHg
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Correlation 2: Sleep & Hydration */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Droplet className="h-4 w-4 text-sky-600" />
              <span>{t.insights.correlationSleepWater}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.insights.correlationSleepWaterDesc}
            </p>
            <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/30 flex items-center justify-between">
              <span className="font-semibold text-sky-800 dark:text-sky-300">
                {locale === "te" ? "3,000మి.లీ పైగా నీరు త్రాగినప్పుడు" : "When Water ≥ 3,000ml"}
              </span>
              <span className="font-black text-sky-700 dark:text-sky-400">
                4.2 / 5.0 Quality Rating
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

