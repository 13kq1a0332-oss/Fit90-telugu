"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  getFoodLogsForDate,
  addFoodLogEntry,
  getTodayDateString,
  MealType,
  LoggedFoodEntry,
} from "@/lib/diet-store";
import { getUserProfileAndGoal } from "@/lib/profile-store";
import { getAllFoods } from "@/lib/data/custom-food-store";
import { FoodItemNutrition } from "@/lib/data/food-catalog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Flame,
  Dumbbell,
  CheckCircle2,
  RefreshCw,
  Plus,
  Wheat,
  Droplet,
  Check,
} from "lucide-react";

interface MealComboItem {
  food: FoodItemNutrition;
  servings: number;
  labelTe: string;
  labelEn: string;
}

interface RecommendedCombo {
  titleTe: string;
  titleEn: string;
  descriptionTe: string;
  descriptionEn: string;
  badgeTe: string;
  badgeEn: string;
  items: MealComboItem[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
}

interface SmartMealRecommenderProps {
  onFoodLogged?: () => void;
  refreshTrigger?: number;
}

export function SmartMealRecommender({ onFoodLogged, refreshTrigger }: SmartMealRecommenderProps) {
  const { locale } = useI18n();

  const [targetCalories, setTargetCalories] = useState<number>(1900);
  const [targetProteinG, setTargetProteinG] = useState<number>(95);
  const [consumedCalories, setConsumedCalories] = useState<number>(0);
  const [consumedProteinG, setConsumedProteinG] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<MealType>("lunch");
  const [loggedSlots, setLoggedSlots] = useState<Set<MealType>>(new Set());
  const [comboIndex, setComboIndex] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<RecommendedCombo | null>(null);
  const [isLoggingCombo, setIsLoggingCombo] = useState(false);
  const [comboLoggedSuccess, setComboLoggedSuccess] = useState(false);

  // Helper to load all pre-defined curated South Indian combos per meal slot
  const getSlotCombos = useCallback((slot: MealType): RecommendedCombo[] => {
    const allFoods = getAllFoods();
    const findFood = (id: string) => allFoods.find((f) => f.id === id);

    // Fallback safe item generator if specific catalog items are missing
    const makeSafeItem = (id: string, defaultNameEn: string, defaultNameTe: string, cal: number, prot: number): FoodItemNutrition => {
      const found = findFood(id);
      if (found) return found;
      return {
        id,
        nameEn: defaultNameEn,
        nameTe: defaultNameTe,
        category: "breakfast",
        state: "cooked",
        per100g: { calories: cal, proteinG: prot, carbsG: 20, fatG: 2, fiberG: 2 },
        standardServingG: 100,
        servingUnitEn: "1 serving",
        servingUnitTe: "1 భాగం",
        householdMeasures: [],
        estimatedCostInr: 30,
        isVegetarian: true,
        iconName: "utensils",
      };
    };

    if (slot === "breakfast") {
      const pesarattu = makeSafeItem("pesarattu", "Pesarattu (Moong Dal Crepe)", "పెసరట్టు (పెసర పిండి దోశ)", 180, 9.6);
      const majjiga = makeSafeItem("spiced-majjiga", "Spiced Majjiga", "మసాలా మజ్జిగ", 36, 1.2);
      const idli = makeSafeItem("idli", "Steamed Plain Idli", "ఇడ్లీ", 140, 4.2);
      const sambar = makeSafeItem("vegetable-sambar", "Drumstick Sambar", "మునక్కాయ సాంబార్", 58, 2.1);
      const boiledEgg = makeSafeItem("boiled-egg-whole", "Boiled Egg (Whole)", "ఉడకబెట్టిన గుడ్డు", 155, 12.6);
      const omelette = makeSafeItem("egg-omelette", "Double Egg Omelette", "డబుల్ ఎగ్ ఆమ్లెట్", 190, 13.5);
      const phulka = makeSafeItem("wheat-roti-phulka", "Whole Wheat Phulka", "పుల్కా", 240, 8.5);
      const upma = makeSafeItem("upma-vegetable", "Vegetable Rava Upma", "వెజిటబుల్ రవ్వ ఉప్మా", 160, 4.0);

      return [
        {
          titleTe: "హై-ప్రోటీన్ పెసరట్టు & చల్లని మజ్జిగ",
          titleEn: "High-Protein Pesarattu & Spiced Majjiga",
          badgeTe: "ఆంధ్ర స్పెషల్ • గ్లూకోజ్ నిరోధకం",
          badgeEn: "Andhra Classic • Low GI Anchor",
          descriptionTe: "రక్తంలో చక్కెర పెరగకుండా రోజంతా స్థిరమైన శక్తినిచ్చే ఉత్తమ సంప్రదాయ తెలుగు అల్పాహారం.",
          descriptionEn: "Low-glycemic morning fuel rich in whole green gram plant protein and gut-friendly probiotics.",
          items: [
            { food: pesarattu, servings: 2, labelTe: "2 పెసరట్లు (150g)", labelEn: "2 Pesarattu (150g)" },
            { food: majjiga, servings: 1, labelTe: "1 పెద్ద గ్లాసు మజ్జిగ (250ml)", labelEn: "1 Large Glass Buttermilk (250ml)" },
          ],
          totalCalories: 360,
          totalProteinG: 18.2,
          totalCarbsG: 44.0,
          totalFatG: 7.5,
        },
        {
          titleTe: "మెత్తని ఇడ్లీలు + కూరగాయల సాంబార్ + ఉడకబెట్టిన గుడ్డు",
          titleEn: "Steamed Idli + Sambar + Whole Boiled Egg",
          badgeTe: "సులభంగా జీర్ణమయ్యే ప్రోటీన్",
          badgeEn: "Gut-Friendly & Lean Protein",
          descriptionTe: "జీర్ణవ్యవస్థకు మేలు చేసే ఆవిరి ఇడ్లీలు, కాయగూరల సాంబార్ మరియు సంపూర్ణ ప్రోటీన్ కలిగిన గుడ్డు.",
          descriptionEn: "Steamed fermented rice-lentil cakes paired with fiber-rich sambar and essential amino acids.",
          items: [
            { food: idli, servings: 3, labelTe: "3 ఇడ్లీలు (150g)", labelEn: "3 Steamed Idlis (150g)" },
            { food: sambar, servings: 1, labelTe: "1 గిన్నె సాంబార్ (150g)", labelEn: "1 Bowl Sambar (150g)" },
            { food: boiledEgg, servings: 1, labelTe: "1 ఉడకబెట్టిన గుడ్డు (50g)", labelEn: "1 Boiled Egg (50g)" },
          ],
          totalCalories: 375,
          totalProteinG: 16.8,
          totalCarbsG: 52.0,
          totalFatG: 6.8,
        },
        {
          titleTe: "డబుల్ ఎగ్ ఆమ్లెట్ + 2 గోధుమ పుల్కాలు",
          titleEn: "Double Egg Onion Omelette + 2 Wheat Phulkas",
          badgeTe: "మజిల్ రికవరీ & శక్తి",
          badgeEn: "Athletic Recovery Fuel",
          descriptionTe: "కండర పుష్టికి, ఉదయం క్యాలరీ బర్న్‌కు తోడ్పడే నూనె తక్కువతో కూడిన దేశీ ఎగ్ బ్రేక్‌ఫాస్ట్.",
          descriptionEn: "High-bioavailability protein plate supporting metabolic energy and sustained satiety.",
          items: [
            { food: omelette, servings: 1, labelTe: "1 డబుల్ ఎగ్ ఆమ్లెట్ (100g)", labelEn: "1 Double Egg Omelette (100g)" },
            { food: phulka, servings: 2, labelTe: "2 పుల్కాలు (70g)", labelEn: "2 Phulkas (70g)" },
          ],
          totalCalories: 358,
          totalProteinG: 19.5,
          totalCarbsG: 38.0,
          totalFatG: 11.2,
        },
        {
          titleTe: "కూరగాయల రవ్వ ఉప్మా + చల్లని జీలకర్ర మజ్జిగ",
          titleEn: "Vegetable Rava Upma & Jeera Majjiga",
          badgeTe: "తేలికపాటి శక్తి భోజనం",
          badgeEn: "Light Morning Vitality",
          descriptionTe: "క్యారెట్, బీన్స్, బఠానీలతో కూడిన తేలికపాటి ఉప్మా మరియు అజీర్తిని తగ్గించే జీలకర్ర మజ్జిగ.",
          descriptionEn: "High-fiber vegetable semolina upma accompanied by cooling cumin buttermilk.",
          items: [
            { food: upma, servings: 1, labelTe: "1 మధ్యస్థ గిన్నె ఉప్మా (150g)", labelEn: "1 Bowl Veg Upma (150g)" },
            { food: majjiga, servings: 1, labelTe: "1 గ్లాసు మజ్జిగ (250ml)", labelEn: "1 Glass Majjiga (250ml)" },
          ],
          totalCalories: 285,
          totalProteinG: 9.8,
          totalCarbsG: 48.0,
          totalFatG: 5.6,
        },
      ];
    }

    if (slot === "lunch") {
      const palakuraPappu = makeSafeItem("palakura-pappu", "Palakura Pappu", "పాలకూర పప్పు", 116, 6.8);
      const brownRice = makeSafeItem("brown-rice-cooked", "Brown Rice (Cooked)", "బ్రౌన్ రైస్ (వండినది)", 111, 2.6);
      const sonaMasoori = makeSafeItem("sona-masoori-cooked", "Sona Masoori Rice", "సోనా మసూరి అన్నం", 130, 2.7);
      const bendakaya = makeSafeItem("bendakaya-fry", "Bhendi Fry with Peanuts", "బెండకాయ వేపుడు", 135, 3.4);
      const ragiSankati = makeSafeItem("ragi-sankati", "Ragi Mudde / Sankati", "రాగి సంకటి / ముద్ద", 125, 2.8);
      const chickenCurry = makeSafeItem("chicken-curry-light", "Chicken Breast Curry (Light)", "నాటుకోడి / చికెన్ కూర", 130, 19.5);
      const tomatoPappu = makeSafeItem("tomato-pappu", "Tomato Pappu", "టమాటో పప్పు", 112, 6.2);
      const boiledEgg = makeSafeItem("boiled-egg-whole", "Boiled Egg", "ఉడకబెట్టిన గుడ్డు", 155, 12.6);
      const curd = makeSafeItem("curd-homemade", "Homemade Curd (Perugu)", "ఇంటి పెరుగు", 60, 3.5);
      const jowarRoti = makeSafeItem("jowar-roti", "Jowar Roti / Jonnah Rotte", "జొన్న రొట్టె", 120, 3.8);
      const guttiVankaya = makeSafeItem("gutti-vankaya", "Gutti Vankaya Curry", "గుత్తి వంకాయ కూర", 125, 2.5);
      const majjiga = makeSafeItem("spiced-majjiga", "Spiced Majjiga", "మసాలా మజ్జిగ", 36, 1.2);

      return [
        {
          titleTe: "పాలకూర పప్పు + బ్రౌన్ రైస్ + బెండకాయ కూర",
          titleEn: "Palakura Pappu + Brown Rice + Bhendi Fry",
          badgeTe: "ICMR 40/30/30 సమతుల్య భోజనం",
          badgeEn: "Gold Standard ICMR Plate",
          descriptionTe: "ఐరన్, పీచు పదార్థం మరియు నిదానంగా జీర్ణమయ్యే బ్రౌన్ రైస్‌తో కూడిన సమతుల్య పోషక భోజనం.",
          descriptionEn: "Iron-rich spinach dal paired with fiber-dense brown rice and antioxidant okra stir-fry.",
          items: [
            { food: palakuraPappu, servings: 1, labelTe: "1 పెద్ద గిన్నె పప్పు (150g)", labelEn: "1 Large Bowl Dal (150g)" },
            { food: brownRice, servings: 1, labelTe: "1 కప్పు వండిన బ్రౌన్ రైస్ (150g)", labelEn: "1 Cup Brown Rice (150g)" },
            { food: bendakaya, servings: 1, labelTe: "1 కప్పు బెండకాయ కూర (100g)", labelEn: "1 Cup Bhendi Fry (100g)" },
          ],
          totalCalories: 475,
          totalProteinG: 18.5,
          totalCarbsG: 64.0,
          totalFatG: 12.8,
        },
        {
          titleTe: "రాయలసీమ రాగి సంకటి + హోమ్-స్టైల్ చికెన్ కర్రీ",
          titleEn: "Rayalaseema Ragi Sankati + Lean Chicken Curry",
          badgeTe: "హై-ప్రోటీన్ • లో-గ్లైసిమిక్",
          badgeEn: "High-Protein • Low-GI",
          descriptionTe: "కాల్షియం సమృద్ధిగా ఉన్న రాగి ముద్ద మరియు తక్కువ నూనెతో చేసిన లీన్ చికెన్ రొమ్ము కూర.",
          descriptionEn: "Calcium-dense finger millet mudde served with lean home-cooked chicken breast for peak satiety.",
          items: [
            { food: ragiSankati, servings: 1, labelTe: "1 మధ్యస్థ రాగి ముద్ద (200g)", labelEn: "1 Medium Ragi Ball (200g)" },
            { food: chickenCurry, servings: 1, labelTe: "1 గిన్నె చికెన్ కూర (150g)", labelEn: "1 Bowl Chicken Breast (150g)" },
            { food: majjiga, servings: 1, labelTe: "1 గ్లాసు మజ్జిగ (250ml)", labelEn: "1 Glass Majjiga (250ml)" },
          ],
          totalCalories: 485,
          totalProteinG: 34.2,
          totalCarbsG: 52.0,
          totalFatG: 10.5,
        },
        {
          titleTe: "టమాటో పప్పు + అన్నం + ఉడకబెట్టిన గుడ్డు + తాజా పెరుగు",
          titleEn: "Tomato Pappu + Rice + Boiled Egg + Fresh Curd",
          badgeTe: "సంప్రదాయ తెలుగు మీల్",
          badgeEn: "Classic Andhra Comfort Meal",
          descriptionTe: "మితమైన అన్నంతో పాటు కందిపప్పు, విటమిన్-C టమాటో, గుడ్డు మరియు ప్రేగులకు మేలు చేసే తాజా పెరుగు.",
          descriptionEn: "Portion-controlled rice paired with protein dal, whole egg, and gut-soothing probiotic curd.",
          items: [
            { food: tomatoPappu, servings: 1, labelTe: "1 గిన్నె పప్పు (150g)", labelEn: "1 Bowl Dal (150g)" },
            { food: sonaMasoori, servings: 1, labelTe: "1 కటోరి అన్నం (120g)", labelEn: "1 Katori Rice (120g)" },
            { food: boiledEgg, servings: 1, labelTe: "1 ఉడకబెట్టిన గుడ్డు (50g)", labelEn: "1 Boiled Egg (50g)" },
            { food: curd, servings: 1, labelTe: "1 చిన్న కప్పు పెరుగు (100g)", labelEn: "1 Cup Curd (100g)" },
          ],
          totalCalories: 468,
          totalProteinG: 22.4,
          totalCarbsG: 58.0,
          totalFatG: 11.2,
        },
        {
          titleTe: "2 జొన్న రొట్టెలు + గుత్తి వంకాయ కూర + మజ్జిగ",
          titleEn: "2 Jowar Rotis + Gutti Vankaya + Spiced Buttermilk",
          badgeTe: "ఫైబర్ రిచ్ • గ్లూటెన్-ఫ్రీ",
          badgeEn: "Gluten-Free High-Fiber",
          descriptionTe: "డయాబెటిస్ నియంత్రణకు మేలైన చిరుధాన్య జొన్న రొట్టెలు మరియు మసాలా తక్కువ గుత్తి వంకాయ.",
          descriptionEn: "Complex whole-millet rotis rich in micronutrients and dietary fiber paired with spiced majjiga.",
          items: [
            { food: jowarRoti, servings: 2, labelTe: "2 జొన్న రొట్టెలు (90g)", labelEn: "2 Jowar Rotis (90g)" },
            { food: guttiVankaya, servings: 1, labelTe: "1 గిన్నె గుత్తి వంకాయ (120g)", labelEn: "1 Bowl Gutti Vankaya (120g)" },
            { food: majjiga, servings: 1, labelTe: "1 గ్లాసు మజ్జిగ (250ml)", labelEn: "1 Glass Majjiga (250ml)" },
          ],
          totalCalories: 410,
          totalProteinG: 14.2,
          totalCarbsG: 62.0,
          totalFatG: 9.8,
        },
      ];
    }

    if (slot === "evening_snack") {
      const boiledEgg = makeSafeItem("boiled-egg-whole", "Boiled Egg (Whole)", "ఉడకబెట్టిన గుడ్డు", 155, 12.6);
      const majjiga = makeSafeItem("spiced-majjiga", "Spiced Majjiga", "మసాలా మజ్జిగ", 36, 1.2);
      const chana = makeSafeItem("chana-sundal", "Boiled Chickpea Sundal", "ఉడకబెట్టిన శెనగల సుండల్", 164, 8.9);
      const makhana = makeSafeItem("phool-makhana-roasted", "Roasted Phool Makhana", "వేయించిన ఫూల్ మఖానా", 350, 9.7);
      const ragiMalt = makeSafeItem("ragi-malt", "Ragi Malt / Ambali (Sugar-Free)", "రాగి అంబలి / మాల్ట్", 52, 1.8);

      return [
        {
          titleTe: "2 ఉడకబెట్టిన గుడ్లు + చల్లని మసాలా మజ్జిగ",
          titleEn: "2 Whole Boiled Eggs + Spiced Majjiga",
          badgeTe: "జీరో కార్బ్ ప్రోటీన్ స్నాక్",
          badgeEn: "Pure Satiety & Muscle Fuel",
          descriptionTe: "సాయంత్రం ఆకలిని నివారించి, రాత్రి అతిగా తినకుండా అడ్డుకునే స్వచ్ఛమైన ప్రోటీన్ స్నాక్.",
          descriptionEn: "Clean, low-carb satiety snack that stops evening junk food cravings and fuels metabolic rate.",
          items: [
            { food: boiledEgg, servings: 2, labelTe: "2 గుడ్లు (100g)", labelEn: "2 Boiled Eggs (100g)" },
            { food: majjiga, servings: 1, labelTe: "1 పెద్ద గ్లాసు మజ్జిగ (250ml)", labelEn: "1 Glass Buttermilk (250ml)" },
          ],
          totalCalories: 205,
          totalProteinG: 15.6,
          totalCarbsG: 4.8,
          totalFatG: 11.5,
        },
        {
          titleTe: "ఉడకబెట్టిన గుగ్గిళ్లు / శెనగల సుండల్ + మజ్జిగ",
          titleEn: "Boiled Chickpeas (Senagalu Sundal) + Majjiga",
          badgeTe: "సహజమైన మొక్కల ప్రోటీన్",
          badgeEn: "Plant Protein & Soluble Fiber",
          descriptionTe: "కొలెస్ట్రాల్‌ను తగ్గించే పీచు పదార్థం మరియు మొక్కల ప్రోటీన్‌తో కూడిన సంప్రదాయ స్నాక్.",
          descriptionEn: "Traditional boiled black/white gram seasoned with mustard seeds, curry leaves, and fresh ginger.",
          items: [
            { food: chana, servings: 1, labelTe: "1 కప్పు ఉడకబెట్టిన శెనగలు (100g)", labelEn: "1 Cup Boiled Chickpeas (100g)" },
            { food: majjiga, servings: 1, labelTe: "1 గ్లాసు మజ్జిగ (250ml)", labelEn: "1 Glass Buttermilk (250ml)" },
          ],
          totalCalories: 215,
          totalProteinG: 11.8,
          totalCarbsG: 28.0,
          totalFatG: 4.8,
        },
        {
          titleTe: "డ్రై రోస్టెడ్ పూల్ మఖానా + వేడి రాగి మాల్ట్ (పంచదార లేకుండా)",
          titleEn: "Roasted Phool Makhana + Sugar-Free Ragi Malt",
          badgeTe: "కాల్షియం & యాంటీఆక్సిడెంట్స్",
          badgeEn: "Crunchy & Low-Calorie",
          descriptionTe: "తక్కువ క్యాలరీలతో కరకరలాడే తామర గింజలు మరియు కాల్షియం నిండిన వేడి రాగి మాల్ట్.",
          descriptionEn: "Crunchy fox nuts dry roasted with a pinch of turmeric and rock salt, paired with warm unsweetened ragi malt.",
          items: [
            { food: makhana, servings: 1, labelTe: "1 బౌల్ మఖానా (35g)", labelEn: "1 Bowl Roasted Makhana (35g)" },
            { food: ragiMalt, servings: 1, labelTe: "1 పెద్ద కప్పు రాగి మాల్ట్ (200ml)", labelEn: "1 Cup Ragi Malt (200ml)" },
          ],
          totalCalories: 210,
          totalProteinG: 6.8,
          totalCarbsG: 34.0,
          totalFatG: 2.2,
        },
      ];
    }

    // Default: Dinner
    const phulka = makeSafeItem("wheat-roti-phulka", "Whole Wheat Phulka", "పుల్కా", 240, 8.5);
    const palakuraPappu = makeSafeItem("palakura-pappu", "Palakura Pappu", "పాలకూర పప్పు", 116, 6.8);
    const salad = makeSafeItem("cucumber-tomato-salad", "Fresh Cucumber Tomato Salad", "దోసకాయ టమాటో సలాడ్", 25, 0.9);
    const jowarRoti = makeSafeItem("jowar-roti", "Jowar Roti", "జొన్న రొట్టె", 120, 3.8);
    const chickenCurry = makeSafeItem("chicken-curry-light", "Chicken Breast Curry (Light)", "చికెన్ కూర", 130, 19.5);
    const majjiga = makeSafeItem("spiced-majjiga", "Spiced Majjiga", "మసాలా మజ్జిగ", 36, 1.2);
    const chapalaPulusu = makeSafeItem("chapala-pulusu", "Andhra Fish Pulusu", "చేపల పులుసు", 120, 15.4);
    const brownRice = makeSafeItem("brown-rice-cooked", "Brown Rice (Cooked)", "బ్రౌన్ రైస్ (వండినది)", 111, 2.6);
    const curdRice = makeSafeItem("curd-rice", "Curd Rice (Daddojanam)", "దద్దోజనం / పెరుగన్నం", 135, 3.8);
    const rasam = makeSafeItem("miriyala-rasam", "Pepper Garlic Rasam", "మిరియాల చారు", 28, 0.8);

    return [
      {
        titleTe: "2 గోధుమ పుల్కాలు + పాలకూర పప్పు + దోసకాయ సలాడ్",
        titleEn: "2 Whole Wheat Phulkas + Palakura Pappu + Salad",
        badgeTe: "తేలికపాటి రాత్రి భోజనం • జీర్ణశక్తి",
        badgeEn: "Light Night Metabolism • High Fiber",
        descriptionTe: "రాత్రి నిద్రలో కొవ్వుగా మారకుండా ఉండే తేలికపాటి ఆకుకూర పప్పు, నూనె లేని పుల్కాలు మరియు సలాడ్.",
        descriptionEn: "Zero-oil wheat phulkas with light iron-rich dal and alkaline cucumber salad for deep nocturnal digestion.",
        items: [
          { food: phulka, servings: 2, labelTe: "2 పుల్కాలు (70g)", labelEn: "2 Phulkas (70g)" },
          { food: palakuraPappu, servings: 1, labelTe: "1 గిన్నె పప్పు (150g)", labelEn: "1 Bowl Palakura Pappu (150g)" },
          { food: salad, servings: 1, labelTe: "1 ప్లేట్ సలాడ్ (100g)", labelEn: "1 Plate Fresh Salad (100g)" },
        ],
        totalCalories: 368,
        totalProteinG: 17.5,
        totalCarbsG: 56.0,
        totalFatG: 6.2,
      },
      {
        titleTe: "2 జొన్న రొట్టెలు + లీన్ చికెన్ కర్రీ + చల్లని మజ్జిగ",
        titleEn: "2 Jowar Rotis + Lean Chicken Curry + Majjiga",
        badgeTe: "హై ప్రోటీన్ • లోయర్ ఇన్సులిన్",
        badgeEn: "Lean Protein Recovery Plate",
        descriptionTe: "కండర పునరుద్ధరణకు, మరుసటి రోజు ఉదయానికి శక్తినిచ్చే శుభ్రమైన నాన్-వెజ్ డిన్నర్.",
        descriptionEn: "Gluten-free whole grain rotis with lean protein helping maintain positive overnight nitrogen balance.",
        items: [
          { food: jowarRoti, servings: 2, labelTe: "2 జొన్న రొట్టెలు (90g)", labelEn: "2 Jowar Rotis (90g)" },
          { food: chickenCurry, servings: 1, labelTe: "1 గిన్నె చికెన్ కర్రీ (150g)", labelEn: "1 Bowl Chicken Breast (150g)" },
          { food: majjiga, servings: 1, labelTe: "1 గ్లాసు మజ్జిగ (250ml)", labelEn: "1 Glass Majjiga (250ml)" },
        ],
        totalCalories: 435,
        totalProteinG: 32.8,
        totalCarbsG: 54.0,
        totalFatG: 9.5,
      },
      {
        titleTe: "చేపల పులుసు + మితమైన బ్రౌన్ రైస్ + పచ్చి కూరగాయలు",
        titleEn: "Andhra Fish Pulusu + Brown Rice + Fresh Salad",
        badgeTe: "ఒమేగా-3 • గుండె ఆరోగ్యం",
        badgeEn: "Omega-3 Heart & Joint Health",
        descriptionTe: "చింతపండు, వెల్లుల్లితో చేసిన సంప్రదాయ చేపల పులుసు, మెదడుకు, కీళ్లకు మేలు చేసే ఒమేగా-3 ఫ్యాటీ యాసిడ్లు.",
        descriptionEn: "Tamarind-simmered fish curry rich in anti-inflammatory EPA/DHA paired with controlled complex grains.",
        items: [
          { food: chapalaPulusu, servings: 1, labelTe: "1 గిన్నె చేపల పులుసు (150g)", labelEn: "1 Bowl Fish Curry (150g)" },
          { food: brownRice, servings: 1, labelTe: "1 కప్పు బ్రౌన్ రైస్ (120g)", labelEn: "1 Cup Brown Rice (120g)" },
          { food: salad, servings: 1, labelTe: "1 ప్లేట్ సలాడ్ (100g)", labelEn: "1 Plate Salad (100g)" },
        ],
        totalCalories: 385,
        totalProteinG: 25.2,
        totalCarbsG: 48.0,
        totalFatG: 7.8,
      },
      {
        titleTe: "తేలికపాటి పెరుగన్నం (దద్దోజనం) + వేడి మిరియాల చారు",
        titleEn: "Light Curd Rice (Perugu Annam) + Pepper Garlic Rasam",
        badgeTe: "జీర్ణక్రియ • నిద్ర నాణ్యత",
        badgeEn: "Soothing Gut & Restorative Sleep",
        descriptionTe: "కడుపు మంటను తగ్గించి, హాయిగా నిద్రపట్టేందుకు సహాయపడే స్వచ్ఛమైన దేశీ రాత్రి భోజనం.",
        descriptionEn: "Cooling fermented curd rice accompanied by piperine-rich garlic rasam for deep digestive relief.",
        items: [
          { food: curdRice, servings: 1, labelTe: "1 బౌల్ దద్దోజనం (180g)", labelEn: "1 Bowl Curd Rice (180g)" },
          { food: rasam, servings: 1, labelTe: "1 కప్పు మిరియాల చారు (150ml)", labelEn: "1 Cup Pepper Rasam (150ml)" },
        ],
        totalCalories: 285,
        totalProteinG: 8.8,
        totalCarbsG: 49.0,
        totalFatG: 5.4,
      },
    ];
  }, []);

  // Compute daily intake and determine meal slot dynamically based on actual logged history
  const loadMetricsAndRecommend = useCallback(async () => {
    try {
      const { goal } = await getUserProfileAndGoal();
      const avgTarget = Math.round((goal.calorieTargetMin + goal.calorieTargetMax) / 2) || 1900;
      const avgProtein = Math.round((goal.proteinTargetMinG + goal.proteinTargetMaxG) / 2) || 95;
      setTargetCalories(avgTarget);
      setTargetProteinG(avgProtein);

      const logs: LoggedFoodEntry[] = await getFoodLogsForDate(getTodayDateString());
      const cKcal = logs.reduce((sum: number, item) => sum + (Number(item.calories) || 0), 0);
      const cProt = logs.reduce((sum: number, item) => sum + (Number(item.proteinG) || 0), 0);
      setConsumedCalories(cKcal);
      setConsumedProteinG(cProt);

      // Track all slots that have at least 1 food entry today
      const slotsLogged = new Set<MealType>(logs.map((item) => item.mealType));
      setLoggedSlots(slotsLogged);

      // Intelligently select next meal based on what the user has ALREADY eaten today
      let nextSlot: MealType = "breakfast";
      if (!slotsLogged.has("breakfast")) {
        nextSlot = "breakfast";
      } else if (!slotsLogged.has("lunch")) {
        nextSlot = "lunch";
      } else if (!slotsLogged.has("evening_snack")) {
        nextSlot = "evening_snack";
      } else if (!slotsLogged.has("dinner")) {
        nextSlot = "dinner";
      } else {
        // All 4 meals are logged! Default to dinner or light option
        nextSlot = "dinner";
      }

      setSelectedSlot(nextSlot);

      // Select active combo
      const combos = getSlotCombos(nextSlot);
      setRecommendation(combos[comboIndex % combos.length] || combos[0]);
    } catch (err) {
      console.warn("Could not load metrics for meal recommender:", err);
    }
  }, [comboIndex, getSlotCombos]);

  useEffect(() => {
    loadMetricsAndRecommend();
  }, [loadMetricsAndRecommend, refreshTrigger]);

  // Handle slot dropdown change
  const handleSlotChange = (slot: MealType) => {
    setSelectedSlot(slot);
    setComboIndex(0);
    const combos = getSlotCombos(slot);
    setRecommendation(combos[0]);
  };

  // Cycle to next authentic recommendation
  const handleNextCombo = () => {
    const combos = getSlotCombos(selectedSlot);
    const nextIdx = (comboIndex + 1) % combos.length;
    setComboIndex(nextIdx);
    setRecommendation(combos[nextIdx]);
  };

  const handleLogCombo = async () => {
    if (!recommendation) return;
    setIsLoggingCombo(true);
    try {
      for (const item of recommendation.items) {
        await addFoodLogEntry({
          foodItemId: item.food.id,
          foodNameEn: item.food.nameEn,
          foodNameTe: item.food.nameTe,
          mealType: selectedSlot,
          portionG: item.food.standardServingG * item.servings,
          portionUnitLabel: locale === "te" ? item.labelTe : item.labelEn,
          calories: Math.round((item.food.per100g.calories * (item.food.standardServingG * item.servings)) / 100),
          proteinG: Math.round(((item.food.per100g.proteinG * (item.food.standardServingG * item.servings)) / 100) * 10) / 10,
          carbsG: Math.round(((item.food.per100g.carbsG * (item.food.standardServingG * item.servings)) / 100) * 10) / 10,
          fatG: Math.round(((item.food.per100g.fatG * (item.food.standardServingG * item.servings)) / 100) * 10) / 10,
          fiberG: Math.round(((item.food.per100g.fiberG * (item.food.standardServingG * item.servings)) / 100) * 10) / 10,
          estimatedCostInr: item.food.estimatedCostInr,
          loggedDate: getTodayDateString(),
          loggedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      }

      setComboLoggedSuccess(true);
      if (onFoodLogged) onFoodLogged();
      await loadMetricsAndRecommend();
      setTimeout(() => setComboLoggedSuccess(false), 4000);
    } catch (e) {
      console.warn("Failed to log recommended combo", e);
    } finally {
      setIsLoggingCombo(false);
    }
  };

  const remainingKcal = Math.max(targetCalories - consumedCalories, 0);
  const remainingProt = Math.max(targetProteinG - consumedProteinG, 0);
  const isAllLogged = loggedSlots.has("breakfast") && loggedSlots.has("lunch") && loggedSlots.has("evening_snack") && loggedSlots.has("dinner");

  return (
    <Card className="glass-card-3d rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* 3D ambient lighting glow */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {locale === "te" ? "ఈరోజు ఏం తినాలి? (స్మార్ట్ మీల్ సిఫార్సు)" : "What Should I Eat Next? (Smart Suggestion)"}
              </h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                ICMR 40/30/30
              </span>
              {isAllLogged && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center gap-1 border border-blue-300">
                  <Check className="h-3 w-3" />
                  {locale === "te" ? "అన్ని భోజనాలు నమోదయ్యాయి" : "All 4 Meals Logged"}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {locale === "te"
                ? `ఈరోజు లక్ష్యంలో మిగిలినది: ఇంకా ${remainingKcal} kcal & ${remainingProt.toFixed(0)}g ప్రోటీన్ అవసరం`
                : `Remaining Budget: ${remainingKcal} kcal & ${remainingProt.toFixed(0)}g protein remaining today`}
            </p>
          </div>
        </div>

        {/* Meal Slot Selector & Progress Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {locale === "te" ? "భోజన సమయం:" : "For:"}
          </span>
          <select
            value={selectedSlot}
            onChange={(e) => handleSlotChange(e.target.value as MealType)}
            className="text-xs font-black rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-100 shadow-xs focus:ring-2 focus:ring-emerald-500"
          >
            <option value="breakfast">
              {locale === "te" ? "అల్పాహారం (Breakfast)" : "Breakfast"} {loggedSlots.has("breakfast") ? "✓" : ""}
            </option>
            <option value="lunch">
              {locale === "te" ? "మధ్యాహ్న భోజనం (Lunch)" : "Lunch"} {loggedSlots.has("lunch") ? "✓" : ""}
            </option>
            <option value="evening_snack">
              {locale === "te" ? "సాయంత్రం స్నాక్ (Snack)" : "Snack"} {loggedSlots.has("evening_snack") ? "✓" : ""}
            </option>
            <option value="dinner">
              {locale === "te" ? "రాత్రి భోజనం (Dinner)" : "Dinner"} {loggedSlots.has("dinner") ? "✓" : ""}
            </option>
          </select>

          {/* Suggest Another Combo Button */}
          <button
            type="button"
            onClick={handleNextCombo}
            title={locale === "te" ? "వేరొక భోజనం చూడండి" : "Suggest another healthy combo"}
            className="btn-3d-slate px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all text-slate-700 dark:text-slate-200"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{locale === "te" ? "వేరొకటి" : "Shuffle"}</span>
          </button>
        </div>
      </div>

      {recommendation && (
        <div className="mt-4 space-y-4 relative z-10">
          {/* Title & Description with Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-black text-emerald-950 dark:text-emerald-100">
                  🍽️ {locale === "te" ? recommendation.titleTe : recommendation.titleEn}
                </h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                  {locale === "te" ? recommendation.badgeTe : recommendation.badgeEn}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {locale === "te" ? recommendation.descriptionTe : recommendation.descriptionEn}
              </p>
            </div>

            {/* 3D Macro Visual Badges */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {recommendation.totalCalories} kcal
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-sm flex items-center gap-1.5">
                <Dumbbell className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-black">
                  {recommendation.totalProteinG}g {locale === "te" ? "ప్రోటీన్" : "Protein"}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 shadow-sm flex items-center gap-1.5">
                <Wheat className="h-4 w-4 text-cyan-600" />
                <span className="text-xs font-black">
                  {recommendation.totalCarbsG}g {locale === "te" ? "పిండి" : "Carbs"}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-2xl bg-rose-500/10 dark:bg-rose-950/60 border border-rose-500/30 text-rose-700 dark:text-rose-300 shadow-sm flex items-center gap-1.5">
                <Droplet className="h-4 w-4 text-rose-600" />
                <span className="text-xs font-black">
                  {recommendation.totalFatG}g {locale === "te" ? "కొవ్వు" : "Fat"}
                </span>
              </div>
            </div>
          </div>

          {/* Authentic South Indian Meal Items Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {recommendation.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {locale === "te" ? item.food.nameTe : item.food.nameEn}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {locale === "te" ? item.labelTe : item.labelEn}
                  </p>
                </div>
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {Math.round((item.food.per100g.calories * item.food.standardServingG * item.servings) / 100)} kcal
                </span>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-500/15">
            <span className="text-xs text-slate-500 dark:text-slate-400 italic">
              {locale === "te"
                ? `💡 ఈ భోజనం నేటి మిగిలిన బడ్జెట్‌కు సరిగ్గా సరిపోతుంది. ${loggedSlots.has(selectedSlot) ? "ఈ సమయానికి ఇప్పటికే ఆహారం నమోదై ఉంది." : "ఇంకా లాగ్ చేయలేదు."}`
                : `💡 Aligned with your metabolic goals. ${loggedSlots.has(selectedSlot) ? "You have already logged meals for this slot." : "Not logged yet today."}`}
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                type="button"
                onClick={handleLogCombo}
                isLoading={isLoggingCombo}
                className="w-full sm:w-auto min-h-[46px] font-black text-xs btn-3d-emerald px-6 rounded-2xl flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {locale === "te"
                    ? "ఈ భోజనాన్ని వెంటనే లాగ్ చేయండి (1-క్లిక్)"
                    : "+ 1-Click Log This Meal"}
                </span>
              </Button>
            </div>
          </div>

          {/* Feedback Toast */}
          {comboLoggedSuccess && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                {locale === "te"
                  ? "✅ సిఫార్సు చేసిన భోజనం మీ డైలీ లాగ్‌లో విజయవంతంగా నమోదు చేయబడింది! నేటి సారాంశం అప్‌డేట్ అయింది."
                  : "✅ Recommended meal successfully logged to your daily tracker! Daily targets updated."}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
