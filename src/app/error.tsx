"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to console or error tracking service
    console.error("Fit90 Global Application Error:", error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center max-w-lg mx-auto"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mb-6 shadow-sm">
        <AlertTriangle className="h-9 w-9" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        ఏదో తప్పు జరిగింది / Something went wrong
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        దయచేసి మళ్లీ ప్రయత్నించండి. సమస్య కొనసాగితే పేజీని రిఫ్రెష్ చేయండి.
        <br />
        <span className="text-xs text-slate-500">
          Please try again. If the issue persists, try refreshing the page.
        </span>
      </p>

      {error.digest && (
        <div className="mb-6 rounded-lg bg-slate-100 dark:bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
          Error Digest: {error.digest}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          id="globalErrorRetryBtn"
          onClick={() => reset()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 shadow-sm transition active:scale-95"
        >
          <RotateCw className="h-4 w-4" />
          <span>మళ్లీ ప్రయత్నించండి / Try Again</span>
        </button>

        <Link
          href="/dashboard"
          id="globalErrorHomeBtn"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium px-4 py-2.5 shadow-sm transition"
        >
          <Home className="h-4 w-4" />
          <span>డాష్‌బోర్డ్ / Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

