"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  CoachMessage,
  CoachContext,
  hasUserConsentedToAi,
  setUserAiConsent,
  generateCoachResponse,
} from "@/lib/ai/lifestyle-coach";
import { WeeklyDigest, computeWeeklyDigest } from "@/lib/insights-store";
import { getUserProfileAndGoal } from "@/lib/profile-store";
import { getFoodLogsForDate, getTodayDateString } from "@/lib/diet-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Send,
  AlertTriangle,
  Lock,
  RotateCcw,
  AlertOctagon,
} from "lucide-react";

export function AiCoachCard() {
  const { locale, t } = useI18n();
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [digest, setDigest] = useState<WeeklyDigest | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const [coachContext, setCoachContext] = useState<CoachContext>({});

  useEffect(() => {
    setHasConsented(hasUserConsentedToAi());
    async function load() {
      const d = await computeWeeklyDigest();
      setDigest(d);

      let name = "Member";
      let day = 1;
      let curWeight = 85;
      let tarWeight = 80;
      let calMin = 1800;
      let calMax = 2000;
      let protMin = 90;
      let protMax = 110;

      try {
        const { profile, goal } = await getUserProfileAndGoal();
        if (profile?.fullName) name = profile.fullName;
        if (profile?.currentWeightKg) curWeight = profile.currentWeightKg;
        if (goal?.targetWeightKg) tarWeight = goal.targetWeightKg;
        if (goal?.calorieTargetMin) calMin = goal.calorieTargetMin;
        if (goal?.calorieTargetMax) calMax = goal.calorieTargetMax;
        if (goal?.proteinTargetMinG) protMin = goal.proteinTargetMinG;
        if (goal?.proteinTargetMaxG) protMax = goal.proteinTargetMaxG;
        if (goal?.startDate) {
          const start = new Date(goal.startDate).getTime();
          const now = Date.now();
          const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
          day = Math.min(Math.max(diffDays, 1), 90);
        }
      } catch (e) {
        console.warn("Could not load profile for AI coach:", e);
      }

      let todayCals = 0;
      let todayProt = 0;
      try {
        const todayEntries = await getFoodLogsForDate(getTodayDateString());
        todayCals = todayEntries.reduce((sum, item) => sum + (item.calories || 0), 0);
        todayProt = todayEntries.reduce((sum, item) => sum + (item.proteinG || 0), 0);
      } catch (e) {
        console.warn("Could not load today's logs for AI coach:", e);
      }

      const ctx: CoachContext = {
        userName: name,
        dayNumber: day,
        currentWeightKg: curWeight,
        targetWeightKg: tarWeight,
        todayCalories: todayCals,
        targetCaloriesMin: calMin,
        targetCaloriesMax: calMax,
        todayProteinG: Math.round(todayProt),
        targetProteinMinG: protMin,
        targetProteinMaxG: protMax,
      };
      setCoachContext(ctx);

      // Initialize personalized greeting
      setMessages([
        {
          id: "welcome-1",
          sender: "coach",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          textEn: `Hello ${name}! 👋 I am your Fit90 Lifestyle Coach. How can I support your weekly habits, South Indian meal choices, or walking progression today?`,
          textTe: `నమస్కారం ${name} గారు! 👋 నేను మీ ఫిట్90 లైఫ్‌స్టైల్ కోచ్‌ని. మీ వారం అలవాట్లు, తెలుగు భోజన ప్రత్యామ్నాయాలు లేదా నడక పురోగతి గురించి మీరు ఏదైనా అడగవచ్చు.`,
        },
      ]);
    }
    load();
  }, []);

  const handleGrantConsent = () => {
    setUserAiConsent(true);
    setHasConsented(true);
  };

  const handleRevokeConsent = () => {
    setUserAiConsent(false);
    setHasConsented(false);
  };

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: CoachMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      textEn: queryText,
      textTe: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsThinking(true);

    setTimeout(() => {
      const response = generateCoachResponse(queryText, digest || undefined, coachContext);
      setMessages((prev) => [...prev, response]);
      setIsThinking(false);
    }, 400);
  };

  const promptChips = [
    { label: t.insights.chipProtein, query: "How is my weekly protein adherence?" },
    { label: t.insights.chipFluctuation, query: "Why did my weight fluctuate today?" },
    { label: t.insights.chipDinnerSwap, query: "Healthy South Indian dinner swaps" },
    { label: t.insights.chipWaistVisceral, query: "Explain my waist vs visceral fat risk" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Consent Gate if NOT yet granted */}
      {!hasConsented ? (
        <Card className="border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/40 to-white dark:from-indigo-950/20 dark:to-slate-900 shadow-sm animate-in fade-in duration-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold">
                {t.insights.aiConsentTitle}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.insights.aiConsentBody}
            </p>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p>{t.insights.aiDisclaimer}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                id="grantAiConsentBtn"
                onClick={handleGrantConsent}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold"
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                {t.insights.aiConsentAccept}
              </Button>

              <Button
                id="declineAiConsentBtn"
                variant="outline"
                onClick={handleGrantConsent}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                {t.insights.aiConsentDecline}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 2. Active AI Coach Interface */
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    {t.insights.aiCoachTitle}
                  </CardTitle>
                  <p className="text-xs text-slate-500">{t.insights.aiCoachSubtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {t.insights.aiConsentActiveBadge}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRevokeConsent}
                  className="h-7 text-xs text-slate-400 hover:text-slate-600"
                >
                  {locale === "te" ? "సమ్మతి ఉపసంహరించు" : "Revoke Consent"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Non-Diagnostic Disclaimer Box */}
            <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{t.insights.aiDisclaimer}</p>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  data-testid={`prompt-chip-${idx}`}
                  onClick={() => handleSendMessage(chip.query)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors text-left"
                >
                  💡 {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Thread */}
            <div
              className="space-y-3 max-h-96 overflow-y-auto p-2 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800"
              id="coachMessagesThread"
            >
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : msg.isRedFlagWarning
                          ? "bg-red-50 text-red-950 dark:bg-red-950 dark:text-red-200 border-2 border-red-500 rounded-bl-none shadow-md font-medium"
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none"
                      }`}
                    >
                      {msg.isRedFlagWarning && (
                        <div className="flex items-center gap-1.5 font-bold text-red-700 dark:text-red-300 mb-1">
                          <AlertOctagon className="h-4 w-4 animate-pulse" />
                          <span>EMERGENCY DEFLECTION</span>
                        </div>
                      )}
                      <p>{locale === "te" ? msg.textTe : msg.textEn}</p>
                      <span className="block text-[10px] opacity-60 text-right mt-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 italic">
                  <Bot className="h-3.5 w-3.5 animate-bounce" />
                  <span>{locale === "te" ? "సలహా సిద్ధం చేస్తోంది..." : "Coach is formulating advice..."}</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputQuery);
              }}
              className="flex items-center gap-2 pt-2"
            >
              <Input
                id="askCoachInput"
                placeholder={t.insights.askCoachPlaceholder}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="text-xs sm:text-sm bg-white dark:bg-slate-900"
              />
              <Button
                id="sendCoachQuestionBtn"
                type="submit"
                disabled={!inputQuery.trim() || isThinking}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-1 text-xs">
                  {t.insights.sendQuestion}
                </span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
