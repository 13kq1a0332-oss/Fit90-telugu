"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { Quote, Star, TrendingDown, HeartPulse, CheckCircle2 } from "lucide-react";

interface Story {
  id: string;
  nameTe: string;
  nameEn: string;
  roleTe: string;
  roleEn: string;
  locationTe: string;
  locationEn: string;
  initialWeight: string;
  finalWeight: string;
  keyMetricTe: string;
  keyMetricEn: string;
  quoteTe: string;
  quoteEn: string;
  tagTe: string;
  tagEn: string;
  avatarBg: string;
  initials: string;
}

export function TransformationStories() {
  const { locale } = useI18n();

  const stories: Story[] = [
    {
      id: "rajesh",
      nameTe: "శ్రీకాంత్ వర్మ (34 సం)",
      nameEn: "Srikanth Varma (34 y)",
      roleTe: "సాఫ్ట్‌వేర్ టీమ్ లీడ్",
      roleEn: "Software Team Lead",
      locationTe: "గచ్చిబౌలి, హైదరాబాద్",
      locationEn: "Gachibowli, Hyderabad",
      initialWeight: "112 kg",
      finalWeight: "104 kg",
      keyMetricTe: "నడుము: 108 cm → 98 cm (-10 cm)",
      keyMetricEn: "Waistline: 108 cm → 98 cm (-10 cm)",
      quoteTe: "రోజూ 10 గంటలు ల్యాప్‌టాప్ ముందు కూర్చోవడం వల్ల నడుము బరువు విపరీతంగా పెరిగింది. జిమ్‌లలో క్రాష్ డైట్స్ చేసినప్పుడు నీరసం, మోకాళ్ల నొప్పులు వచ్చాయి. Fit90 లో మన ఇంట్లో వండే పెసరట్టు, పప్పు, అన్నం తింటూ, రోజూ 20 నిమిషాల సులువైన నడకతో 90 రోజుల్లో 8 కిలోలు తగ్గాను.",
      quoteEn: "10 hours at a desk left me at 112 kg with painful knees. Generic gym diets caused severe fatigue. Fit90 kept my home meals intact (pesarattu, dal, boiled eggs) with a gentle walking progression. Down 8 kg and zero knee discomfort.",
      tagTe: "డెస్క్ వర్కర్స్ & మోకాళ్ల రక్షణ",
      tagEn: "Desk Worker & Knee Health",
      avatarBg: "from-emerald-600 to-teal-500",
      initials: "SV",
    },
    {
      id: "saritha",
      nameTe: "సరిత రావు (41 సం)",
      nameEn: "Saritha Rao (41 y)",
      roleTe: "బ్యాంక్ మేనేజర్",
      roleEn: "Bank Branch Manager",
      locationTe: "బెంజ్ సర్కిల్, విజయవాడ",
      locationEn: "Benz Circle, Vijayawada",
      initialWeight: "84 kg",
      finalWeight: "77 kg",
      keyMetricTe: "HbA1c: 7.6 → 6.3 | BP సాధారణ స్థితికి",
      keyMetricEn: "HbA1c: 7.6 → 6.3 | BP Normalized",
      quoteTe: "నాకు బోర్డర్‌లైన్ బీపీ మరియు షుగర్ రిస్క్ ఉండేది. ఈ యాప్‌లో రక్తపోటు వర్గీకరణ మరియు ఆహారంలో ప్రోటీన్ లెక్కించే విధానం నాకు బాగా నచ్చింది. అనవసర మందుల మీద ఆధారపడకుండా ఆహారపు అలవాట్లను మార్చుకోవడానికి ఇది ఒక మంచి గైడ్ లా పనిచేసింది.",
      quoteEn: "With borderline BP and rising HbA1c, I needed scientific tracking, not fad diets. Logging Telugu meals with accurate protein grams helped lower my blood pressure and brought my HbA1c down from 7.6 to 6.3.",
      tagTe: "జీవక్రియ & రక్తపోటు నియంత్రణ",
      tagEn: "Metabolic & BP Wellness",
      avatarBg: "from-teal-600 to-cyan-500",
      initials: "SR",
    },
    {
      id: "venkat",
      nameTe: "వెంకటేశ్వర్లు (52 సం)",
      nameEn: "Venkateswarlu (52 y)",
      roleTe: "రిటైల్ వ్యాపారి",
      roleEn: "Retail Business Owner",
      locationTe: "గుంటూరు",
      locationEn: "Guntur, Andhra Pradesh",
      initialWeight: "96 kg",
      finalWeight: "89 kg",
      keyMetricTe: "రాత్రి గురక (Snoring) పూర్తిగా తగ్గింది",
      keyMetricEn: "Sleep Apnea & Snoring Resolved",
      quoteTe: "రాత్రి నిద్రలో తీవ్రమైన గురక, పగలు నీరసంతో ఇబ్బంది పడేవాడిని. నాకు ఇంగ్లీష్ అంతగా రాదు. Fit90 మొత్తం తెలుగులోనే స్పష్టంగా ఉండటం వల్ల చాలా సులభంగా అర్థమైంది. రాత్రి అన్నం పరిమాణం తగ్గించి, సాయంత్రం గుగ్గిళ్ళు తినే అలవాటు వల్ల బరువుతో పాటు గురక సమస్య తగ్గింది.",
      quoteEn: "Severe snoring disrupted my sleep every night. Being comfortable only in Telugu, having the entire app natively in Telugu was a blessing. Simple swaps like portioning dinner rice and adding boiled legumes resolved my snoring completely.",
      tagTe: "నిద్ర & శ్వాసకోశ మెరుగుదల",
      tagEn: "Restful Sleep & Energy",
      avatarBg: "from-amber-600 to-emerald-500",
      initials: "VR",
    },
  ];

  return (
    <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          {locale === "te" ? "వాస్తవ విజయగాథలు" : "Real South Indian Results"}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3.5">
          {locale === "te"
            ? "మన ఇంటి ఆహారంతో 90 రోజుల్లో మారిన జీవితాలు"
            : "Sustainable Transformations with Home Food"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
          {locale === "te"
            ? "ఆకలి బాధలు, క్రాష్ డైట్స్ మరియు ఖరీదైన సప్లిమెంట్లు లేకుండా సాధించిన నిజమైన అనుభవాలు."
            : "No extreme starvation, no costly supplements. Verified real-life progress from Hyderabad, Vijayawada, and Guntur."}
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="glass-card card-spotlight rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 shadow-md relative"
          >
            {/* Tag */}
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                {locale === "te" ? story.tagTe : story.tagEn}
              </span>
            </div>

            {/* Quote text */}
            <div className="space-y-3 flex-1">
              <Quote className="h-6 w-6 text-emerald-500/40" />
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                &ldquo;{locale === "te" ? story.quoteTe : story.quoteEn}&rdquo;
              </p>
            </div>

            {/* Before/After Progress Banner */}
            <div className="my-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-500">{story.initialWeight}</span>
                <span className="text-slate-400">→</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                  {story.finalWeight}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{locale === "te" ? story.keyMetricTe : story.keyMetricEn}</span>
              </div>
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <div
                className={`h-10 w-10 rounded-2xl bg-gradient-to-tr ${story.avatarBg} text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0`}
              >
                {story.initials}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {locale === "te" ? story.nameTe : story.nameEn}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {locale === "te" ? story.roleTe : story.roleEn} • {locale === "te" ? story.locationTe : story.locationEn}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

