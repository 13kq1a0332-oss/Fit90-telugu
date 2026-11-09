"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "./language-toggle";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { Activity, User, LogOut } from "lucide-react";

interface NavbarProps {
  userEmail?: string | null;
}

export function Navbar({ userEmail }: NavbarProps) {
  const { t, locale } = useI18n();
  const pathname = usePathname();

  const handleClientLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("fit90_user_profile");
        localStorage.removeItem("fit90_user_goals");
        localStorage.removeItem("fit90_current_user");
        localStorage.removeItem("fit90_active_meal_plan");
        localStorage.removeItem("fit90_food_logs");
        document.cookie = "fit90_client_demo=; max-age=0; path=/;";
      } catch {}
    }
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    window.location.href = "/login";
  };

  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password");

  return (
    <header className="sticky top-0 z-40 w-full glass-navbar shadow-xs">
      <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href={userEmail ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-all duration-200">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg leading-tight font-black tracking-tight text-slate-900 dark:text-white">
              Fit90 <span className="text-gradient-emerald">తెలుగు</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {locale === "te" ? "90 రోజుల జీవన ప్రయాణం" : "90-Day Metabolic Health"}
            </span>
          </div>
        </Link>

        {userEmail && (
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pathname === "/dashboard"
                  ? "bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.dashboard}
            </Link>
            <Link
              href="/diet"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pathname?.startsWith("/diet")
                  ? "bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.diet}
            </Link>
            <Link
              href="/workouts"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pathname?.startsWith("/workouts")
                  ? "bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.workouts}
            </Link>
            <Link
              href="/health"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pathname?.startsWith("/health")
                  ? "bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.health}
            </Link>
            <Link
              href="/insights"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                pathname?.startsWith("/insights")
                  ? "bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.insights}
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2.5">
          <LanguageToggle />

          {!isAuthPage && !userEmail && (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              {t.nav.login}
            </Link>
          )}

          {userEmail && (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                aria-label={t.nav.profile}
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={handleClientLogout}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-red-950/40 transition-colors"
                aria-label={t.nav.logout}
                title={t.nav.logout}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

