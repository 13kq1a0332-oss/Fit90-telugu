"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-slate-100/90 p-1 border border-slate-200/80 dark:bg-slate-800/90 dark:border-slate-700/80 h-10 shadow-xs ${className || ""}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLocale("te")}
        className={`flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          locale === "te"
            ? "bg-emerald-600 text-white shadow-sm scale-102"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        }`}
        aria-pressed={locale === "te"}
      >
        <span>తెలుగు</span>
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          locale === "en"
            ? "bg-emerald-600 text-white shadow-sm scale-102"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        }`}
        aria-pressed={locale === "en"}
      >
        <span>EN</span>
      </button>
    </div>
  );
}

