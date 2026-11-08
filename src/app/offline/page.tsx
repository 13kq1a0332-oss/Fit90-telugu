"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { WifiOff, RotateCw } from "lucide-react";

export default function OfflinePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 mb-6">
        <WifiOff className="h-10 w-10" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {t.pwa.offlineTitle}
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {t.pwa.offlineMessage}
      </p>
      <Button
        variant="primary"
        onClick={() => window.location.reload()}
        className="flex items-center gap-2"
      >
        <RotateCw className="h-4 w-4" />
        <span>{t.pwa.refreshButton}</span>
      </Button>
    </div>
  );
}

