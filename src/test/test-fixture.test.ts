import { describe, it, expect } from "vitest";
import { SAMPLE_TEST_USER_FIXTURE } from "@/lib/test-fixtures/sample-user";

describe("QA Sample User Fixture Isolation & Accuracy", () => {
  it("should match user specification for QA automation testing", () => {
    const { profile, goals, sampleVitals, sampleLabs } = SAMPLE_TEST_USER_FIXTURE;

    // Age 31, height 176 cm, weight 118 kg, waist 150 cm, desk job, mixed Indian diet
    expect(profile.age).toBe(31);
    expect(profile.height_cm).toBe(176);
    expect(profile.current_weight_kg).toBe(118);
    expect(profile.waist_cm).toBe(150);
    expect(profile.activity_level).toBe("sedentary");
    expect(profile.dietary_preference).toBe("mixed");

    // Calorie target 2000-2200 kcal/day, protein 100-120 g/day, 90-day target 112-114 kg
    expect(goals.calorie_target_min).toBe(2000);
    expect(goals.calorie_target_max).toBe(2200);
    expect(goals.protein_target_min_g).toBe(100);
    expect(goals.protein_target_max_g).toBe(120);
    expect(goals.target_weight_min_kg).toBe(112);
    expect(goals.target_weight_max_kg).toBe(114);

    // Snoring reported
    expect(sampleVitals.snoring_reported).toBe(true);

    // hs-CRP 12.25 mg/L, HDL 24.1 mg/dL, vitamin D 13.2 ng/mL
    const hsCrp = sampleLabs.find((l) => l.test_name.includes("hs-CRP"));
    expect(hsCrp?.numeric_value).toBe(12.25);
    expect(hsCrp?.unit).toBe("mg/L");

    const hdl = sampleLabs.find((l) => l.test_name.includes("HDL"));
    expect(hdl?.numeric_value).toBe(24.1);
    expect(hdl?.unit).toBe("mg/dL");

    const vitD = sampleLabs.find((l) => l.test_name.includes("Vitamin D"));
    expect(vitD?.numeric_value).toBe(13.2);
    expect(vitD?.unit).toBe("ng/mL");
  });

  it("should clearly label records for doctor consultation without automatic diagnosis", () => {
    for (const lab of SAMPLE_TEST_USER_FIXTURE.sampleLabs) {
      expect(lab.is_flagged_for_doctor_consultation).toBe(true);
      expect(lab.reference_range_text).toBeDefined();
    }
  });
});

