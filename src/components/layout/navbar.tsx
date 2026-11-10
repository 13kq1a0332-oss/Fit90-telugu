"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "./language-toggle";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { getUserProfileAndGoal } from "@/lib/profile-store";
import {
  Activity,
  User,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  HeartPulse,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  userEmail?: string | null;
}

export function Navbar({ userEmail }: NavbarProps) {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("Member");

  // Load user name dynamically for the profile pill
  useEffect(() => {
    async function loadName() {
      try {
        const { profile } = await getUserProfileAndGoal();
        if (profile?.fullName && !profile.fullName.includes("Ramesh")) {
          setUserName(profile.fullName.split(" ")[0]);
        }
      } catch {}
    }
    loadName();
  }, []);

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

  const navItems = [
    {
      href: "/dashboard",
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/diet",
      label: t.nav.diet,
      icon: UtensilsCrossed,
      active: pathname?.startsWith("/diet"),
    },
    {
      href: "/workouts",
      label: t.nav.workouts,
      icon: Dumbbell,
      active: pathname?.startsWith("/workouts"),
    },
    {
      href: "/health",
      label: t.nav.health,
      icon: HeartPulse,
      active: pathname?.startsWith("/health"),
    },
    {
      href: "/insights",
      label: t.nav.insights,
      icon: Sparkles,
      active: pathname?.startsWith("/insights"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-navbar shadow-xs backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 w-full gap-4">
        {/* Left: Brand Logo & Title */}
        <Link
          href={userEmail ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white group shrink-0"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-all duration-200">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg leading-tight font-black tracking-tight text-slate-900 dark:text-white">
              Fit90 <span className="text-gradient-emerald">తెలుగు</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {locale === "te" ? "90 రోజుల జీవన ప్రయాణం" : "90-Day Metabolic Health"}
            </span>
          </div>
        </Link>

        {/* Center: 21st.dev Tubelight Floating Navigation Dock */}
        {userEmail && (
          <nav
            aria-label="Desktop primary navigation"
            className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md shadow-xs"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    item.active
                      ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs border border-slate-200/70 dark:border-slate-700/70"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {/* Tubelight Glowing Top Light Indicator */}
                  {item.active && (
                    <span className="absolute -top-1.5 left-3 right-3 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-in fade-in zoom-in duration-200" />
                  )}
                  <Icon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      item.active ? "stroke-[2.5] scale-110" : "stroke-[1.75]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: Unified Controls Cluster (Harmonious Rounded-Full Geometry) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <LanguageToggle />

          {!isAuthPage && !userEmail && (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-5 text-xs font-black text-white shadow-md shadow-emerald-500/25 transition-all hover:scale-102"
            >
              {t.nav.login}
            </Link>
          )}

          {userEmail && (
            <div className="flex items-center gap-2">
              {/* Profile Pill with Active Status Pulse */}
              <Link
                href="/profile"
                className={`flex items-center gap-2 h-10 px-3.5 rounded-full border transition-all shadow-xs ${
                  pathname === "/profile"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-emerald-500/10 font-black"
                    : "border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 font-bold"
                }`}
                aria-label={t.nav.profile}
                title={t.nav.profile}
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs truncate max-w-[80px] sm:max-w-[120px] hidden sm:inline">
                  {userName}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleClientLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all shadow-xs"
                aria-label={t.nav.logout}
                title={t.nav.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

