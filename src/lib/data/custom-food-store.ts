import { FoodItemNutrition, FoodCategory, FOOD_CATALOG } from "./food-catalog";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const CUSTOM_FOODS_STORAGE_KEY = "fit90_custom_foods";

export interface CustomFoodInput {
  nameEn: string;
  nameTe: string;
  category: FoodCategory;
  state: "cooked" | "raw";
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  standardServingG: number;
  servingUnitEn: string;
  servingUnitTe: string;
  estimatedCostInr?: number;
  isVegetarian: boolean;
  notesEn?: string;
  notesTe?: string;
}

/**
 * Retrieve custom user-added foods from localStorage
 */
export function getCustomFoods(): FoodItemNutrition[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_FOODS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load custom foods from localStorage", e);
    return [];
  }
}

/**
 * Get combined list of all foods: built-in catalog + user-added custom foods
 */
export function getAllFoods(): FoodItemNutrition[] {
  const custom = getCustomFoods();
  return [...FOOD_CATALOG, ...custom];
}

/**
 * Save a new custom food item to localStorage and attempt Supabase persistence
 */
export async function saveCustomFood(input: CustomFoodInput): Promise<FoodItemNutrition> {
  const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Calculate per100g values if serving size is different from 100g
  const factor = input.standardServingG > 0 ? 100 / input.standardServingG : 1;

  const newFood: FoodItemNutrition = {
    id,
    nameEn: input.nameEn.trim(),
    nameTe: input.nameTe.trim() || input.nameEn.trim(),
    category: input.category,
    state: input.state,
    per100g: {
      calories: Math.round(input.calories * factor),
      proteinG: Math.round(input.proteinG * factor * 10) / 10,
      carbsG: Math.round(input.carbsG * factor * 10) / 10,
      fatG: Math.round(input.fatG * factor * 10) / 10,
      fiberG: Math.round(input.fiberG * factor * 10) / 10,
    },
    standardServingG: input.standardServingG,
    servingUnitEn: input.servingUnitEn.trim() || "1 serving",
    servingUnitTe: input.servingUnitTe.trim() || "1 మోతాదు",
    householdMeasures: [
      {
        id: "standard",
        nameEn: input.servingUnitEn.trim() || "1 serving",
        nameTe: input.servingUnitTe.trim() || "1 మోతాదు",
        grams: input.standardServingG,
      },
    ],
    estimatedCostInr: input.estimatedCostInr || 15,
    isVegetarian: input.isVegetarian,
    notesEn: input.notesEn || "User added home food",
    notesTe: input.notesTe || "ఇంట్లో వండిన ఆహార పదార్థం",
    iconName: input.category === "curry" ? "soup" : "utensils",
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getCustomFoods();
      const updated = [newFood, ...existing];
      localStorage.setItem(CUSTOM_FOODS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save custom food to localStorage", e);
    }
  }

  // Attempt Supabase sync if live DB is configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("food_items").insert({
          id,
          name_en: newFood.nameEn,
          name_te: newFood.nameTe,
          category: newFood.category,
          state: newFood.state,
          calories_per_100g: newFood.per100g.calories,
          protein_g_per_100g: newFood.per100g.proteinG,
          carbs_g_per_100g: newFood.per100g.carbsG,
          fat_g_per_100g: newFood.per100g.fatG,
          fiber_g_per_100g: newFood.per100g.fiberG,
          standard_serving_g: newFood.standardServingG,
          is_vegetarian: newFood.isVegetarian,
          estimated_cost_inr: newFood.estimatedCostInr,
          created_by: user.id,
        } as any);
      }
    } catch (e) {
      // Graceful fallback to local storage
      console.warn("Supabase custom food insert notice:", e);
    }
  }

  return newFood;
}

/**
 * Delete a custom food item
 */
export function deleteCustomFood(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getCustomFoods();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(CUSTOM_FOODS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to delete custom food", e);
  }
}

