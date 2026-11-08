"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { addWorkoutSession } from "@/lib/workout-store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dumbbell,
  Footprints,
  Calendar,
  Clock,
  AlertTriangle,
  X,
  CheckCircle2,
  HeartPulse,
} from "lucide-react";

interface WorkoutSessionLoggerProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionLogged: () => void;
  initialType?: "walking" | "strength" | "combined";
  defaultDuration?: number;
  defaultSteps?: number;
}

export function WorkoutSessionLogger({
  isOpen,
  onClose,
  onSessionLogged,
  initialType = "walking",
  defaultDuration = 25,
  defaultSteps = 5000,
}: WorkoutSessionLoggerProps) {
  const { locale, t } = useI18n();

  const [workoutType, setWorkoutType] = useState<"walking" | "strength" | "combined">(initialType);
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(defaultDuration);
  const [walkingSteps, setWalkingSteps] = useState<number>(defaultSteps);
  const [rpeScore, setRpeScore] = useState<number>(5);
  const [kneePainReported, setKneePainReported] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addWorkoutSession({
        date: sessionDate,
        type: workoutType,
        durationMinutes,
        walkingMinutes: workoutType !== "strength" ? durationMinutes : undefined,
        walkingSteps: workoutType !== "strength" ? walkingSteps : undefined,
        rpeScore,
        kneePainReported,
        kneePainNotes: kneePainReported ? notes : undefined,
        exerciseLogs: [],
        notes,
      });

      onSessionLogged();
      onClose();
    } catch (err) {
      console.error("Error logging workout session:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rpeDescriptions: Record<number, { en: string; te: string }> = {
    1: { en: "1 - Extremely easy, barely moving", te: "1 - చాలా తేలికపాటి, శ్రమ లేదు" },
    2: { en: "2 - Easy, casual stroll", te: "2 - సాధారణ నడక, సులభం" },
    3: { en: "3 - Light, can sing freely", te: "3 - తేలికపాటి, ఆయాసం లేదు" },
    4: { en: "4 - Moderate, warming up", te: "4 - మధ్యస్థ శ్రమ ప్రారంభం" },
    5: { en: "5 - Recommended: brisk, can talk comfortably", te: "5 - సిఫార్సు: చురుకైన నడక, మాట్లాడగలగాలి" },
    6: { en: "6 - Challenging, breathing elevated", te: "6 - కొద్దిగా కఠినం, శ్వాస పెరిగింది" },
    7: { en: "7 - Heavy effort, short sentences only", te: "7 - కఠిన శ్రమ, చిన్న మాటలే మాట్లాడగలం" },
    8: { en: "8 - Very hard, pushing limits", te: "8 - చాలా ఎక్కువ శ్రమ" },
    9: { en: "9 - Near maximal effort", te: "9 - విపరీతమైన శ్రమ (సిఫార్సు చేయబడదు)" },
    10: { en: "10 - Complete exhaustion", te: "10 - తీవ్ర అలసట (పరిహరించండి)" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>{t.workouts.logSession}</span>
            </CardTitle>
            <p className="text-xs text-slate-500">
              {locale === "te"
                ? "నేటి శారీరక శ్రమ మరియు కీళ్ల అనుభూతి వివరాలను నమోదు చేయండి"
                : "Record your movement, perceived exertion, and joint comfort"}
            </p>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            {/* Workout Type Selector */}
            <div>
              <Label className="block mb-1.5 font-semibold text-slate-700 dark:text-slate-300">
                {locale === "te" ? "వ్యాయామ రకం" : "Activity Type"}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWorkoutType("walking")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${workoutType === "walking"
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                >
                  <Footprints className="h-4 w-4 mx-auto mb-1" />
                  <span>{locale === "te" ? "నడక" : "Walking"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkoutType("strength")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${workoutType === "strength"
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                >
                  <Dumbbell className="h-4 w-4 mx-auto mb-1" />
                  <span>{locale === "te" ? "కసరత్తులు" : "Strength"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkoutType("combined")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${workoutType === "combined"
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                >
                  <HeartPulse className="h-4 w-4 mx-auto mb-1" />
                  <span>{locale === "te" ? "రెండు కలిసి" : "Combined"}</span>
                </button>
              </div>
            </div>

            {/* Date & Duration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="sessionDate" className="mb-1 block font-semibold">
                  {locale === "te" ? "తేదీ" : "Date"}
                </Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="durationMinutes" className="mb-1 block font-semibold">
                  {t.workouts.durationMins}
                </Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min={5}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Steps (if walking or combined) */}
            {workoutType !== "strength" && (
              <div>
                <Label htmlFor="walkingSteps" className="mb-1 block font-semibold">
                  {locale === "te" ? "నడచిన అడుగులు (అంచనా లేదా పెడోమీటర్)" : "Walking Steps (approx)"}
                </Label>
                <Input
                  id="walkingSteps"
                  type="number"
                  step="100"
                  min={500}
                  max={50000}
                  value={walkingSteps}
                  onChange={(e) => setWalkingSteps(Number(e.target.value))}
                />
              </div>
            )}

            {/* Rate of Perceived Exertion (RPE 1-10 Slider) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="rpeSlider" className="font-semibold mb-0">
                  {t.workouts.rpeLabel}:
                </Label>
                <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  RPE {rpeScore} / 10
                </span>
              </div>

              <input
                id="rpeSlider"
                type="range"
                min="1"
                max="10"
                value={rpeScore}
                onChange={(e) => setRpeScore(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />

              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {locale === "te"
                  ? rpeDescriptions[rpeScore]?.te
                  : rpeDescriptions[rpeScore]?.en}
              </p>
            </div>

            {/* Knee Pain / Joint Discomfort Check */}
            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  id="kneePainCheckbox"
                  type="checkbox"
                  checked={kneePainReported}
                  onChange={(e) => setKneePainReported(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-600"
                />
                <Label
                  htmlFor="kneePainCheckbox"
                  className="text-xs font-bold text-amber-950 dark:text-amber-200 cursor-pointer mb-0"
                >
                  {t.workouts.kneePainQuestion}
                </Label>
              </div>

              {kneePainReported && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                  <div className="flex items-start gap-1.5 text-xs text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <p className="leading-relaxed">
                      {t.workouts.kneePainAlert}
                    </p>
                  </div>

                  <Input
                    type="text"
                    placeholder={
                      locale === "te"
                        ? "ఎక్కడ నొప్పి వచ్చింది? (ఉదా: కుడి మోకాలు, పాదం)..."
                        : "Describe the discomfort (e.g. right knee, inner ankle)..."
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {locale === "te" ? "రద్దు చేయండి" : "Cancel"}
            </Button>
            <Button
              id="sessionLoggerSubmitBtn"
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {isSubmitting ? "Saving..." : t.workouts.logSession}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
