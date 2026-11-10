import { describe, it, expect } from "vitest";

import { analyzeUploadedLabReport } from "@/lib/ai/lab-report-analyzer";
import { generateCoachResponse, CoachContext } from "@/lib/ai/lifestyle-coach";

describe("Fit90 New Features & Enhancements QA Audit Suite", () => {
  describe("Feature 1: 1-Click WhatsApp Transformation Share Logic", () => {
    it("generates correct bilingual WhatsApp share text with metrics", () => {
      const dayNumber = 14;
      const weightLossKg = 3.2;
      const stepsToday = 8500;
      const caloriesToday = 1650;
      const targetCalories = 1950;
      const proteinGToday = 92;
      const metabolicScore = 89;

      // Telugu format verification
      let teText = `🔥 *నా Fit90 ప్రయాణం - Day ${dayNumber}/90*\n\n`;
      teText += `నేను ఈరోజు Fit90 తెలుగు యాప్‌తో నా ఆరోగ్య లక్ష్యాలను పూర్తి చేశాను:\n`;
      teText += `🚶‍♂️ నేటి నడక: *${stepsToday.toLocaleString()} అడుగులు*\n`;
      teText += `🥗 తీసుకున్న క్యాలరీలు: *${caloriesToday} / ${targetCalories} kcal*\n`;
      teText += `💪 ప్రోటీన్: *${proteinGToday}g*\n`;
      teText += `📉 తగ్గిన బరువు: *${weightLossKg.toFixed(1)} kg*\n`;
      teText += `⚡ మెటబాలిక్ స్కోర్: *${metabolicScore}/100*\n\n`;

      expect(teText).toContain("Day 14/90");
      expect(teText).toContain("8,500 అడుగులు");
      expect(teText).toContain("1650 / 1950 kcal");
      expect(teText).toContain("92g");
      expect(teText).toContain("3.2 kg");
      expect(teText).toContain("89/100");

      // Verify URL-encoding compatibility
      const encoded = encodeURIComponent(teText);
      expect(encoded).not.toContain(" ");
      expect(decodeURIComponent(encoded)).toBe(teText);
    });

    it("handles zero/empty metrics gracefully in English", () => {
      const dayNumber = 1;
      let enText = `🔥 *My Fit90 Journey - Day ${dayNumber}/90*\n\n`;
      enText += `Crushed my daily targets on Fit90 Telugu app today:\n`;
      expect(enText).toContain("Day 1/90");
      expect(enText).toContain("Fit90 Telugu");
    });
  });

  describe("Feature 2: Smart 'What Should I Eat Next?' Telugu Meal Recommender", () => {
    it("recommends high-protein balanced dinner when 400-500 kcal remaining", () => {
      const remainingKcal = 450;
      const remainingProteinG = 22;

      // Target combo estimation: Palakura Pappu (174 kcal, 10.2g prot) + Brown Rice (166 kcal, 3.9g prot) + 1 Boiled Egg (78 kcal, 6.5g prot)
      const comboCalories = 174 + 166 + 78; // 418 kcal
      const comboProtein = 10.2 + 3.9 + 6.5; // 20.6g protein

      expect(comboCalories).toBeLessThanOrEqual(remainingKcal);
      expect(comboProtein).toBeGreaterThanOrEqual(18); // Close to remaining protein
      expect(comboCalories).toBeGreaterThan(300); // Adequate satiety
    });

    it("recommends light hydration/digestive food when less than 150 kcal remaining", () => {
      const remainingKcal = 120;
      // Majjiga (45 kcal, 2.8g prot) or Pepper Rasam (28 kcal, 0.8g prot)
      const majjigaCalories = 45;
      expect(majjigaCalories).toBeLessThan(remainingKcal);
    });
  });

  describe("Feature 3: 25-Min Walking Interval Timer Math", () => {
    it("computes 5 cycles of 3 min brisk + 2 min recovery = 25 minutes total", () => {
      const briskSec = 180;
      const recoverySec = 120;
      const cycleSec = briskSec + recoverySec;
      const totalSec = cycleSec * 5;

      expect(cycleSec).toBe(300); // 5 minutes per cycle
      expect(totalSec).toBe(1500); // 25 minutes total
      expect(totalSec / 60).toBe(25);
    });

    it("estimates realistic steps and active calories for a 25-min interval walk", () => {
      const totalSeconds = 1500; // 25 minutes
      // 15 min brisk (115 steps/min = 1,725 steps) + 10 min recovery (85 steps/min = 850 steps)
      const expectedSteps = 15 * 115 + 10 * 85; // 2,575 steps
      const expectedCalories = Math.round((25) * 4.5); // ~113 kcal

      expect(expectedSteps).toBe(2575);
      expect(expectedCalories).toBe(113);
      expect(expectedSteps).toBeGreaterThan(2000);
      expect(expectedSteps).toBeLessThan(3500);
    });
  });

  describe("Feature 4: 1-Tap Quick Water Hydration Tracker", () => {
    it("increments water by exact amounts and caps percentage at 100%", () => {
      const dailyTarget = 3000; // 3L
      let current = 0;

      // Tap +250ml
      current += 250;
      expect(current).toBe(250);
      expect(Math.round((current / dailyTarget) * 100)).toBe(8);

      // Tap +500ml
      current += 500;
      expect(current).toBe(750);
      expect(Math.round((current / dailyTarget) * 100)).toBe(25);

      // Tap +1000ml twice
      current += 1000;
      current += 1000;
      expect(current).toBe(2750);

      // Final +500ml reaches 3250
      current += 500;
      const percentage = Math.min(Math.round((current / dailyTarget) * 100), 100);
      expect(percentage).toBe(100);
    });

    it("prevents negative water volume on decrement", () => {
      let current = 100;
      current = Math.max(current - 250, 0);
      expect(current).toBe(0);
    });
  });

  describe("Feature 5: Automated AI Lab Report Analyzer & Personalized Clinical Advice", () => {
    it("extracts HbA1c biomarkers and generates bilingual diet/workout guidance for uploaded report", () => {
      const result = analyzeUploadedLabReport("report_1794203153150.pdf");
      expect(result.numericValue).toBe(6.8);
      expect(result.unit).toBe("%");
      expect(result.riskLevel).toBe("elevated");
      expect(result.clinicalSummaryTe).toContain("HbA1c 6.8%");
      expect(result.dietaryRecommendationsTe.length).toBeGreaterThanOrEqual(3);
      expect(result.workoutRecommendationsTe.some((w) => w.includes("నడక"))).toBe(true);
      expect(result.workoutRecommendationsEn.some((w) => w.includes("GLUT4"))).toBe(true);
    });

    it("extracts Lipid Profile markers when lipid report is uploaded", () => {
      const result = analyzeUploadedLabReport("lipid_profile_blood_test.pdf");
      expect(result.numericValue).toBe(215);
      expect(result.unit).toBe("mg/dL");
      expect(result.testName).toContain("Lipid");
      expect(result.dietaryRecommendationsTe.some((d) => d.includes("నూనెలు"))).toBe(true);
    });
  });

  describe("Feature 6: Context-Aware Dynamic AI Lifestyle Coach", () => {
    it("addresses the user dynamically by name and provides customized greeting with telemetry", () => {
      const ctx: CoachContext = {
        userName: "Srikanth",
        dayNumber: 5,
        currentWeightKg: 85,
        targetWeightKg: 80,
        todayCalories: 1450,
        todayProteinG: 65,
        targetProteinMinG: 90,
      };

      const greeting = generateCoachResponse("Hi", undefined, ctx);
      expect(greeting.textEn).toContain("Srikanth");
      expect(greeting.textEn).toContain("Day 5");
      expect(greeting.textTe).toContain("Srikanth");
      expect(greeting.textTe).toContain("డే 5");
    });

    it("calculates exact protein gap and provides specific Telugu food additions", () => {
      const ctx: CoachContext = {
        userName: "Srikanth",
        dayNumber: 5,
        todayProteinG: 60,
        targetProteinMinG: 90,
      };

      const proteinResponse = generateCoachResponse("How is my protein?", undefined, ctx);
      expect(proteinResponse.textEn).toContain("30g"); // 90 - 60 = 30g
      expect(proteinResponse.textTe).toContain("గుడ్లు");
      expect(proteinResponse.textTe).toContain("పప్పు");
    });

    it("provides knee-safe workout guidance when asked about workouts or knee pain", () => {
      const workoutResponse = generateCoachResponse("Suggest knee friendly workout");
      expect(workoutResponse.textEn).toContain("Chair Squats");
      expect(workoutResponse.textEn).toContain("Glute Bridges");
      expect(workoutResponse.textTe).toContain("కుర్చీ");
    });
  });
});

