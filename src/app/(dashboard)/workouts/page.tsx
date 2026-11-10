"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { StrengthRoutineView } from "@/components/workout/strength-routine-view";
import { WalkingProgressionView } from "@/components/workout/walking-progression-view";
import { WalkingIntervalTimer } from "@/components/workout/walking-interval-timer";
import { ExerciseLibraryView } from "@/components/workout/exercise-library-view";
import { WorkoutHistoryView } from "@/components/workout/workout-history-view";
import { WorkoutSessionLogger } from "@/components/workout/workout-session-logger";
import { WorkoutScheduleModal } from "@/components/workout/workout-schedule-modal";
import { WalkingWeekPlan } from "@/lib/data/workout-catalog";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  Footprints,
  BookOpen,
  CalendarDays,
  Settings2,
  PlusCircle,
} from "lucide-react";

type WorkoutTab = "routine" | "walking" | "library" | "history";

export default function WorkoutsPage() {
  const { locale, t } = useI18n();
  const [activeTab, setActiveTab] = useState<WorkoutTab>("routine");
  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [loggerInitialType, setLoggerInitialType] = useState<"walking" | "strength" | "combined">("strength");
  const [loggerDefaultDuration, setLoggerDefaultDuration] = useState<number>(25);
  const [loggerDefaultSteps, setLoggerDefaultSteps] = useState<number>(5000);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleDataChanged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogWalkClick = (week: WalkingWeekPlan) => {
    setLoggerInitialType("walking");
    setLoggerDefaultDuration(week.targetMinutesDaily);
    setLoggerDefaultSteps(week.targetStepsDaily);
    setIsLoggerOpen(true);
  };

  const handleCompleteStrengthRoutine = (data: { durationMinutes: number }) => {
    setLoggerInitialType("strength");
    setLoggerDefaultDuration(data.durationMinutes);
    setIsLoggerOpen(true);
  };

  const tabs: {
    id: WorkoutTab;
    labelEn: string;
    labelTe: string;
    icon: any;
  }[] = [
    {
      id: "routine",
      labelEn: t.workouts.tabToday,
      labelTe: t.workouts.tabToday,
      icon: Dumbbell,
    },
    {
      id: "walking",
      labelEn: t.workouts.tabWalking,
      labelTe: t.workouts.tabWalking,
      icon: Footprints,
    },
    {
      id: "library",
      labelEn: t.workouts.tabExercises,
      labelTe: t.workouts.tabExercises,
      icon: BookOpen,
    },
    {
      id: "history",
      labelEn: t.workouts.tabHistory,
      labelTe: t.workouts.tabHistory,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 overflow-x-hidden max-w-5xl mx-auto">
      {/* 21st.dev Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 glow-emerald">
              <Dumbbell className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                {t.workouts.title}
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {t.workouts.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScheduleOpen(true)}
            className="text-xs text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl min-h-[44px]"
          >
            <Settings2 className="h-4 w-4 mr-1.5" />
            <span>{t.workouts.adjustSchedule}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setLoggerInitialType("walking");
              setLoggerDefaultDuration(25);
              setIsLoggerOpen(true);
            }}
            className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 min-h-[44px] px-4"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            <span>{t.workouts.logSession}</span>
          </Button>
        </div>
      </div>

      {/* 21st.dev Segmented Glass Tab Bar */}
      <div className="glass-card p-1.5 rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
        {activeTab === "routine" && (
          <StrengthRoutineView onCompleteRoutine={handleCompleteStrengthRoutine} />
        )}

        {activeTab === "walking" && (
          <div className="space-y-6">
            <WalkingIntervalTimer onSessionLogged={handleDataChanged} />
            <WalkingProgressionView onLogWalkClick={handleLogWalkClick} />
          </div>
        )}

        {activeTab === "library" && <ExerciseLibraryView />}

        {activeTab === "history" && (
          <WorkoutHistoryView refreshTrigger={refreshTrigger} />
        )}
      </div>

      {/* Modals */}
      <WorkoutSessionLogger
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSessionLogged={handleDataChanged}
        initialType={loggerInitialType}
        defaultDuration={loggerDefaultDuration}
        defaultSteps={loggerDefaultSteps}
      />

      <WorkoutScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSaved={handleDataChanged}
      />
    </div>
  );
}

