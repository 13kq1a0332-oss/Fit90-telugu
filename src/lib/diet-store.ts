import { FOOD_CATALOG, FoodItemNutrition, getFoodItemById, calculatePortionNutrition } from "./data/food-catalog";
import { createClient, isSupabaseConfigured } from "./supabase/client";

export type MealType = "breakfast" | "lunch" | "evening_snack" | "dinner";

export interface LoggedFoodEntry {
  id: string;
  foodItemId?: string;
  foodNameEn: string;
  foodNameTe: string;
  mealType: MealType;
  portionG: number;
  portionUnitLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  estimatedCostInr: number;
  loggedDate: string; // YYYY-MM-DD
  loggedTime: string;
}

export interface MealPlanItem {
  id: string;
  foodItemId: string;
  mealType: MealType;
  defaultPortionG: number;
  defaultUnitEn: string;
  defaultUnitTe: string;
  allowedSubstitutionIds: string[];
}

export interface ActiveMealPlan {
  id: string;
  titleEn: string;
  titleTe: string;
  targetCaloriesMin: number;
  targetCaloriesMax: number;
  items: Array<MealPlanItem & { activeFoodItemId: string; activePortionG: number }>;
}

export interface GroceryItem {
  foodItemId: string;
  nameEn: string;
  nameTe: string;
  totalGramsWeekly: number;
  totalGramsMonthly: number;
  estimatedCostInrWeekly: number;
  estimatedCostInrMonthly: number;
  category: string;
  checked: boolean;
}

const FOOD_LOGS_STORAGE_KEY = "fit90_food_logs";
const MEAL_PLAN_STORAGE_KEY = "fit90_active_meal_plan";
const GROCERY_CHECKED_KEY = "fit90_grocery_checked_items";

// Default balanced sample 90-day meal plan tuned for 2000-2200 kcal & 100-120g protein
export const DEFAULT_SAMPLE_MEAL_PLAN: ActiveMealPlan = {
  id: "fit90-core-plan",
  titleEn: "90-Day Sustainable South Indian Fat-Loss Plan",
  titleTe: "90 రోజుల సమతుల్య దక్షిణ భారత భోజన ప్రణాళిక",
  targetCaloriesMin: 2000,
  targetCaloriesMax: 2200,
  items: [
    // Breakfast: 2 Pesarattu (150g) + 3 Egg Whites (100g) + Fresh Papaya (150g) (~379 kcal, ~25g protein)
    {
      id: "bf-1",
      foodItemId: "pesarattu",
      activeFoodItemId: "pesarattu",
      mealType: "breakfast",
      defaultPortionG: 150,
      activePortionG: 150,
      defaultUnitEn: "2 Pesarattu (150g)",
      defaultUnitTe: "2 పెసరట్లు",
      allowedSubstitutionIds: ["idli", "jowar-roti", "upma-vegetable"],
    },
    {
      id: "bf-2",
      foodItemId: "boiled-egg-white",
      activeFoodItemId: "boiled-egg-white",
      mealType: "breakfast",
      defaultPortionG: 100,
      activePortionG: 100,
      defaultUnitEn: "3 Egg Whites (100g)",
      defaultUnitTe: "3 తెల్లసొనలు",
      allowedSubstitutionIds: ["paneer-low-fat", "whey-protein-isolate"],
    },
    {
      id: "bf-3",
      foodItemId: "papaya-fresh",
      activeFoodItemId: "papaya-fresh",
      mealType: "breakfast",
      defaultPortionG: 150,
      activePortionG: 150,
      defaultUnitEn: "1 Cup Fresh Papaya (150g)",
      defaultUnitTe: "1 కప్పు బొప్పాయి ముక్కలు",
      allowedSubstitutionIds: ["cucumber-tomato-salad"],
    },

    // Lunch: Steamed Rice (200g) + Palakura Pappu (180g) + Chicken Breast Curry (150g) + Curd (150g) + Salad (150g) (~783 kcal, ~57g protein)
    {
      id: "lunch-1",
      foodItemId: "sona-masoori-cooked",
      activeFoodItemId: "sona-masoori-cooked",
      mealType: "lunch",
      defaultPortionG: 200,
      activePortionG: 200,
      defaultUnitEn: "2 Katoris Steamed Rice (200g)",
      defaultUnitTe: "2 గిన్నెల అన్నం",
      allowedSubstitutionIds: ["brown-rice-cooked", "ragi-sankati", "jowar-roti"],
    },
    {
      id: "lunch-2",
      foodItemId: "palakura-pappu",
      activeFoodItemId: "palakura-pappu",
      mealType: "lunch",
      defaultPortionG: 180,
      activePortionG: 180,
      defaultUnitEn: "1.2 Bowl Palakura Pappu (180g)",
      defaultUnitTe: "పెద్ద గిన్నె పాలకూర పప్పు",
      allowedSubstitutionIds: ["toor-dal-cooked", "tomato-pappu"],
    },
    {
      id: "lunch-3",
      foodItemId: "chicken-curry-light",
      activeFoodItemId: "chicken-curry-light",
      mealType: "lunch",
      defaultPortionG: 150,
      activePortionG: 150,
      defaultUnitEn: "1 Bowl Chicken Breast Curry (150g)",
      defaultUnitTe: "1 గిన్నె చికెన్ కర్రీ",
      allowedSubstitutionIds: ["paneer-low-fat", "soya-chunks-curry", "boiled-egg-whole"],
    },
    {
      id: "lunch-4",
      foodItemId: "curd-homemade",
      activeFoodItemId: "curd-homemade",
      mealType: "lunch",
      defaultPortionG: 150,
      activePortionG: 150,
      defaultUnitEn: "1 Cup Curd (150g)",
      defaultUnitTe: "1 కప్పు పెరుగు",
      allowedSubstitutionIds: ["spiced-majjiga"],
    },
    {
      id: "lunch-5",
      foodItemId: "cucumber-tomato-salad",
      activeFoodItemId: "cucumber-tomato-salad",
      mealType: "lunch",
      defaultPortionG: 150,
      activePortionG: 150,
      defaultUnitEn: "1 Plate Salad (150g)",
      defaultUnitTe: "1 ప్లేటు సలాడ్",
      allowedSubstitutionIds: ["papaya-fresh"],
    },

    // Evening Snack: Spiced Majjiga (250ml) + Chana Sundal (100g) + Roasted Makhana (30g) (~307 kcal, ~15g protein)
    {
      id: "snack-1",
      foodItemId: "spiced-majjiga",
      activeFoodItemId: "spiced-majjiga",
      mealType: "evening_snack",
      defaultPortionG: 250,
      activePortionG: 250,
      defaultUnitEn: "1 Tall Glass Majjiga (250ml)",
      defaultUnitTe: "1 పెద్ద గ్లాసు మజ్జిగ",
      allowedSubstitutionIds: ["curd-homemade"],
    },
    {
      id: "snack-2",
      foodItemId: "chana-sundal",
      activeFoodItemId: "chana-sundal",
      mealType: "evening_snack",
      defaultPortionG: 100,
      activePortionG: 100,
      defaultUnitEn: "1 Cup Chana Sundal (100g)",
      defaultUnitTe: "1 కప్పు సెనగల గుగ్గిళ్ళు",
      allowedSubstitutionIds: ["phool-makhana-roasted"],
    },
    {
      id: "snack-3",
      foodItemId: "phool-makhana-roasted",
      activeFoodItemId: "phool-makhana-roasted",
      mealType: "evening_snack",
      defaultPortionG: 30,
      activePortionG: 30,
      defaultUnitEn: "1 Bowl Roasted Makhana (30g)",
      defaultUnitTe: "1 పెద్ద బౌల్ మఖానా",
      allowedSubstitutionIds: ["chana-sundal"],
    },

    // Dinner: 3 Phulkas (105g) + Tomato Pappu (150g) + 2 Whole Boiled Eggs (100g) (~565 kcal, ~30g protein)
    {
      id: "din-1",
      foodItemId: "wheat-roti-phulka",
      activeFoodItemId: "wheat-roti-phulka",
      mealType: "dinner",
      defaultPortionG: 105,
      activePortionG: 105,
      defaultUnitEn: "3 Phulkas (No Oil, 105g)",
      defaultUnitTe: "3 పుల్కాలు",
      allowedSubstitutionIds: ["jowar-roti", "sona-masoori-cooked"],
    },
    {
      id: "din-2",
      foodItemId: "tomato-pappu",
      activeFoodItemId: "tomato-pappu",
      mealType: "dinner",
      defaultPortionG: 150,
      activePortionG: 150,
      defaultUnitEn: "1 Bowl Tomato Pappu (150g)",
      defaultUnitTe: "1 గిన్నె టమోటా పప్పు",
      allowedSubstitutionIds: ["toor-dal-cooked", "palakura-pappu"],
    },
    {
      id: "din-3",
      foodItemId: "boiled-egg-whole",
      activeFoodItemId: "boiled-egg-whole",
      mealType: "dinner",
      defaultPortionG: 100,
      activePortionG: 100,
      defaultUnitEn: "2 Whole Boiled Eggs (100g)",
      defaultUnitTe: "2 గుడ్లు",
      allowedSubstitutionIds: ["paneer-low-fat", "chicken-curry-light", "soya-chunks-curry"],
    },
  ],
};

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

// -------------------------------------------------------------
// Daily Food Logs Management
// -------------------------------------------------------------

export async function getFoodLogsForDate(date: string): Promise<LoggedFoodEntry[]> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`${FOOD_LOGS_STORAGE_KEY}_${date}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("food_logs")
          .select("*")
          .eq("user_id", user.id)
          .eq("logged_date", date)
          .order("created_at", { ascending: true });

        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            foodItemId: d.food_item_id,
            foodNameEn: d.custom_food_name || "Food",
            foodNameTe: d.custom_food_name || "ఆహారం",
            mealType: d.meal_type as MealType,
            portionG: Number(d.portion_g),
            portionUnitLabel: `${d.portion_g}g`,
            calories: Number(d.calculated_calories),
            proteinG: Number(d.calculated_protein_g),
            carbsG: Number(d.calculated_carbs_g),
            fatG: Number(d.calculated_fat_g),
            fiberG: 0,
            estimatedCostInr: 0,
            loggedDate: d.logged_date,
            loggedTime: d.logged_time,
          }));
        }
      }
    } catch (e) {
      console.warn("Supabase fetch food logs error:", e);
    }
  }

  return [];
}

export async function addFoodLogEntry(
  entry: Omit<LoggedFoodEntry, "id">
): Promise<LoggedFoodEntry> {
  const newEntry: LoggedFoodEntry = {
    ...entry,
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
  };

  if (typeof window !== "undefined") {
    try {
      const current = await getFoodLogsForDate(entry.loggedDate);
      const updated = [...current, newEntry];
      localStorage.setItem(
        `${FOOD_LOGS_STORAGE_KEY}_${entry.loggedDate}`,
        JSON.stringify(updated)
      );
    } catch {
      // storage unavailable
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("food_logs").insert({
          user_id: user.id,
          food_item_id: entry.foodItemId || null,
          custom_food_name: entry.foodNameEn,
          meal_type: entry.mealType,
          portion_g: entry.portionG,
          calculated_calories: entry.calories,
          calculated_protein_g: entry.proteinG,
          calculated_carbs_g: entry.carbsG,
          calculated_fat_g: entry.fatG,
          logged_date: entry.loggedDate,
          logged_time: entry.loggedTime,
        } as any);
      }
    } catch (e) {
      console.warn("Supabase insert food log error:", e);
    }
  }

  return newEntry;
}

export async function deleteFoodLogEntry(id: string, date: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getFoodLogsForDate(date);
      const updated = current.filter((item) => item.id !== id);
      localStorage.setItem(
        `${FOOD_LOGS_STORAGE_KEY}_${date}`,
        JSON.stringify(updated)
      );
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from("food_logs").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete food log error:", e);
    }
  }
}

export function computeDailyNutritionTotals(logs: LoggedFoodEntry[]) {
  const totals = logs.reduce(
    (acc, log) => {
      acc.calories += log.calories;
      acc.proteinG += log.proteinG;
      acc.carbsG += log.carbsG;
      acc.fatG += log.fatG;
      acc.fiberG += log.fiberG;
      acc.estimatedCostInr += log.estimatedCostInr || 0;
      return acc;
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0, estimatedCostInr: 0 }
  );

  return {
    calories: Math.round(totals.calories),
    proteinG: Math.round(totals.proteinG * 10) / 10,
    carbsG: Math.round(totals.carbsG * 10) / 10,
    fatG: Math.round(totals.fatG * 10) / 10,
    fiberG: Math.round(totals.fiberG * 10) / 10,
    estimatedCostInr: Math.round(totals.estimatedCostInr),
  };
}

// -------------------------------------------------------------
// Active Meal Plan & Substitutions
// -------------------------------------------------------------

export function getActiveMealPlan(): ActiveMealPlan {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(MEAL_PLAN_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }
  return DEFAULT_SAMPLE_MEAL_PLAN;
}

export function updateMealPlanItemSubstitution(
  planItemId: string,
  newFoodItemId: string
): ActiveMealPlan {
  const currentPlan = getActiveMealPlan();
  const updatedItems = currentPlan.items.map((item) => {
    if (item.id === planItemId) {
      const newFood = getFoodItemById(newFoodItemId);
      const portion = newFood?.standardServingG || item.defaultPortionG;
      return {
        ...item,
        activeFoodItemId: newFoodItemId,
        activePortionG: portion,
      };
    }
    return item;
  });

  const updatedPlan: ActiveMealPlan = {
    ...currentPlan,
    items: updatedItems,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MEAL_PLAN_STORAGE_KEY, JSON.stringify(updatedPlan));
    } catch {
      // ignore
    }
  }

  return updatedPlan;
}

export function calculateMealPlanTotals(plan: ActiveMealPlan) {
  let totalCalories = 0;
  let totalProteinG = 0;
  let totalCarbsG = 0;
  let totalFatG = 0;
  let totalFiberG = 0;
  let totalCostInr = 0;

  for (const item of plan.items) {
    const food = getFoodItemById(item.activeFoodItemId);
    if (food) {
      const nut = calculatePortionNutrition(food, item.activePortionG);
      totalCalories += nut.calories;
      totalProteinG += nut.proteinG;
      totalCarbsG += nut.carbsG;
      totalFatG += nut.fatG;
      totalFiberG += nut.fiberG;
      totalCostInr += nut.estimatedCostInr;
    }
  }

  return {
    calories: Math.round(totalCalories),
    proteinG: Math.round(totalProteinG * 10) / 10,
    carbsG: Math.round(totalCarbsG * 10) / 10,
    fatG: Math.round(totalFatG * 10) / 10,
    fiberG: Math.round(totalFiberG * 10) / 10,
    costInrDaily: Math.round(totalCostInr),
  };
}

// -------------------------------------------------------------
// Grocery List & INR Budget Calculator
// -------------------------------------------------------------

export function generateGroceryList(plan: ActiveMealPlan): GroceryItem[] {
  const foodQuantities: Record<string, { food: FoodItemNutrition; totalGramsDaily: number }> = {};

  for (const item of plan.items) {
    const food = getFoodItemById(item.activeFoodItemId);
    if (food) {
      if (!foodQuantities[food.id]) {
        foodQuantities[food.id] = { food, totalGramsDaily: 0 };
      }
      foodQuantities[food.id].totalGramsDaily += item.activePortionG;
    }
  }

  let checkedMap: Record<string, boolean> = {};
  if (typeof window !== "undefined") {
    try {
      const savedChecked = localStorage.getItem(GROCERY_CHECKED_KEY);
      if (savedChecked) checkedMap = JSON.parse(savedChecked);
    } catch {}
  }

  return Object.values(foodQuantities).map(({ food, totalGramsDaily }) => {
    const totalGramsWeekly = totalGramsDaily * 7;
    const totalGramsMonthly = totalGramsDaily * 30;

    const estimatedCostInrWeekly = Math.round((food.estimatedCostInr * totalGramsWeekly) / 100);
    const estimatedCostInrMonthly = Math.round((food.estimatedCostInr * totalGramsMonthly) / 100);

    return {
      foodItemId: food.id,
      nameEn: food.nameEn,
      nameTe: food.nameTe,
      totalGramsWeekly,
      totalGramsMonthly,
      estimatedCostInrWeekly,
      estimatedCostInrMonthly,
      category: food.category,
      checked: !!checkedMap[food.id],
    };
  });
}

export function toggleGroceryItemCheck(foodItemId: string, checked: boolean) {
  if (typeof window !== "undefined") {
    try {
      const savedChecked = localStorage.getItem(GROCERY_CHECKED_KEY);
      const checkedMap = savedChecked ? JSON.parse(savedChecked) : {};
      checkedMap[foodItemId] = checked;
      localStorage.setItem(GROCERY_CHECKED_KEY, JSON.stringify(checkedMap));
    } catch {}
  }
}
