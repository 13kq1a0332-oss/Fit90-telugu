"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { ShieldAlert, AlertTriangle, X } from "lucide-react";

export function SafetyBanner({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed && compact) return null;

  return (
    <aside
      aria-label="Medical disclaimer and health safety warning"
      className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/10 border-b border-amber-300/40 dark:border-amber-700/40 backdrop-blur-md px-4 py-2 text-xs text-amber-950 dark:text-amber-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400">
            <ShieldAlert className="h-3.5 w-3.5" />
          </span>
          <div className="flex-1 min-w-0 truncate">
            <span className="font-bold">{t.app.disclaimerShort}</span>
            {!compact && (
              <span className="hidden sm:inline text-amber-800/90 dark:text-amber-300/80 text-[11px] ml-2">
                — {t.app.disclaimerLong}
              </span>
            )}
          </div>
        </div>
        {compact && (
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="h-6 w-6 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}

export function EmergencyNoticeModal() {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
            ముఖ్యమైన ఆరోగ్య హెచ్చరిక / Medical Precaution
          </h4>
          <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
            {t.app.emergencyNotice}
          </p>
        </div>
      </div>
    </div>
  );
}

