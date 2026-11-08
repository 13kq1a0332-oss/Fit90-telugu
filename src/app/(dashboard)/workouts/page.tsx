"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { StrengthRoutineView } from "@/components/workout/strength-routine-view";
import { WalkingProgressionView } from "@/components/workout/walking-progression-view";
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
    <div className="space-y-5 animate-in fade-in duration-200 overflow-x-hidden max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-emerald-600" />
            <span>{t.workouts.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.workouts.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScheduleOpen(true)}
            className="text-xs text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
          >
            <Settings2 className="h-3.5 w-3.5 mr-1" />
            <span>{t.workouts.adjustSchedule}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setLoggerInitialType("walking");
              setLoggerDefaultDuration(25);
              setIsLoggerOpen(true);
            }}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            <span>{t.workouts.logSession}</span>
          </Button>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="grid grid-cols-4 bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
              <span className="truncate">{tab.labelTe}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "routine" && (
          <StrengthRoutineView onCompleteRoutine={handleCompleteStrengthRoutine} />
        )}

        {activeTab === "walking" && (
          <WalkingProgressionView onLogWalkClick={handleLogWalkClick} />
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

