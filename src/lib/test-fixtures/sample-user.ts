/**
 * SAMPLE USER FIXTURE FOR TESTING AND QA VERIFICATION ONLY
 * 
 * IMPORTANT NOTICE:
 * This dataset represents an isolated, synthetic test fixture for QA and security test automation.
 * It must NEVER be used as a public default or default state for new signups.
 * It is NOT medical advice or clinical diagnosis.
 */

export interface SampleTestUserProfile {
  profile: {
    email: string;
    full_name: string;
    preferred_locale: "te" | "en";
    age: number;
    height_cm: number;
    current_weight_kg: number;
    waist_cm: number;
    activity_level: "sedentary";
    dietary_preference: "mixed";
    health_notes: string;
  };
  goals: {
    target_weight_min_kg: number;
    target_weight_max_kg: number;
    duration_days: number;
    calorie_target_min: number;
    calorie_target_max: number;
    protein_target_min_g: number;
    protein_target_max_g: number;
    daily_water_target_ml: number;
    daily_step_target: number;
  };
  sampleVitals: {
    snoring_reported: boolean;
    blood_pressure?: {
      systolic: number;
      diastolic: number;
    };
  };
  sampleLabs: Array<{
    test_name: string;
    numeric_value: number;
    unit: string;
    reference_range_text: string;
    is_flagged_for_doctor_consultation: boolean;
  }>;
}

export const SAMPLE_TEST_USER_FIXTURE: SampleTestUserProfile = {
  profile: {
    email: "test.telugu.user@fit90.test",
    full_name: "టెస్ట్ యూజర్ (Ramesh K.)",
    preferred_locale: "te",
    age: 31,
    height_cm: 176,
    current_weight_kg: 118,
    waist_cm: 150,
    activity_level: "sedentary",
    dietary_preference: "mixed",
    health_notes: "Desk job (software/desk worker). Private test record only.",
  },
  goals: {
    target_weight_min_kg: 112,
    target_weight_max_kg: 114,
    duration_days: 90,
    calorie_target_min: 2000,
    calorie_target_max: 2200,
    protein_target_min_g: 100,
    protein_target_max_g: 120,
    daily_water_target_ml: 3500,
    daily_step_target: 7000,
  },
  sampleVitals: {
    snoring_reported: true,
  },
  sampleLabs: [
    {
      test_name: "High-Sensitivity C-Reactive Protein (hs-CRP)",
      numeric_value: 12.25,
      unit: "mg/L",
      reference_range_text: "< 1.0 mg/L (Normal risk), 1.0-3.0 (Average), > 3.0 (High inflammation marker)",
      is_flagged_for_doctor_consultation: true,
    },
    {
      test_name: "High-Density Lipoprotein (HDL) Cholesterol",
      numeric_value: 24.1,
      unit: "mg/dL",
      reference_range_text: "> 40.0 mg/dL (Desirable for males)",
      is_flagged_for_doctor_consultation: true,
    },
    {
      test_name: "25-Hydroxy Vitamin D",
      numeric_value: 13.2,
      unit: "ng/mL",
      reference_range_text: "30.0 - 100.0 ng/mL (Sufficient)",
      is_flagged_for_doctor_consultation: true,
    },
  ],
};

