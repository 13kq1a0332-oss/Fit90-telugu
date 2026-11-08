"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  WorkoutSession,
  getWorkoutSessions,
  deleteWorkoutSession,
  calculateWorkoutStreak,
  getWeeklyWorkoutMetrics,
  getWorkoutScheduleConfig,
} from "@/lib/workout-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Calendar,
  Clock,
  Footprints,
  Dumbbell,
  Trash2,
  AlertTriangle,
  Trophy,
  CheckCircle2,
} from "lucide-react";

interface WorkoutHistoryViewProps {
  refreshTrigger?: number;
}

export function WorkoutHistoryView({ refreshTrigger = 0 }: WorkoutHistoryViewProps) {
  const { locale, t } = useI18n();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSessions = async () => {
    setLoading(true);
    const data = await getWorkoutSessions();
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSessions();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    await deleteWorkoutSession(id);
    await loadSessions();
  };

  const streak = calculateWorkoutStreak(sessions);
  const metrics = getWeeklyWorkoutMetrics(sessions);
  const scheduleConfig = getWorkoutScheduleConfig();

  return (
    <div className="space-y-4">
      {/* Top Progress & Streak Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Streak */}
        <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-950/20 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {locale === "te" ? "నిరంతర క్రమశిక్షణ" : "Consistency Streak"}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                {streak} {locale === "te" ? "రోజుల స్ట్రీక్" : "days"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Adherence */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {locale === "te" ? "ఈ వారపు లక్ష్యం" : "This Week's Goal"}
              </span>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {metrics.sessionsCompleted} / {scheduleConfig.daysPerWeek} {locale === "te" ? "రోజులు" : "days"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Minutes Moved */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {locale === "te" ? "ఈ వారం మొత్తం సమయం" : "Total Time This Week"}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                {metrics.totalMinutes} {locale === "te" ? "నిమిషాలు" : "mins"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knee Discomfort Summary if any reported */}
      {metrics.kneePainCount > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <p>
            {locale === "te"
              ? `ఈ వారం ${metrics.kneePainCount} వ్యాయామాలలో మోకాలి/కీళ్ల నొప్పి నమోదైంది. నొప్పి తగ్గే వరకు నడక వేగాన్ని తగ్గించి, కుర్చీ స్క్వాట్స్‌కు బదులుగా గ్లూట్ బ్రిడ్జెస్‌ను ఎంచుకోండి.`
              : `Knee/joint discomfort was noted in ${metrics.kneePainCount} session(s) this week. Favor floor glute bridges and gentle level walking until symptoms resolve.`}
          </p>
        </div>
      )}

      {/* Sessions History List */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
        <CardHeader className="py-3 px-4 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span>{t.workouts.tabHistory}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {session.type === "walking" ? (
                      <Footprints className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Dumbbell className="h-4 w-4 text-indigo-600" />
                    )}
                    <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {session.type === "walking"
                        ? locale === "te"
                          ? "రోజువారీ చురుకైన నడక"
                          : "Brisk Walking Session"
                        : session.type === "strength"
                        ? locale === "te"
                          ? "కీళ్ల భద్రతతో కూడిన కసరత్తులు"
                          : "Low-Impact Strength Routine"
                        : locale === "te"
                        ? "మిశ్రమ వ్యాయామం"
                        : "Combined Workout"}
                    </h5>
                    {session.kneePainReported && (
                      <span className="text-[10px] text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                        <AlertTriangle className="h-3 w-3" />
                        {locale === "te" ? "నొప్పి నమోదైంది" : "Joint Discomfort"}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    {session.date} • {session.durationMinutes} mins
                    {session.walkingSteps ? ` • ${session.walkingSteps.toLocaleString()} steps` : ""}
                    {" • RPE " + session.rpeScore + "/10"}
                  </p>

                  {session.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      &quot;{session.notes}&quot;
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(session.id)}
                  className="text-slate-400 hover:text-red-500 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Delete Session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 px-4 text-center text-slate-400 text-xs">
              <Footprints className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p>{t.workouts.historyEmpty}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

