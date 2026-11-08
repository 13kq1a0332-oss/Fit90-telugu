"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Navbar } from "@/components/layout/navbar";
import { SafetyBanner, EmergencyNoticeModal } from "@/components/layout/safety-banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Utensils,
  Dumbbell,
  ShieldCheck,
  CheckCircle,
  TrendingDown,
  Sparkles,
  ArrowRight,
  HeartPulse,
} from "lucide-react";

export default function HomePage() {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <SafetyBanner />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-10 pb-16 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-bold text-emerald-800 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {locale === "te"
                ? "తెలుగు వారి కోసం ప్రత్యేకంగా రూపొందించబడింది"
                : "Designed specifically for Telugu & Indian lifestyles"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {locale === "te" ? (
              <>
                <span className="text-emerald-700">90 రోజులలో</span> స్థిరమైన బరువు నిర్వహణ & పూర్తి ఆరోగ్యం
              </>
            ) : (
              <>
                Sustainable Weight Loss in{" "}
                <span className="text-emerald-700">90 Days</span>
              </>
            )}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.app.tagline}.{" "}
            {locale === "te"
              ? "కఠినమైన డైటింగ్‌లు లేకుండా, మన ఇంటి భోజనంతో, మోకాళ్లకు హాని కలగని నడకతో మీ ఆరోగ్యాన్ని మెరుగుపరుచుకోండి."
              : "No extreme crash deficits. Authentic South Indian nutrition, knee-safe walking progression, and private tracking."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base font-bold shadow-md shadow-emerald-700/25">
                <span>{t.auth.signupButton}</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-bold">
                {t.auth.loginButton}
              </Button>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-6 border-y border-slate-200/80 py-6 max-w-xl mx-auto text-center">
            <div>
              <div className="text-2xl font-black text-slate-900">90</div>
              <div className="text-xs text-slate-500 font-medium">
                {locale === "te" ? "రోజుల ప్రయాణం" : "Day Program"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-700">100%</div>
              <div className="text-xs text-slate-500 font-medium">
                {locale === "te" ? "తెలుగు & ఇంగ్లీష్" : "Bilingual PWA"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">0</div>
              <div className="text-xs text-slate-500 font-medium">
                {locale === "te" ? "కఠినమైన ఆహార నియమాలు" : "Crash Diets"}
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars Section */}
        <section className="px-4 py-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">
              {locale === "te" ? "ఫిట్90 ముఖ్య సూత్రాలు" : "The Core Fit90 Principles"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {locale === "te"
                ? "శాస్త్రీయమైన, స్థిరమైన మరియు మీ సంస్కృతికి సరిపోయే విధానం"
                : "Evidence-based, habit-focused, and culturally attuned"}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-5 border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-4">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {locale === "te" ? "మన ఇంటి ఆహార పోషణ" : "Indian Nutritional Accuracy"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {locale === "te"
                  ? "ఇడ్లీ, పెసరట్టు, పప్పు, అన్నం వంటి మన ఆహారాల ఖచ్చితమైన క్యాలరీలు & ప్రోటీన్ కొలతలు."
                  : "Accurate per-100g cooked/raw macros for staples: idli, pesarattu, toor dal, rice, and curries."}
              </p>
            </Card>

            <Card className="p-5 border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 mb-4">
                <Dumbbell className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {locale === "te" ? "మోకాళ్లకు రక్షణతో వ్యాయామం" : "Knee-Safe Progression"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {locale === "te"
                  ? "అధిక బరువు ఉన్నవారి మోకాళ్లను రక్షిస్తూ 13 వారాల క్రమమైన నడక మరియు కుర్చీ వ్యాయామాలు."
                  : "Low-impact 13-week walking program with chair-assisted movements to protect joints."}
              </p>
            </Card>

            <Card className="p-5 border-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1.5">
                {locale === "te" ? "సంపూర్ణ గోప్యత & భద్రత" : "Private & Secure Tracking"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {locale === "te"
                  ? "మీ బరువు, రక్తపోటు, ల్యాబ్ రికార్డులు పూర్తిగా మీ నియంత్రణలోనే భద్రపరచబడతాయి."
                  : "Strict Row Level Security (RLS) protects your personal vitals, weight, and test logs."}
              </p>
            </Card>
          </div>
        </section>

        {/* Safety & Medical Disclaimers Section */}
        <section className="px-4 py-8 max-w-4xl mx-auto">
          <EmergencyNoticeModal />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-slate-700">
            Fit90 Telugu • ఫిట్90 తెలుగు
          </p>
          <p className="max-w-xl mx-auto text-slate-400">
            {t.app.disclaimerLong}
          </p>
          <p className="text-slate-400 pt-2">
            © {new Date().getFullYear()} Fit90 Telugu. Built with Next.js, Supabase, & TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}

