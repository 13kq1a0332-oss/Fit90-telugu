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
      className="bg-amber-50/95 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-950 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200"
    >
      <div className="max-w-4xl mx-auto flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-0.5">
          <p className="font-semibold leading-relaxed">
            {t.app.disclaimerShort}
          </p>
          {!compact && (
            <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed text-[11px]">
              {t.app.disclaimerLong}
            </p>
          )}
        </div>
        {compact && (
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="text-amber-700 hover:text-amber-900 p-0.5"
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

