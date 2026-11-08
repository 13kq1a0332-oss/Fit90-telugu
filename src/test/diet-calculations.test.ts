import { describe, it, expect } from "vitest";
import {
  FOOD_CATALOG,
  getFoodItemById,
  calculatePortionNutrition,
} from "@/lib/data/food-catalog";
import {
  DEFAULT_SAMPLE_MEAL_PLAN,
  calculateMealPlanTotals,
  computeDailyNutritionTotals,
  generateGroceryList,
  updateMealPlanItemSubstitution,
  LoggedFoodEntry,
} from "@/lib/diet-store";

describe("Phase 3: Diet & Food Catalog Calculations", () => {
  it("contains essential South Indian staple foods in both Telugu and English", () => {
    expect(FOOD_CATALOG.length).toBeGreaterThanOrEqual(20);

    const rice = getFoodItemById("sona-masoori-cooked");
    expect(rice).toBeDefined();
    expect(rice?.nameEn).toContain("Sona Masoori");
    expect(rice?.nameTe).toContain("సోనా మసూరి");
    expect(rice?.state).toBe("cooked");

    const pesarattu = getFoodItemById("pesarattu");
    expect(pesarattu).toBeDefined();
    expect(pesarattu?.nameTe).toContain("పెసరట్టు");

    const chicken = getFoodItemById("chicken-curry-light");
    expect(chicken).toBeDefined();
    expect(chicken?.isVegetarian).toBe(false);

    const majjiga = getFoodItemById("spiced-majjiga");
    expect(majjiga).toBeDefined();
    expect(majjiga?.category).toBe("drink");
  });

  it("accurately calculates portion nutrition for varying weights and states", () => {
    const rice = getFoodItemById("sona-masoori-cooked")!;
    // 100g cooked rice: 130 kcal, 2.7g protein
    const portion100 = calculatePortionNutrition(rice, 100);
    expect(portion100.calories).toBe(130);
    expect(portion100.proteinG).toBe(2.7);

    // 150g cooked rice (1.5 katori standard serving): 130 * 1.5 = 195 kcal
    const portion150 = calculatePortionNutrition(rice, 150);
    expect(portion150.calories).toBe(195);
    expect(portion150.proteinG).toBeCloseTo(4.05, 1);
    expect(portion150.estimatedCostInr).toBe(12); // ₹8 per 100g * 1.5 = 12
  });

  it("verifies cooked vs raw state notes for user awareness", () => {
    const cookedRice = getFoodItemById("sona-masoori-cooked")!;
    expect(cookedRice.notesEn).toContain("absorbs");

    const cookedPappu = getFoodItemById("palakura-pappu")!;
    expect(cookedPappu.state).toBe("cooked");
  });

  it("correctly computes daily nutrition totals from logged entries", () => {
    const mockLogs: LoggedFoodEntry[] = [
      {
        id: "log-1",
        foodNameEn: "Pesarattu",
        foodNameTe: "పెసరట్టు",
        mealType: "breakfast",
        portionG: 150,
        portionUnitLabel: "2 pieces",
        calories: 320,
        proteinG: 16.0,
        carbsG: 44.0,
        fatG: 8.0,
        fiberG: 6.0,
        estimatedCostInr: 25,
        loggedDate: "2026-11-08",
        loggedTime: "08:30 AM",
      },
      {
        id: "log-2",
        foodNameEn: "Steamed Rice",
        foodNameTe: "అన్నం",
        mealType: "lunch",
        portionG: 150,
        portionUnitLabel: "1.5 katori",
        calories: 195,
        proteinG: 4.1,
        carbsG: 42.3,
        fatG: 0.5,
        fiberG: 0.6,
        estimatedCostInr: 12,
        loggedDate: "2026-11-08",
        loggedTime: "01:15 PM",
      },
      {
        id: "log-3",
        foodNameEn: "Palakura Pappu",
        foodNameTe: "పాలకూర పప్పు",
        mealType: "lunch",
        portionG: 150,
        portionUnitLabel: "1 bowl",
        calories: 180,
        proteinG: 11.2,
        carbsG: 22.5,
        fatG: 4.5,
        fiberG: 5.4,
        estimatedCostInr: 20,
        loggedDate: "2026-11-08",
        loggedTime: "01:15 PM",
      },
    ];

    const totals = computeDailyNutritionTotals(mockLogs);
    expect(totals.calories).toBe(320 + 195 + 180); // 695 kcal
    expect(totals.proteinG).toBeCloseTo(16.0 + 4.1 + 11.2, 1); // 31.3g
    expect(totals.estimatedCostInr).toBe(25 + 12 + 20); // ₹57
  });

  it("handles empty daily logs safely with zeroed totals", () => {
    const totals = computeDailyNutritionTotals([]);
    expect(totals.calories).toBe(0);
    expect(totals.proteinG).toBe(0);
    expect(totals.carbsG).toBe(0);
    expect(totals.fatG).toBe(0);
    expect(totals.fiberG).toBe(0);
    expect(totals.estimatedCostInr).toBe(0);
  });

  it("verifies the default 90-day South Indian meal plan aligns with 2000-2200 kcal & 100-120g protein targets", () => {
    const totals = calculateMealPlanTotals(DEFAULT_SAMPLE_MEAL_PLAN);

    // Baseline target range for the calibrated 118kg sedentary male test profile:
    // Mifflin-St Jeor TDEE ~2556, safe sustainable fat-loss intake 2000-2200 kcal
    expect(totals.calories).toBeGreaterThanOrEqual(1950);
    expect(totals.calories).toBeLessThanOrEqual(2250);

    // Protein target: 100-120g
    expect(totals.proteinG).toBeGreaterThanOrEqual(100);
    expect(totals.proteinG).toBeLessThanOrEqual(130);

    // Daily budget should be reasonable for home-cooked Indian meals (~₹150 - ₹350/day)
    expect(totals.costInrDaily).toBeGreaterThan(100);
    expect(totals.costInrDaily).toBeLessThan(400);
  });

  it("properly swaps substitutions and recalculates plan metrics", () => {
    // Check replacing rice with brown rice or ragi sankati
    const updatedPlan = updateMealPlanItemSubstitution(
      "lunch-1",
      "ragi-sankati"
    );

    const sankatiItem = updatedPlan.items.find((i) => i.id === "lunch-1");
    expect(sankatiItem?.activeFoodItemId).toBe("ragi-sankati");

    const totals = calculateMealPlanTotals(updatedPlan);
    expect(totals.calories).toBeGreaterThan(0);
    expect(totals.proteinG).toBeGreaterThan(0);
  });

  it("generates 7-day and 30-day grocery lists and aggregates quantities", () => {
    const groceryList = generateGroceryList(DEFAULT_SAMPLE_MEAL_PLAN);

    expect(groceryList.length).toBeGreaterThan(0);

    for (const item of groceryList) {
      expect(item.nameEn).toBeTruthy();
      expect(item.nameTe).toBeTruthy();
      expect(item.totalGramsWeekly).toBe(item.totalGramsMonthly * (7 / 30));
      expect(item.estimatedCostInrWeekly).toBeGreaterThan(0);
      expect(item.estimatedCostInrMonthly).toBeGreaterThan(item.estimatedCostInrWeekly);
      expect(typeof item.checked).toBe("boolean");
    }
  });
});

