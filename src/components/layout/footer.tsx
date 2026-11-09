"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import {
  ShieldCheck,
  HeartPulse,
  PhoneCall,
  Globe,
  Sparkles,
  Lock,
  Download,
} from "lucide-react";

export function Footer() {
  const { locale, setLocale } = useI18n();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl relative z-10 text-xs text-slate-600 dark:text-slate-400">
      {/* Top Clinical & Emergency Guidance Strip */}
      <div className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 border-b border-emerald-500/20 py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              {locale === "te"
                ? "వైద్య అత్యవసర మార్గదర్శకం (Emergency Protocol):"
                : "Medical Emergency Advice:"}
            </span>
            <span className="text-slate-600 dark:text-slate-400 text-xs">
              {locale === "te"
                ? "తీవ్రమైన గుండె నొప్పి లేదా ఊపిరాడకపోతే తక్షణమే సంప్రదించండి:"
                : "For severe chest pain or acute breathlessness, call:"}
            </span>
          </div>

          <a
            href="tel:108"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-black text-xs hover:bg-rose-500/25 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>108 / 112 (ఉచిత అంబులెన్స్ & అత్యవసర సేవలు)</span>
          </a>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
              F90
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white">
              Fit90 <span className="text-emerald-600">తెలుగు</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
            {locale === "te"
              ? "తెలుగు వారి జీవనశైలి, ఆసియా-భారతీయ శరీర కొలతలు మరియు స్థానిక ఆహార అలవాట్లకు అనుగుణంగా రూపొందించబడిన 90 రోజుల స్థిరమైన ఆరోగ్య ప్లాట్‌ఫామ్."
              : "South Asian metabolic health and sustainable 90-day weight loss PWA. Native Telugu nutrition, knee-safe movement, and private health records."}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>ICMR-NIN Guidelines</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>100% Private RLS Vault</span>
            </span>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="space-y-2.5">
          <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            {locale === "te" ? "ముఖ్య లింకులు" : "Core Features"}
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                {locale === "te" ? "డాష్‌బోర్డ్ (Dashboard)" : "Dashboard"}
              </Link>
            </li>
            <li>
              <Link href="/diet" className="hover:text-emerald-600 transition-colors">
                {locale === "te" ? "తెలుగు ఆహార సూచిక (Diet)" : "Telugu Food Catalog"}
              </Link>
            </li>
            <li>
              <Link href="/workouts" className="hover:text-emerald-600 transition-colors">
                {locale === "te" ? "13 వారాల నడక (Workouts)" : "Walking Progression"}
              </Link>
            </li>
            <li>
              <Link href="/health" className="hover:text-emerald-600 transition-colors">
                {locale === "te" ? "ఆరోగ్య రికార్డులు (Vitals)" : "Health & Lab Vault"}
              </Link>
            </li>
            <li>
              <Link href="/insights" className="hover:text-emerald-600 transition-colors">
                {locale === "te" ? "AI లైఫ్‌స్టైల్ కోచ్ (AI Coach)" : "AI Lifestyle Coach"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Language & PWA Controls */}
        <div className="space-y-3">
          <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            {locale === "te" ? "భాష & యాప్" : "Language & PWA"}
          </h4>

          {/* Language Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-slate-100/70 dark:bg-slate-900/70">
            <button
              type="button"
              onClick={() => setLocale("te")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                locale === "te"
                  ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              తెలుగు
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                locale === "en"
                  ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              English
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {locale === "te"
              ? "ఈ వెబ్‌సైట్‌ను మీ మొబైల్ హోమ్ స్క్రీన్‌పై యాప్ లాగా ఇన్‌స్టాల్ చేసుకోవచ్చు."
              : "Installable as a Progressive Web App (PWA) with offline-safe read access."}
          </p>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Clinical Safety Disclaimer */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 px-4 py-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <p>
            {locale === "te"
              ? "గమనిక: Fit90 తెలుగు ఒక జీవనశైలి మరియు అలవాట్ల ట్రాకింగ్ అప్లికేషన్ మాత్రమే; ఇది ఏ వైద్య పరీక్షలను లేదా చికిత్సలను నిర్ధారించదు. ఏదైనా కొత్త డైట్ లేదా వ్యాయామం ప్రారంభించే ముందు మీ వ్యక్తిగత వైద్యుడిని సంప్రదించండి."
              : "Clinical Disclaimer: Fit90 Telugu is a lifestyle tracking application and does not provide medical diagnosis, treatment, or prescription. Consult a qualified physician before changing medications or starting intensive exercise."}
          </p>
          <span className="shrink-0 font-semibold text-slate-400">
            © {new Date().getFullYear()} Fit90 Telugu. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

