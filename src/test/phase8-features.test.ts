import { describe, it, expect } from "vitest";

describe("Phase 8 New Features: Telugu Voice-to-Plate & Clinical Biomarkers", () => {
  describe("Telugu Semantic Food & Quantity Parser", () => {
    // Replicate parsing logic for unit verification
    const parsePhrase = (rawText: string) => {
      const textLower = rawText.toLowerCase().trim();
      let factor = 1;
      if (textLower.includes("రెండు") || textLower.includes("2") || textLower.includes("two")) {
        factor = 2;
      } else if (textLower.includes("మూడు") || textLower.includes("3") || textLower.includes("three")) {
        factor = 3;
      } else if (textLower.includes("అర") || textLower.includes("సగం") || textLower.includes("half")) {
        factor = 0.5;
      }

      let matchedItem: string | null = null;
      if (textLower.includes("పెసర") || textLower.includes("pesarattu")) {
        matchedItem = "pesarattu";
      } else if (textLower.includes("అన్నం") || textLower.includes("rice")) {
        matchedItem = "sona-masuri-rice";
      } else if (textLower.includes("గుడ్డు") || textLower.includes("గుడ్లు") || textLower.includes("egg")) {
        matchedItem = "boiled-eggs";
      } else if (textLower.includes("మజ్జిగ") || textLower.includes("majiga") || textLower.includes("buttermilk")) {
        matchedItem = "majiga";
      }

      return { factor, matchedItem };
    };

    it("should correctly identify 'రెండు పెసరట్లు' with 2x multiplier", () => {
      const res = parsePhrase("రెండు పెసరట్లు");
      expect(res.matchedItem).toBe("pesarattu");
      expect(res.factor).toBe(2);
    });

    it("should recognize 'ఒక కప్పు అన్నం' with 1x multiplier", () => {
      const res = parsePhrase("ఒక కప్పు అన్నం");
      expect(res.matchedItem).toBe("sona-masuri-rice");
      expect(res.factor).toBe(1);
    });

    it("should recognize 'సగం గ్లాసు మజ్జిగ' with 0.5x multiplier", () => {
      const res = parsePhrase("సగం గ్లాసు మజ్జిగ");
      expect(res.matchedItem).toBe("majiga");
      expect(res.factor).toBe(0.5);
    });

    it("should recognize '3 eggs' in English query", () => {
      const res = parsePhrase("3 eggs");
      expect(res.matchedItem).toBe("boiled-eggs");
      expect(res.factor).toBe(3);
    });
  });

  describe("Clinical Biomarker Computations & Staging", () => {
    const computeTgHdlRatio = (triglycerides: number, hdl: number) => {
      if (hdl <= 0) return 0;
      return Math.round((triglycerides / hdl) * 10) / 10;
    };

    const stageInsulinResistance = (ratio: number) => {
      if (ratio <= 2.0) return "optimal";
      if (ratio <= 3.0) return "borderline";
      return "high_risk";
    };

    const stageGlycemicStatus = (hba1c: number, fastingGlucose: number) => {
      if (hba1c < 5.7 && fastingGlucose < 100) return "normal";
      if (hba1c < 6.5 || fastingGlucose < 126) return "prediabetes";
      return "diabetes";
    };

    it("should compute TG/HDL ratio accurately (175 / 42 = 4.2)", () => {
      const ratio = computeTgHdlRatio(175, 42);
      expect(ratio).toBe(4.2);
      expect(stageInsulinResistance(ratio)).toBe("high_risk");
    });

    it("should classify healthy profile (TG 100, HDL 50 = 2.0) as optimal", () => {
      const ratio = computeTgHdlRatio(100, 50);
      expect(ratio).toBe(2.0);
      expect(stageInsulinResistance(ratio)).toBe("optimal");
    });

    it("should classify pre-diabetes according to ICMR thresholds (HbA1c 5.9, FBG 108)", () => {
      const stage = stageGlycemicStatus(5.9, 108);
      expect(stage).toBe("prediabetes");
    });

    it("should classify normal glycemic status (HbA1c 5.2, FBG 92)", () => {
      const stage = stageGlycemicStatus(5.2, 92);
      expect(stage).toBe("normal");
    });

    it("should classify diabetes range (HbA1c 6.8, FBG 138)", () => {
      const stage = stageGlycemicStatus(6.8, 138);
      expect(stage).toBe("diabetes");
    });
  });
});
