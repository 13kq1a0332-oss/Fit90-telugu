"use client";

import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { addFoodLogEntry, MealType, getTodayDateString } from "@/lib/diet-store";
import { getAllFoods } from "@/lib/data/custom-food-store";
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
  AlertCircle,
  Search,
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
    id: "tomato-pappu",
    nameTe: "టమోటా కందిపప్పు",
    nameEn: "Tomato Dal (Tomato Pappu)",
    keywords: ["టమోటా", "tomato pappu", "tomato", "టమాట"],
    defaultPortionG: 150,
    portionLabelTe: "1 గిన్నె (150g)",
    portionLabelEn: "1 bowl (150g)",
    calories: 168,
    proteinG: 10.2,
    carbsG: 22.2,
    fatG: 4.6,
    fiberG: 5.7,
    costInr: 22,
  },
  {
    id: "majjiga",
    nameTe: "పోపు మజ్జిగ / బటర్‌మిల్క్",
    nameEn: "Tempered Buttermilk (Majjiga)",
    keywords: ["మజ్జిగ", "majjiga", "buttermilk", "చల్ల"],
    defaultPortionG: 250,
    portionLabelTe: "1 పెద్ద గ్లాసు (250ml)",
    portionLabelEn: "1 large glass (250ml)",
    calories: 45,
    proteinG: 2.8,
    carbsG: 4.8,
    fatG: 1.5,
    fiberG: 0.2,
    costInr: 8,
  },
  {
    id: "chicken-curry",
    nameTe: "ఆంధ్ర చికెన్ కూర",
    nameEn: "Andhra Chicken Curry",
    keywords: ["చికెన్", "chicken", "కోడి", "curry", "కూర"],
    defaultPortionG: 150,
    portionLabelTe: "1 గిన్నె / 3-4 ముక్కలు (150g)",
    portionLabelEn: "1 bowl / 3-4 pieces (150g)",
    calories: 225,
    proteinG: 24.5,
    carbsG: 5.2,
    fatG: 11.8,
    fiberG: 1.2,
    costInr: 65,
  },
  {
    id: "plain-dosa",
    nameTe: "దోస / అట్టు",
    nameEn: "Plain Dosa / Attu",
    keywords: ["దోస", "dosa", "అట్టు", "attu", "dosalu"],
    defaultPortionG: 80,
    portionLabelTe: "1 దోస (80g)",
    portionLabelEn: "1 dosa (80g)",
    calories: 135,
    proteinG: 3.1,
    carbsG: 23.6,
    fatG: 3.0,
    fiberG: 1.1,
    costInr: 10,
  },
  {
    id: "idli",
    nameTe: "ఇడ్లీ (2 ముక్కలు) సాంబార్‌తో",
    nameEn: "Steamed Idli (2 pieces)",
    keywords: ["ఇడ్లీ", "idli", "idly", "ఇడ్లీలు"],
    defaultPortionG: 120,
    portionLabelTe: "2 ఇడ్లీలు (120g)",
    portionLabelEn: "2 idlis (120g)",
    calories: 140,
    proteinG: 4.8,
    carbsG: 28.5,
    fatG: 0.6,
    fiberG: 2.0,
    costInr: 15,
  },
  {
    id: "upma",
    nameTe: "రవ్వ ఉప్మా",
    nameEn: "Rava Upma with Veggies",
    keywords: ["ఉప్మా", "upma", "రవ్వ"],
    defaultPortionG: 150,
    portionLabelTe: "1 గిన్నె (150g)",
    portionLabelEn: "1 bowl (150g)",
    calories: 213,
    proteinG: 5.4,
    carbsG: 37.2,
    fatG: 4.8,
    fiberG: 2.7,
    costInr: 18,
  },
  {
    id: "sambar",
    nameTe: "మునక్కాయ సాంబార్",
    nameEn: "Drumstick Sambar",
    keywords: ["సాంబార్", "sambar", "మునక్కాయ"],
    defaultPortionG: 180,
    portionLabelTe: "1 పెద్ద గిన్నె (180g)",
    portionLabelEn: "1 large bowl (180g)",
    calories: 130,
    proteinG: 6.3,
    carbsG: 20.2,
    fatG: 2.9,
    fiberG: 5.0,
    costInr: 25,
  },
  {
    id: "rasam",
    nameTe: "మిరియాల చారు / రసం",
    nameEn: "Pepper Rasam / Charu",
    keywords: ["రసం", "rasam", "చారు", "charu", "మిరియాల"],
    defaultPortionG: 150,
    portionLabelTe: "1 గిన్నె (150ml)",
    portionLabelEn: "1 bowl (150ml)",
    calories: 42,
    proteinG: 1.2,
    carbsG: 6.8,
    fatG: 1.2,
    fiberG: 1.0,
    costInr: 9,
  },
  {
    id: "ragi-mudde",
    nameTe: "రాగి సంకటి / ముద్ద",
    nameEn: "Ragi Mudde / Sankati",
    keywords: ["రాగి", "సంకటి", "ముద్ద", "ragi", "sankati", "mudde"],
    defaultPortionG: 200,
    portionLabelTe: "1 ముద్ద (200g)",
    portionLabelEn: "1 ball (200g)",
    calories: 220,
    proteinG: 5.2,
    carbsG: 46.8,
    fatG: 1.6,
    fiberG: 6.4,
    costInr: 16,
  },
  {
    id: "curd-rice",
    nameTe: "దద్ధోజనం / పెరుగన్నం",
    nameEn: "Curd Rice (Daddojanam)",
    keywords: ["పెరుగు", "దద్ధోజనం", "curd rice", "daddojanam", "పెరుగన్నం"],
    defaultPortionG: 180,
    portionLabelTe: "1 గిన్నె (180g)",
    portionLabelEn: "1 bowl (180g)",
    calories: 212,
    proteinG: 6.5,
    carbsG: 35.6,
    fatG: 5.0,
    fiberG: 0.7,
    costInr: 25,
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
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
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
    if (typeof window === "undefined") return;

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
        setMicErrorMessage(null);
        setFeedbackSuccess(null);
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        setManualInput(currentText);
        parseVoiceInput(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setMicErrorMessage(
            locale === "te"
              ? "మైక్రోఫోన్ అనుమతి అవసరం: దయచేసి బ్రౌజర్ అడ్రస్ బార్‌లో 'Allow' క్లిక్ చేయండి."
              : "Microphone blocked: Please click the lock/mic icon in your address bar and select 'Allow'."
          );
        } else if (event.error === "no-speech") {
          setMicErrorMessage(
            locale === "te"
              ? "ధ్వని వినబడలేదు. దయచేసి మైక్ నొక్కి స్పష్టంగా మాట్లాడండి లేదా కింద టైప్ చేయండి."
              : "No speech detected. Please tap the mic again, or type below."
          );
        } else {
          setMicErrorMessage(
            locale === "te"
              ? `వాయిస్ ఎర్రర్ (${event.error}). కింద బాక్స్‌లో నేరుగా టైప్ చేయవచ్చు.`
              : `Speech error (${event.error}). You can also type directly below.`
          );
        }
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
  }, [speechLanguage, locale]);

  const [showMicPermissionGuide, setShowMicPermissionGuide] = useState(false);

  const toggleListening = async () => {
    setMicErrorMessage(null);
    setFeedbackSuccess(null);

    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setMicErrorMessage(
        locale === "te"
          ? "ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి కింద ఉన్న శోధన బాక్స్‌లో టైప్ చేయండి."
          : "Web Speech API is not supported in this browser. Please use the search input below."
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    // Explicitly prompt the browser for microphone permission via getUserMedia first.
    // This triggers Chrome's native modal prompt: "fit90-telugu.vercel.app wants to use your microphone [Allow] [Block]"
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release mic stream so SpeechRecognition can take over cleanly
        stream.getTracks().forEach((track) => track.stop());
        setShowMicPermissionGuide(false);
      }
    } catch (err: any) {
      console.warn("Microphone permission denied or dismissed:", err);
      setShowMicPermissionGuide(true);
      setMicErrorMessage(
        locale === "te"
          ? "మైక్రోఫోన్ అనుమతి నిలిపివేయబడింది: బ్రౌజర్ అడ్రస్ బార్‌లో లాక్/ట్యూన్ ఐకాన్ నొక్కి 'Microphone' ని 'Allow' చేయండి."
          : "Microphone blocked: Please click the lock/settings icon in your address bar and set Microphone to 'Allow'."
      );
      return;
    }

    setTranscript("");
    setDetectedMatch(null);
    setMultiplier(1);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.lang = speechLanguage;
        recognitionRef.current.start();
      }
    } catch (e: any) {
      console.warn("Speech start error:", e);
      setIsListening(false);
    }
  };

  const parseVoiceInput = (rawText: string) => {
    const textLower = rawText.toLowerCase().trim();
    if (!textLower) return;

    // Check for quantity multipliers in Telugu / English
    let factor = 1;
    if (
      textLower.includes("రెండు") ||
      textLower.includes("2") ||
      textLower.includes("two") ||
      textLower.includes("డబుల్")
    ) {
      factor = 2;
    } else if (textLower.includes("మూడు") || textLower.includes("3") || textLower.includes("three")) {
      factor = 3;
    } else if (textLower.includes("నాలుగు") || textLower.includes("4") || textLower.includes("four")) {
      factor = 4;
    } else if (
      textLower.includes("అర") ||
      textLower.includes("సగం") ||
      textLower.includes("half") ||
      textLower.includes("0.5")
    ) {
      factor = 0.5;
    }
    setMultiplier(factor);

    // 1. Search in Telugu Knowledge Base first
    for (const item of TELUGU_KNOWLEDGE_BASE) {
      const matched = item.keywords.some((kw) => textLower.includes(kw.toLowerCase()));
      if (matched) {
        setDetectedMatch(item);
        return;
      }
    }

    // 2. Search in all catalog & custom home foods
    const allFoods = getAllFoods();
    for (const food of allFoods) {
      const matchesTe = food.nameTe.toLowerCase().includes(textLower);
      const matchesEn = food.nameEn.toLowerCase().includes(textLower);
      if (matchesTe || matchesEn) {
        // Convert to TeluguFoodItem shape
        setDetectedMatch({
          id: food.id,
          nameTe: food.nameTe,
          nameEn: food.nameEn,
          keywords: [food.nameTe, food.nameEn],
          defaultPortionG: food.standardServingG,
          portionLabelTe: food.servingUnitTe,
          portionLabelEn: food.servingUnitEn,
          calories: Math.round((food.per100g.calories * food.standardServingG) / 100),
          proteinG: Math.round(((food.per100g.proteinG * food.standardServingG) / 100) * 10) / 10,
          carbsG: Math.round(((food.per100g.carbsG * food.standardServingG) / 100) * 10) / 10,
          fatG: Math.round(((food.per100g.fatG * food.standardServingG) / 100) * 10) / 10,
          fiberG: Math.round(((food.per100g.fiberG * food.standardServingG) / 100) * 10) / 10,
          costInr: food.estimatedCostInr,
        });
        return;
      }
    }

    // If no match found
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
          navigator.vibrate([40, 30, 40]);
        } catch {}
      }

      setTranscript("");
      setManualInput("");
      setDetectedMatch(null);
      setMultiplier(1);
      if (onEntryAdded) onEntryAdded();
    } catch (e) {
      console.warn("Failed to add food log:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden relative">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Language Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {locale === "te" ? "తెలుగు వాయిస్-టు-ప్లేట్ లాగర్" : "Telugu Voice-to-Plate Logger"}
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Web Speech AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locale === "te"
                ? "మీ భోజనాన్ని తెలుగులో లేదా ఇంగ్లీషులో మాట్లాడండి లేదా టైప్ చేయండి"
                : "Speak or type your South Indian meal to instantly estimate calories and protein"}
            </p>
          </div>
        </div>

        {/* Language Selection Buttons */}
        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold self-start sm:self-center">
          <button
            type="button"
            onClick={() => setSpeechLanguage("te-IN")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              speechLanguage === "te-IN"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            తెలుగు (te-IN)
          </button>
          <button
            type="button"
            onClick={() => setSpeechLanguage("en-IN")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              speechLanguage === "en-IN"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            English (en-IN)
          </button>
        </div>
      </div>

      {/* Main Interactive Mic Center */}
      <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
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
            aria-label="Tap to speak"
          >
            {isListening ? (
              <MicOff className="h-8 w-8 animate-pulse" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {isListening
              ? locale === "te"
                ? "🎙️ వింటున్నాము... మాట్లాడండి (ఉదా: 'రెండు పెసరట్లు', 'ఒక కప్పు అన్నం')"
                : "🎙️ Listening... Say e.g. '2 Pesarattu' or '1 cup rice'"
              : locale === "te"
              ? "మాట్లాడటానికి మైక్ నొక్కండి"
              : "Tap mic to speak"}
          </p>

          {micErrorMessage && (
            <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-100 text-xs shadow-md text-left space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-amber-900 dark:text-amber-200">
                    {locale === "te" ? "మైక్రోఫోన్ అనుమతి గైడ్:" : "Microphone Access Required:"}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{micErrorMessage}</p>
                </div>
              </div>

              {/* Step by step unlock instructions for Chrome/Edge */}
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 text-[11px] space-y-1 border border-amber-200/60 dark:border-amber-900/40">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {locale === "te" ? "గూగుల్ క్రోమ్‌లో మైక్ ఆన్ చేసే విధానం:" : "To unlock in Google Chrome / Browser:"}
                </p>
                <ol className="list-decimal pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                  <li>
                    {locale === "te"
                      ? "అడ్రస్ బార్‌లో fit90 ఎడమవైపు ఉన్న 🔒 లాక్ / ⚙️ సెట్టింగ్స్ గుర్తు నొక్కండి."
                      : "Click the 🔒 lock or ⚙️ site settings icon on the left of your URL address bar."}
                  </li>
                  <li>
                    {locale === "te"
                      ? "'Microphone' ని 'Allow' చేయండి."
                      : "Toggle 'Microphone' from Blocked to 'Allow'."}
                  </li>
                  <li>
                    {locale === "te"
                      ? "కింద ఉన్న బటన్ క్లిక్ చేసి వెంటనే ప్రయత్నించండి."
                      : "Click the retry button below to start speaking."}
                  </li>
                </ol>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={toggleListening}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-8 px-3 shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  {locale === "te" ? "మైక్ తిరిగి ప్రయత్నించండి" : "Allow & Retry Microphone"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMicErrorMessage(null)}
                  className="text-slate-500 hover:text-slate-700 text-xs h-8"
                >
                  {locale === "te" ? "మూసివేయి" : "Dismiss"}
                </Button>
              </div>
            </div>
          )}

          {transcript && !micErrorMessage && (
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-500/20 max-w-md mx-auto">
              {`"${transcript}"`}
            </p>
          )}
        </div>

        {/* Text Input Search Fallback */}
        <div className="w-full max-w-md mx-auto relative pt-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={
                locale === "te"
                  ? "⌨️ లేదా ఇక్కడ టైప్ చేయండి (ఉదా: 2 దోసలు, అన్నం పప్పు, చికెన్ కూర)..."
                  : "⌨️ Or type here (e.g., 2 dosas, dal rice, chicken curry)..."
              }
              value={manualInput}
              onChange={(e) => handleManualSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border-slate-200 shadow-xs"
            />
          </div>
        </div>

        {/* 1-Tap Quick Demo Phrases for Presentations */}
        <div className="w-full pt-2">
          <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>
              {locale === "te" ? "తక్షణ ఉదాహరణలు (1-క్లిక్ క్లిక్ చేయండి):" : "Quick Demo Phrases (1-Click):"}
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
              "దోస",
              "రవ్వ ఉప్మా",
              "మునక్కాయ సాంబార్",
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

            {/* Meal Slot Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500">
                {locale === "te" ? "భోజనం:" : "Meal:"}
              </span>
              <select
                value={selectedMeal}
                onChange={(e) => setSelectedMeal(e.target.value as MealType)}
                className="text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-100"
              >
                <option value="breakfast">{locale === "te" ? "అల్పాహారం (Breakfast)" : "Breakfast"}</option>
                <option value="lunch">{locale === "te" ? "మధ్యాహ్న భోజనం (Lunch)" : "Lunch"}</option>
                <option value="evening_snack">{locale === "te" ? "సాయంత్రం స్నాక్ (Snack)" : "Snack"}</option>
                <option value="dinner">{locale === "te" ? "రాత్రి భోజనం (Dinner)" : "Dinner"}</option>
              </select>
            </div>
          </div>

          {/* Real-time calculated nutrient breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <TiltCard maxTilt={6} className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                {locale === "te" ? "క్యాలరీలు" : "Calories"}
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-center justify-center gap-1">
                <KineticCounter value={Math.round(detectedMatch.calories * multiplier)} />
                <span className="text-xs font-semibold text-slate-400">kcal</span>
              </div>
            </TiltCard>

            <TiltCard maxTilt={6} className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                {locale === "te" ? "ప్రోటీన్" : "Protein"}
              </span>
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                <KineticCounter value={Math.round(detectedMatch.proteinG * multiplier * 10) / 10} decimals={1} />
                <span className="text-xs font-semibold text-emerald-500">g</span>
              </div>
            </TiltCard>

            <TiltCard maxTilt={6} className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-cyan-600 block">
                {locale === "te" ? "కార్బోహైడ్రేట్లు" : "Carbohydrates"}
              </span>
              <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5 flex items-center justify-center gap-1">
                <KineticCounter value={Math.round(detectedMatch.carbsG * multiplier * 10) / 10} decimals={1} />
                <span className="text-xs font-semibold text-slate-400">g</span>
              </div>
            </TiltCard>

            <TiltCard maxTilt={6} className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">
                {locale === "te" ? "కొవ్వులు" : "Fats"}
              </span>
              <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5 flex items-center justify-center gap-1">
                <KineticCounter value={Math.round(detectedMatch.fatG * multiplier * 10) / 10} decimals={1} />
                <span className="text-xs font-semibold text-slate-400">g</span>
              </div>
            </TiltCard>
          </div>

          {/* Add to Daily Log Action Button */}
          <Button
            type="button"
            onClick={handleAddLog}
            isLoading={isSubmitting}
            className="w-full min-h-[46px] rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>
              {locale === "te"
                ? `ఈ భోజనాన్ని డైలీ లాగ్‌లో చేర్చండి (+${Math.round(detectedMatch.calories * multiplier)} kcal)`
                : `Add to Daily Log (+${Math.round(detectedMatch.calories * multiplier)} kcal)`}
            </span>
          </Button>
        </div>
      )}

      {/* Success Notification */}
      {feedbackSuccess && (
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{feedbackSuccess}</span>
        </div>
      )}
    </Card>
  );
}
