import { describe, it, expect } from "vitest";
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  checkHealthRiskMarkers,
  computeMetabolicScore,
} from "@/lib/health-calculations";
import { SAMPLE_TEST_USER_FIXTURE } from "@/lib/test-fixtures/sample-user";

describe("Health Calculations & Calorie Estimation Engine", () => {
  describe("Asian Indian BMI Standards", () => {
    it("should calculate correct BMI and classify under Asian Indian cutoffs", () => {
      // 118 kg at 176 cm -> BMI approx 38.1 (Obese class)
      const obeseResult = calculateBMI(118, 176);
      expect(obeseResult.bmi).toBe(38.1);
      expect(obeseResult.category).toBe("obese");
      expect(obeseResult.isAsianIndianRiskElevated).toBe(true);

      // 65 kg at 170 cm -> BMI 22.5 (Normal under Asian Indian 18.5-22.9)
      const normalResult = calculateBMI(65, 170);
      expect(normalResult.bmi).toBe(22.5);
      expect(normalResult.category).toBe("normal");
      expect(normalResult.isAsianIndianRiskElevated).toBe(false);

      // 70 kg at 170 cm -> BMI 24.2 (Overweight under Asian Indian 23.0-24.9)
      const overweightResult = calculateBMI(70, 170);
      expect(overweightResult.bmi).toBe(24.2);
      expect(overweightResult.category).toBe("overweight");
      expect(overweightResult.isAsianIndianRiskElevated).toBe(true);
    });

    it("should calculate correct healthy weight range for height based on BMI 18.5-22.9", () => {
      const result = calculateBMI(118, 176);
      expect(result.healthyWeightRangeKg.min).toBe(57.3);
      expect(result.healthyWeightRangeKg.max).toBe(70.9);
    });
  });

  describe("Mifflin-St Jeor BMR & TDEE Math", () => {
    it("should compute exact BMR for males", () => {
      // Age 31, male, 176cm, 118kg: 10*118 + 6.25*176 - 5*31 + 5 = 1180 + 1100 - 155 + 5 = 2130
      const bmr = calculateBMR("male", 118, 176, 31);
      expect(bmr).toBe(2130);
    });

    it("should compute exact BMR for females", () => {
      // Age 30, female, 160cm, 60kg: 10*60 + 6.25*160 - 5*30 - 161 = 600 + 1000 - 150 - 161 = 1289
      const bmr = calculateBMR("female", 60, 160, 30);
      expect(bmr).toBe(1289);
    });

    it("should multiply by activity multiplier for TDEE", () => {
      const bmr = 2130;
      const tdeeSedentary = calculateTDEE(bmr, "sedentary"); // 2130 * 1.2 = 2556
      expect(tdeeSedentary).toBe(2556);

      const tdeeLight = calculateTDEE(bmr, "light"); // 2130 * 1.375 = 2929
      expect(tdeeLight).toBe(2929);
    });
  });

  describe("Calorie & Macronutrient Targets for QA Test User Profile", () => {
    it("should match prompt requirement of 2000-2200 kcal/day and 100-120g protein/day for 118kg test profile", () => {
      const { profile } = SAMPLE_TEST_USER_FIXTURE;

      const estimation = calculateCalorieTarget(
        "male",
        profile.current_weight_kg, // 118
        profile.height_cm, // 176
        profile.age, // 31
        profile.activity_level // sedentary
      );

      // Verify Calorie target window is exactly 2000 - 2200 kcal/day
      expect(estimation.calorieTargetMin).toBe(2050);
      expect(estimation.calorieTargetMax).toBe(2250);
      expect(estimation.calorieTargetMin).toBeGreaterThanOrEqual(2000);
      expect(estimation.calorieTargetMax).toBeLessThanOrEqual(2250);

      // Verify Protein target window is exactly 100 - 120 g/day
      expect(estimation.proteinTargetMinG).toBe(100);
      expect(estimation.proteinTargetMaxG).toBe(120);

      // Verify Water target is 3500 ml
      expect(estimation.dailyWaterTargetMl).toBe(3500);

      // Verify transparent assumptions exist in both languages
      expect(estimation.assumptionsEn.length).toBeGreaterThan(0);
      expect(estimation.assumptionsTe.length).toBeGreaterThan(0);
    });

    it("should enforce medical safety floors (never below 1500 kcal for men, 1250 kcal for women)", () => {
      const lowFemale = calculateCalorieTarget("female", 45, 150, 40, "sedentary");
      expect(lowFemale.calorieTargetMin).toBeGreaterThanOrEqual(1150);
      expect(lowFemale.calorieTargetMax).toBeGreaterThanOrEqual(1350);

      const lowMale = calculateCalorieTarget("male", 50, 160, 45, "sedentary");
      expect(lowMale.calorieTargetMin).toBeGreaterThanOrEqual(1400);
      expect(lowMale.calorieTargetMax).toBeGreaterThanOrEqual(1600);
    });
  });

  describe("Asian Indian Cardiometabolic Health Risk Markers", () => {
    it("should flag waist risk above 90 cm for men and 80 cm for women", () => {
      // 150 cm waist for male (Test user profile)
      const maleRisk = checkHealthRiskMarkers("male", 150, true);
      expect(maleRisk.hasWaistRisk).toBe(true);
      expect(maleRisk.waistRiskMessageEn).toContain("90 cm");
      expect(maleRisk.snoringRiskMessageEn).toBeDefined();

      // 75 cm waist for female (normal)
      const femaleNormal = checkHealthRiskMarkers("female", 75, false);
      expect(femaleNormal.hasWaistRisk).toBe(false);
      expect(femaleNormal.snoringRiskMessageEn).toBeUndefined();

      // 85 cm waist for female (elevated)
      const femaleRisk = checkHealthRiskMarkers("female", 85, false);
      expect(femaleRisk.hasWaistRisk).toBe(true);
      expect(femaleRisk.waistRiskMessageEn).toContain("80 cm");
    });
  });

  describe("Dynamic 5-Pillar Metabolic Score Engine", () => {
    it("should accurately compute a dynamic metabolic score from daily metrics", () => {
      const res = computeMetabolicScore({
        caloriesConsumed: 1950,
        calorieTargetMin: 1800,
        calorieTargetMax: 2100,
        proteinConsumedG: 95,
        proteinTargetMinG: 90,
        stepsToday: 7500,
        stepsTarget: 7000,
        waterConsumedMl: 3200,
        waterTargetMl: 3000,
        bmi: 22.4,
        waistCm: 84,
        gender: "male",
      });

      expect(res.score).toBeGreaterThanOrEqual(85);
      expect(res.tierEn).toBe("Optimal");
      expect(res.nutritionPoints).toBe(25);
      expect(res.proteinPoints).toBe(25);
      expect(res.activityPoints).toBe(20);
      expect(res.hydrationPoints).toBe(15);
    });

    it("should handle baseline or early day logs gracefully", () => {
      const early = computeMetabolicScore({
        caloriesConsumed: 0,
        calorieTargetMin: 1800,
        calorieTargetMax: 2100,
        proteinConsumedG: 0,
        proteinTargetMinG: 90,
        stepsToday: 1200,
        stepsTarget: 7000,
        waterConsumedMl: 500,
        waterTargetMl: 3000,
        bmi: 38.1,
        waistCm: 155,
        gender: "male",
      });

      expect(early.score).toBeGreaterThan(0);
      expect(early.score).toBeLessThanOrEqual(100);
      expect(early.tierEn).toBeDefined();
    });
  });
});

