"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { playRestCompleteChime } from "@/lib/audio-timer";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, X, Plus, FastForward, Play, Pause, CheckCircle2 } from "lucide-react";

interface RestTimerModalProps {
  isOpen: boolean;
  initialSeconds?: number;
  onClose: () => void;
  onComplete?: () => void;
}

export function RestTimerModal({
  isOpen,
  initialSeconds = 60,
  onClose,
  onComplete,
}: RestTimerModalProps) {
  const { locale, t } = useI18n();
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTotalSeconds(initialSeconds);
      setSecondsRemaining(initialSeconds);
      setIsRunning(true);
      setIsFinished(false);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isOpen && isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval as NodeJS.Timeout);
            setIsRunning(false);
            setIsFinished(true);
            playRestCompleteChime();
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isRunning, secondsRemaining, onComplete]);

  if (!isOpen) return null;

  const handleAdd30s = () => {
    setSecondsRemaining((prev) => prev + 30);
    setTotalSeconds((prev) => prev + 30);
    setIsFinished(false);
    setIsRunning(true);
  };

  const handleSkip = () => {
    setIsRunning(false);
    setIsFinished(true);
    onClose();
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };

  const progressPct = totalSeconds > 0
    ? Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100)
    : 100;

  // SVG Circle calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-sm shadow-2xl relative border-emerald-500/30 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="text-center pb-2">
          <CardTitle className="text-base font-bold flex items-center justify-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Timer className="h-5 w-5 text-emerald-600" />
            <span>{t.workouts.restTimer}</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isFinished
              ? t.workouts.timerRestComplete
              : locale === "te"
              ? "శ్వాసను సాధారణ స్థితికి తెచ్చుకోండి"
              : "Catch your breath and recover"}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center py-4">
          {/* Animated Countdown Ring */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-emerald-500 transition-all duration-500 ease-linear"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              {isFinished ? (
                <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" />
              ) : (
                <>
                  <span className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {secondsRemaining}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {locale === "te" ? "సెకన్లు" : "seconds"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdd30s}
              className="text-xs text-slate-700 dark:text-slate-300"
            >
              <Plus className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              {t.workouts.addThirtySec}
            </Button>

            {!isFinished && (
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
                className="text-xs h-9 w-9 p-0"
                aria-label={isRunning ? "Pause" : "Resume"}
              >
                {isRunning ? (
                  <Pause className="h-4 w-4 text-slate-600" />
                ) : (
                  <Play className="h-4 w-4 text-emerald-600" />
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSkip}
              className="text-xs text-slate-700 dark:text-slate-300"
            >
              <FastForward className="h-3.5 w-3.5 mr-1" />
              {t.workouts.skipRest}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 dark:bg-slate-800/40 py-2.5 px-4 text-center">
          <p className="text-[11px] text-slate-500 mx-auto">
            {locale === "te"
              ? "💡 విశ్రాంతి సమయంలో ముక్కు ద్వారా లోతుగా శ్వాస తీసుకోండి."
              : "💡 Breathe deeply through your nose to facilitate oxygen recovery."}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

