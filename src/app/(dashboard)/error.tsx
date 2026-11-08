"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCw } from "lucide-react";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Fit90 Dashboard Section Error:", error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-6 my-8 max-w-lg mx-auto bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-center shadow-sm"
    >
      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-1">
        డాష్‌బోర్డ్ లోడ్ చేయడంలో లోపం / Failed to load dashboard
      </h2>

      <p className="text-sm text-rose-700 dark:text-rose-400 mb-5">
        ఈ విభాగాన్ని లోడ్ చేయడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.
        <br />
        <span className="text-xs">There was an issue loading this section. Please retry.</span>
      </p>

      <button
        type="button"
        id="dashboardErrorRetryBtn"
        onClick={() => reset()}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium px-5 py-2.5 shadow-sm transition active:scale-95"
      >
        <RotateCw className="h-4 w-4" />
        <span>మళ్లీ ప్రయత్నించండి / Retry</span>
      </button>
    </div>
  );
}

