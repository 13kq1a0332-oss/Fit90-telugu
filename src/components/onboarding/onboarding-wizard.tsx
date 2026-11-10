"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import {
  calculateBMI,
  calculateCalorieTarget,
  checkHealthRiskMarkers,
  type Gender,
  type ActivityLevel,
} from "@/lib/health-calculations";
import {
  getUserProfileAndGoal,
  saveUserProfileAndGoal,
  UserProfileData,
  UserGoalData,
} from "@/lib/profile-store";
import { SAMPLE_TEST_USER_FIXTURE } from "@/lib/test-fixtures/sample-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Activity,
  Flame,
  Dumbbell,
  Droplets,
  Footprints,
  Scale,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
} from "lucide-react";

export function OnboardingWizard() {
  const router = useRouter();
  const { t, locale } = useI18n();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState<number>(172);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(80);
  const [waistCm, setWaistCm] = useState<number>(90);

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("sedentary");
  const [dietaryPreference, setDietaryPreference] = useState<
    "veg" | "non_veg" | "egg_only" | "vegan" | "mixed"
  >("mixed");
  const [snoringReported, setSnoringReported] = useState<boolean>(false);

  // Load authenticated user identity on mount
  React.useEffect(() => {
    async function loadIdentity() {
      try {
        const { profile: existing } = await getUserProfileAndGoal();
        if (existing) {
          if (existing.fullName && !existing.fullName.includes("Ramesh")) {
            setFullName(existing.fullName);
          }
          if (existing.email && !existing.email.includes("user@fit90.test")) {
            setEmail(existing.email);
          }
          if (existing.age > 0) setAge(existing.age);
          if (existing.heightCm > 0) setHeightCm(existing.heightCm);
          if (existing.currentWeightKg > 0) setCurrentWeightKg(existing.currentWeightKg);
          if (existing.waistCm > 0) setWaistCm(existing.waistCm);
          if (existing.gender) setGender(existing.gender);
        }
      } catch {}
    }
    loadIdentity();
  }, []);

  // Dynamic calculations
  const bmiResult = useMemo(
    () => calculateBMI(currentWeightKg, heightCm),
    [currentWeightKg, heightCm]
  );

  const calorieEstimation = useMemo(
    () =>
      calculateCalorieTarget(
        gender,
        currentWeightKg,
        heightCm,
        age,
        activityLevel
      ),
    [gender, currentWeightKg, heightCm, age, activityLevel]
  );

  const riskMarkers = useMemo(
    () => checkHealthRiskMarkers(gender, waistCm, snoringReported),
    [gender, waistCm, snoringReported]
  );

  // Configurable 90-day targets (initialized from science-backed calculation)
  const [targetWeightKg, setTargetWeightKg] = useState<number>(113); // Safe ~5kg loss in 90 days
  const [userCalorieMin, setUserCalorieMin] = useState<number>(calorieEstimation.calorieTargetMin);
  const [userCalorieMax, setUserCalorieMax] = useState<number>(calorieEstimation.calorieTargetMax);
  const [userProteinMin, setUserProteinMin] = useState<number>(calorieEstimation.proteinTargetMinG);
  const [userProteinMax, setUserProteinMax] = useState<number>(calorieEstimation.proteinTargetMaxG);
  const [userWaterMl, setUserWaterMl] = useState<number>(calorieEstimation.dailyWaterTargetMl);
  const [userStepTarget, setUserStepTarget] = useState<number>(calorieEstimation.dailyStepTarget);

  // Update targets if calculations change in Step 3
  React.useEffect(() => {
    setUserCalorieMin(calorieEstimation.calorieTargetMin);
    setUserCalorieMax(calorieEstimation.calorieTargetMax);
    setUserProteinMin(calorieEstimation.proteinTargetMinG);
    setUserProteinMax(calorieEstimation.proteinTargetMaxG);
    setUserWaterMl(calorieEstimation.dailyWaterTargetMl);
    setUserStepTarget(calorieEstimation.dailyStepTarget);
    // Reasonable safe 90-day target: ~5-6 kg loss for sustainability
    const safeTarget = Math.round(Math.max(currentWeightKg - 5, currentWeightKg * 0.95));
    setTargetWeightKg(safeTarget);
  }, [calorieEstimation, currentWeightKg]);

  const loadQaTestFixture = () => {
    const { profile, goals, sampleVitals } = SAMPLE_TEST_USER_FIXTURE;
    setAge(profile.age);
    setGender("male");
    setHeightCm(profile.height_cm);
    setCurrentWeightKg(profile.current_weight_kg);
    setWaistCm(profile.waist_cm);
    setActivityLevel(profile.activity_level);
    setDietaryPreference(profile.dietary_preference);
    setSnoringReported(sampleVitals.snoring_reported);
    setTargetWeightKg(113);
  };

  const handleFinish = async () => {
    setIsSaving(true);

    const profileData: UserProfileData = {
      email: email || "member@fit90.app",
      fullName: fullName.trim() || (locale === "te" ? "ఫిట్90 సభ్యులు" : "Fit90 Member"),
      preferredLocale: locale,
      gender,
      age,
      heightCm,
      currentWeightKg,
      waistCm,
      activityLevel,
      dietaryPreference,
      snoringReported,
      healthNotes: snoringReported ? "Snoring reported. Desk job." : "Desk job.",
      isOnboarded: true,
    };

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 90);

    const goalData: UserGoalData = {
      targetWeightKg,
      startDate: new Date().toISOString().slice(0, 10),
      targetDate: targetDate.toISOString().slice(0, 10),
      calorieTargetMin: userCalorieMin,
      calorieTargetMax: userCalorieMax,
      proteinTargetMinG: userProteinMin,
      proteinTargetMaxG: userProteinMax,
      dailyWaterTargetMl: userWaterMl,
      dailyStepTarget: userStepTarget,
      isActive: true,
    };

    await saveUserProfileAndGoal(profileData, goalData);
    setIsSaving(false);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                step === currentStep
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/30 scale-105"
                  : step < currentStep
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            {step < 4 && (
              <div
                className={`h-1 w-12 sm:w-20 rounded-full mx-1 ${
                  step < currentStep ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Biometrics */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Step 1 / 4
              </span>
              <button
                type="button"
                onClick={loadQaTestFixture}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline bg-emerald-50 px-2.5 py-1 rounded-lg"
              >
                ⚡ Load Sample QA Profile (118kg)
              </button>
            </div>
            <CardTitle className="text-xl font-bold">
              {t.onboarding.step1Title}
            </CardTitle>
            <CardDescription>{t.onboarding.step1Subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="onboardingFullName">
                {t.auth.fullNameLabel}
              </Label>
              <Input
                id="onboardingFullName"
                placeholder={locale === "te" ? "మీ పూర్తి పేరు నమోదు చేయండి (ఉదా: శ్రీకాంత్)" : "Enter your full name (e.g. Srikanth)"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" required>
                  {t.onboarding.ageLabel}
                </Label>
                <Input
                  id="age"
                  type="number"
                  min={18}
                  max={95}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="gender" required>
                  {t.onboarding.genderLabel}
                </Label>
                <Select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                >
                  <option value="male">{t.onboarding.male}</option>
                  <option value="female">{t.onboarding.female}</option>
                  <option value="other">{t.onboarding.other}</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height" required>
                  {t.onboarding.heightLabel}
                </Label>
                <Input
                  id="height"
                  type="number"
                  min={100}
                  max={240}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="weight" required>
                  {t.onboarding.weightLabel}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.5"
                  min={30}
                  max={300}
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="waist" required>
                {t.onboarding.waistLabel}
              </Label>
              <Input
                id="waist"
                type="number"
                step="0.5"
                min={40}
                max={220}
                value={waistCm}
                onChange={(e) => setWaistCm(Number(e.target.value))}
              />
              <p className="text-xs text-slate-500 mt-1">
                {locale === "te"
                  ? "పొట్ట భాగంలో బొడ్డు మీదుగా టేపుతో కొలవండి."
                  : "Measure across the navel at the end of normal expiration."}
              </p>
            </div>

            {/* Instant BMI & Health Context Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {locale === "te" ? "ప్రస్తుత బాడీ మాస్ ఇండెక్స్ (BMI)" : "Current BMI (Asian Indian Standard)"}
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {bmiResult.bmi} kg/m²
                </span>
              </div>
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
                {t.onboarding.healthyBmiNotice
                  .replace("{min}", String(bmiResult.healthyWeightRangeKg.min))
                  .replace("{max}", String(bmiResult.healthyWeightRangeKg.max))}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2"
            >
              <span>{t.onboarding.nextStep}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Lifestyle & Diet */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Step 2 / 4
            </span>
            <CardTitle className="text-xl font-bold">
              {t.onboarding.step2Title}
            </CardTitle>
            <CardDescription>{t.onboarding.step2Subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="activityLevel" required>
                {t.onboarding.activityLabel}
              </Label>
              <Select
                id="activityLevel"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              >
                <option value="sedentary">{t.onboarding.sedentary}</option>
                <option value="light">{t.onboarding.light}</option>
                <option value="moderate">{t.onboarding.moderate}</option>
                <option value="very_active">{t.onboarding.veryActive}</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="dietaryPreference" required>
                {t.onboarding.dietLabel}
              </Label>
              <Select
                id="dietaryPreference"
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value as any)}
              >
                <option value="mixed">{t.onboarding.dietMixed}</option>
                <option value="veg">{t.onboarding.dietVeg}</option>
                <option value="egg_only">{t.onboarding.dietEgg}</option>
                <option value="vegan">{t.onboarding.dietVegan}</option>
              </Select>
            </div>

            <div className="pt-2">
              <Label className="mb-2 block font-semibold">
                {t.onboarding.snoringLabel}
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="snoring"
                    checked={snoringReported === true}
                    onChange={() => setSnoringReported(true)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{t.onboarding.yes}</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="snoring"
                    checked={snoringReported === false}
                    onChange={() => setSnoringReported(false)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{t.onboarding.no}</span>
                </label>
              </div>
            </div>

            {/* Health precaution alerts based on inputs */}
            {riskMarkers.hasWaistRisk && (
              <Alert variant="warning" className="text-xs">
                {locale === "te"
                  ? riskMarkers.waistRiskMessageTe
                  : riskMarkers.waistRiskMessageEn}
              </Alert>
            )}

            {snoringReported && (
              <Alert variant="warning" className="text-xs">
                {locale === "te"
                  ? riskMarkers.snoringRiskMessageTe
                  : riskMarkers.snoringRiskMessageEn}
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.onboarding.prevStep}</span>
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2"
            >
              <span>{t.onboarding.nextStep}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Science-Backed Calorie & Macro Target Estimation */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Step 3 / 4
            </span>
            <CardTitle className="text-xl font-bold">
              {t.onboarding.step3Title}
            </CardTitle>
            <CardDescription>{t.onboarding.step3Subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800">
                <span className="text-xs text-slate-500 font-medium">
                  {t.onboarding.bmrText}
                </span>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {calorieEstimation.bmr} <span className="text-xs font-normal text-slate-400">kcal/day</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800">
                <span className="text-xs text-slate-500 font-medium">
                  {t.onboarding.tdeeText}
                </span>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {calorieEstimation.tdee} <span className="text-xs font-normal text-slate-400">kcal/day</span>
                </div>
              </div>
            </div>

            {/* Recommended Target Ranges */}
            <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 mb-2">
                <Sparkles className="h-5 w-5" />
                <h4 className="font-bold text-sm">
                  {locale === "te"
                    ? "సిఫార్సు చేయబడిన రోజువారీ లక్ష్యాలు (మితమైన, స్థిరమైన లోటు)"
                    : "Recommended Daily Targets (Sustainable Deficit)"}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="text-xs text-emerald-900/80 dark:text-emerald-200">
                    {t.onboarding.targetCalorieRange}
                  </span>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                    {calorieEstimation.calorieTargetMin} - {calorieEstimation.calorieTargetMax}
                    <span className="text-xs font-normal ml-1">kcal</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-emerald-900/80 dark:text-emerald-200">
                    {t.onboarding.targetProteinRange}
                  </span>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                    {calorieEstimation.proteinTargetMinG} - {calorieEstimation.proteinTargetMaxG}
                    <span className="text-xs font-normal ml-1">g/day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparent Assumptions Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-2 dark:bg-slate-900 dark:border-slate-800">
              <h5 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-emerald-600" />
                <span>{t.onboarding.assumptionsTitle}</span>
              </h5>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                {(locale === "te"
                  ? calorieEstimation.assumptionsTe
                  : calorieEstimation.assumptionsEn
                ).map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.onboarding.prevStep}</span>
            </Button>
            <Button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2"
            >
              <span>{t.onboarding.nextStep}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Configurable 90-Day Goals */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Step 4 / 4
            </span>
            <CardTitle className="text-xl font-bold">
              {t.onboarding.step4Title}
            </CardTitle>
            <CardDescription>{t.onboarding.step4Subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetWeight" required>
                {t.onboarding.targetWeightLabel}
              </Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.5"
                min={Math.round(currentWeightKg * 0.8)}
                max={currentWeightKg}
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
              />
              <p className="text-xs text-slate-500 mt-1">
                {locale === "te"
                  ? `90 రోజులలో ${(currentWeightKg - targetWeightKg).toFixed(1)} కిలోల తగ్గుదల (సురక్షితమైన రేటు: నెలకు ~1.5-2 కిలోలు).`
                  : `Targeting ${(currentWeightKg - targetWeightKg).toFixed(1)} kg reduction over 90 days (~0.5 kg/week).`}
              </p>
            </div>

            {currentWeightKg - targetWeightKg > 10 && (
              <Alert variant="warning" className="text-xs">
                {locale === "te"
                  ? "హెచ్చరిక: 90 రోజుల్లో 10 కిలోల కంటే ఎక్కువ వేగంగా తగ్గాలని ప్రయత్నించడం వల్ల కండరాలు కరిగిపోయే ప్రమాదం ఉంది. నెమ్మదిగా, స్థిరంగా తగ్గడం మేలు."
                  : "Note: Aiming for over 10 kg loss in 90 days may increase risk of muscle loss and gallstones. Consider a gradual 5-8 kg milestone."}
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userCalMin">Calorie Min (kcal)</Label>
                <Input
                  id="userCalMin"
                  type="number"
                  step="50"
                  value={userCalorieMin}
                  onChange={(e) => setUserCalorieMin(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="userCalMax">Calorie Max (kcal)</Label>
                <Input
                  id="userCalMax"
                  type="number"
                  step="50"
                  value={userCalorieMax}
                  onChange={(e) => setUserCalorieMax(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waterTarget">{t.onboarding.targetWaterText} (ml)</Label>
                <Input
                  id="waterTarget"
                  type="number"
                  step="250"
                  value={userWaterMl}
                  onChange={(e) => setUserWaterMl(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="stepTarget">{t.onboarding.targetStepText}</Label>
                <Input
                  id="stepTarget"
                  type="number"
                  step="500"
                  value={userStepTarget}
                  onChange={(e) => setUserStepTarget(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.onboarding.prevStep}</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              isLoading={isSaving}
              onClick={handleFinish}
              className="flex items-center gap-2"
            >
              <span>{t.onboarding.finishOnboarding}</span>
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

