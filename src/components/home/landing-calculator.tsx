"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import {
  calculateBMI,
  calculateCalorieTarget,
  Gender,
  ActivityLevel,
} from "@/lib/health-calculations";
import { KineticCounter } from "@/components/ui/kinetic-counter";
import {
  Scale,
  Flame,
  Dumbbell,
  Droplets,
  Footprints,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Utensils,
  HeartPulse,
} from "lucide-react";

export function LandingCalculator() {
  const { locale } = useI18n();

  // Input state with default test profile values
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<number>(31);
  const [heightCm, setHeightCm] = useState<number>(176);
  const [weightKg, setWeightKg] = useState<number>(118);
  const [activity, setActivity] = useState<ActivityLevel>("sedentary");

  // Dynamic calculations
  const bmiResult = useMemo(
    () => calculateBMI(weightKg, heightCm),
    [weightKg, heightCm]
  );

  const caloriePlan = useMemo(
    () => calculateCalorieTarget(gender, weightKg, heightCm, age, activity),
    [gender, weightKg, heightCm, age, activity]
  );

  // 90-day realistic projection (safe 0.5kg/week = ~6kg over 12 weeks)
  const estimated90DayWeight = useMemo(() => {
    const projectedLossKg = weightKg > 100 ? 6.0 : Math.round(weightKg * 0.05 * 10) / 10;
    return Math.max(Math.round((weightKg - projectedLossKg) * 10) / 10, bmiResult.healthyWeightRangeKg.max);
  }, [weightKg, bmiResult.healthyWeightRangeKg.max]);

  const targetLossKg = Math.round((weightKg - estimated90DayWeight) * 10) / 10;

  return (
    <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-teal-500/20 to-transparent shadow-2xl">
      <div className="glass-card rounded-[22px] p-6 sm:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{locale === "te" ? "తక్షణ జీవక్రియ కాలిక్యులేటర్" : "Instant Metabolic Calculator"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {locale === "te"
                ? "మీ శరీరానికి సరిపోయే 90 రోజుల స్థిరమైన ప్రణాళికను తనిఖీ చేయండి"
                : "Calculate Your Sustainable 90-Day Metabolic Target"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {locale === "te"
                ? "క్రాష్ డైట్స్ లేకుండా, మీ ఇంట్లో వండే ఆహారంతో రోజుకు ఎన్ని క్యాలరీలు తినాలో తెలుసుకోండి."
                : "Real science: Mifflin-St Jeor math + ICMR South Asian cutoffs. Zero starvation."}
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{locale === "te" ? "వైద్యపరంగా సురక్షితం" : "Clinically Safe Floor"}</span>
          </div>
        </div>

        {/* Interactive Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Gender Switch */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                {locale === "te" ? "లింగం (Gender)" : "Gender"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                    gender === "male"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  <span>👨 {locale === "te" ? "పురుషుడు" : "Male"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                    gender === "female"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  <span>👩 {locale === "te" ? "స్త్రీ" : "Female"}</span>
                </button>
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === "te" ? "వయస్సు (Age)" : "Age"}
                </label>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {age} {locale === "te" ? "సంవత్సరాలు" : "years"}
                </span>
              </div>
              <input
                type="range"
                min={18}
                max={75}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Height Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === "te" ? "ఎత్తు (Height)" : "Height"}
                </label>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {heightCm} cm ({Math.floor(heightCm / 30.48)}&apos;{Math.round((heightCm % 30.48) / 2.54)}&quot;)
                </span>
              </div>
              <input
                type="range"
                min={140}
                max={205}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Current Weight Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {locale === "te" ? "ప్రస్తుత బరువు (Weight)" : "Current Weight"}
                </label>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {weightKg} kg
                </span>
              </div>
              <input
                type="range"
                min={45}
                max={160}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Activity Level Selector */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                {locale === "te" ? "రోజువారీ శ్రమ (Daily Activity)" : "Daily Activity"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActivity("sedentary")}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs font-medium ${
                    activity === "sedentary"
                      ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="font-bold block">🪑 {locale === "te" ? "డెస్క్ జాబ్" : "Desk Job"}</span>
                  <span className="text-[10px] text-slate-500 block">కూర్చుని చేసే పని, తక్కువ నడక</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivity("light")}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs font-medium ${
                    activity === "light"
                      ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="font-bold block">🚶 {locale === "te" ? "సాధారణ నడక" : "Light Activity"}</span>
                  <span className="text-[10px] text-slate-500 block">రోజూ 20-30 నిమిషాల నడక</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Science-Backed Results Dashboard */}
          <div className="space-y-4">
            {/* BMI & 90-Day Target Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/20 border border-emerald-500/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    {locale === "te" ? "ఆసియా-భారతీయ BMI" : "Asian Indian BMI"}
                  </span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                    <KineticCounter value={bmiResult.bmi} decimals={1} />{" "}
                    <span className="text-xs font-normal text-slate-400">kg/m²</span>
                  </div>
                </div>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${
                    bmiResult.category === "normal"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : bmiResult.category === "overweight"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
                  }`}
                >
                  {bmiResult.category === "normal"
                    ? "సాధారణ బరువు (Normal)"
                    : bmiResult.category === "overweight"
                    ? "అధిక బరువు (Overweight)"
                    : "ఊబకాయం (Obese)"}
                </span>
              </div>

              {/* 90-Day Target Projection */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  <span>{locale === "te" ? "90 రోజుల లక్ష్య బరువు:" : "Achievable 90-Day Goal:"}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                    {weightKg} kg → <KineticCounter value={estimated90DayWeight} decimals={1} suffix=" kg" /> (-<KineticCounter value={targetLossKg} decimals={1} suffix=" kg" />)
                  </span>
                </div>
                <div className="w-full bg-slate-200/70 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: "70%" }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {locale === "te"
                    ? "వారానికి 0.5 కిలోల స్థిరమైన తగ్గుదల — కండరాలు తగ్గకుండా, జీవక్రియ దెబ్బతినకుండా."
                    : "Sustainable ~0.5 kg/week — preserves lean muscle & prevents rebound weight gain."}
                </span>
              </div>
            </div>

            {/* Daily Target Metrics Bento */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 mb-1">
                  <span className="text-[11px] font-bold">{locale === "te" ? "క్యాలరీలు" : "Daily Calories"}</span>
                  <Flame className="h-4 w-4" />
                </div>
                <div className="text-xl font-black tabular-nums">
                  <KineticCounter value={caloriePlan.calorieTargetMin} /> - <KineticCounter value={caloriePlan.calorieTargetMax} />
                </div>
                <span className="text-[10px] text-orange-700 dark:text-orange-300 font-semibold block">
                  kcal / రోజుకు (Safe Deficit)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
                  <span className="text-[11px] font-bold">{locale === "te" ? "ప్రోటీన్" : "Daily Protein"}</span>
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div className="text-xl font-black tabular-nums">
                  <KineticCounter value={caloriePlan.proteinTargetMinG} /> - <KineticCounter value={caloriePlan.proteinTargetMaxG} /> g
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold block">
                  కండరాల రక్షణ కోసం
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 mb-1">
                  <span className="text-[11px] font-bold">{locale === "te" ? "మంచి నీరు" : "Hydration"}</span>
                  <Droplets className="h-4 w-4" />
                </div>
                <div className="text-xl font-black tabular-nums">
                  <KineticCounter value={Math.round(caloriePlan.dailyWaterTargetMl / 100) / 10} decimals={1} suffix=" L" />
                </div>
                <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-semibold block">
                  (~{Math.round(caloriePlan.dailyWaterTargetMl / 250)} గ్లాసులు)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
                  <span className="text-[11px] font-bold">{locale === "te" ? "నడక లక్ష్యం" : "Walking Goal"}</span>
                  <Footprints className="h-4 w-4" />
                </div>
                <div className="text-xl font-black tabular-nums">
                  <KineticCounter value={caloriePlan.dailyStepTarget} />
                </div>
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold block">
                  అడుగులు / 20 నిమిషాలు
                </span>
              </div>
            </div>

            {/* Sample Telugu Meal Matching This Target */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Utensils className="h-4 w-4 text-emerald-600" />
                <span>{locale === "te" ? "మీ లక్ష్యానికి సరిపడే నమూనా తెలుగు భోజనం:" : "Sample South Indian Meal for This Goal:"}</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>ఉదయం (టిఫిన్):</strong> 2 పెసరట్లు + అల్లం చట్నీ + 1 కప్పు మజ్జిగ (~380 kcal, 18g ప్రోటీన్)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>మధ్యాహ్నం:</strong> 1 కప్పు అన్నం + 1 కప్పు పాలకూర పప్పు + 2 ఉడికించిన గుడ్లు (~620 kcal, 32g ప్రోటీన్)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>రాత్రి:</strong> 2 రోటీలు + చికెన్ కర్రీ లేదా పన్నీర్ భుర్జీ (~520 kcal, 36g ప్రోటీన్)</span>
                </li>
              </ul>
            </div>

            {/* Direct CTA button to start with this calculated plan */}
            <Link href="/onboarding" className="block w-full pt-2">
              <button
                type="button"
                className="w-full min-h-[50px] px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{locale === "te" ? "ఈ ప్లాన్‌తో ఉచితంగా ప్రారంభించండి" : "Start With This Custom Plan (Free)"}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

