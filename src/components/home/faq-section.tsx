"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  qTe: string;
  qEn: string;
  aTe: string;
  aEn: string;
}

export function FaqSection() {
  const { locale } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      qTe: "అన్నం తింటూ నిజంగా బరువు తగ్గవచ్చా?",
      qEn: "Can I really lose weight while still eating rice and home food?",
      aTe: "ఖచ్చితంగా తగ్గవచ్చు. బరువు పెరగడానికి లేదా తగ్గడానికి ప్రధాన కారణం మీరు రోజంతా తీసుకునే మొత్తం క్యాలరీలు మరియు ప్రోటీన్ సమతుల్యత. అన్నాన్ని పూర్తిగా మానివేయాల్సిన అవసరం లేదు. సోనా మసూరి అన్నాన్ని కప్పు పరిమాణంలో కొలిచి, దానికి పప్పు, గుడ్లు లేదా పన్నీర్ వంటి ప్రోటీన్ జత చేయడం ద్వారా ఆకలి వేయకుండా స్థిరంగా బరువు తగ్గవచ్చు.",
      aEn: "Yes, absolutely. Weight management depends on overall caloric balance and adequate protein, not cutting out rice. By measuring rice in standardized katoris/grams and pairing it with high-protein sides (dal, eggs, paneer), you stay full and lose fat sustainably without starvation.",
    },
    {
      qTe: "నాకు మోకాళ్ల నొప్పులు ఉన్నాయి, వ్యాయామాలు చేయవచ్చా?",
      qEn: "I have knee and lower-back pain. Is it safe to exercise?",
      aTe: "అవును. అధిక బరువు ఉన్నప్పుడు పరిగెత్తడం వల్ల మోకాళ్ల కీళ్లపై శరీర బరువుకు 4 నుండి 6 రెట్లు ఒత్తిడి పడుతుంది. అందుకే Fit90 లో కేవలం లో-ఇంపాక్ట్ (కీళ్లకు హాని కలగని) నడక మరియు కుర్చీ స్క్వాట్లు, వాల్ సిట్స్ వంటి సురక్షిత కదలికలు మాత్రమే ఉంటాయి. నొప్పి వచ్చిన వెంటనే 1-క్లిక్‌తో ప్రత్యామ్నాయ వ్యాయామాన్ని ఎంచుకోవచ్చు.",
      aEn: "Yes. High body weight subjects knees to 4-6x ground force during running. Fit90 avoids running entirely, providing a 13-week low-impact walking ladder and knee-safe exercises (chair squats, glute bridges) with one-click alternatives if you feel any discomfort.",
    },
    {
      qTe: "నా రక్త పరీక్షలు (hs-CRP, విటమిన్ D, లిపిడ్ ప్రొఫైల్) ఎంతవరకు సురక్షితం?",
      qEn: "How private and secure are my uploaded medical lab reports?",
      aTe: "మీ మెడికల్ డాక్యుమెంట్లు మరియు బ్లడ్ రిపోర్టులు 100% ప్రైవేట్. Supabase Row Level Security (RLS) ఎన్‌క్రిప్షన్ ద్వారా మీ డేటాను మీరు తప్ప మరొకరు చూడలేరు. మీ సమాచారాన్ని ఏ విధమైన ప్రకటనల సంస్థలకు అమ్మడం లేదా పంచుకోవడం జరగదు.",
      aEn: "100% private. All PDF documents and lab values are encrypted and protected by PostgreSQL Row Level Security (RLS). Only your authenticated account has access. We never sell or share medical data with advertisers.",
    },
    {
      qTe: "క్రాష్ డైట్స్ వల్ల బరువు త్వరగా తగ్గుతుంది కదా, 90 రోజుల సమయం ఎందుకు?",
      qEn: "Crash diets promise faster weight loss. Why take 90 days?",
      aTe: "క్రాష్ డైట్స్ (కేవలం పండ్లు లేదా రసాలు తాగడం) వల్ల తగ్గేది నీరు మరియు కండరాలు మాత్రమే, కొవ్వు కాదు. దానివల్ల జుట్టు రాలడం, నీరసం మరియు డైట్ ఆపగానే అంతకంటే ఎక్కువ బరువు పెరిగే ప్రమాదం (రీబౌండ్ వెయిట్ గెయిన్) ఉంటుంది. 90 రోజుల్లో వారానికి 0.5 కిలోల చొప్పున తగ్గడం వల్ల జీవక్రియ చురుగ్గా ఉండి, తగ్గిన బరువు జీవితాంతం నిలకడగా ఉంటుంది.",
      aEn: "Crash starvation drops water weight and muscle mass, damaging your resting metabolism and triggering rapid rebound weight gain. A structured 90-day protocol burns visceral fat while preserving muscle, ensuring permanent lifestyle results.",
    },
    {
      qTe: "Fit90 తెలుగు ఉపయోగించడానికి ఏదైనా ఫీజు లేదా సబ్‌స్క్రిప్షన్ చెల్లించాలా?",
      qEn: "Is there any subscription fee or hidden cost to use Fit90?",
      aTe: "లేదు, Fit90 ప్రధాన ట్రాకింగ్, పోర్షన్ కాలిక్యులేటర్, వర్కౌట్ ప్లాన్ మరియు హెల్త్ వాల్ట్ ఫీచర్లు పూర్తిగా ఉచితం. ఇది తెలుగు ప్రజల ఆరోగ్య భద్రత కోసం రూపొందించబడిన స్వచ్ఛమైన అప్లికేషన్.",
      aEn: "No. The core 90-day tracking, Telugu portion calculator, knee-safe workouts, and health vitals vault are completely free. No subscription walls or payment traps.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:py-20 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          <HelpCircle className="h-3.5 w-3.5 inline mr-1" />
          {locale === "te" ? "తరచుగా అడిగే ప్రశ్నలు" : "Frequently Asked Questions"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3.5">
          {locale === "te"
            ? "మీ సందేహాలు — మా స్పష్టమైన సమాధానాలు"
            : "Clear Answers for Your Health Journey"}
        </h2>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>{locale === "te" ? faq.qTe : faq.qEn}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 animate-in fade-in duration-200">
                  {locale === "te" ? faq.aTe : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
