"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { TiltCard } from "@/components/ui/tilt-card";
import { KineticCounter } from "@/components/ui/kinetic-counter";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

export function BiomarkerRiskCalculator() {
  const { locale } = useI18n();

  // Biomarker inputs
  const [hba1c, setHba1c] = useState<number>(5.9);
  const [fastingSugar, setFastingSugar] = useState<number>(108);
  const [triglycerides, setTriglycerides] = useState<number>(175);
  const [hdl, setHdl] = useState<number>(42);

  // Computations
  const tgHdlRatio = hdl > 0 ? Math.round((triglycerides / hdl) * 10) / 10 : 0;

  // Glycemic Staging
  const getGlycemicStatus = () => {
    if (hba1c < 5.7 && fastingSugar < 100) {
      return {
        labelTe: "ఆరోగ్యకరం / సాధారణం (Normal)",
        labelEn: "Optimal / Normal Range",
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
        badge: "Normal",
      };
    }
    if (hba1c < 6.5 || fastingSugar < 126) {
      return {
        labelTe: "ప్రీ-డయాబెటిస్ దశ (Pre-Diabetes / Impaired)",
        labelEn: "Pre-Diabetes (Impaired Glucose Tolerance)",
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
        badge: "Pre-Diabetic",
      };
    }
    return {
      labelTe: "డయాబెటిస్ పరిధి (Diabetes Range)",
      labelEn: "Diabetic Glycemic Range",
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
      badge: "High Risk",
    };
  };

  // Lipid & Insulin Resistance Staging
  const getInsulinResistanceStatus = () => {
    if (tgHdlRatio <= 2.0) {
      return {
        labelTe: "అత్యుత్తమ ఇన్సులిన్ సున్నితత్వం (Optimal Insulin Sensitivity)",
        labelEn: "Optimal Insulin Sensitivity (Low Atherogenic Index)",
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      };
    }
    if (tgHdlRatio <= 3.0) {
      return {
        labelTe: "మితమైన ఇన్సులిన్ నిరోధకత (Borderline Insulin Resistance)",
        labelEn: "Mild Insulin Resistance (Borderline TG/HDL)",
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
      };
    }
    return {
      labelTe: "అధిక ఇన్సులిన్ నిరోధకత (High Insulin Resistance / Metabolic Syndrome)",
      labelEn: "Significant Insulin Resistance (Elevated TG/HDL)",
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
    };
  };

  const glycemic = getGlycemicStatus();
  const lipid = getInsulinResistanceStatus();

  // Load sample profiles for 1-click client demo
  const loadProfile = (type: "healthy" | "prediabetic" | "highRisk") => {
    if (type === "healthy") {
      setHba1c(5.2);
      setFastingSugar(92);
      setTriglycerides(110);
      setHdl(52);
    } else if (type === "prediabetic") {
      setHba1c(5.9);
      setFastingSugar(108);
      setTriglycerides(175);
      setHdl(42);
    } else {
      setHba1c(6.8);
      setFastingSugar(138);
      setTriglycerides(240);
      setHdl(34);
    }
  };

  return (
    <TiltCard className="w-full glass-card rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/80 dark:border-slate-800/90 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{locale === "te" ? "క్లినికల్ బయోమార్కర్ & మెటబాలిక్ విశ్లేషణ" : "Clinical Biomarker Analyzer"}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                ICMR 2020
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locale === "te"
                ? "మీ రక్త పరీక్ష ఫలితాల ఆధారంగా ఇన్సులిన్ నిరోధకత మరియు జీవక్రియ ప్రమాదాన్ని లెక్కిస్తుంది."
                : "Evaluates Insulin Resistance index (TG/HDL) and glycemic risk tailored to South Asian thresholds."}
            </p>
          </div>
        </div>

        {/* 1-Click Client Presets */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => loadProfile("healthy")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 transition-all"
          >
            {locale === "te" ? "ఆరోగ్యకరమైన ప్రొఫైల్" : "Healthy Preset"}
          </button>
          <button
            type="button"
            onClick={() => loadProfile("prediabetic")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 transition-all"
          >
            {locale === "te" ? "ప్రీ-డయాబెటిక్" : "Pre-Diabetic"}
          </button>
          <button
            type="button"
            onClick={() => loadProfile("highRisk")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 transition-all"
          >
            {locale === "te" ? "హై రిస్క్" : "High Risk"}
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* HbA1c Slider */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              🩸 HbA1c (3 నెలల రక్తంలో చక్కెర సగటు)
            </span>
            <span className="font-black text-slate-900 dark:text-white text-base">
              {hba1c}%
            </span>
          </div>
          <input
            type="range"
            min="4.5"
            max="10.0"
            step="0.1"
            value={hba1c}
            onChange={(e) => setHba1c(parseFloat(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>&lt; 5.7% సాధారణం</span>
            <span>5.7 - 6.4% ప్రీ-డయాబెటిస్</span>
            <span>&ge; 6.5% డయాబెటిస్</span>
          </div>
        </div>

        {/* Fasting Blood Sugar Slider */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              🥣 Fasting Glucose (ఉపవాస చక్కెర)
            </span>
            <span className="font-black text-slate-900 dark:text-white text-base">
              {fastingSugar} mg/dL
            </span>
          </div>
          <input
            type="range"
            min="70"
            max="220"
            step="1"
            value={fastingSugar}
            onChange={(e) => setFastingSugar(parseInt(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>&lt; 100 mg/dL సాధారణం</span>
            <span>100-125 బోర్డర్‌లైన్</span>
            <span>&ge; 126 డయాబెటిస్</span>
          </div>
        </div>

        {/* Triglycerides Slider */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              🥑 Triglycerides (రక్తంలోని కొవ్వులు)
            </span>
            <span className="font-black text-slate-900 dark:text-white text-base">
              {triglycerides} mg/dL
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="350"
            step="5"
            value={triglycerides}
            onChange={(e) => setTriglycerides(parseInt(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>&lt; 150 సరైనది</span>
            <span>150-199 మితం</span>
            <span>&ge; 200 అధికం</span>
          </div>
        </div>

        {/* HDL Good Cholesterol Slider */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              🛡️ HDL (మంచి కొలెస్ట్రాల్)
            </span>
            <span className="font-black text-slate-900 dark:text-white text-base">
              {hdl} mg/dL
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="75"
            step="1"
            value={hdl}
            onChange={(e) => setHdl(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>&lt; 40 తక్కువ (ప్రమాదం)</span>
            <span>40-50 సగటు</span>
            <span>&gt; 50 ఉత్తమం</span>
          </div>
        </div>
      </div>

      {/* Calculated Risk Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Glycemic Status Card */}
        <div className={`p-4 rounded-2xl border ${glycemic.color} space-y-1`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider">
              {locale === "te" ? "గ్లైసెమిక్ స్థితి (రక్తంలో చక్కెర)" : "Glycemic Status"}
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60">
              {glycemic.badge}
            </span>
          </div>
          <h4 className="text-sm font-black">
            {locale === "te" ? glycemic.labelTe : glycemic.labelEn}
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            {hba1c < 5.7
              ? "మీ రక్తంలో చక్కెర నియంత్రణ చాలా బాగుంది. ఈ జీవనశైలిని కొనసాగించండి."
              : "ఆహారంలో తెల్ల అన్నం, చక్కెర పదార్థాలు తగ్గించి, రోజూ 20 నిమిషాల వేగవంతమైన నడక చేయండి."}
          </p>
        </div>

        {/* Insulin Resistance TG/HDL Ratio Card */}
        <div className={`p-4 rounded-2xl border ${lipid.color} space-y-1`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider">
              {locale === "te" ? "ఇన్సులిన్ నిరోధక సూచిక (TG / HDL Ratio)" : "Insulin Resistance Index"}
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60">
              Ratio: <KineticCounter value={tgHdlRatio} />
            </span>
          </div>
          <h4 className="text-sm font-black">
            {locale === "te" ? lipid.labelTe : lipid.labelEn}
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            {tgHdlRatio <= 2.0
              ? "కార్డియో-మెటబాలిక్ రక్షణ ఉత్తమంగా ఉంది. ధమనులలో కొవ్వు పేరుకుపోయే ప్రమాదం తక్కువ."
              : "దక్షిణాసియా వారిలో TG/HDL నిష్పత్తి 3.0 దాటితే రక్తనాళాలలో సమస్యలు వచ్చే అవకాశం ఉంటుంది. ఆహారంలో పెసరట్టు, రసం, చేపలు మరియు గుడ్లు చేర్చండి."}
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

