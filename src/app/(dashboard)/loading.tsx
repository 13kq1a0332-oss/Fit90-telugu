import React from "react";

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse"
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* Hero Metric Card Skeleton */}
      <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      {/* Grid Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <span className="sr-only">డాష్‌బోర్డ్ లోడ్ అవుతోంది... / Loading dashboard data...</span>
    </div>
  );
}

