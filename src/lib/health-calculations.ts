/**
 * Fit90 Telugu - Science-Backed Health, Calorie, & Macronutrient Calculation Engine
 * 
 * Implements:
 * 1. Mifflin-St Jeor Equation for BMR (clinical gold standard for non-athletes)
 * 2. Activity Multipliers for TDEE (Total Daily Energy Expenditure)
 * 3. Moderate, sustainable caloric deficit (no crash dieting, metabolic preservation)
 * 4. Asian Indian BMI consensus criteria (WHO/ICMR guidelines)
 * 5. Asian Indian waist circumference thresholds
 * 6. Protein & hydration recommendations
 */

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active";
export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  isAsianIndianRiskElevated: boolean;
  healthyWeightRangeKg: { min: number; max: number };
}

export interface CalorieEstimationResult {
  bmr: number;
  tdee: number;
  calorieTargetMin: number;
  calorieTargetMax: number;
  proteinTargetMinG: number;
  proteinTargetMaxG: number;
  dailyWaterTargetMl: number;
  dailyStepTarget: number;
  assumptionsEn: string[];
  assumptionsTe: string[];
}

export interface HealthRiskMarkers {
  hasWaistRisk: boolean;
  waistRiskMessageEn?: string;
  waistRiskMessageTe?: string;
  snoringRiskMessageEn?: string;
  snoringRiskMessageTe?: string;
}

/**
 * Calculates BMI and classifies according to Asian Indian specific cutoffs
 * Asian Indian Consensus: Normal: 18.5-22.9, Overweight: 23-24.9, Obese: >=25.0
 */
export function calculateBMI(weightKg: number, heightCm: number): BmiResult {
  if (heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: "normal",
      isAsianIndianRiskElevated: false,
      healthyWeightRangeKg: { min: 0, max: 0 },
    };
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let category: BmiCategory = "normal";
  if (bmi < 18.5) {
    category = "underweight";
  } else if (bmi <= 22.9) {
    category = "normal";
  } else if (bmi <= 24.9) {
    category = "overweight";
  } else {
    category = "obese";
  }

  // Asian Indian ideal BMI range: 18.5 - 22.9
  const minHealthyWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthyWeight = Math.round(22.9 * heightM * heightM * 10) / 10;

  return {
    bmi,
    category,
    isAsianIndianRiskElevated: bmi >= 23.0,
    healthyWeightRangeKg: { min: minHealthyWeight, max: maxHealthyWeight },
  };
}

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor formula
 */
export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1500;

  // Base equation: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y)
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  if (gender === "female") {
    return Math.round(base - 161);
  } else {
    // For males, and standard neutral baseline
    return Math.round(base + 5);
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) based on activity multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2, // Desk job, little to no regular exercise
    light: 1.375, // Light walking or activity 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    very_active: 1.725, // Hard exercise 6-7 days/week
  };

  const multiplier = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates sustainable calorie and macronutrient targets with clear medical safety floors
 */
export function calculateCalorieTarget(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel
): CalorieEstimationResult {
  const bmr = calculateBMR(gender, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);

  // Moderate deficit: 350-450 kcal below maintenance
  let baseDeficit = 450;

  // For high starting weights (>100kg), keep deficit gradual to protect metabolic rate and muscle mass
  if (weightKg > 100) {
    baseDeficit = 400;
  }

  let calculatedTarget = tdee - baseDeficit;

  // Hard safety floors (never go below essential metabolic needs)
  const floor = gender === "female" ? 1250 : 1500;
  if (calculatedTarget < floor) {
    calculatedTarget = floor;
  }

  // Create a practical 200 kcal window
  const calorieTargetMin = Math.round((calculatedTarget - 100) / 50) * 50;
  const calorieTargetMax = Math.round((calculatedTarget + 100) / 50) * 50;

  // Protein targets: 1.0 - 1.2g per kg adjusted reference weight for sustainable weight loss
  // For higher body weight, protein is calibrated to preserve lean muscle without overburdening kidneys
  let proteinMin = Math.round(Math.min(weightKg * 0.9, 100));
  let proteinMax = Math.round(Math.min(weightKg * 1.05, 120));

  if (weightKg >= 110) {
    proteinMin = 100;
    proteinMax = 120;
  }

  // Hydration target: 30-35 ml per kg body weight, capped safely between 2500ml and 3500ml
  const dailyWaterTargetMl = Math.min(Math.max(Math.round((weightKg * 30) / 250) * 250, 2500), 3500);

  // Step target progression starting point
  const dailyStepTarget = activityLevel === "sedentary" ? 7000 : 8500;

  const assumptionsEn = [
    `BMR (${bmr} kcal) computed using the Mifflin-St Jeor formula based on age ${age}, weight ${weightKg}kg, and height ${heightCm}cm.`,
    `TDEE (${tdee} kcal) based on a ${activityLevel} physical activity profile (multiplier: ${activityLevel === "sedentary" ? "1.2x desk job" : "active"}).`,
    `A sustainable 350-450 kcal/day deficit is applied to promote steady fat loss (approx 0.4-0.6 kg/week) while preventing muscle loss or extreme hunger.`,
    `Protein target (${proteinMin}-${proteinMax}g) is scaled to protect lean tissue and optimize satiety on an Indian diet.`,
  ];

  const assumptionsTe = [
    `మీ వయస్సు ${age}, బరువు ${weightKg} కిలోలు, ఎత్తు ${heightCm} సెం.మీ. ఆధారంగా మిఫ్లిన్-సెయింట్ జియోర్ ఫార్ములాతో BMR (${bmr} క్యాలరీలు) లెక్కించబడింది.`,
    `${activityLevel === "sedentary" ? "డెస్క్ జాబ్ / తక్కువ శారీరక కదలికలు" : "చురుకైన జీవనశైలి"} ఆధారంగా రోజువారీ నిర్వహణ శక్తి TDEE (${tdee} క్యాలరీలు) లెక్కించబడింది.`,
    `కఠినమైన ఉపవాసాలు లేకుండా, కండరాలు తగ్గకుండా నెమ్మదిగా, స్థిరంగా బరువు తగ్గడానికి (వారానికి ~0.5 కిలోలు) 350-450 క్యాలరీల మితమైన లోటు వర్తించబడింది.`,
    `మన భారతీయ భోజనంలో కండరాల రక్షణకు మరియు త్వరగా ఆకలి వేయకుండా ఉండటానికి రోజుకు ${proteinMin}-${proteinMax} గ్రాముల ప్రోటీన్ లక్ష్యం సిఫార్సు చేయబడింది.`,
  ];

  return {
    bmr,
    tdee,
    calorieTargetMin,
    calorieTargetMax,
    proteinTargetMinG: proteinMin,
    proteinTargetMaxG: proteinMax,
    dailyWaterTargetMl,
    dailyStepTarget,
    assumptionsEn,
    assumptionsTe,
  };
}

/**
 * Evaluates Asian Indian specific cardiometabolic waist cutoffs & lifestyle risks
 */
export function checkHealthRiskMarkers(
  gender: Gender,
  waistCm: number | null,
  snoringReported: boolean
): HealthRiskMarkers {
  let hasWaistRisk = false;
  let waistRiskMessageEn: string | undefined;
  let waistRiskMessageTe: string | undefined;

  if (waistCm && waistCm > 0) {
    const threshold = gender === "female" ? 80 : 90;
    if (waistCm > threshold) {
      hasWaistRisk = true;
      waistRiskMessageEn = `Waist circumference (${waistCm} cm) exceeds the Asian Indian threshold of ${threshold} cm, which is associated with increased visceral fat. Consistent daily walking and dietary portion control are encouraged.`;
      waistRiskMessageTe = `నడుము కొలత (${waistCm} సెం.మీ) ఆసియా భారతీయుల పరిమితి (${threshold} సెం.మీ) కంటే ఎక్కువగా ఉంది. ఇది అంతర్గత కొవ్వును సూచిస్తుంది. క్రమమైన నడక మరియు సమతుల్య ఆహారం దీనిని నియంత్రించడంలో సహాయపడతాయి.`;
    }
  }

  let snoringRiskMessageEn: string | undefined;
  let snoringRiskMessageTe: string | undefined;

  if (snoringReported) {
    snoringRiskMessageEn = `Frequent snoring with daytime tiredness may indicate obstructive sleep apnea (OSA). Consider discussing a sleep evaluation with your physician or ENT specialist.`;
    snoringRiskMessageTe = `గురకతో పాటు పగటిపూట నీరసం లేదా నిద్రమత్తు ఉంటే, స్లీప్ అప్నియా (నిద్రలో శ్వాస సమస్య) అయ్యే అవకాశం ఉంది. దయచేసి సంబంధిత వైద్యుడిని లేదా ఈఎన్‌టీ నిపుణుడిని సంప్రదించండి.`;
  }

  return {
    hasWaistRisk,
    waistRiskMessageEn,
    waistRiskMessageTe,
    snoringRiskMessageEn,
    snoringRiskMessageTe,
  };
}

export interface MetabolicScoreParams {
  caloriesConsumed: number;
  calorieTargetMin: number;
  calorieTargetMax: number;
  proteinConsumedG: number;
  proteinTargetMinG: number;
  stepsToday: number;
  stepsTarget: number;
  waterConsumedMl: number;
  waterTargetMl: number;
  bmi: number;
  waistCm: number;
  gender?: Gender;
}

export interface MetabolicScoreResult {
  score: number; // 0 to 100
  tierEn: "Optimal" | "Good" | "Needs Focus";
  tierTe: "ఆప్టిమల్" | "మంచిది" | "దృష్టి అవసరం";
  nutritionPoints: number; // max 25
  proteinPoints: number; // max 25
  activityPoints: number; // max 20
  hydrationPoints: number; // max 15
  biometricPoints: number; // max 15
}

/**
 * Calculates a dynamic, multi-pillar Metabolic Adherence Score (0-100)
 * Evaluates nutrition energy, protein density, daily steps, hydration, and Asian Indian biometric cutoffs.
 */
export function computeMetabolicScore(params: MetabolicScoreParams): MetabolicScoreResult {
  const {
    caloriesConsumed,
    calorieTargetMin,
    calorieTargetMax,
    proteinConsumedG,
    proteinTargetMinG,
    stepsToday,
    stepsTarget,
    waterConsumedMl,
    waterTargetMl,
    bmi,
    waistCm,
    gender = "male",
  } = params;

  // 1. Nutrition Calorie Balance (Max 25 pts)
  let nutritionPoints = 12; // Baseline
  if (caloriesConsumed > 0 && calorieTargetMax > 0) {
    if (caloriesConsumed >= calorieTargetMin * 0.75 && caloriesConsumed <= calorieTargetMax * 1.05) {
      nutritionPoints = 25; // Perfect adherence
    } else if (caloriesConsumed < calorieTargetMin * 0.75) {
      nutritionPoints = Math.round(15 + (caloriesConsumed / (calorieTargetMin * 0.75)) * 10);
    } else {
      // Over calorie ceiling
      const overPct = (caloriesConsumed - calorieTargetMax) / calorieTargetMax;
      nutritionPoints = Math.max(8, Math.round(25 - overPct * 25));
    }
  }

  // 2. Protein Density (Max 25 pts)
  let proteinPoints = 10;
  if (proteinTargetMinG > 0) {
    const proteinRatio = proteinConsumedG / proteinTargetMinG;
    proteinPoints = Math.min(25, Math.round(proteinRatio * 25));
  }

  // 3. Physical Activity & Daily Steps (Max 20 pts)
  let activityPoints = 8;
  const safeStepTarget = stepsTarget > 0 ? stepsTarget : 7000;
  activityPoints = Math.min(20, Math.round((stepsToday / safeStepTarget) * 20));

  // 4. Hydration & Fluid Balance (Max 15 pts)
  let hydrationPoints = 5;
  const safeWaterTarget = waterTargetMl > 0 ? waterTargetMl : 3000;
  hydrationPoints = Math.min(15, Math.round((waterConsumedMl / safeWaterTarget) * 15));

  // 5. Biometric Baseline (Asian Indian Risk Cutoffs, Max 15 pts)
  let biometricPoints = 0;
  // BMI component (8 pts)
  if (bmi >= 18.5 && bmi <= 22.9) {
    biometricPoints += 8; // Normal Asian Indian
  } else if (bmi > 22.9 && bmi <= 24.9) {
    biometricPoints += 5; // Overweight
  } else {
    biometricPoints += 3; // Obese or underweight
  }
  // Waist component (7 pts)
  const waistLimit = gender === "female" ? 80 : 90;
  if (waistCm > 0) {
    if (waistCm <= waistLimit) {
      biometricPoints += 7;
    } else if (waistCm <= waistLimit + 5) {
      biometricPoints += 4;
    } else {
      biometricPoints += 2;
    }
  } else {
    biometricPoints += 4;
  }

  const rawScore = nutritionPoints + proteinPoints + activityPoints + hydrationPoints + biometricPoints;
  const score = Math.min(100, Math.max(10, rawScore));

  let tierEn: "Optimal" | "Good" | "Needs Focus" = "Optimal";
  let tierTe: "ఆప్టిమల్" | "మంచిది" | "దృష్టి అవసరం" = "ఆప్టిమల్";

  if (score >= 80) {
    tierEn = "Optimal";
    tierTe = "ఆప్టిమల్";
  } else if (score >= 60) {
    tierEn = "Good";
    tierTe = "మంచిది";
  } else {
    tierEn = "Needs Focus";
    tierTe = "దృష్టి అవసరం";
  }

  return {
    score,
    tierEn,
    tierTe,
    nutritionPoints,
    proteinPoints,
    activityPoints,
    hydrationPoints,
    biometricPoints,
  };
}

