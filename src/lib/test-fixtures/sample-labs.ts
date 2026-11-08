export interface LabRecordEntry {
  id: string;
  testName: string;
  testDate: string; // YYYY-MM-DD
  numericValue: number;
  unit: string;
  referenceRangeText: string;
  documentStoragePath?: string;
  documentFileName?: string;
  notes?: string;
}

/**
 * STRICTLY FOR QA & AUTHORIZED TEST ACCOUNTS ONLY.
 * NEVER exposed as a public default for new visitor signups.
 */
export const SAMPLE_QA_LAB_RECORDS: LabRecordEntry[] = [
  {
    id: "lab-1",
    testName: "High Sensitivity C-Reactive Protein (hs-CRP)",
    testDate: "2026-10-15",
    numericValue: 12.25,
    unit: "mg/L",
    referenceRangeText: "< 1.0 mg/L (Low), 1.0 - 3.0 mg/L (Moderate), > 3.0 mg/L (Elevated)",
    documentFileName: "Apollo_Diagnostics_Cardiac_hsCRP_Report.pdf",
    notes: "Systemic baseline inflammation marker for personal tracking. Non-diagnostic.",
  },
  {
    id: "lab-2",
    testName: "HDL Cholesterol",
    testDate: "2026-10-15",
    numericValue: 24.1,
    unit: "mg/dL",
    referenceRangeText: "> 40.0 mg/dL (Desirable for adult males)",
    documentFileName: "Apollo_Lipid_Panel_October.pdf",
    notes: "Monitored longitudinally with low-impact walking and dietary interventions.",
  },
  {
    id: "lab-3",
    testName: "Vitamin D (25-OH Total)",
    testDate: "2026-10-15",
    numericValue: 13.2,
    unit: "ng/mL",
    referenceRangeText: "30.0 - 100.0 ng/mL (Sufficient), < 20.0 ng/mL (Deficient)",
    documentFileName: "Vitamin_D_Screen.pdf",
    notes: "Discuss supplementation with personal physician.",
  },
  {
    id: "lab-4",
    testName: "Triglycerides",
    testDate: "2026-10-15",
    numericValue: 260.0,
    unit: "mg/dL",
    referenceRangeText: "< 150.0 mg/dL (Normal)",
    documentFileName: "Apollo_Lipid_Panel_October.pdf",
    notes: "Tracking metabolic lipid response to 2000-2200 kcal balanced diet.",
  },
];

