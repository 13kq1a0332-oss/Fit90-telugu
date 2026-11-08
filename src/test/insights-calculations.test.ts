import { describe, it, expect, beforeEach } from "vitest";
import {
  computeWeeklyDigest,
  computeRollingMovingAverage,
  getNotificationPreferences,
  saveNotificationPreferences,
  generateShareableDigestText,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "../lib/insights-store";
import {
  checkMedicalRedFlags,
  generateCoachResponse,
  hasUserConsentedToAi,
  setUserAiConsent,
  EMERGENCY_DEFLECTION_MESSAGE,
} from "../lib/ai/lifestyle-coach";

describe("Phase 6 - Insights & Weekly Summaries", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  describe("Weekly Progress Digest Aggregation", () => {
    it("computes 7-day progress digest with realistic adherence wins", async () => {
      const digest = await computeWeeklyDigest();

      expect(digest.startDate).toBeDefined();
      expect(digest.endDate).toBeDefined();
      expect(digest.avgCalories).toBeGreaterThan(1500);
      expect(digest.avgProteinG).toBeGreaterThanOrEqual(90);
      expect(digest.avgWaterMl).toBeGreaterThan(2000);
      expect(digest.totalSteps).toBeGreaterThan(10000);
      expect(digest.activeWorkoutDays).toBeGreaterThanOrEqual(1);

      // Biometrics
      expect(digest.latestWeightKg).toBeCloseTo(117.2, 1);
      expect(digest.baselineWeightKg).toBe(118.0);
      expect(digest.weightDeltaKg).toBeLessThan(0); // -0.8 kg

      expect(digest.latestWaistCm).toBe(148.5);
      expect(digest.baselineWaistCm).toBe(150.0);
      expect(digest.waistDeltaCm).toBe(-1.5);

      // Adherence Wins
      expect(digest.adherenceWins.length).toBeGreaterThan(0);
      const proteinWin = digest.adherenceWins.find((w) => w.category === "protein");
      expect(proteinWin).toBeDefined();
      expect(proteinWin?.titleEn).toContain("Protein Target");

      const waistWin = digest.adherenceWins.find((w) => w.category === "waist");
      expect(waistWin).toBeDefined();
      expect(waistWin?.detailEn).toContain("Visceral fat reduction");
    });

    it("formats bilingual WhatsApp/SMS shareable digest with disclaimers", async () => {
      const digest = await computeWeeklyDigest();

      const enText = generateShareableDigestText(digest, "en");
      expect(enText).toContain("Fit90 Telugu — Weekly Progress Digest");
      expect(enText).toContain("117.2 kg");
      expect(enText).toContain("148.5 cm");
      expect(enText).toContain("Non-diagnostic");

      const teText = generateShareableDigestText(digest, "te");
      expect(teText).toContain("ఫిట్90 తెలుగు — వారపు పురోగతి నివేదిక");
      expect(teText).toContain("శరీర బరువు");
      expect(teText).toContain("నడుము కొలత");
      expect(teText).toContain("జీవనశైలి ట్రాకింగ్ నివేదిక మాత్రమే");
    });
  });

  describe("7-Day Rolling Moving Average", () => {
    it("computes smoothed rolling average points without scale noise", async () => {
      const points = await computeRollingMovingAverage(7);
      expect(points.length).toBeGreaterThanOrEqual(2);

      points.forEach((p) => {
        expect(p.date).toBeDefined();
        expect(p.actualWeight).toBeGreaterThan(100);
        expect(p.rollingAvgWeight).toBeGreaterThan(100);
        expect(Number.isNaN(p.rollingAvgWeight)).toBe(false);
      });
    });
  });

  describe("Notification Preferences Management", () => {
    it("returns default notification preferences", async () => {
      const prefs = await getNotificationPreferences();
      expect(prefs.pushEnabled).toBe(true);
      expect(prefs.emailWeeklySummary).toBe(true);
      expect(prefs.whatsappDigestEnabled).toBe(true);
      expect(prefs.quietHoursStart).toBe("22:00");
      expect(prefs.quietHoursEnd).toBe("06:00");
    });

    it("saves and persists updated preferences", async () => {
      await saveNotificationPreferences({
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        pushEnabled: false,
        quietHoursStart: "23:00",
      });

      const updated = await getNotificationPreferences();
      expect(updated.pushEnabled).toBe(false);
      expect(updated.quietHoursStart).toBe("23:00");
    });
  });

  describe("AI Lifestyle Coach Engine & Guardrails", () => {
    it("manages user explicit opt-in consent gate", () => {
      expect(hasUserConsentedToAi()).toBe(false);
      setUserAiConsent(true);
      expect(hasUserConsentedToAi()).toBe(true);
      setUserAiConsent(false);
      expect(hasUserConsentedToAi()).toBe(false);
    });

    it("detects acute medical emergency red flags and deflects immediately", () => {
      expect(checkMedicalRedFlags("I have severe chest pain and left arm ache")).toBe(true);
      expect(checkMedicalRedFlags("Feeling dizziness and short of breath")).toBe(true);
      expect(checkMedicalRedFlags("నాకు ఛాతీ నొప్పి మరియు ఆయాసం వస్తోంది")).toBe(true);

      // Benign fitness questions should NOT trigger red flags
      expect(checkMedicalRedFlags("How to make moong dal pesarattu?")).toBe(false);
      expect(checkMedicalRedFlags("Why is my walking cadence 100 steps per minute?")).toBe(false);
    });

    it("returns immediate emergency alert when red flag symptom is asked", async () => {
      const digest = await computeWeeklyDigest();
      const response = generateCoachResponse("I have sudden chest pain and dizziness", digest);

      expect(response.isRedFlagWarning).toBe(true);
      expect(response.textEn).toContain("CRITICAL MEDICAL ALERT");
      expect(response.textEn).toContain("108 or 112");
      expect(response.textTe).toContain("అత్యవసర వైద్య హెచ్చరిక");
      expect(response.textTe).toContain("108 లేదా 112");
    });

    it("deflects prescription, pharmaceutical, and diagnostic requests", async () => {
      const digest = await computeWeeklyDigest();
      const response = generateCoachResponse("Can you prescribe me statin or metformin dosage?", digest);

      expect(response.textEn).toContain("Non-Diagnostic Boundary");
      expect(response.textEn).toContain("cannot diagnose");
      expect(response.textTe).toContain("వైద్య నిరాకరణ");
    });

    it("answers South Indian dinner questions with nutritious staples", async () => {
      const digest = await computeWeeklyDigest();
      const response = generateCoachResponse("Suggest healthy dinner swaps", digest);

      expect(response.textEn).toContain("Pesarattu");
      expect(response.textEn).toContain("Palakura Pappu");
      expect(response.textTe).toContain("పెసరట్లు");
      expect(response.textTe).toContain("పాలకూర పప్పు");
    });

    it("explains daily weight fluctuations and scale anxiety scientifically", async () => {
      const digest = await computeWeeklyDigest();
      const response = generateCoachResponse("Why did my weight fluctuate by 1kg today?", digest);

      expect(response.textEn).toContain("water, sodium, and digestive bulk");
      expect(response.textEn).toContain("rolling average");
      expect(response.textTe).toContain("నీరు, ఉప్పు మరియు జీర్ణక్రియ");
    });

    it("educates on waist circumference and visceral fat risk", async () => {
      const digest = await computeWeeklyDigest();
      const response = generateCoachResponse("Tell me about my 150cm waist and visceral fat", digest);

      expect(response.textEn).toContain("90 cm");
      expect(response.textEn).toContain("visceral");
      expect(response.textTe).toContain("విసెరల్ కొవ్వు");
    });
  });
});

