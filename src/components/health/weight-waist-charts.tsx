"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  WeightLogEntry,
  WaistLogEntry,
  getWeightHistory,
  getWaistHistory,
} from "@/lib/health-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Scale, Ruler, TrendingDown, Info } from "lucide-react";

export function WeightWaistCharts() {
  const { locale } = useI18n();
  const [weights, setWeights] = useState<WeightLogEntry[]>([]);
  const [waists, setWaists] = useState<WaistLogEntry[]>([]);

  useEffect(() => {
    async function load() {
      const wData = await getWeightHistory();
      const wstData = await getWaistHistory();
      // Sort ascending for chronological chart
      setWeights(
        [...wData].sort(
          (a, b) => new Date(a.loggedDate).getTime() - new Date(b.loggedDate).getTime()
        )
      );
      setWaists(
        [...wstData].sort(
          (a, b) => new Date(a.loggedDate).getTime() - new Date(b.loggedDate).getTime()
        )
      );
    }
    load();
  }, []);

  const chartWeightData = weights.map((w) => ({
    date: w.loggedDate.slice(5), // MM-DD
    weight: w.weightKg,
  }));

  const chartWaistData = waists.map((w) => ({
    date: w.loggedDate.slice(5),
    waist: w.waistCm,
  }));

  return (
    <div className="space-y-4">
      {/* 1. Weight Trajectory Chart Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-600" />
              <span>{locale === "te" ? "బరువు తగ్గుదల పథం" : "Weight Loss Trajectory (kg)"}</span>
            </CardTitle>
            <span className="text-xs text-slate-500 font-medium">
              Goal: 113.0 kg
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartWeightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: number) => [`${val} kg`, "Weight"]}
                />
                <ReferenceLine
                  y={113}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: "90-Day Goal", fill: "#10b981", fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#059669" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Waist Circumference Trend Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Ruler className="h-4 w-4 text-amber-600" />
              <span>{locale === "te" ? "నడుము కొలత పురోగతి (సెం.మీ)" : "Waist Circumference Trend (cm)"}</span>
            </CardTitle>
            <span className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded font-medium">
              Cutoff: 90 cm (Men)
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartWaistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={["dataMin - 5", "dataMax + 5"]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: number) => [`${val} cm`, "Waist"]}
                />
                <ReferenceLine
                  y={90}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: "Indian Male Cutoff (90cm)", fill: "#f59e0b", fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="waist"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#d97706" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              {locale === "te"
                ? "నడుము కొలత తగ్గడం అంతర్గత అవయవాల చుట్టూ ఉన్న ప్రమాదకరమైన విసెరల్ ఫ్యాట్ కరుగుతోందని తెలియజేస్తుంది. బరువు కంటే నడుము కొలత తగ్గడం గుండె ఆరోగ్యానికి ఎక్కువ మేలు చేస్తుంది."
                : "A reduction in waist circumference signifies loss of metabolically hazardous visceral adipose tissue surrounding vital organs, reducing cardiovascular risk."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

