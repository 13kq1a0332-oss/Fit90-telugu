import React from "react";

export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-950 dark:border-t-emerald-400" />
        <div className="absolute h-6 w-6 rounded-full bg-emerald-600/20 animate-pulse" />
      </div>
      <p className="mt-4 text-base font-medium text-slate-800 dark:text-slate-200">
        లోడ్ అవుతోంది... / Loading...
      </p>
      <span className="sr-only">దయచేసి వేచి ఉండండి, పేజీ లోడ్ అవుతోంది / Please wait, page is loading</span>
    </div>
  );
}

