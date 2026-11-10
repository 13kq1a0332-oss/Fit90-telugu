"use client";

import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { addWorkoutSession } from "@/lib/workout-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  Footprints,
  Flame,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";

interface WalkingIntervalTimerProps {
  onSessionLogged?: () => void;
}

export function WalkingIntervalTimer({ onSessionLogged }: WalkingIntervalTimerProps) {
  const { locale } = useI18n();

  // 25 minutes total: 5 cycles of 3 min brisk (180s) + 2 min recovery (120s)
  const BRISK_SECONDS = 180;
  const RECOVERY_SECONDS = 120;
  const TOTAL_CYCLES = 5;

  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [phase, setPhase] = useState<"brisk" | "recovery">("brisk");
  const [secondsRemaining, setSecondsRemaining] = useState(BRISK_SECONDS);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logSuccessNotice, setLogSuccessNotice] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play browser synthesizer beep chime (No external mp3 file needed)
  const playChime = (type: "brisk" | "recovery" | "finish") => {
    if (!soundEnabled || typeof window === "undefined") return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "brisk") {
        // High energetic double tone
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(1046.5, now + 0.15); // C6
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "recovery") {
        // Gentle mellow tone
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(392.0, now + 0.15); // G4
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        // Fanfare
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        osc.frequency.setValueAtTime(783.99, now + 0.3);
        osc.frequency.setValueAtTime(1046.5, now + 0.45);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {
      console.warn("Audio chime notice:", e);
    }

    // Voice announcement using Web Speech
    if ("speechSynthesis" in window) {
      try {
        const text =
          type === "brisk"
            ? locale === "te"
              ? "వేగంగా నడవండి! బ్రిస్క్ వాక్."
              : "Brisk walk! Increase your pace."
            : type === "recovery"
            ? locale === "te"
              ? "నెమ్మదిగా నడవండి. రికవరీ వాక్."
              : "Recovery walk. Slow down and catch your breath."
            : locale === "te"
            ? "అభినందనలు! 25 నిమిషాల వాకింగ్ పూర్తయింది."
            : "Great job! 25-minute walking session completed.";

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale === "te" ? "te-IN" : "en-IN";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !sessionCompleted) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Interval transition
            if (phase === "brisk") {
              setPhase("recovery");
              playChime("recovery");
              return RECOVERY_SECONDS;
            } else {
              // Recovery ended
              if (currentCycle >= TOTAL_CYCLES) {
                // Completed session!
                setIsRunning(false);
                setSessionCompleted(true);
                playChime("finish");
                return 0;
              } else {
                setCurrentCycle((c) => c + 1);
                setPhase("brisk");
                playChime("brisk");
                return BRISK_SECONDS;
              }
            }
          }
          return prev - 1;
        });

        setTotalSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, phase, currentCycle, sessionCompleted, soundEnabled, locale]);

  const toggleTimer = () => {
    if (sessionCompleted) return;
    if (!isRunning && totalSecondsElapsed === 0) {
      playChime("brisk");
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentCycle(1);
    setPhase("brisk");
    setSecondsRemaining(BRISK_SECONDS);
    setTotalSecondsElapsed(0);
    setSessionCompleted(false);
    setLogSuccessNotice(null);
  };

  // Estimated stats based on elapsed time: ~110 steps/min in brisk, ~80 steps/min in recovery
  const estimatedSteps = Math.round(
    ((totalSecondsElapsed * (phase === "brisk" ? 115 : 85)) / 60)
  );
  // ~4.5 kcal / min for brisk walking
  const estimatedCalories = Math.round((totalSecondsElapsed / 60) * 4.5);

  const handleSaveSession = async () => {
    setIsLogging(true);
    try {
      const minutesDone = Math.max(Math.round(totalSecondsElapsed / 60), 1);
      await addWorkoutSession({
        date: new Date().toISOString().slice(0, 10),
        type: "walking",
        durationMinutes: minutesDone,
        walkingMinutes: minutesDone,
        walkingSteps: estimatedSteps,
        rpeScore: 5,
        kneePainReported: false,
        exerciseLogs: [],
        notes: `Fit90 Knee-Safe Interval Walk: ${minutesDone} mins (${currentCycle}/${TOTAL_CYCLES} cycles completed)`,
      });

      setLogSuccessNotice(
        locale === "te"
          ? `✅ వాకింగ్ సెషన్ విజయవంతంగా లాగ్ చేయబడింది! (+${estimatedSteps} అడుగులు, ~${estimatedCalories} kcal)`
          : `✅ Walking session logged! (+${estimatedSteps} steps, ~${estimatedCalories} kcal)`
      );
      if (onSessionLogged) onSessionLogged();
    } catch (e) {
      console.warn("Failed to log session", e);
    } finally {
      setIsLogging(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalTimeMinutes = Math.floor(totalSecondsElapsed / 60);

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl p-4 sm:p-6 overflow-hidden relative">
      {/* Ambient background glow */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        phase === "brisk" ? "bg-emerald-500/15" : "bg-cyan-500/15"
      }`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`h-10 w-10 rounded-2xl text-white flex items-center justify-center shadow-md transition-colors ${
            phase === "brisk" ? "bg-gradient-to-tr from-emerald-600 to-teal-500" : "bg-gradient-to-tr from-cyan-600 to-blue-500"
          }`}>
            <Footprints className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {locale === "te" ? "మోకాళ్లకు రక్షణగా 25 ని. వాకింగ్ టైమర్" : "25-Min Joint-Safe Interval Walk"}
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                ICMR Audio Cues
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locale === "te"
                ? "3 నిమిషాలు వేగంగా నడక (Brisk) + 2 నిమిషాలు నెమ్మదిగా నడక (Recovery) - 5 సైకిల్స్"
                : "3 min Brisk Walk (Fat Burning) + 2 min Recovery Walk - 5 Cycles"}
            </p>
          </div>
        </div>

        {/* Audio Mute / Unmute Button */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-center ${
            soundEnabled
              ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-300 text-emerald-800 dark:text-emerald-300"
              : "bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-500"
          }`}
          title="Toggle audio whistle and voice cues"
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          <span>{soundEnabled ? (locale === "te" ? "ఆడియో ఆన్" : "Audio On") : (locale === "te" ? "ఆడియో మ్యూట్" : "Muted")}</span>
        </button>
      </div>

      {/* Main Countdown Center */}
      <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
        {/* Phase Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all">
          <span className={`h-2.5 w-2.5 rounded-full ${isRunning ? "animate-ping" : ""} ${
            phase === "brisk" ? "bg-emerald-500" : "bg-cyan-500"
          }`} />
          <span className={phase === "brisk" ? "text-emerald-700 dark:text-emerald-300 font-extrabold" : "text-cyan-700 dark:text-cyan-300 font-extrabold"}>
            {phase === "brisk"
              ? locale === "te"
                ? "⚡ వేగంగా నడవండి (Brisk Walk - Zone 2)"
                : "⚡ Brisk Walk (Target Zone 2)"
              : locale === "te"
              ? "🌿 నెమ్మదిగా నడవండి (Recovery Walk)"
              : "🌿 Recovery Walk (Cool Down)"}
          </span>
        </div>

        {/* Big Digital Countdown */}
        <div className="relative">
          <div className="text-6xl sm:text-7xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
            {formatTime(secondsRemaining)}
          </div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 block">
            {locale === "te" ? `సైకిల్ ${currentCycle} / ${TOTAL_CYCLES}` : `Cycle ${currentCycle} of ${TOTAL_CYCLES}`}
          </span>
        </div>

        {/* Live Metrics: Steps & Calories */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto pt-2">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              {locale === "te" ? "సమయం" : "Duration"}
            </span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">
              {formatTime(totalSecondsElapsed)}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
              {locale === "te" ? "అడుగులు" : "Steps"}
            </span>
            <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
              ~{estimatedSteps}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">
              {locale === "te" ? "క్యాలరీలు" : "Burned"}
            </span>
            <span className="text-sm font-black text-amber-700 dark:text-amber-300">
              ~{estimatedCalories} kcal
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="rounded-2xl h-12 w-12 p-0 border-slate-300 text-slate-600 hover:bg-slate-100"
            title="Reset timer"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            onClick={toggleTimer}
            className={`min-w-[140px] h-12 rounded-2xl font-black text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isRunning
                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
                : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 fill-white" />
                <span>{locale === "te" ? "పాజ్ చేయండి" : "Pause"}</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-white" />
                <span>{totalSecondsElapsed > 0 ? (locale === "te" ? "కొనసాగించండి" : "Resume") : (locale === "te" ? "ప్రారంభించండి" : "Start Walk")}</span>
              </>
            )}
          </Button>

          {totalSecondsElapsed > 30 && (
            <Button
              type="button"
              onClick={handleSaveSession}
              isLoading={isLogging}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs h-12 px-4 rounded-2xl shadow-md shadow-cyan-600/20"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              <span>{locale === "te" ? "లాగ్ చేయండి" : "Log Walk"}</span>
            </Button>
          )}
        </div>

        {logSuccessNotice && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{logSuccessNotice}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
