"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  EXERCISE_LIBRARY,
  DEFAULT_BEGINNER_ROUTINE_IDS,
  ExerciseItem,
  getExerciseById,
} from "@/lib/data/workout-catalog";
import { PersonalizedWorkoutEngine } from "./personalized-workout-engine";
import { RestTimerModal } from "./rest-timer-modal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  ShieldCheck,
  ArrowRightLeft,
  Timer,
  CheckCircle2,
  Circle,
  Sparkles,
  Info,
  Flame,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StrengthRoutineViewProps {
  onCompleteRoutine?: (data: {
    durationMinutes: number;
    completedExercises: Array<{
      exerciseId: string;
      nameEn: string;
      nameTe: string;
      setsCompleted: number;
      reps: number;
    }>;
  }) => void;
}

export function StrengthRoutineView({ onCompleteRoutine }: StrengthRoutineViewProps) {
  const { locale, t } = useI18n();

  // Active exercises in today's routine (user can swap alternatives)
  const [activeExerciseIds, setActiveExerciseIds] = useState<string[]>(
    DEFAULT_BEGINNER_ROUTINE_IDS
  );

  // Track completed sets per exercise: { [exerciseId]: number of completed sets }
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});

  // Expanded form guide accordion
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Rest Timer state
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);

  // Swap an exercise with its knee-safe alternative
  const handleSwapAlternative = (currentId: string) => {
    const current = getExerciseById(currentId);
    if (!current?.kneeAlternativeId) return;

    const altId = current.kneeAlternativeId;
    setActiveExerciseIds((prev) =>
      prev.map((id) => (id === currentId ? altId : id))
    );
  };

  const handleToggleSet = (exercise: ExerciseItem, setIndex: number) => {
    const currentCount = completedSets[exercise.id] || 0;
    // If clicking the next uncompleted set, mark it and trigger rest timer
    if (setIndex === currentCount + 1) {
      setCompletedSets((prev) => ({
        ...prev,
        [exercise.id]: setIndex,
      }));
      setTimerSeconds(exercise.defaultRestSeconds);
      setIsTimerOpen(true);
    } else if (setIndex <= currentCount) {
      // Uncheck down to previous
      setCompletedSets((prev) => ({
        ...prev,
        [exercise.id]: setIndex - 1,
      }));
    }
  };

  const activeExercises = activeExerciseIds
    .map((id) => getExerciseById(id))
    .filter(Boolean) as ExerciseItem[];

  const totalPossibleSets = activeExercises.reduce(
    (sum, ex) => sum + ex.defaultSets,
    0
  );
  const totalCompletedSets = Object.values(completedSets).reduce(
    (sum, n) => sum + n,
    0
  );
  const routineProgressPct = Math.round(
    (totalCompletedSets / totalPossibleSets) * 100
  );

  const handleFinish = () => {
    if (onCompleteRoutine) {
      onCompleteRoutine({
        durationMinutes: 25,
        completedExercises: activeExercises.map((ex) => ({
          exerciseId: ex.id,
          nameEn: ex.nameEn,
          nameTe: ex.nameTe,
          setsCompleted: completedSets[ex.id] || ex.defaultSets,
          reps: ex.defaultReps,
        })),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Health Profile & History Personalized Engine */}
      <PersonalizedWorkoutEngine
        onSelectRoutine={(ids) => {
          setActiveExerciseIds(ids);
          setCompletedSets({});
        }}
        activeExerciseIds={activeExerciseIds}
      />

      {/* Routine Header Card */}
      <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-r from-emerald-500/10 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t.workouts.kneeSafeBadge}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ~25 mins • Full Body
                </span>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                {locale === "te"
                  ? "కీళ్ల భద్రతతో కూడిన ప్రారంభ కసరత్తులు"
                  : "Joint-Friendly Low-Impact Strength Routine"}
              </CardTitle>
            </div>

            <Button
              size="sm"
              onClick={handleFinish}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {t.workouts.logSession}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span>{locale === "te" ? "పూర్తయిన సెట్లు" : "Routine Progress"}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totalCompletedSets} / {totalPossibleSets} {locale === "te" ? "సెట్లు" : "sets"} ({routineProgressPct}%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${routineProgressPct}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Joint Safety Note */}
      <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
        <Info className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
        <p className="leading-relaxed">
          {locale === "te"
            ? "ఈ కసరత్తులు అధిక బరువు ఉన్నవారి మోకాళ్ళు మరియు నడుముపై హానికర ఒత్తిడి పడకుండా రూపొందించబడ్డాయి. ఏ సమయంలోనైనా కీళ్ల నొప్పి అనిపిస్తే 'ప్రత్యామ్నాయం' బటన్ ద్వారా సురక్షిత వ్యాయామానికి మారండి."
            : "Engineered specifically to eliminate patellar tendon strain and lower-back shear. Tap 'Switch to Knee-Safe Alternative' anytime you feel joint discomfort."}
        </p>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3">
        {activeExercises.map((exercise, index) => {
          const setsDone = completedSets[exercise.id] || 0;
          const isExpanded = expandedId === exercise.id;

          return (
            <Card
              key={exercise.id}
              className={`transition-all border-slate-200 dark:border-slate-800 shadow-xs ${
                setsDone === exercise.defaultSets
                  ? "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300"
                  : "bg-white dark:bg-slate-900"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                        {locale === "te" ? exercise.nameTe : exercise.nameEn}
                      </h4>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {exercise.defaultSets} × {exercise.defaultReps} {locale === "te" ? "రెప్స్" : "reps"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      🎯 {locale === "te" ? exercise.targetMusclesTe : exercise.targetMusclesEn}
                    </p>
                  </div>

                  {/* Knee Alternative Swap Button */}
                  {exercise.kneeAlternativeId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwapAlternative(exercise.id)}
                      className="text-xs h-8 text-amber-700 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 shrink-0"
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
                      {t.workouts.kneeAlternative}
                    </Button>
                  )}
                </div>

                {/* Sets Completed Checkboxes */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-1">
                      {t.workouts.sets}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: exercise.defaultSets }).map((_, sIdx) => {
                        const setNum = sIdx + 1;
                        const isChecked = setNum <= setsDone;

                        return (
                          <button
                            key={setNum}
                            onClick={() => handleToggleSet(exercise, setNum)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              isChecked
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            <span>{locale === "te" ? `సెట్ ${setNum}` : `Set ${setNum}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTimerSeconds(exercise.defaultRestSeconds);
                        setIsTimerOpen(true);
                      }}
                      className="text-xs text-slate-500 hover:text-emerald-600 p-1 flex items-center gap-1"
                      title={t.workouts.restTimer}
                    >
                      <Timer className="h-4 w-4" />
                      <span className="hidden sm:inline">{exercise.defaultRestSeconds}s</span>
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : exercise.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1 flex items-center gap-0.5"
                    >
                      <span>{isExpanded ? (locale === "te" ? "దాచు" : "Hide Form") : (locale === "te" ? "సూచనలు" : "Form Cues")}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Form Cues & Step Instructions */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        {locale === "te" ? "చేసే విధానం:" : "Step-by-Step Execution:"}
                      </span>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                        {(locale === "te" ? exercise.instructionsTe : exercise.instructionsEn).map(
                          (inst, i) => (
                            <li key={i}>{inst}</li>
                          )
                        )}
                      </ol>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                        {locale === "te" ? "కీలకమైన సూచనలు & భద్రత:" : "Key Form & Safety Cues:"}
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                        {(locale === "te" ? exercise.formCuesTe : exercise.formCuesEn).map(
                          (cue, i) => (
                            <li key={i}>{cue}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={isTimerOpen}
        initialSeconds={timerSeconds}
        onClose={() => setIsTimerOpen(false)}
      />
    </div>
  );
}

