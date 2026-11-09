"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TiltCard } from "@/components/ui/tilt-card";
import { Utensils, Sparkles, Check, PieChart, ShieldCheck } from "lucide-react";

type DietType = "veg" | "non_veg" | "egg";

export function MacroPlateVisualizer() {
  const { locale } = useI18n();
  const [dietType, setDietType] = useState<DietType>("non_veg");

  const dietDetails = {
    non_veg: {
      titleTe: "మిశ్రమ ఆహార పళ్లెం (Non-Veg / Mixed)",
      titleEn: "Mixed South Indian Plate",
      calories: "~620 kcal",
      protein: "34g ప్రోటీన్",
      carbs: "1 కప్పు సోనా మసూరి అన్నం (45g కార్బోహైడ్రేట్లు)",
      proteinItem: "2 ఉడకబెట్టిన గుడ్లు + 1 కప్పు కోడికూర (చికెన్ బ్రెస్ట్)",
      fiberItem: "1 కప్పు టమాటా రసం + కీరదోస ముక్కలు + 1 గ్లాసు చల్లని మజ్జిగ",
      tagTe: "అత్యధిక ప్రోటీన్ & స్థిరమైన శక్తి",
      tagEn: "High Protein & Sustained Energy",
    },
    egg: {
      titleTe: "ఎగ్గేరియన్ పళ్లెం (Eggitarian)",
      titleEn: "Eggitarian Plate",
      calories: "~580 kcal",
      protein: "28g ప్రోటీన్",
      carbs: "2 పెసరట్లు లేదా 1 కప్పు గోధుమ రవ్వ ఉప్మా",
      proteinItem: "2 పూర్తి గుడ్ల ఆమ్లెట్ లేదా ఉడికించిన గుడ్లు + కొబ్బరి చట్నీ",
      fiberItem: "పాలకూర పప్పు + తాజా కీరదోస & నిమ్మరసం",
      tagTe: "మోకాళ్ల రక్షణ & కండరాల పుష్టి",
      tagEn: "Knee Protection & Muscle Support",
    },
    veg: {
      titleTe: "స్వచ్ఛమైన శాఖాహార పళ్లెం (100% Vegetarian)",
      titleEn: "100% Vegetarian High-Protein Plate",
      calories: "~590 kcal",
      protein: "26g ప్రోటీన్",
      carbs: "1 కప్పు బ్రౌన్ రైస్ లేదా 2 జొన్న రొట్టెలు",
      proteinItem: "100g పన్నీర్ భుర్జీ + 1 కప్పు దట్టమైన కంది పప్పు",
      fiberItem: "బెండకాయ వేపుడు (తక్కువ నూనె) + 1 కప్పు ఘాటైన రసం + పెరుగు",
      tagTe: "మొక్కల ఆధారిత జీవక్రియ రక్షణ",
      tagEn: "Plant-Powered Metabolic Support",
    },
  };

  const active = dietDetails[dietType];

  return (
    <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <PieChart className="h-3.5 w-3.5 inline mr-1" />
          {locale === "te" ? "శాస్త్రీయ పోషకాహార నిష్పత్తి" : "The 40/30/30 South Indian Plate"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3.5">
          {locale === "te"
            ? "మన తెలుగు భోజనంతో కండరాలు పెంచుతూ కొవ్వు కరిగించండి"
            : "Lose Visceral Fat While Enjoying Telugu Food"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
          {locale === "te"
            ? "అన్నాన్ని మానాల్సిన పనిలేదు. పళ్లెంలో 40% కార్బ్స్, 30% ప్రోటీన్, 30% పీచు పదార్థాల సమతుల్యత ఉంటే సరిపోతుంది."
            : "No extreme low-carb starvation. The ideal South Asian metabolic plate balances home staples scientifically."}
        </p>

        {/* Dietary Switcher */}
        <div className="inline-flex mt-6 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 gap-1.5">
          <button
            type="button"
            onClick={() => setDietType("non_veg")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
              dietType === "non_veg"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            🍗 {locale === "te" ? "నాన్-వెజ్" : "Non-Veg"}
          </button>
          <button
            type="button"
            onClick={() => setDietType("egg")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
              dietType === "egg"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            🍳 {locale === "te" ? "ఎగ్గేరియన్" : "Eggitarian"}
          </button>
          <button
            type="button"
            onClick={() => setDietType("veg")}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
              dietType === "veg"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            🥗 {locale === "te" ? "శాకాహారం" : "100% Veg"}
          </button>
        </div>
      </div>

      {/* 3D Tilt Card Displaying the Plate Architecture */}
      <TiltCard
        maxTilt={5}
        spotlightColor="rgba(16, 185, 129, 0.2)"
        className="p-6 sm:p-8 border border-emerald-500/30 shadow-2xl bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-slate-900/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Visual Plate Ring Diagram */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative h-60 w-60 sm:h-68 sm:w-68 rounded-full border-8 border-slate-200/60 dark:border-slate-800 p-2 flex items-center justify-center bg-white/40 dark:bg-slate-900/40 shadow-inner">
              {/* ThreeUI / GSAP-inspired circular macro sectors */}
              <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent border-l-transparent -rotate-45" />
              <div className="absolute inset-0 rounded-full border-8 border-teal-400 border-b-transparent border-r-transparent rotate-45" />

              <div className="text-center p-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  {locale === "te" ? active.tagTe : active.tagEn}
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white block mt-1">
                  {active.calories}
                </span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {active.protein}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500 mt-3 font-semibold">
              {locale === "te" ? "ICMR-NIN సిఫార్సు చేసిన భారతీయ నిష్పత్తి" : "ICMR-NIN Recommended Indian Plate Ratio"}
            </span>
          </div>

          {/* Breakdown Items List */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="h-5 w-5 text-emerald-600" />
              <span>{locale === "te" ? active.titleTe : active.titleEn}</span>
            </h3>

            <div className="space-y-3">
              {/* Sector 1: Carbs */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-xs shrink-0">
                  40%
                </div>
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-200 block text-xs">
                    {locale === "te" ? "స్మార్ట్ కార్బోహైడ్రేట్లు (Smart Carbs):" : "Complex Carbohydrates (40%):"}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{active.carbs}</p>
                </div>
              </div>

              {/* Sector 2: Protein */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xs shrink-0">
                  30%
                </div>
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs">
                    {locale === "te" ? "కండర రక్షణ ప్రోటీన్ (Lean Protein):" : "High-Bioavailability Protein (30%):"}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{active.proteinItem}</p>
                </div>
              </div>

              {/* Sector 3: Fiber & Gut Health */}
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-xs shrink-0">
                  30%
                </div>
                <div>
                  <span className="font-bold text-teal-900 dark:text-teal-200 block text-xs">
                    {locale === "te" ? "పీచు పదార్థాలు & జీర్ణశక్తి (Fiber & Gut Health):" : "Digestive Fiber & Probiotics (30%):"}
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{active.fiberItem}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </section>
  );
}

