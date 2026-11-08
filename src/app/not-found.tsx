import React from "react";
import Link from "next/link";
import { HelpCircle, Home, LayoutDashboard } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      role="main"
      className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center max-w-md mx-auto"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-6 shadow-sm">
        <HelpCircle className="h-10 w-10" />
      </div>

      <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 rounded-full mb-3">
        404 — పేజీ కనుగొనబడలేదు / Not Found
      </span>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        పేజీ కనుగొనబడలేదు
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        మీరు వెతుకుతున్న పేజీ అందుబాటులో లేదు లేదా తరలించబడింది.
        <br />
        <span className="text-xs text-slate-500">
          The page you are looking for does not exist or has been moved.
        </span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          id="notFoundDashboardBtn"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 shadow-sm transition active:scale-95"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>డాష్‌బోర్డ్ / Dashboard</span>
        </Link>

        <Link
          href="/"
          id="notFoundHomeBtn"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 shadow-sm transition"
        >
          <Home className="h-4 w-4" />
          <span>హోమ్ / Home</span>
        </Link>
      </div>
    </div>
  );
}

