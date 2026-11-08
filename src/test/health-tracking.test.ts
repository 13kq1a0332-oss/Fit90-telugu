import { describe, it, expect, beforeEach } from "vitest";
import {
  classifyBloodPressure,
  getBloodPressureLogs,
  addBloodPressureLog,
  deleteBloodPressureLog,
  getWaterTotalForDate,
  addWaterLog,
  resetWaterForDate,
  getSleepLogForDate,
  saveSleepLog,
  getWeightHistory,
  addWeightLog,
  getWaistHistory,
  addWaistLog,
  getLabRecords,
  addLabRecord,
  deleteLabRecord,
  loadSampleTestProfileLabs,
  getHealthReminders,
  toggleHealthReminder,
  updateHealthReminderTime,
  DEFAULT_REMINDERS,
} from "../lib/health-store";
import { SAMPLE_QA_LAB_RECORDS } from "../lib/test-fixtures/sample-labs";

describe("Phase 5 - Health & Biometrics Tracking", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  describe("Blood Pressure Classification Engine", () => {
    it("classifies normal blood pressure (<120 / <80 mmHg)", () => {
      const res = classifyBloodPressure(115, 75);
      expect(res.stage).toBe("normal");
      expect(res.isCrisis).toBe(false);
      expect(res.labelEn).toContain("Normal");
      expect(res.labelTe).toContain("సాధారణం");
    });

    it("classifies elevated blood pressure (120-129 / <80 mmHg)", () => {
      const res = classifyBloodPressure(125, 78);
      expect(res.stage).toBe("elevated");
      expect(res.isCrisis).toBe(false);
      expect(res.labelEn).toContain("Elevated");
    });

    it("classifies Stage 1 hypertension (130-139 / 80-89 mmHg)", () => {
      const resBySystolic = classifyBloodPressure(132, 78);
      expect(resBySystolic.stage).toBe("stage_1");
      expect(resBySystolic.isCrisis).toBe(false);

      const resByDiastolic = classifyBloodPressure(118, 84);
      expect(resByDiastolic.stage).toBe("stage_1");
    });

    it("classifies Stage 2 hypertension (>=140 / >=90 mmHg)", () => {
      const res1 = classifyBloodPressure(145, 88);
      expect(res1.stage).toBe("stage_2");
      expect(res1.isCrisis).toBe(false);

      const res2 = classifyBloodPressure(135, 95);
      expect(res2.stage).toBe("stage_2");
    });

    it("flags Hypertensive Crisis (>180 systolic OR >120 diastolic) as emergency", () => {
      const crisisSystolic = classifyBloodPressure(185, 100);
      expect(crisisSystolic.stage).toBe("crisis");
      expect(crisisSystolic.isCrisis).toBe(true);
      expect(crisisSystolic.labelEn).toContain("Crisis");
      expect(crisisSystolic.labelTe).toContain("తీవ్ర రక్తపోటు ముప్పు");

      const crisisDiastolic = classifyBloodPressure(150, 125);
      expect(crisisDiastolic.stage).toBe("crisis");
      expect(crisisDiastolic.isCrisis).toBe(true);
    });
  });

  describe("Blood Pressure CRUD Operations", () => {
    it("adds a blood pressure reading and retrieves it", async () => {
      const created = await addBloodPressureLog({
        systolic: 128,
        diastolic: 82,
        pulse: 74,
        loggedDate: "2026-11-08",
        loggedTime: "08:30",
        notes: "Resting morning reading",
      });

      expect(created.id).toBeDefined();
      expect(created.stage).toBe("stage_1");

      const logs = await getBloodPressureLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].systolic).toBe(128);
      expect(logs[0].pulse).toBe(74);
    });

    it("deletes a blood pressure reading by id", async () => {
      const entry1 = await addBloodPressureLog({
        systolic: 120,
        diastolic: 80,
        loggedDate: "2026-11-07",
        loggedTime: "09:00",
      });
      const entry2 = await addBloodPressureLog({
        systolic: 130,
        diastolic: 85,
        loggedDate: "2026-11-08",
        loggedTime: "09:00",
      });

      let current = await getBloodPressureLogs();
      expect(current.length).toBe(2);

      await deleteBloodPressureLog(entry1.id);
      current = await getBloodPressureLogs();
      expect(current.length).toBe(1);
      expect(current[0].id).toBe(entry2.id);
    });
  });

  describe("Hydration & Sleep Tracking", () => {
    it("accumulates water intake for a date and allows resetting", async () => {
      const date = "2026-11-08";
      expect(await getWaterTotalForDate(date)).toBe(0);

      const total1 = await addWaterLog(250, date);
      expect(total1).toBe(250);

      const total2 = await addWaterLog(500, date);
      expect(total2).toBe(750);

      const fetched = await getWaterTotalForDate(date);
      expect(fetched).toBe(750);

      await resetWaterForDate(date);
      expect(await getWaterTotalForDate(date)).toBe(0);
    });

    it("saves and retrieves daily sleep log with snoring status", async () => {
      const date = "2026-11-08";
      expect(await getSleepLogForDate(date)).toBeNull();

      await saveSleepLog({
        durationHours: 6.5,
        qualityScore: 3,
        snoringReported: true,
        loggedDate: date,
        notes: "Interrupted sleep; daytime fatigue noted",
      });

      const retrieved = await getSleepLogForDate(date);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.durationHours).toBe(6.5);
      expect(retrieved?.qualityScore).toBe(3);
      expect(retrieved?.snoringReported).toBe(true);
    });
  });

  describe("Weight & Waist Biometrics Logs", () => {
    it("logs a new morning weight and prepends to history", async () => {
      const baseline = await getWeightHistory();
      const initialCount = baseline.length;

      const newLog = await addWeightLog(116.8, "2026-11-08", "fasting_morning");
      expect(newLog.weightKg).toBe(116.8);

      const updated = await getWeightHistory();
      expect(updated.length).toBe(initialCount + 1);
      expect(updated[0].weightKg).toBe(116.8);
    });

    it("logs a new waist measurement and preserves history", async () => {
      const baseline = await getWaistHistory();
      const initialCount = baseline.length;

      const newLog = await addWaistLog(147.5, "2026-11-08");
      expect(newLog.waistCm).toBe(147.5);

      const updated = await getWaistHistory();
      expect(updated.length).toBe(initialCount + 1);
      expect(updated[0].waistCm).toBe(147.5);
    });
  });

  describe("Private Lab Records & Non-Diagnostic Guardrails", () => {
    it("loads sample QA test profile labs with exact clinical biomarkers", async () => {
      const loaded = await loadSampleTestProfileLabs();
      expect(loaded.length).toBe(4);

      const hsCrp = loaded.find((r) => r.testName.includes("hs-CRP"));
      expect(hsCrp).toBeDefined();
      expect(hsCrp?.numericValue).toBe(12.25);
      expect(hsCrp?.unit).toBe("mg/L");

      const hdl = loaded.find((r) => r.testName.includes("HDL"));
      expect(hdl).toBeDefined();
      expect(hdl?.numericValue).toBe(24.1);
      expect(hdl?.unit).toBe("mg/dL");

      const vitD = loaded.find((r) => r.testName.includes("Vitamin D"));
      expect(vitD).toBeDefined();
      expect(vitD?.numericValue).toBe(13.2);
      expect(vitD?.unit).toBe("ng/mL");

      const tg = loaded.find((r) => r.testName.includes("Triglycerides"));
      expect(tg).toBeDefined();
      expect(tg?.numericValue).toBe(260.0);
    });

    it("verifies non-diagnostic nature of lab test records", () => {
      SAMPLE_QA_LAB_RECORDS.forEach((rec) => {
        expect(rec.notes).toBeDefined();
        // None should claim definitive diagnosis or prescribe medication
        expect(rec.notes).not.toContain("prescription");
        expect(rec.notes).not.toContain("guarantee");
      });
    });

    it("adds and deletes a custom lab record", async () => {
      const rec = await addLabRecord({
        testName: "Fasting Plasma Glucose",
        testDate: "2026-11-08",
        numericValue: 104,
        unit: "mg/dL",
        referenceRangeText: "70 - 99 mg/dL (Normal)",
        notes: "Routine screen",
      });

      expect(rec.id).toBeDefined();
      let records = await getLabRecords();
      expect(records.length).toBe(1);
      expect(records[0].testName).toBe("Fasting Plasma Glucose");

      await deleteLabRecord(rec.id);
      records = await getLabRecords();
      expect(records.length).toBe(0);
    });
  });

  describe("Health Reminders Schedule", () => {
    it("provides 5 default lifestyle reminders (weight, water, walk, sleep)", async () => {
      const reminders = await getHealthReminders();
      expect(reminders.length).toBe(5);

      const types = reminders.map((r) => r.type);
      expect(types).toContain("weight");
      expect(types).toContain("water");
      expect(types).toContain("walk");
      expect(types).toContain("sleep");
    });

    it("toggles reminder enabled state and persists changes", async () => {
      const initial = await getHealthReminders();
      const firstId = initial[0].id;
      const initialStatus = initial[0].isEnabled;

      await toggleHealthReminder(firstId, !initialStatus);
      const updated = await getHealthReminders();
      const target = updated.find((r) => r.id === firstId);
      expect(target?.isEnabled).toBe(!initialStatus);
    });

    it("updates scheduled time for a reminder", async () => {
      const initial = await getHealthReminders();
      const walkReminder = initial.find((r) => r.type === "walk");
      expect(walkReminder).toBeDefined();

      await updateHealthReminderTime(walkReminder!.id, "15:30");
      const updated = await getHealthReminders();
      const target = updated.find((r) => r.id === walkReminder!.id);
      expect(target?.scheduledTime).toBe("15:30");
    });
  });
});

