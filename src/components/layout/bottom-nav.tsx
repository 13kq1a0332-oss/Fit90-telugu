"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { LayoutDashboard, UtensilsCrossed, Dumbbell, HeartPulse, Sparkles, User } from "lucide-react";

export function BottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  // Hide on auth screens or landing page if desired
  const isAuthPage =
    pathname === "/" ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password");

  if (isAuthPage) return null;

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
    {
      href: "/profile",
      label: t.nav.profile,
      icon: User,
      active: pathname?.startsWith("/profile"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-slate-200/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl safe-area-bottom shadow-lg shadow-black/5"
    >
      <div className="grid h-16 grid-cols-6 items-center justify-around px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 ${
                item.active
                  ? "text-emerald-700 dark:text-emerald-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {item.active && (
                <span className="absolute -top-0.5 w-6 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 shadow-xs shadow-emerald-500" />
              )}
              <Icon className={`h-5 w-5 transition-transform duration-200 ${item.active ? "stroke-[2.5] scale-110" : "stroke-[1.75]"}`} />
              <span className="text-[10px] mt-0.5 truncate max-w-[64px] text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

