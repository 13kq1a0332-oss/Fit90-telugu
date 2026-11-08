"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Navbar } from "@/components/layout/navbar";
import { SafetyBanner } from "@/components/layout/safety-banner";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HeartPulse,
  Flame,
  CheckCircle2,
  TrendingDown,
  Activity,
  Zap,
  Scale,
  Award,
} from "lucide-react";

export default function HomePage() {
  const { t, locale } = useI18n();
  const [heroTab, setHeroTab] = useState<"diet" | "workout" | "vitals" | "ai">("diet");

  return (
    <div className="min-h-screen flex flex-col bg-ambient-mesh dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-emerald-500/20">
      <SafetyBanner />
      <Navbar />

      <main className="flex-1 relative">
        {/* Ambient 21st.dev style background glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[500px] bg-gradient-to-b from-emerald-400/15 via-teal-400/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-72 -left-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-blob" />
        <div className="absolute top-96 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-blob [animation-delay:4s]" />

        {/* HERO SECTION */}
        <section className="relative px-4 pt-12 pb-20 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          {/* Animated 21st.dev style Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-6 backdrop-blur-md shadow-xs animate-in fade-in duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>
              {locale === "te"
                ? "✨ తెలుగు వారి జీవనశైలి & ఆసియా-భారతీయ కొలతల కోసం ప్రత్యేకంగా"
                : "✨ Engineered for Telugu & South Asian Metabolic Health"}
            </span>
          </div>

          {/* Eye-catching Heading with dynamic gradient */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] max-w-3xl mx-auto">
            {locale === "te" ? (
              <>
                <span className="text-gradient-emerald">90 రోజులలో</span> స్థిరమైన బరువు నియంత్రణ & సంపూర్ణ ఆరోగ్యం
              </>
            ) : (
              <>
                Sustainable Weight Loss in{" "}
                <span className="text-gradient-emerald">90 Days</span> with South Indian Living
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {locale === "te"
              ? "కఠినమైన తిండి నియంత్రణలు లేకుండా, మన ఇంటి భోజనంతో, మోకాళ్లకు హాని కలగని నడకతో మరియు వైద్యపరమైన భద్రతతో మీ బరువును తగ్గించుకోండి."
              : "No extreme crash deficits. Authentic South Indian nutrition, knee-safe walking progressions, and private, non-diagnostic vital tracking."}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto min-h-[50px] px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{t.auth.signupButton}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto min-h-[50px] px-7 rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                {t.auth.loginButton}
              </button>
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-12 grid grid-cols-3 gap-3 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 max-w-xl mx-auto text-center shadow-xs">
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">90</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                {locale === "te" ? "రోజుల సమగ్ర లక్ష్యం" : "Day Protocol"}
              </div>
            </div>
            <div className="border-x border-slate-200/70 dark:border-slate-800/80 space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                {locale === "te" ? "తెలుగు & ఇంగ్లీష్" : "Bilingual PWA"}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">0</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                {locale === "te" ? "క్రాష్ డైట్స్ / ఆకలి బాధలు" : "Crash Diets"}
              </div>
            </div>
          </div>

          {/* INTERACTIVE 21ST.DEV STYLE LIVE DEMO PREVIEW CARD */}
          <div className="mt-14 max-w-2xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent shadow-2xl">
            <div className="glass-card rounded-[22px] p-5 sm:p-7 text-left space-y-5">
              {/* Header with pill tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      {locale === "te" ? "లైవ్ ప్రివ్యూ — Fit90 డాష్‌బోర్డ్" : "Live Preview — Fit90 Dashboard"}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {locale === "te" ? "రోజు 1 నుండి 90 రోజుల వరకు మీ పురోగతి" : "Real-time tracking without guesswork"}
                    </p>
                  </div>
                </div>

                {/* Segmented Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold gap-1">
                  <button
                    type="button"
                    onClick={() => setHeroTab("diet")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      heroTab === "diet"
                        ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    🥗 {locale === "te" ? "డైట్" : "Diet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab("workout")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      heroTab === "workout"
                        ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    🚶 {locale === "te" ? "నడక" : "Walk"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab("vitals")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      heroTab === "vitals"
                        ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    ❤️ {locale === "te" ? "రక్తపోటు" : "Vitals"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroTab("ai")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      heroTab === "ai"
                        ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    ✨ {locale === "te" ? "AI కోచ్" : "AI"}
                  </button>
                </div>
              </div>

              {/* Dynamic Preview Content */}
              {heroTab === "diet" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium block">
                        {locale === "te" ? "క్యాలరీలు" : "Calories"}
                      </span>
                      <span className="text-lg font-black text-emerald-900 dark:text-emerald-200">2,050</span>
                      <span className="text-[9px] text-slate-500 block">/ 2,200 kcal</span>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50">
                      <span className="text-[10px] text-teal-700 dark:text-teal-300 font-medium block">
                        {locale === "te" ? "ప్రోటీన్" : "Protein"}
                      </span>
                      <span className="text-lg font-black text-teal-900 dark:text-teal-200">114g</span>
                      <span className="text-[9px] text-slate-500 block">/ 120g target</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium block">
                        {locale === "te" ? "రోజువారీ ఖర్చు" : "Daily Cost"}
                      </span>
                      <span className="text-lg font-black text-amber-900 dark:text-amber-200">₹148</span>
                      <span className="text-[9px] text-slate-500 block">Home cooked</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      🍛 {locale === "te" ? "నేటి లంచ్: పెసరట్టు + పాలకూర పప్పు + 2 గుడ్లు" : "Sample: Pesarattu + Spinach Dal + 2 Boiled Eggs"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {locale === "te" ? "సమతుల్యం" : "Balanced"}
                    </span>
                  </div>
                </div>
              )}

              {heroTab === "workout" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/60 dark:border-emerald-900/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Dumbbell className="h-4 w-4 text-emerald-600" />
                        {locale === "te" ? "వారం 1 నడక ప్రణాళిక: రోజుకు 20 నిమిషాలు (~4,500 అడుగులు)" : "Week 1 Walking Roadmap: 20 mins/day (~4,500 steps)"}
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                        {locale === "te" ? "సురక్షితం" : "Knee Safe"}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      🛡️ {locale === "te" ? "మోకాలి నొప్పి ప్రత్యామ్నాయం: కుర్చీ స్క్వాట్లు ⇄ గ్లూట్ బ్రిడ్జెస్" : "Knee Alternative Swap: Chair Squats ⇄ Glute Bridges"}
                    </span>
                    <span className="text-amber-600 text-[11px] font-bold">1-Click Swap</span>
                  </div>
                </div>
              )}

              {heroTab === "vitals" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                      <span className="text-slate-500 text-[10px] block">
                        {locale === "te" ? "రక్తపోటు (BP)" : "Blood Pressure"}
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-slate-100">124 / 82</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block">
                        Normal / Stage 1
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/50">
                      <span className="text-slate-500 text-[10px] block">
                        {locale === "te" ? "నడుము కొలత" : "Waistline"}
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-slate-100">149.0 cm</span>
                      <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-bold block">
                        -1.0 cm this week
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      {locale === "te"
                        ? "180/120 కంటే ఎక్కువ నమోదైతే తక్షణమే 108/112 ఎమర్జెన్సీ అలర్ట్ ట్రిగ్గర్ అవుతుంది."
                        : "Hypertensive crisis alerts (>180/>120 mmHg) trigger instant deflection to 108/112."}
                    </span>
                  </div>
                </div>
              )}

              {heroTab === "ai" && (
                <div className="space-y-2.5 animate-in fade-in duration-200 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/50 text-slate-800 dark:text-slate-200 leading-relaxed">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                      🤖 Fit90 Lifestyle Coach:
                    </span>
                    {locale === "te"
                      ? "మీ 7 రోజుల బరువు సగటు 117.2 కేజీలకు చేరింది. రోజూ స్కేల్ పై కనిపించే చిన్న హెచ్చుతగ్గులు నీరు మరియు ఉప్పు వల్లనే వస్తాయి. పెసరట్టు మరియు నడకను కొనసాగించండి!"
                      : "Your 7-day rolling weight average is 117.2 kg (down 0.8 kg). Daily scale noise is just fluid/sodium. Focus on your 110g protein anchor and 20-min daily walks!"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 21ST.DEV STYLE BENTO GRID PILLARS */}
        <section className="px-4 py-16 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
              {locale === "te" ? "4 మూలస్తంభాలు" : "Core Architecture"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
              {locale === "te"
                ? "శాస్త్రీయమైన, స్థిరమైన బరువు నిర్వహణ"
                : "Science-Backed, Sustainable Health"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bento Card 1: Telugu Diet */}
            <div className="glass-card card-spotlight rounded-3xl p-6 sm:p-7 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {locale === "te" ? "తెలుగు ఆహారాల పోర్షన్ కాలిక్యులేటర్" : "Authentic South Indian Food Catalog"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {locale === "te"
                  ? "23+ సంప్రదాయ ఆహారాలు (సోనా మసూరి, పెసరట్టు, పాలకూర పప్పు, గుడ్లు, మజ్జిగ). రా vs వండిన కొలతలు, క్యాలరీలు, మరియు సులువైన బడ్జెట్ అంచనాలు."
                  : "23+ staples with cooked vs raw nutrition, INR budget calculations, and smart household portion scaling (katoris, plates, grams)."}
              </p>
            </div>

            {/* Bento Card 2: Knee-Safe Workouts */}
            <div className="glass-card card-spotlight rounded-3xl p-6 sm:p-7 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                <Dumbbell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {locale === "te" ? "కీళ్ల రక్షణతో కూడిన 13 వారాల నడక" : "13-Week Low-Impact Progression"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {locale === "te"
                  ? "అధిక బరువు ఉన్నవారి కీళ్ళు మరియు వెన్నెముకపై హానికర ఒత్తిడి లేకుండా 20 నుండి 50 నిమిషాల వరకు క్రమమైన నడక మరియు ఆడియో రెస్ట్ టైమర్."
                  : "Engineered specifically for heavy individuals to prevent knee and lower back shear. 1-click alternative swapping and audio rest chime."}
              </p>
            </div>

            {/* Bento Card 3: Vitals & PDF Vault */}
            <div className="glass-card card-spotlight rounded-3xl p-6 sm:p-7 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {locale === "te" ? "రక్తపోటు & ప్రైవేట్ మెడికల్ ల్యాబ్ వాల్ట్" : "BP Crisis Detection & Private Vault"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {locale === "te"
                  ? "180/120 కంటే ఎక్కువ BP వస్తే తక్షణ ఎమర్జెన్సీ హెచ్చరిక. మీ రక్త పరీక్షలు (hs-CRP, HDL, విటమిన్ D) మరియు డాక్యుమెంట్లు పూర్తి ప్రైవేట్."
                  : "Automatic hypertension staging, instant 108 emergency deflections, and private, encrypted PDF document storage."}
              </p>
            </div>

            {/* Bento Card 4: AI Coach & 7-Day Rolling Trend */}
            <div className="glass-card card-spotlight rounded-3xl p-6 sm:p-7 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {locale === "te" ? "7-రోజుల రోలింగ్ సగటు & AI కోచ్" : "7-Day Rolling Trend & Lifestyle AI"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {locale === "te"
                  ? "రోజువారీ బరువు హెచ్చుతగ్గుల ఆందోళనను తొలగించే రోలింగ్ యావరేజ్ గ్రాఫ్. ప్రిస్క్రిప్షన్లు ఇవ్వకుండా అలవాట్లను మెరుగుపరిచే సురక్షిత AI కోచ్."
                  : "Smooths scale fluctuations caused by water retention and glycogen. Non-diagnostic, strictly guardrailed lifestyle assistance."}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
