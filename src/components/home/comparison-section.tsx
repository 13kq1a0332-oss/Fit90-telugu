"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { Check, X, ShieldAlert, Sparkles, HeartPulse, Scale, Utensils } from "lucide-react";

export function ComparisonSection() {
  const { locale } = useI18n();

  const comparisonRows = [
    {
      featureTe: "ఆహార విధానం (Food & Diet)",
      featureEn: "Nutrition & Diet",
      genericTe: "సలాడ్లు, ఓట్స్, స్మూతీలు (కష్టమైన విదేశీ పద్ధతి)",
      genericEn: "Salads, oats, green juices (Unrealistic Western diets)",
      fit90Te: "అన్నం, పప్పు, పెసరట్లు, రాగి సంకటి, గుడ్లు, మజ్జిగ (ఇంటి భోజనం)",
      fit90En: "Home cooked staples: Dal, rice, pesarattu, eggs, curd & curries",
    },
    {
      featureTe: "వ్యాయామం & కీళ్ల రక్షణ (Workouts)",
      featureEn: "Exercise & Joint Safety",
      genericTe: "అధిక బరువుతో పరిగెత్తడం (మోకాళ్ల నొప్పుల ప్రమాదం)",
      genericEn: "Aggressive jogging & HIIT (high knee and back injury risk)",
      fit90Te: "13 వారాల లో-ఇంపాక్ట్ నడక మరియు మోకాలి నొప్పి ప్రత్యామ్నాయాలు",
      fit90En: "13-week low-impact walking progression + 1-click knee swaps",
    },
    {
      featureTe: "వైద్యపరమైన భద్రత (Clinical Safety)",
      featureEn: "Medical Safety Deflection",
      genericTe: "ఎమర్జెన్సీ రక్షణ లేదు; తప్పుడు గ్యారెంటీలు",
      genericEn: "No emergency deflection, unscientific rapid weight loss claims",
      fit90Te: "180/120 BP సంక్షోభ గుర్తింపు మరియు 108/112 తక్షణ హెచ్చరిక",
      fit90En: "AHA/ICMR staging, >180/>120 BP crisis alerts & instant 108 helpline",
    },
    {
      featureTe: "భాష & సంస్కృతి (Bilingual Localization)",
      featureEn: "Cultural & Native Language",
      genericTe: "కేవలం ఇంగ్లీష్ మాత్రమే అందుబాటులో ఉంటుంది",
      genericEn: "English-only interfaces with complex Western terminology",
      fit90Te: "100% స్పష్టమైన తెలుగు & ఇంగ్లీష్ ద్విభాషా వెసులుబాటు",
      fit90En: "100% native toggle between Telugu and English across all metrics",
    },
    {
      featureTe: "డేటా ప్రైవసీ (Data Privacy)",
      featureEn: "Medical Records & Privacy",
      genericTe: "మీ ఆరోగ్య సమాచారం ప్రకటనల కోసం ట్రాక్ అవుతుంది",
      genericEn: "Data shared with ad networks and third-party trackers",
      fit90Te: "జీరో యాడ్స్; 100% ఎన్‌క్రిప్టెడ్ ప్రైవేట్ ల్యాబ్ వాల్ట్",
      fit90En: "Zero ads, zero data selling, RLS-encrypted private lab vault",
    },
  ];

  return (
    <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          {locale === "te" ? "స్పష్టమైన తేడా" : "The Fit90 Difference"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3.5">
          {locale === "te"
            ? "సాధారణ క్రాష్ యాప్‌లకు, Fit90 కి మధ్య తేడా ఏమిటి?"
            : "Why Generic Diet Apps Fail South Asians"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
          {locale === "te"
            ? "మన జీవనశైలికి విరుద్ధమైన ఆహారాలు కాకుండా, మన సంప్రదాయ పద్ధతికి ఆధునిక విజ్ఞానాన్ని జోడించాం."
            : "Generic apps ignore Indian genetics, vegetarian protein needs, and visceral fat thresholds. Here is how we differ."}
        </p>
      </div>

      {/* Comparison Table Card */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl">
        <div className="grid grid-cols-12 bg-slate-100/80 dark:bg-slate-900/80 p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-black">
          <div className="col-span-4 sm:col-span-4 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {locale === "te" ? "ప్రమాణం (Factor)" : "Factor"}
          </div>
          <div className="col-span-4 sm:col-span-4 text-slate-500 line-through truncate">
            {locale === "te" ? "సాధారణ క్రాష్ యాప్స్" : "Generic Diet Apps"}
          </div>
          <div className="col-span-4 sm:col-span-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-black">
            <Sparkles className="h-4 w-4" />
            <span className="truncate">Fit90 తెలుగు</span>
          </div>
        </div>

        <div className="divide-y divide-slate-200/60 dark:divide-slate-800/80">
          {comparisonRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center transition-colors ${
                idx % 2 === 0 ? "bg-white/40 dark:bg-slate-900/20" : "bg-slate-50/40 dark:bg-slate-900/40"
              }`}
            >
              <div className="col-span-4 font-bold text-slate-900 dark:text-white pr-2">
                {locale === "te" ? row.featureTe : row.featureEn}
              </div>

              <div className="col-span-4 text-slate-500 pr-2 flex items-start gap-1.5 text-xs">
                <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{locale === "te" ? row.genericTe : row.genericEn}</span>
              </div>

              <div className="col-span-4 text-slate-800 dark:text-slate-200 font-medium flex items-start gap-1.5 text-xs">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold text-emerald-950 dark:text-emerald-200">
                  {locale === "te" ? row.fit90Te : row.fit90En}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
