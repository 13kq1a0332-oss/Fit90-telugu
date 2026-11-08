"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  NotificationPreferences,
  getNotificationPreferences,
  saveNotificationPreferences,
} from "@/lib/insights-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Mail,
  MessageSquare,
  Moon,
  Clock,
  CheckCircle2,
  Droplet,
  ShieldCheck,
} from "lucide-react";

export function NotificationPreferencesView() {
  const { locale, t } = useI18n();
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getNotificationPreferences();
      setPrefs(data);
    }
    load();
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!prefs) return;
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefs) return;

    await saveNotificationPreferences(prefs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!prefs) return null;

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.insights.notificationsTitle}</span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.insights.notificationsSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>User Controlled</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6 text-xs sm:text-sm">
            {/* 1. Push Notifications Toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {t.insights.pushNotifications}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.insights.pushDesc}</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                id="togglePushNotificationsBtn"
                aria-checked={prefs.pushEnabled}
                onClick={() => handleToggle("pushEnabled")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  prefs.pushEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    prefs.pushEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* 2. Weekly Email Summary Toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {t.insights.weeklyEmailSummary}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.insights.weeklyEmailDesc}</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                id="toggleWeeklyEmailBtn"
                aria-checked={prefs.emailWeeklySummary}
                onClick={() => handleToggle("emailWeeklySummary")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  prefs.emailWeeklySummary ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    prefs.emailWeeklySummary ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* 3. WhatsApp / SMS Digest Enabled */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {t.insights.whatsappDigest}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.insights.whatsappDesc}</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                id="toggleWhatsappDigestBtn"
                aria-checked={prefs.whatsappDigestEnabled}
                onClick={() => handleToggle("whatsappDigestEnabled")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  prefs.whatsappDigestEnabled ? "bg-green-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    prefs.whatsappDigestEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* 4. Quiet Hours */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-indigo-500" />
                <h4 className="font-bold text-slate-900 dark:text-white">
                  {t.insights.quietHoursTitle}
                </h4>
              </div>
              <p className="text-xs text-slate-500">{t.insights.quietHoursDesc}</p>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <Label htmlFor="quietStart" className="text-xs font-semibold">
                    {t.insights.quietStart}
                  </Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={prefs.quietHoursStart}
                    onChange={(e) =>
                      setPrefs({ ...prefs, quietHoursStart: e.target.value })
                    }
                    className="mt-1 font-mono text-xs"
                  />
                </div>

                <div>
                  <Label htmlFor="quietEnd" className="text-xs font-semibold">
                    {t.insights.quietEnd}
                  </Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={prefs.quietHoursEnd}
                    onChange={(e) =>
                      setPrefs({ ...prefs, quietHoursEnd: e.target.value })
                    }
                    className="mt-1 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {isSaved && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  {t.insights.preferencesSaved}
                </span>
              )}
              <Button
                id="saveNotificationPreferencesBtn"
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                {t.common.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

