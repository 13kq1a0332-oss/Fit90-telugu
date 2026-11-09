"use client";

import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { addFoodLogEntry, MealType, getTodayDateString } from "@/lib/diet-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiltCard } from "@/components/ui/tilt-card";
import { KineticCounter } from "@/components/ui/kinetic-counter";
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Volume2,
  Flame,
  Utensils,
  RefreshCw,
  Plus,
  Info,
} from "lucide-react";

interface TeluguFoodItem {
  id: string;
  nameTe: string;
  nameEn: string;
  keywords: string[];
  defaultPortionG: number;
  portionLabelTe: string;
  portionLabelEn: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  costInr: number;
}

const TELUGU_KNOWLEDGE_BASE: TeluguFoodItem[] = [
  {
    id: "pesarattu",
    nameTe: "పెసరట్టు (2 ముక్కలు)",
    nameEn: "Pesarattu (2 pieces)",
    keywords: ["పెసరట్టు", "pesarattu", "pesaratu", "పెసర"],
    defaultPortionG: 150,
    portionLabelTe: "2 పెసరట్లు (150g)",
    portionLabelEn: "2 Pesarattu (150g)",
    calories: 260,
    proteinG: 14.5,
    carbsG: 34.0,
    fatG: 6.2,
    fiberG: 6.8,
    costInr: 25,
  },
  {
    id: "sona-masuri-rice",
    nameTe: "వండిన సోనా మసూరి అన్నం",
    nameEn: "Cooked Sona Masuri Rice",
    keywords: ["అన్నం", "rice", "సోనా", "రైస్", "anam", "annam"],
    defaultPortionG: 150,
    portionLabelTe: "1 కప్పు (150g)",
    portionLabelEn: "1 cup (150g)",
    calories: 195,
    proteinG: 3.9,
    carbsG: 42.5,
    fatG: 0.8,
    fiberG: 0.6,
    costInr: 12,
  },
  {
    id: "boiled-eggs",
    nameTe: "ఉడకబెట్టిన కోడిగుడ్లు",
    nameEn: "Boiled Whole Eggs",
    keywords: ["గుడ్డు", "గుడ్లు", "egg", "eggs", "guddu", "gudlu", "ఆమ్లెట్", "omlet"],
    defaultPortionG: 100,
    portionLabelTe: "2 గుడ్లు (100g)",
    portionLabelEn: "2 eggs (100g)",
    calories: 155,
    proteinG: 13.0,
    carbsG: 1.1,
    fatG: 10.6,
    fiberG: 0,
    costInr: 14,
  },
  {
    id: "palakura-pappu",
    nameTe: "పాలకూర కందిపప్పు",
    nameEn: "Spinach Dal (Palakura Pappu)",
    keywords: ["పప్పు", "పాలకూర", "dal", "pappu", "palakura"],
    defaultPortionG: 150,
    portionLabelTe: "1 గిన్నె (150g)",
    portionLabelEn: "1 bowl (150g)",
    calories: 174,
    proteinG: 10.2,
    carbsG: 22.4,
    fatG: 4.8,
    fiberG: 5.4,
    costInr: 20,
  },
  {
    id: "majiga",
    nameTe: "చల్లని మజ్జిగ (ఆవాలు, కరివేపాకు)",
    nameEn: "Spiced Buttermilk (Majjiga)",
    keywords: ["మజ్జిగ", "majiga", "majjiga", "buttermilk", "చల్ల"],
    defaultPortionG: 200,
    portionLabelTe: "1 పెద్ద గ్లాసు (200ml)",
    portionLabelEn: "1 tall glass (200ml)",
    calories: 42,
    proteinG: 2.2,
    carbsG: 3.6,
    fatG: 1.8,
    fiberG: 0.2,
    costInr: 8,
  },
  {
    id: "chicken-curry",
    nameTe: "ఆంధ్ర నాటు కోడి / చికెన్ కూర",
    nameEn: "South Indian Chicken Curry",
    keywords: ["చికెన్", "కోడి", "chicken", "kodi", "కూర"],
    defaultPortionG: 150,
    portionLabelTe: "1 కప్పు (150g)",
    portionLabelEn: "1 cup (150g)",
    calories: 240,
    proteinG: 26.5,
    carbsG: 4.5,
    fatG: 12.0,
    fiberG: 1.5,
    costInr: 65,
  },
  {
    id: "idli-sambar",
    nameTe: "ఆవిరి ఇడ్లీలు + సాంబార్",
    nameEn: "Steamed Idli with Sambar",
    keywords: ["ఇడ్లీ", "ఇడ్లీలు", "idli", "idly", "సాంబార్", "sambar"],
    defaultPortionG: 160,
    portionLabelTe: "2 ఇడ్లీలు + సాంబార్ (160g)",
    portionLabelEn: "2 Idlis + Sambar (160g)",
    calories: 180,
    proteinG: 6.2,
    carbsG: 34.0,
    fatG: 1.5,
    fiberG: 3.2,
    costInr: 22,
  },
  {
    id: "chapati",
    nameTe: "గోధుమ చపాతీలు",
    nameEn: "Whole Wheat Chapatis",
    keywords: ["చపాతీ", "రోటీ", "chapati", "roti", "రొట్టె"],
    defaultPortionG: 80,
    portionLabelTe: "2 చపాతీలు (80g)",
    portionLabelEn: "2 Chapatis (80g)",
    calories: 208,
    proteinG: 6.4,
    carbsG: 38.0,
    fatG: 3.2,
    fiberG: 4.8,
    costInr: 12,
  },
  {
    id: "paneer-bhurji",
    nameTe: "పన్నీర్ భుర్జీ",
    nameEn: "Low-Oil Paneer Bhurji",
    keywords: ["పన్నీర్", "paneer", "పనీర్", "భుర్జీ"],
    defaultPortionG: 100,
    portionLabelTe: "1 కప్పు (100g)",
    portionLabelEn: "1 cup (100g)",
    calories: 215,
    proteinG: 14.8,
    carbsG: 5.2,
    fatG: 15.0,
    fiberG: 1.2,
    costInr: 45,
  },
];

interface TeluguVoiceLoggerProps {
  onEntryAdded?: () => void;
}

export function TeluguVoiceLogger({ onEntryAdded }: TeluguVoiceLoggerProps) {
  const { locale } = useI18n();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [speechLanguage, setSpeechLanguage] = useState<"te-IN" | "en-IN">("te-IN");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [detectedMatch, setDetectedMatch] = useState<TeluguFoodItem | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("lunch");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Set default meal based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setSelectedMeal("breakfast");
    else if (hour < 16) setSelectedMeal("lunch");
    else if (hour < 19) setSelectedMeal("evening_snack");
    else setSelectedMeal("dinner");
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setFeedbackSuccess(null);
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        parseVoiceInput(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("Speech recognition init error:", e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [speechLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setDetectedMatch(null);
      setMultiplier(1);
      try {
        recognitionRef.current.lang = speechLanguage;
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Speech start error:", e);
      }
    }
  };

  const parseVoiceInput = (rawText: string) => {
    const textLower = rawText.toLowerCase().trim();

    // Check for quantity multipliers in Telugu / English
    let factor = 1;
    if (textLower.includes("రెండు") || textLower.includes("2") || textLower.includes("two")) {
      factor = 2;
    } else if (textLower.includes("మూడు") || textLower.includes("3") || textLower.includes("three")) {
      factor = 3;
    } else if (textLower.includes("అర") || textLower.includes("సగం") || textLower.includes("half")) {
      factor = 0.5;
    }
    setMultiplier(factor);

    // Match keywords against Telugu database
    for (const item of TELUGU_KNOWLEDGE_BASE) {
      const matched = item.keywords.some((kw) => textLower.includes(kw.toLowerCase()));
      if (matched) {
        setDetectedMatch(item);
        return;
      }
    }

    // If no match found, fallback to generic
    setDetectedMatch(null);
  };

  const handleManualSearch = (text: string) => {
    setManualInput(text);
    setTranscript(text);
    parseVoiceInput(text);
  };

  const handleAddLog = async () => {
    if (!detectedMatch) return;

    setIsSubmitting(true);
    try {
      const calculatedPortion = Math.round(detectedMatch.defaultPortionG * multiplier);
      const calculatedCalories = Math.round(detectedMatch.calories * multiplier);
      const calculatedProtein = Math.round(detectedMatch.proteinG * multiplier * 10) / 10;
      const calculatedCarbs = Math.round(detectedMatch.carbsG * multiplier * 10) / 10;
      const calculatedFat = Math.round(detectedMatch.fatG * multiplier * 10) / 10;
      const calculatedFiber = Math.round(detectedMatch.fiberG * multiplier * 10) / 10;

      await addFoodLogEntry({
        foodItemId: detectedMatch.id,
        foodNameEn: detectedMatch.nameEn,
        foodNameTe: detectedMatch.nameTe,
        mealType: selectedMeal,
        portionG: calculatedPortion,
        portionUnitLabel: `${calculatedPortion}g`,
        calories: calculatedCalories,
        proteinG: calculatedProtein,
        carbsG: calculatedCarbs,
        fatG: calculatedFat,
        fiberG: calculatedFiber,
        estimatedCostInr: Math.round(detectedMatch.costInr * multiplier),
        loggedDate: getTodayDateString(),
        loggedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      setFeedbackSuccess(
        locale === "te"
          ? `✅ "${detectedMatch.nameTe}" విజయవంతంగా డైలీ లాగ్‌లో చేర్చబడింది!`
          : `✅ "${detectedMatch.nameEn}" successfully added to your food log!`
      );

      // Trigger light haptic if supported
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch {}
      }

      onEntryAdded?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TiltCard className="w-full glass-card rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/80 dark:border-slate-800/90 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Mic className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{locale === "te" ? "తెలుగు వాయిస్ ఫుడ్ లాగర్" : "Telugu Voice-to-Plate Logger"}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                Web Speech AI
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locale === "te"
                ? "మీరు తిన్న ఆహారాన్ని తెలుగులో లేదా ఇంగ్లీష్‌లో మాట్లాడితే తక్షణమే పోషకాలు లెక్కిస్తుంది."
                : "Speak your South Indian meal to instantly estimate calories and protein."}
            </p>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold gap-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSpeechLanguage("te-IN")}
            className={`px-3 py-1 rounded-lg transition-all ${
              speechLanguage === "te-IN"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-500"
            }`}
          >
            తెలుగు (te-IN)
          </button>
          <button
            type="button"
            onClick={() => setSpeechLanguage("en-IN")}
            className={`px-3 py-1 rounded-lg transition-all ${
              speechLanguage === "en-IN"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-500"
            }`}
          >
            English (en-IN)
          </button>
        </div>
      </div>

      {/* Main Interactive Mic Center */}
      <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
        {speechSupported ? (
          <div className="relative">
            {isListening && (
              <div className="absolute -inset-4 rounded-full bg-emerald-500/25 animate-ping" />
            )}
            <button
              type="button"
              onClick={toggleListening}
              className={`relative z-10 h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                isListening
                  ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/30 scale-105"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/30 hover:scale-105"
              }`}
            >
              {isListening ? <MicOff className="h-8 w-8 animate-pulse" /> : <Mic className="h-8 w-8" />}
            </button>
          </div>
        ) : (
          <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200">
            {locale === "te"
              ? "ఈ బ్రౌజర్‌లో మైక్రోఫోన్ ఆటో-రికగ్నిషన్ అందుబాటులో లేదు. కింద ఉన్న శోధన బాక్స్‌ను ఉపయోగించవచ్చు."
              : "Microphone API not supported on this browser. Use the quick buttons or search input below."}
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isListening
              ? locale === "te"
                ? "🎙️ వింటున్నాము... మాట్లాడండి (ఉదా: 'రెండు పెసరట్లు', 'ఒక కప్పు అన్నం')"
                : "🎙️ Listening... Say e.g. '2 Pesarattu' or '1 cup rice'"
              : locale === "te"
              ? "మాట్లాడటానికి మైక్ నొక్కండి"
              : "Tap mic to speak"}
          </p>
          {transcript && (
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-500/20 max-w-md mx-auto">
              {`"${transcript}"`}
            </p>
          )}
        </div>

        {/* 1-Tap Quick Demo Phrases for Client Presentations */}
        <div className="w-full pt-2">
          <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>
              {locale === "te" ? "తక్షణ క్లయింట్ డెమో ఉదాహరణలు (1-క్లిక్)" : "Quick Demo Phrases (1-Click)"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              "రెండు పెసరట్లు",
              "ఒక కప్పు అన్నం",
              "2 ఉడకబెట్టిన గుడ్లు",
              "పాలకూర పప్పు",
              "ఒక గ్లాసు మజ్జిగ",
              "చికెన్ కూర",
            ].map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => handleManualSearch(phrase)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all hover:border-emerald-400"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detected Food Card with Macros & Add Action */}
      {detectedMatch && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-500/30 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                {locale === "te" ? "గుర్తించిన ఆహార పదార్థం" : "Identified Food Item"}
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {locale === "te" ? detectedMatch.nameTe : detectedMatch.nameEn}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === "te" ? detectedMatch.portionLabelTe : detectedMatch.portionLabelEn}
                {multiplier !== 1 && ` × ${multiplier}`}
              </p>
            </div>

            {/* Meal Type Switcher */}
            <div className="flex items-center gap-1.5">
              {(["breakfast", "lunch", "evening_snack", "dinner"] as MealType[]).map((meal) => (
                <button
                  key={meal}
                  type="button"
                  onClick={() => setSelectedMeal(meal)}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg capitalize transition-all ${
                    selectedMeal === meal
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {meal === "breakfast"
                    ? "ఉదయం"
                    : meal === "lunch"
                    ? "మధ్యాహ్నం"
                    : meal === "evening_snack"
                    ? "స్నాక్"
                    : "రాత్రి"}
                </button>
              ))}
            </div>
          </div>

          {/* Kinetic Macro Counters */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/50 shadow-xs">
              <span className="text-[10px] text-emerald-600 font-bold block">Calories</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                <KineticCounter value={Math.round(detectedMatch.calories * multiplier)} />
              </span>
              <span className="text-[9px] text-slate-400 block">kcal</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-teal-100 dark:border-teal-900/50 shadow-xs">
              <span className="text-[10px] text-teal-600 font-bold block">Protein</span>
              <span className="text-base font-black text-teal-700 dark:text-teal-300">
                <KineticCounter value={Math.round(detectedMatch.proteinG * multiplier * 10) / 10} />
              </span>
              <span className="text-[9px] text-slate-400 block">grams</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-100 dark:border-amber-900/50 shadow-xs">
              <span className="text-[10px] text-amber-600 font-bold block">Carbs</span>
              <span className="text-base font-black text-amber-700 dark:text-amber-300">
                <KineticCounter value={Math.round(detectedMatch.carbsG * multiplier * 10) / 10} />
              </span>
              <span className="text-[9px] text-slate-400 block">grams</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900/50 shadow-xs">
              <span className="text-[10px] text-rose-600 font-bold block">Est. Cost</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                ₹<KineticCounter value={Math.round(detectedMatch.costInr * multiplier)} />
              </span>
              <span className="text-[9px] text-slate-400 block">home meal</span>
            </div>
          </div>

          {/* Add to Daily Log CTA */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleAddLog}
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[46px] px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              <span>
                {locale === "te"
                  ? "ఈ ఆహారాన్ని డైలీ లాగ్‌లో చేర్చండి"
                  : "Add this Item to Today's Food Log"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Success Notification Feedback */}
      {feedbackSuccess && (
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{feedbackSuccess}</span>
        </div>
      )}
    </TiltCard>
  );
}

