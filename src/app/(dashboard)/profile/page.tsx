"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import {
  getUserProfileAndGoal,
  saveUserProfileAndGoal,
  UserProfileData,
  UserGoalData,
  DEFAULT_NEW_USER_PROFILE,
  DEFAULT_GOAL_DATA,
} from "@/lib/profile-store";
import {
  calculateBMI,
  calculateCalorieTarget,
  checkHealthRiskMarkers,
  type Gender,
  type ActivityLevel,
} from "@/lib/health-calculations";
import { SAMPLE_TEST_USER_FIXTURE } from "@/lib/test-fixtures/sample-user";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import {
  User,
  Download,
  Trash2,
  Shield,
  Info,
  Sparkles,
  HeartPulse,
  Scale,
  Ruler,
  AlertTriangle,
} from "lucide-react";

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n();

  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_NEW_USER_PROFILE);
  const [goal, setGoal] = useState<UserGoalData>(DEFAULT_GOAL_DATA);
  const [isSaved, setIsSaved] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getUserProfileAndGoal();
      setProfile(data.profile);
      setGoal(data.goal);
    }
    loadData();
  }, []);

  const bmiResult = useMemo(
    () => calculateBMI(profile.currentWeightKg, profile.heightCm),
    [profile.currentWeightKg, profile.heightCm]
  );

  const riskMarkers = useMemo(
    () => checkHealthRiskMarkers(profile.gender, profile.waistCm, profile.snoringReported),
    [profile.gender, profile.waistCm, profile.snoringReported]
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveUserProfileAndGoal(profile, goal);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLoadQaTestFixture = async () => {
    const { profile: testProf, goals: testGoals, sampleVitals } = SAMPLE_TEST_USER_FIXTURE;

    const newProfile: UserProfileData = {
      ...profile,
      email: testProf.email,
      fullName: testProf.full_name,
      preferredLocale: testProf.preferred_locale,
      gender: "male",
      age: testProf.age,
      heightCm: testProf.height_cm,
      currentWeightKg: testProf.current_weight_kg,
      waistCm: testProf.waist_cm,
      activityLevel: testProf.activity_level,
      dietaryPreference: testProf.dietary_preference,
      snoringReported: sampleVitals.snoring_reported,
      healthNotes: testProf.health_notes,
      isOnboarded: true,
    };

    const newGoal: UserGoalData = {
      ...goal,
      targetWeightKg: testGoals.target_weight_min_kg,
      calorieTargetMin: testGoals.calorie_target_min,
      calorieTargetMax: testGoals.calorie_target_max,
      proteinTargetMinG: testGoals.protein_target_min_g,
      proteinTargetMaxG: testGoals.protein_target_max_g,
      dailyWaterTargetMl: testGoals.daily_water_target_ml,
      dailyStepTarget: testGoals.daily_step_target,
    };

    setProfile(newProfile);
    setGoal(newGoal);
    await saveUserProfileAndGoal(newProfile, newGoal);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportData = () => {
    const exportData = {
      user: {
        profile,
        activeGoal: goal,
        bmi: bmiResult,
        exportedAt: new Date().toISOString(),
      },
      disclaimer: "Fit90 Telugu personal data archive. Health tracking records are private to this account.",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fit90-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice(
      locale === "te"
        ? "మీ వ్యక్తిగత డేటా ఆర్కైవ్ డౌన్‌లోడ్ చేయబడింది."
        : "Your personal data export has been downloaded."
    );
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      locale === "te"
        ? "మీ ఖాతాను మరియు అన్ని రికార్డులను శాశ్వతంగా తొలగించాలనుకుంటున్నారా? ఈ చర్యను రద్దు చేయలేము."
        : "Are you sure you want to permanently delete your account and all health records? This action cannot be undone."
    );
    if (confirmed) {
      alert(
        locale === "te"
          ? "ఖాతా తొలగింపు అభ్యర్థన నమోదు చేయబడింది."
          : "Account deletion request processed."
      );
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t.profile.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.profile.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadQaTestFixture}
          className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-200 transition-colors shrink-0"
        >
          ⚡ Load QA Test Profile (118kg)
        </button>
      </div>

      {isSaved && (
        <Alert variant="success">
          <span>{t.profile.saveSuccess}</span>
        </Alert>
      )}

      {exportNotice && (
        <Alert variant="default" className="border-emerald-200 bg-emerald-50 text-emerald-950">
          <span>{exportNotice}</span>
        </Alert>
      )}

      {/* Basic Biometrics & Identity Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">
              {t.profile.biometricsTitle}
            </CardTitle>
          </div>
          <CardDescription>
            {locale === "te"
              ? "మీ ఎత్తు, బరువు, నడుము కొలతలు ఆధారంగా క్యాలరీ లక్ష్యాలు స్వయంచాలకంగా నవీకరించబడతాయి."
              : "Your biometrics directly dictate your daily energy and macro equations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profileName">{t.auth.fullNameLabel}</Label>
                <Input
                  id="profileName"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="profileEmail">{t.auth.emailLabel}</Label>
                <Input
                  id="profileEmail"
                  value={profile.email}
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="profileAge">{t.onboarding.ageLabel}</Label>
                <Input
                  id="profileAge"
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label htmlFor="profileGender">{t.onboarding.genderLabel}</Label>
                <Select
                  id="profileGender"
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile({ ...profile, gender: e.target.value as Gender })
                  }
                >
                  <option value="male">{t.onboarding.male}</option>
                  <option value="female">{t.onboarding.female}</option>
                  <option value="other">{t.onboarding.other}</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="profileLocale">{t.auth.preferredLanguageLabel}</Label>
                <Select
                  id="profileLocale"
                  value={locale}
                  onChange={(e) => {
                    const l = e.target.value as "te" | "en";
                    setLocale(l);
                    setProfile({ ...profile, preferredLocale: l });
                  }}
                >
                  <option value="te">తెలుగు</option>
                  <option value="en">English</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="profileHeight">{t.onboarding.heightLabel}</Label>
                <Input
                  id="profileHeight"
                  type="number"
                  value={profile.heightCm}
                  onChange={(e) =>
                    setProfile({ ...profile, heightCm: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label htmlFor="profileWeight">{t.onboarding.weightLabel}</Label>
                <Input
                  id="profileWeight"
                  type="number"
                  step="0.5"
                  value={profile.currentWeightKg}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      currentWeightKg: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="profileWaist">{t.onboarding.waistLabel}</Label>
                <Input
                  id="profileWaist"
                  type="number"
                  step="0.5"
                  value={profile.waistCm}
                  onChange={(e) =>
                    setProfile({ ...profile, waistCm: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* Real-Time BMI & Health Reference Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Calculated BMI (Asian Indian Cutoff): <strong>{bmiResult.bmi} kg/m²</strong>
                </span>
                <span className="font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                  {bmiResult.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-400">
                {t.onboarding.healthyBmiNotice
                  .replace("{min}", String(bmiResult.healthyWeightRangeKg.min))
                  .replace("{max}", String(bmiResult.healthyWeightRangeKg.max))}
              </p>
            </div>

            {/* Health risk markers */}
            {riskMarkers.hasWaistRisk && (
              <Alert variant="warning" className="text-xs">
                {locale === "te"
                  ? riskMarkers.waistRiskMessageTe
                  : riskMarkers.waistRiskMessageEn}
              </Alert>
            )}

            <Button type="submit" variant="primary">
              {t.common.save}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 90-Day Configurable Targets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">
                {t.profile.goalsTitle}
              </CardTitle>
            </div>
            <Link href="/onboarding">
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                {t.profile.recalculateButton}
              </Button>
            </Link>
          </div>
          <CardDescription>
            {locale === "te"
              ? "మీ రోజువారీ క్యాలరీ, ప్రోటీన్ మరియు 90 రోజుల లక్ష్య బరువు"
              : "Adjust your 90-day weight goal and daily nutritional targets"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goalWeight">{t.onboarding.targetWeightLabel}</Label>
              <Input
                id="goalWeight"
                type="number"
                step="0.5"
                value={goal.targetWeightKg}
                onChange={(e) =>
                  setGoal({ ...goal, targetWeightKg: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="goalDate">Target Date</Label>
              <Input
                id="goalDate"
                type="date"
                value={goal.targetDate}
                onChange={(e) =>
                  setGoal({ ...goal, targetDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goalCalMin">Calorie Target Min (kcal)</Label>
              <Input
                id="goalCalMin"
                type="number"
                step="50"
                value={goal.calorieTargetMin}
                onChange={(e) =>
                  setGoal({ ...goal, calorieTargetMin: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="goalCalMax">Calorie Target Max (kcal)</Label>
              <Input
                id="goalCalMax"
                type="number"
                step="50"
                value={goal.calorieTargetMax}
                onChange={(e) =>
                  setGoal({ ...goal, calorieTargetMax: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goalProteinMin">Protein Target Min (g)</Label>
              <Input
                id="goalProteinMin"
                type="number"
                value={goal.proteinTargetMinG}
                onChange={(e) =>
                  setGoal({ ...goal, proteinTargetMinG: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="goalProteinMax">Protein Target Max (g)</Label>
              <Input
                id="goalProteinMax"
                type="number"
                value={goal.proteinTargetMaxG}
                onChange={(e) =>
                  setGoal({ ...goal, proteinTargetMaxG: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={async () => {
              await saveUserProfileAndGoal(profile, goal);
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 3000);
            }}
          >
            {t.common.save}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy, Data Export & Deletion Compliance */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">
              {t.profile.privacyTitle}
            </CardTitle>
          </div>
          <CardDescription>
            {locale === "te"
              ? "మీ ఆరోగ్య రికార్డులను డౌన్‌లోడ్ చేసుకోండి లేదా శాశ్వతంగా తొలగించండి"
              : "Download your tracking history or delete your account records"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.profile.exportData}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {locale === "te"
                  ? "మీ ప్రొఫైల్ మరియు అన్ని లాగ్‌ల JSON కాపీని డౌన్‌లోడ్ చేస్తుంది"
                  : "Downloads a full JSON archive of all your tracking logs"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-2 shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>{locale === "te" ? "డౌన్‌లోడ్" : "Export"}</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/60">
            <div>
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">
                {t.profile.deleteAccount}
              </h4>
              <p className="text-xs text-red-700/80 dark:text-red-300 mt-0.5">
                {locale === "te"
                  ? "మీ ప్రొఫైల్ మరియు లాగ్ డేటా పూర్తిగా తొలగించబడుతుంది"
                  : "Permanently erase your account and associated records"}
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              <span>{locale === "te" ? "తొలగించండి" : "Delete"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
