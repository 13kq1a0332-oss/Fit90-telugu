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
  Zap,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n();

  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_NEW_USER_PROFILE);
  const [goal, setGoal] = useState<UserGoalData>(DEFAULT_GOAL_DATA);
  const [isSaved, setIsSaved] = useState(false);
  const [recalcNotice, setRecalcNotice] = useState<string | null>(null);
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
    () => calculateBMI(profile.currentWeightKg || 70, profile.heightCm || 170),
    [profile.currentWeightKg, profile.heightCm]
  );

  const riskMarkers = useMemo(
    () => checkHealthRiskMarkers(profile.gender, profile.waistCm || 85, profile.snoringReported),
    [profile.gender, profile.waistCm, profile.snoringReported]
  );

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await saveUserProfileAndGoal(profile, goal);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  /**
   * Auto-calculates 90-day targets dynamically from entered biometrics
   */
  const handleAutoRecalculateFromBiometrics = () => {
    const age = profile.age > 0 ? profile.age : 30;
    const height = profile.heightCm > 0 ? profile.heightCm : 170;
    const weight = profile.currentWeightKg > 0 ? profile.currentWeightKg : 75;

    const calcs = calculateCalorieTarget(
      profile.gender,
      weight,
      height,
      age,
      profile.activityLevel || "sedentary"
    );

    // Safe 90-day sustainable loss: ~5 to 8 kg based on current weight
    const safeTargetWeight = Math.max(
      Math.round((weight - (weight > 95 ? 8 : weight > 80 ? 6 : 4)) * 10) / 10,
      45
    );

    const updatedGoal: UserGoalData = {
      ...goal,
      targetWeightKg: safeTargetWeight,
      calorieTargetMin: calcs.calorieTargetMin,
      calorieTargetMax: calcs.calorieTargetMax,
      proteinTargetMinG: calcs.proteinTargetMinG,
      proteinTargetMaxG: calcs.proteinTargetMaxG,
      dailyWaterTargetMl: calcs.dailyWaterTargetMl,
      dailyStepTarget: calcs.dailyStepTarget,
    };

    setGoal(updatedGoal);
    setRecalcNotice(
      locale === "te"
        ? `⚡ మీ ఎత్తు (${height}cm), బరువు (${weight}kg) ఆధారంగా క్యాలరీలు (${calcs.calorieTargetMin}-${calcs.calorieTargetMax} kcal) మరియు ప్రోటీన్ (${calcs.proteinTargetMinG}-${calcs.proteinTargetMaxG}g) స్వయంచాలకంగా లెక్కించబడ్డాయి!`
        : `⚡ Targets recalculated based on your biometrics: ${calcs.calorieTargetMin}-${calcs.calorieTargetMax} kcal & ${calcs.proteinTargetMinG}-${calcs.proteinTargetMaxG}g protein!`
    );
    setTimeout(() => setRecalcNotice(null), 5000);
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

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
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

      {recalcNotice && (
        <Alert variant="default" className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-semibold text-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 shrink-0 inline" />
          <span>{recalcNotice}</span>
        </Alert>
      )}

      {exportNotice && (
        <Alert variant="default" className="border-emerald-200 bg-emerald-50 text-emerald-950">
          <span>{exportNotice}</span>
        </Alert>
      )}

      {/* 1. Basic Biometrics & Identity Form */}
      <Card className="rounded-3xl shadow-lg border border-slate-200/80 dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">
              {t.profile.biometricsTitle}
            </CardTitle>
          </div>
          <CardDescription>
            {locale === "te"
              ? "మీ అసలు ఎత్తు, బరువు, వయస్సు వివరాలను నమోదు చేయండి. ఇవి మీ క్యాలరీ మరియు ప్రోటీన్ సమీకరణాలను నిర్ణయిస్తాయి."
              : "Enter your real measurements manually. These directly dictate your daily energy and macro equations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profileName">{t.auth.fullNameLabel}</Label>
                <Input
                  id="profileName"
                  value={profile.fullName}
                  placeholder="మీ పూర్తి పేరు నమోదు చేయండి"
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
                  className="bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="profileAge">{t.onboarding.ageLabel}</Label>
                <Input
                  id="profileAge"
                  type="number"
                  placeholder="e.g. 28"
                  value={profile.age === 0 ? "" : profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: e.target.value === "" ? 0 : Number(e.target.value) })
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
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="en">English</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="profileHeight">{t.onboarding.heightLabel} (cm)</Label>
                <Input
                  id="profileHeight"
                  type="number"
                  placeholder="e.g. 170"
                  value={profile.heightCm === 0 ? "" : profile.heightCm}
                  onChange={(e) =>
                    setProfile({ ...profile, heightCm: e.target.value === "" ? 0 : Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label htmlFor="profileWeight">{t.onboarding.weightLabel} (kg)</Label>
                <Input
                  id="profileWeight"
                  type="number"
                  step="0.5"
                  placeholder="e.g. 75"
                  value={profile.currentWeightKg === 0 ? "" : profile.currentWeightKg}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      currentWeightKg: e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="profileWaist">{t.onboarding.waistLabel} (cm)</Label>
                <Input
                  id="profileWaist"
                  type="number"
                  step="0.5"
                  placeholder="e.g. 88"
                  value={profile.waistCm === 0 ? "" : profile.waistCm}
                  onChange={(e) =>
                    setProfile({ ...profile, waistCm: e.target.value === "" ? 0 : Number(e.target.value) })
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

            <div className="flex items-center justify-between pt-2">
              <Button type="submit" variant="primary" className="font-bold">
                {t.common.save}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoRecalculateFromBiometrics}
                className="text-xs font-bold text-emerald-700 hover:bg-emerald-50 border-emerald-300 flex items-center gap-1.5"
              >
                <Zap className="h-3.5 w-3.5 text-emerald-600" />
                <span>{locale === "te" ? "నా కొలతలతో టార్గెట్స్ లెక్కించండి" : "Sync Targets from Biometrics"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. 90-Day Configurable Targets */}
      <Card className="rounded-3xl shadow-lg border border-slate-200/80 dark:border-slate-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">
                {t.profile.goalsTitle}
              </CardTitle>
            </div>

            {/* 1-Click Auto Recalculate Button */}
            <Button
              type="button"
              size="sm"
              onClick={handleAutoRecalculateFromBiometrics}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{locale === "te" ? "⚡ ఆటోమేటిక్ లెక్కింపు (BMR సూత్రం)" : "⚡ Recalculate from Biometrics"}</span>
            </Button>
          </div>

          <CardDescription>
            {locale === "te"
              ? "ఈ ఫీచర్ మీ 90 రోజుల పరివర్తన కోసం సురక్షితమైన రోజువారీ క్యాలరీ మరియు ప్రోటీన్ లక్ష్యాలను నిర్దేశిస్తుంది."
              : "Adjust your 90-day weight goal and daily nutritional targets based on science or custom recommendations."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Feature Explanation Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {locale === "te" ? "ఈ ఫీచర్ ఎలా ఉపయోగపడుతుంది? (How this works):" : "How does this feature work?"}
              </span>
            </div>
            <p className="leading-relaxed">
              {locale === "te"
                ? "1️⃣ ఆటోమేటిక్ లెక్కింపు: పైన మీరు ఇచ్చిన ఎత్తు, బరువు, వయస్సు ఆధారంగా '⚡ ఆటోమేటిక్ లెక్కింపు' క్లిక్ చేస్తే ICMR-NIN & Mifflin-St Jeor సూత్రాల ప్రకారం క్యాలరీలు (500 kcal deficit) మరియు ప్రోటీన్ సెట్ అవుతాయి."
                : "1️⃣ Auto-Population: Clicking '⚡ Recalculate' uses Mifflin-St Jeor + ICMR guidelines to compute safe daily calories and protein deficits for your exact biometrics."}
            </p>
            <p className="leading-relaxed">
              {locale === "te"
                ? "2️⃣ మాన్యువల్ మార్పులు: మీ డాక్టర్ లేదా న్యూట్రిషనిస్ట్ సూచించిన నిర్దిష్ట లక్ష్యాలకు అనుగుణంగా మీరు కింద ఉన్న ఏ బాక్స్‌నైనా స్వయంగా మార్చుకుని 'Save Changes' క్లిక్ చేయవచ్చు."
                : "2️⃣ Manual Customization: Clients or nutritionists can directly edit any field below (e.g. custom protein target) and save changes."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goalWeight">{t.onboarding.targetWeightLabel} (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                step="0.5"
                value={goal.targetWeightKg}
                onChange={(e) =>
                  setGoal({ ...goal, targetWeightKg: Number(e.target.value) })
                }
              />
              <span className="text-[10px] text-slate-500">
                {locale === "te" ? "90 రోజుల్లో సురక్షితంగా సాధించగల లక్ష్య బరువు" : "Safe 90-day weight target"}
              </span>
            </div>
            <div>
              <Label htmlFor="goalDate">Target Date (90 Days)</Label>
              <Input
                id="goalDate"
                type="date"
                value={goal.targetDate}
                onChange={(e) =>
                  setGoal({ ...goal, targetDate: e.target.value })
                }
              />
              <span className="text-[10px] text-slate-500">
                {locale === "te" ? "90 రోజుల ముగింపు తేదీ" : "90-day milestone deadline"}
              </span>
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
              <span className="text-[10px] text-slate-500">ICMR: 1.2g/kg</span>
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
              <span className="text-[10px] text-slate-500">1.6g/kg muscle retention</span>
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
            className="w-full sm:w-auto font-bold px-6"
          >
            {t.common.save}
          </Button>
        </CardContent>
      </Card>

      {/* 3. Privacy, Data Export & Deletion Compliance */}
      <Card className="rounded-3xl shadow-lg border border-slate-200/80 dark:border-slate-800">
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
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.profile.exportData}
              </h4>
              <p className="text-xs text-slate-500">
                {locale === "te"
                  ? "మీ బయోమెట్రిక్స్, ఆహార లాగ్‌లు, మరియు లక్ష్యాల పూర్తి JSON ఆర్కైవ్"
                  : "Complete JSON archive of biometrics, food logs, and 90-day target history"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="shrink-0 text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              {locale === "te" ? "డౌన్‌లోడ్ చేయండి" : "Export Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
