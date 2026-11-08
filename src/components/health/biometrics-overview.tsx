"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  BloodPressureEntry,
  getBloodPressureLogs,
  deleteBloodPressureLog,
  getWeightHistory,
  addWeightLog,
  getWaistHistory,
  addWaistLog,
  WeightLogEntry,
  WaistLogEntry,
} from "@/lib/health-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickLogModal } from "@/components/dashboard/quick-log-modal";
import { BloodPressureLogger } from "./blood-pressure-logger";
import { WaterSleepLogger } from "./water-sleep-logger";
import {
  Scale,
  Ruler,
  HeartPulse,
  Plus,
  Trash2,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  ArrowDownRight,
  TrendingDown,
} from "lucide-react";

export function BiometricsOverview() {
  const { locale, t } = useI18n();

  // Modal states
  const [isBpModalOpen, setIsBpModalOpen] = useState(false);
  const [quickLogType, setQuickLogType] = useState<"weight" | "waist" | null>(null);

  // Data states
  const [bpLogs, setBpLogs] = useState<BloodPressureEntry[]>([]);
  const [weights, setWeights] = useState<WeightLogEntry[]>([]);
  const [waists, setWaists] = useState<WaistLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [bp, w, wst] = await Promise.all([
        getBloodPressureLogs(),
        getWeightHistory(),
        getWaistHistory(),
      ]);
      setBpLogs(bp);
      setWeights(w);
      setWaists(wst);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const latestBp = bpLogs[0] || null;
  const latestWeight = weights[0] || null;
  const baselineWeight = weights[weights.length - 1] || null;
  const latestWaist = waists[0] || null;
  const baselineWaist = waists[waists.length - 1] || null;

  const weightDiff =
    latestWeight && baselineWeight
      ? Number((latestWeight.weightKg - baselineWeight.weightKg).toFixed(1))
      : 0;

  const waistDiff =
    latestWaist && baselineWaist
      ? Number((latestWaist.waistCm - baselineWaist.waistCm).toFixed(1))
      : 0;

  const handleWeightSave = async (val: number) => {
    await addWeightLog(val, new Date().toISOString().slice(0, 10));
    await loadAll();
  };

  const handleWaistSave = async (val: number) => {
    await addWaistLog(val, new Date().toISOString().slice(0, 10));
    await loadAll();
  };

  const handleDeleteBp = async (id: string) => {
    await deleteBloodPressureLog(id);
    await loadAll();
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Core Biometric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weight Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Scale className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {locale === "te" ? "శరీర బరువు" : "Current Weight"}
              </CardTitle>
            </div>
            <Button
              id="logWeightBtn"
              size="sm"
              variant="outline"
              onClick={() => setQuickLogType("weight")}
              className="h-8 gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{locale === "te" ? "నమోదు" : "Log"}</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white" data-testid="current-weight-val">
                {latestWeight ? latestWeight.weightKg : "--"}
              </span>
              <span className="text-sm font-medium text-slate-500">kg</span>
              {weightDiff !== 0 && (
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                    weightDiff < 0
                      ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300"
                      : "text-amber-700 bg-amber-50"
                  }`}
                >
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {locale === "te"
                ? "90 రోజుల సురక్షిత లక్ష్యం: 112 - 114 కిలోలు"
                : "90-day gradual target: 112 - 114 kg"}
            </p>
          </CardContent>
        </Card>

        {/* Waist Circumference Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Ruler className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {locale === "te" ? "నడుము కొలత" : "Waist Circumference"}
              </CardTitle>
            </div>
            <Button
              id="logWaistBtn"
              size="sm"
              variant="outline"
              onClick={() => setQuickLogType("waist")}
              className="h-8 gap-1 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{locale === "te" ? "నమోదు" : "Log"}</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white" data-testid="current-waist-val">
                {latestWaist ? latestWaist.waistCm : "--"}
              </span>
              <span className="text-sm font-medium text-slate-500">cm</span>
              {waistDiff !== 0 && (
                <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300">
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  {waistDiff > 0 ? `+${waistDiff}` : waistDiff} cm
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>
                {locale === "te"
                  ? "ఆసియన్ ప్రమాణం: పురుషులకు < 90 సెం.మీ (విసెరల్ ఫ్యాట్ తగ్గింపు)"
                  : "Asian Indian Cutoff: < 90 cm for men (visceral fat reduction)"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Blood Pressure Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                <HeartPulse className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {locale === "te" ? "రక్తపోటు (BP)" : "Blood Pressure"}
              </CardTitle>
            </div>
            <Button
              id="openBpModalBtn"
              size="sm"
              variant="outline"
              onClick={() => setIsBpModalOpen(true)}
              className="h-8 gap-1 border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{locale === "te" ? "BP నమోదు" : "Log BP"}</span>
            </Button>
          </CardHeader>
          <CardContent>
            {latestBp ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white" data-testid="latest-bp-val">
                    {latestBp.systolic}/{latestBp.diastolic}
                  </span>
                  <span className="text-sm font-medium text-slate-500">mmHg</span>
                  {latestBp.pulse && (
                    <span className="text-xs text-slate-500 ml-2">
                      Pulse: {latestBp.pulse} bpm
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      latestBp.stage === "crisis"
                        ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        : latestBp.stage === "stage_2"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                        : latestBp.stage === "stage_1"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : latestBp.stage === "elevated"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {latestBp.stage === "crisis"
                      ? t.health.bpCrisis
                      : latestBp.stage === "stage_2"
                      ? t.health.bpStage2
                      : latestBp.stage === "stage_1"
                      ? t.health.bpStage1
                      : latestBp.stage === "elevated"
                      ? t.health.bpElevated
                      : t.health.bpNormal}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-2 text-slate-500 text-sm">
                <p>{t.health.emptyBp}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Alert Banner if any Crisis reading detected */}
      {latestBp?.stage === "crisis" && (
        <div className="p-4 rounded-xl bg-red-100 border-2 border-red-500 text-red-900 dark:bg-red-950/80 dark:border-red-700 dark:text-red-200 flex items-start gap-3 shadow-lg">
          <AlertOctagon className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-sm">
            <h4 className="font-bold text-base text-red-800 dark:text-red-300">
              {locale === "te" ? "అత్యవసర హెచ్చరిక!" : "EMERGENCY ALERT"}
            </h4>
            <p className="mt-1 font-medium">{t.health.bpCrisisAlert}</p>
          </div>
        </div>
      )}

      {/* Hydration & Sleep Trackers */}
      <WaterSleepLogger onDataChanged={loadAll} />

      {/* Recent BP Logs History (Collapsible / Table) */}
      {bpLogs.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">
              {locale === "te" ? "రక్తపోటు రీడింగుల చరిత్ర" : "Blood Pressure Reading History"}
            </CardTitle>
            <span className="text-xs text-slate-500">{bpLogs.length} readings</span>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="py-2.5 px-3">{locale === "te" ? "తేదీ / సమయం" : "Date & Time"}</th>
                    <th className="py-2.5 px-3">BP (mmHg)</th>
                    <th className="py-2.5 px-3">Pulse</th>
                    <th className="py-2.5 px-3">{locale === "te" ? "స్టేజ్" : "Classification"}</th>
                    <th className="py-2.5 px-3 text-right">{locale === "te" ? "చర్య" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bpLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {log.loggedDate} <span className="text-xs text-slate-400">({log.loggedTime})</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {log.systolic}/{log.diastolic}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {log.pulse ? `${log.pulse} bpm` : "--"}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            log.stage === "crisis"
                              ? "bg-red-100 text-red-800"
                              : log.stage === "stage_2"
                              ? "bg-orange-100 text-orange-800"
                              : log.stage === "stage_1"
                              ? "bg-amber-100 text-amber-800"
                              : log.stage === "elevated"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {log.stage === "crisis"
                            ? "Crisis"
                            : log.stage === "stage_2"
                            ? "Stage 2"
                            : log.stage === "stage_1"
                            ? "Stage 1"
                            : log.stage === "elevated"
                            ? "Elevated"
                            : "Normal"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBp(log.id)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-600"
                          aria-label="Delete BP reading"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <BloodPressureLogger
        isOpen={isBpModalOpen}
        onClose={() => setIsBpModalOpen(false)}
        onLogged={loadAll}
      />

      {quickLogType && (
        <QuickLogModal
          type={quickLogType}
          isOpen={!!quickLogType}
          onClose={() => setQuickLogType(null)}
          onSave={quickLogType === "weight" ? handleWeightSave : handleWaistSave}
          currentValue={quickLogType === "weight" ? latestWeight?.weightKg || 118 : latestWaist?.waistCm || 150}
        />
      )}
    </div>
  );
}

