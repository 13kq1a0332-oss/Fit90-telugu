"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  HealthReminder,
  getHealthReminders,
  toggleHealthReminder,
  updateHealthReminderTime,
} from "@/lib/health-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Clock,
  Droplet,
  Utensils,
  Footprints,
  Moon,
  Scale,
  Plus,
  Check,
  Calendar,
} from "lucide-react";

export function RemindersManager() {
  const { locale, t } = useI18n();
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New reminder modal/state
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTitleEn, setCustomTitleEn] = useState("");
  const [customTitleTe, setCustomTitleTe] = useState("");
  const [customTime, setCustomTime] = useState("08:00");
  const [customType, setCustomType] = useState<HealthReminder["type"]>("walk");

  const loadData = async () => {
    const data = await getHealthReminders();
    setReminders(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (id: string, currentState: boolean) => {
    const newState = !currentState;
    await toggleHealthReminder(id, newState);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: newState } : r))
    );
  };

  const handleTimeChange = async (id: string, newTime: string) => {
    await updateHealthReminderTime(id, newTime);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, scheduledTime: newTime } : r))
    );
    setSavedNotice(id);
    setTimeout(() => setSavedNotice(null), 2000);
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitleEn && !customTitleTe) return;

    const newReminder: HealthReminder = {
      id: `rem_${Date.now()}`,
      type: customType,
      titleEn: customTitleEn || customTitleTe,
      titleTe: customTitleTe || customTitleEn,
      scheduledTime: customTime,
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      isEnabled: true,
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fit90_reminders", JSON.stringify(updated));
      } catch {}
    }

    setCustomTitleEn("");
    setCustomTitleTe("");
    setShowAddForm(false);
  };

  const getTypeIcon = (type: HealthReminder["type"]) => {
    switch (type) {
      case "water":
        return <Droplet className="h-4 w-4 text-sky-600 dark:text-sky-400" />;
      case "meal":
        return <Utensils className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "walk":
        return <Footprints className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "sleep":
        return <Moon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case "weight":
        return <Scale className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Bell className="h-4 w-4 text-slate-600" />;
    }
  };

  const daysLabels = locale === "te"
    ? ["సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని", "ఆది"]
    : ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="space-y-6">
      {/* Header and Add Reminder Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.health.remindersTitle}
          </h3>
          <p className="text-xs text-slate-500">{t.health.remindersSubtitle}</p>
        </div>

        <Button
          id="openAddReminderBtn"
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm(!showAddForm)}
          className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
        >
          <Plus className="h-4 w-4" />
          <span>{t.health.addReminder}</span>
        </Button>
      </div>

      {/* Add Custom Form */}
      {showAddForm && (
        <Card className="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10 animate-in fade-in duration-200">
          <CardContent className="p-4">
            <form onSubmit={handleAddCustom} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Reminder Title (English)</Label>
                  <Input
                    placeholder="e.g. Drink 2 glasses of water"
                    value={customTitleEn}
                    onChange={(e) => setCustomTitleEn(e.target.value)}
                    className="mt-1 bg-white dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">శీర్షిక (తెలుగు)</Label>
                  <Input
                    placeholder="ఉదా: 2 గ్లాసుల మంచి నీరు త్రాగండి"
                    value={customTitleTe}
                    onChange={(e) => setCustomTitleTe(e.target.value)}
                    className="mt-1 bg-white dark:bg-slate-900 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">{t.health.reminderTime}</Label>
                  <Input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="mt-1 bg-white dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  {t.common.cancel}
                </Button>
                <Button
                  id="submitCustomReminderBtn"
                  type="submit"
                  size="sm"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  {t.common.save}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reminders List */}
      <div className="space-y-3" id="remindersContainer">
        {reminders.map((reminder) => (
          <Card
            key={reminder.id}
            className={`border transition-all ${
              reminder.isEnabled
                ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                : "border-slate-100 dark:border-slate-800/40 bg-slate-50/60 dark:bg-slate-950/40 opacity-70"
            }`}
          >
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    reminder.isEnabled
                      ? "bg-slate-100 dark:bg-slate-800"
                      : "bg-slate-100 dark:bg-slate-800 opacity-60"
                  }`}
                >
                  {getTypeIcon(reminder.type)}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      reminder.isEnabled
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-500 line-through"
                    }`}
                  >
                    {locale === "te" ? reminder.titleTe : reminder.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {reminder.scheduledTime}
                    </span>
                    <div className="flex items-center gap-1">
                      {daysLabels.map((day, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] px-1 py-0.2 rounded font-semibold ${
                            reminder.daysOfWeek.includes(idx + 1)
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "text-slate-400"
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls: Time Input + Switch Toggle */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="relative">
                  <Input
                    type="time"
                    aria-label={`Time for ${reminder.titleEn}`}
                    data-testid={`reminder-time-input-${reminder.id}`}
                    value={reminder.scheduledTime}
                    onChange={(e) => handleTimeChange(reminder.id, e.target.value)}
                    className="w-24 h-8 text-xs font-mono bg-slate-50 dark:bg-slate-800"
                  />
                  {savedNotice === reminder.id && (
                    <span className="absolute -bottom-4 right-0 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      <Check className="h-2.5 w-2.5" /> saved
                    </span>
                  )}
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={reminder.isEnabled}
                  data-testid={`toggle-reminder-${reminder.id}`}
                  onClick={() => handleToggle(reminder.id, reminder.isEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    reminder.isEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reminder.isEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

