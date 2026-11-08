"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "./language-toggle";
import { useI18n } from "@/lib/i18n/context";
import { Activity, User, LogOut } from "lucide-react";

interface NavbarProps {
  userEmail?: string | null;
}

export function Navbar({ userEmail }: NavbarProps) {
  const { t, locale } = useI18n();
  const pathname = usePathname();

  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href={userEmail ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20 group-hover:bg-emerald-700 transition-colors">
            <Activity className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg leading-tight font-black tracking-tight text-emerald-800 dark:text-emerald-400">
              Fit90 <span className="text-slate-900 dark:text-white font-medium">తెలుగు</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">
              {locale === "te" ? "90 రోజుల ప్రయాణం" : "90-Day Journey"}
            </span>
          </div>
        </Link>

        {userEmail && (
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/dashboard"
                  ? "bg-slate-100 font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.dashboard}
            </Link>
            <Link
              href="/diet"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname?.startsWith("/diet")
                  ? "bg-slate-100 font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.diet}
            </Link>
            <Link
              href="/workouts"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname?.startsWith("/workouts")
                  ? "bg-slate-100 font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.workouts}
            </Link>
            <Link
              href="/health"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname?.startsWith("/health")
                  ? "bg-slate-100 font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {t.nav.health}
            </Link>
            <Link
              href="/insights"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname?.startsWith("/insights")
                  ? "bg-slate-100 font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
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
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-red-950/40"
                  aria-label={t.nav.logout}
                  title={t.nav.logout}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

