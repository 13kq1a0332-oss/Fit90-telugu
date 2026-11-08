export type FoodCategory =
  | "breakfast"
  | "rice_grain"
  | "dal"
  | "curry"
  | "snack"
  | "drink"
  | "fruit_vegetable"
  | "protein_supplement";

export interface HouseholdMeasure {
  id: string;
  nameEn: string;
  nameTe: string;
  grams: number;
}

export interface FoodItemNutrition {
  id: string;
  nameEn: string;
  nameTe: string;
  category: FoodCategory;
  state: "cooked" | "raw";
  per100g: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
  };
  standardServingG: number;
  servingUnitEn: string;
  servingUnitTe: string;
  householdMeasures: HouseholdMeasure[];
  estimatedCostInr: number; // Cost per 100g
  isVegetarian: boolean;
  notesEn?: string;
  notesTe?: string;
  iconName: string;
}

export const FOOD_CATALOG: FoodItemNutrition[] = [
  // --- Rice & Grains ---
  {
    id: "sona-masoori-cooked",
    nameEn: "Steamed Sona Masoori Rice (Cooked)",
    nameTe: "వండిన సోనా మసూరి అన్నం",
    category: "rice_grain",
    state: "cooked",
    per100g: { calories: 130, proteinG: 2.7, carbsG: 28.2, fatG: 0.3, fiberG: 0.4 },
    standardServingG: 150,
    servingUnitEn: "1.5 katori / medium bowl",
    servingUnitTe: "1.5 గిన్నె",
    householdMeasures: [
      { id: "katori", nameEn: "1 Katori (Small bowl)", nameTe: "1 చిన్న గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Medium Bowl", nameTe: "1 మధ్యస్థ గిన్నె", grams: 150 },
      { id: "cup", nameEn: "1 Large Cup", nameTe: "1 పెద్ద కప్పు", grams: 200 },
    ],
    estimatedCostInr: 8,
    isVegetarian: true,
    notesEn: "Cooked rice absorbs ~2x water. 100g raw rice yields ~250g cooked rice.",
    notesTe: "వండినప్పుడు నీటిని పీల్చుకుంటుంది. 100గ్రా పచ్చి బియ్యం సుమారు 250గ్రా అన్నం అవుతుంది.",
    iconName: "rice",
  },
  {
    id: "brown-rice-cooked",
    nameEn: "Brown Rice (Cooked)",
    nameTe: "వండిన బ్రౌన్ రైస్",
    category: "rice_grain",
    state: "cooked",
    per100g: { calories: 111, proteinG: 2.6, carbsG: 23.0, fatG: 0.9, fiberG: 1.8 },
    standardServingG: 150,
    servingUnitEn: "1.5 katori",
    servingUnitTe: "1.5 గిన్నె",
    householdMeasures: [
      { id: "katori", nameEn: "1 Katori", nameTe: "1 చిన్న గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Medium Bowl", nameTe: "1 గిన్నె", grams: 150 },
    ],
    estimatedCostInr: 12,
    isVegetarian: true,
    notesEn: "Higher in fiber and micronutrients; digests more gradually.",
    notesTe: "ఎక్కువ పీచు పదార్థం మరియు తక్కువ గ్లైసెమిక్ ఇండెక్స్ కలిగి ఉంటుంది.",
    iconName: "rice",
  },
  {
    id: "ragi-sankati",
    nameEn: "Ragi Mudde / Sankati (Cooked)",
    nameTe: "రాగి సంకటి / ముద్ద",
    category: "rice_grain",
    state: "cooked",
    per100g: { calories: 120, proteinG: 2.8, carbsG: 25.5, fatG: 0.6, fiberG: 2.9 },
    standardServingG: 180,
    servingUnitEn: "1 small ball",
    servingUnitTe: "1 చిన్న ముద్ద",
    householdMeasures: [
      { id: "small-ball", nameEn: "1 Small Ball", nameTe: "1 చిన్న ముద్ద", grams: 150 },
      { id: "med-ball", nameEn: "1 Medium Ball", nameTe: "1 మధ్యస్థ ముద్ద", grams: 200 },
    ],
    estimatedCostInr: 10,
    isVegetarian: true,
    notesEn: "Excellent source of calcium and slow-digesting complex carbohydrates.",
    notesTe: "కాల్షియం మరియు సహజ పీచు పదార్థం మెండుగా ఉండే సాంప్రదాయ ఆహారం.",
    iconName: "grain",
  },
  {
    id: "jowar-roti",
    nameEn: "Jowar Roti / Jonnah Rotte",
    nameTe: "జొన్న రొట్టె",
    category: "breakfast",
    state: "cooked",
    per100g: { calories: 230, proteinG: 6.5, carbsG: 48.0, fatG: 1.5, fiberG: 6.0 },
    standardServingG: 45,
    servingUnitEn: "1 medium roti (approx 45g)",
    servingUnitTe: "1 మధ్యస్థ రొట్టె",
    householdMeasures: [
      { id: "piece", nameEn: "1 Roti", nameTe: "1 రొట్టె", grams: 45 },
      { id: "double", nameEn: "2 Rotis", nameTe: "2 రొట్టెలు", grams: 90 },
    ],
    estimatedCostInr: 15,
    isVegetarian: true,
    notesEn: "Gluten-free traditional millet flatbread high in satiety.",
    notesTe: "గ్లూటెన్ లేని, ఎక్కువ సమయం ఆకలి వేయకుండా ఉంచే జొన్న రొట్టె.",
    iconName: "roti",
  },
  {
    id: "wheat-roti-phulka",
    nameEn: "Whole Wheat Phulka / Roti (No Oil)",
    nameTe: "నూనె లేని గోధుమ పుల్కా / రోటీ",
    category: "breakfast",
    state: "cooked",
    per100g: { calories: 240, proteinG: 7.5, carbsG: 46.0, fatG: 2.0, fiberG: 5.5 },
    standardServingG: 35,
    servingUnitEn: "1 phulka (approx 35g)",
    servingUnitTe: "1 పుల్కా",
    householdMeasures: [
      { id: "piece", nameEn: "1 Phulka", nameTe: "1 పుల్కా", grams: 35 },
      { id: "two-pieces", nameEn: "2 Phulkas", nameTe: "2 పుల్కాలు", grams: 70 },
      { id: "three-pieces", nameEn: "3 Phulkas", nameTe: "3 పుల్కాలు", grams: 105 },
    ],
    estimatedCostInr: 10,
    isVegetarian: true,
    notesEn: "Cooked dry on tawa without ghee or oil.",
    notesTe: "నూనె లేదా నెయ్యి లేకుండా పెనంపై కాల్చిన పుల్కా.",
    iconName: "roti",
  },

  // --- Dals & Lentils ---
  {
    id: "toor-dal-cooked",
    nameEn: "Plain Toor Dal / Mudda Pappu (Cooked)",
    nameTe: "ముద్ద పప్పు (వండినది)",
    category: "dal",
    state: "cooked",
    per100g: { calories: 116, proteinG: 7.2, carbsG: 18.5, fatG: 1.5, fiberG: 4.2 },
    standardServingG: 120,
    servingUnitEn: "1 katori / bowl",
    servingUnitTe: "1 గిన్నె",
    householdMeasures: [
      { id: "katori", nameEn: "1 Small Katori", nameTe: "1 చిన్న గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Medium Bowl", nameTe: "1 మధ్యస్థ గిన్నె", grams: 150 },
    ],
    estimatedCostInr: 16,
    isVegetarian: true,
    notesEn: "Cooked toor dal with minimal tempering; great plant protein base.",
    notesTe: "తేలికపాటి తాలింపుతో చేసిన కంది పప్పు, మొక్కల ఆధారిత ప్రోటీన్.",
    iconName: "dal",
  },
  {
    id: "palakura-pappu",
    nameEn: "Palakura Pappu (Spinach Dal)",
    nameTe: "పాలకూర పప్పు",
    category: "dal",
    state: "cooked",
    per100g: { calories: 98, proteinG: 6.0, carbsG: 14.5, fatG: 2.0, fiberG: 4.5 },
    standardServingG: 150,
    servingUnitEn: "1 bowl",
    servingUnitTe: "1 గిన్నె",
    householdMeasures: [
      { id: "katori", nameEn: "1 Katori", nameTe: "1 గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Large Bowl", nameTe: "1 పెద్ద గిన్నె", grams: 150 },
    ],
    estimatedCostInr: 18,
    isVegetarian: true,
    notesEn: "Iron-rich spinach integrated with protein-dense dal.",
    notesTe: "ఐరన్ మరియు పీచు కలిగిన పాలకూరతో కూడిన పోషకభరిత పప్పు.",
    iconName: "dal",
  },
  {
    id: "tomato-pappu",
    nameEn: "Tomato Pappu (Andhra Style)",
    nameTe: "టమోటా పప్పు",
    category: "dal",
    state: "cooked",
    per100g: { calories: 105, proteinG: 5.8, carbsG: 16.0, fatG: 2.1, fiberG: 3.8 },
    standardServingG: 150,
    servingUnitEn: "1 bowl",
    servingUnitTe: "1 గిన్నె",
    householdMeasures: [
      { id: "katori", nameEn: "1 Katori", nameTe: "1 గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Bowl", nameTe: "1 మధ్యస్థ గిన్నె", grams: 150 },
    ],
    estimatedCostInr: 16,
    isVegetarian: true,
    notesEn: "Tangy staple Andhra dal prepared with tomatoes and mild spices.",
    notesTe: "ఆంధ్ర శైలిలో టమోటాలు మరియు పచ్చిమిర్చితో చేసిన రుచికరమైన పప్పు.",
    iconName: "dal",
  },

  // --- Breakfasts ---
  {
    id: "pesarattu",
    nameEn: "Pesarattu (Moong Dal Crepe)",
    nameTe: "పెసరట్టు (పెసలతో చేసినది)",
    category: "breakfast",
    state: "cooked",
    per100g: { calories: 175, proteinG: 9.0, carbsG: 26.0, fatG: 3.5, fiberG: 5.0 },
    standardServingG: 75,
    servingUnitEn: "1 medium pesarattu (approx 75g)",
    servingUnitTe: "1 పెసరట్టు",
    householdMeasures: [
      { id: "piece", nameEn: "1 Pesarattu", nameTe: "1 పెసరట్టు", grams: 75 },
      { id: "two-pieces", nameEn: "2 Pesarattu", nameTe: "2 పెసరట్లు", grams: 150 },
    ],
    estimatedCostInr: 22,
    isVegetarian: true,
    notesEn: "High-protein green moong breakfast; prepared with minimal oil on non-stick pan.",
    notesTe: "అత్యధిక ప్రోటీన్ మరియు పీచు ఉండే ఆరోగ్యకరమైన పెసల అల్పాహారం.",
    iconName: "dosa",
  },
  {
    id: "idli",
    nameEn: "Steamed Plain Idli",
    nameTe: "ఆవిరి ఇడ్లీ",
    category: "breakfast",
    state: "cooked",
    per100g: { calories: 136, proteinG: 4.5, carbsG: 27.5, fatG: 0.5, fiberG: 1.5 },
    standardServingG: 100,
    servingUnitEn: "2 pieces (approx 100g)",
    servingUnitTe: "2 ఇడ్లీలు",
    householdMeasures: [
      { id: "one-piece", nameEn: "1 Idli", nameTe: "1 ఇడ్లీ", grams: 50 },
      { id: "two-pieces", nameEn: "2 Idlis", nameTe: "2 ఇడ్లీలు", grams: 100 },
      { id: "three-pieces", nameEn: "3 Idlis", nameTe: "3 ఇడ్లీలు", grams: 150 },
    ],
    estimatedCostInr: 12,
    isVegetarian: true,
    notesEn: "Steamed, fermented, oil-free staple; easily digestible.",
    notesTe: "నూనె లేకుండా ఆవిరిపై ఉడికించిన సులభంగా జీర్ణమయ్యే ఇడ్లీలు.",
    iconName: "idli",
  },
  {
    id: "upma-vegetable",
    nameEn: "Vegetable Rava Upma",
    nameTe: "కూరగాయల రవ్వ ఉప్మా",
    category: "breakfast",
    state: "cooked",
    per100g: { calories: 135, proteinG: 3.2, carbsG: 21.0, fatG: 4.2, fiberG: 2.5 },
    standardServingG: 150,
    servingUnitEn: "1 bowl (approx 150g)",
    servingUnitTe: "1 గిన్నె",
    householdMeasures: [
      { id: "katori", nameEn: "1 Katori", nameTe: "1 చిన్న గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Bowl", nameTe: "1 గిన్నె", grams: 150 },
    ],
    estimatedCostInr: 14,
    isVegetarian: true,
    notesEn: "Prepared with carrots, peas, and green chilies with 1 tsp oil.",
    notesTe: "క్యారెట్, బఠానీలు కలిపి తక్కువ నూనెతో చేసిన రవ్వ ఉప్మా.",
    iconName: "upma",
  },

  // --- Curries & Proteins ---
  {
    id: "chicken-curry-light",
    nameEn: "Chicken Breast Curry (Home Style, Light Oil)",
    nameTe: "చికెన్ బ్రెస్ట్ కర్రీ (ఇంటి పద్ధతి, తక్కువ నూనె)",
    category: "curry",
    state: "cooked",
    per100g: { calories: 155, proteinG: 23.0, carbsG: 3.5, fatG: 5.5, fiberG: 0.8 },
    standardServingG: 120,
    servingUnitEn: "1 medium bowl (approx 120g)",
    servingUnitTe: "1 గిన్నె",
    householdMeasures: [
      { id: "katori", nameEn: "1 Small Katori", nameTe: "1 చిన్న గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Medium Bowl", nameTe: "1 గిన్నె", grams: 150 },
    ],
    estimatedCostInr: 45,
    isVegetarian: false,
    notesEn: "Lean skinless chicken breast cooked with ginger, garlic, onions, and spices.",
    notesTe: "కొవ్వు తక్కువగా ఉండే చికెన్ బ్రెస్ట్‌తో ఇంట్లో చేసిన తాజా కూర.",
    iconName: "curry",
  },
  {
    id: "boiled-egg-white",
    nameEn: "Boiled Egg White",
    nameTe: "ఉడకబెట్టిన గుడ్డు తెల్లసొన",
    category: "curry",
    state: "cooked",
    per100g: { calories: 52, proteinG: 11.0, carbsG: 0.7, fatG: 0.2, fiberG: 0.0 },
    standardServingG: 66,
    servingUnitEn: "2 egg whites (approx 66g)",
    servingUnitTe: "2 తెల్లసొనలు",
    householdMeasures: [
      { id: "one-white", nameEn: "1 Egg White", nameTe: "1 తెల్లసొన", grams: 33 },
      { id: "two-whites", nameEn: "2 Egg Whites", nameTe: "2 తెల్లసొనలు", grams: 66 },
      { id: "three-whites", nameEn: "3 Egg Whites", nameTe: "3 తెల్లసొనలు", grams: 99 },
    ],
    estimatedCostInr: 12,
    isVegetarian: false,
    notesEn: "Pure albumin; near-zero fat, high biological value protein.",
    notesTe: "కొవ్వు లేని స్వచ్ఛమైన హై-క్వాలిటీ ప్రోటీన్.",
    iconName: "egg",
  },
  {
    id: "boiled-egg-whole",
    nameEn: "Boiled Egg (Whole)",
    nameTe: "ఉడకబెట్టిన పూర్తి గుడ్డు",
    category: "curry",
    state: "cooked",
    per100g: { calories: 155, proteinG: 13.0, carbsG: 1.1, fatG: 10.6, fiberG: 0.0 },
    standardServingG: 50,
    servingUnitEn: "1 large egg (approx 50g)",
    servingUnitTe: "1 గుడ్డు",
    householdMeasures: [
      { id: "one-egg", nameEn: "1 Whole Egg", nameTe: "1 గుడ్డు", grams: 50 },
      { id: "two-eggs", nameEn: "2 Whole Eggs", nameTe: "2 గుడ్లు", grams: 100 },
    ],
    estimatedCostInr: 14,
    isVegetarian: false,
    notesEn: "Rich in choline, vitamin B12, vitamin D, and lutein.",
    notesTe: "విటమిన్లు B12, D మరియు కోలిన్ వంటి సూక్ష్మ పోషకాలు కలిగినది.",
    iconName: "egg",
  },
  {
    id: "paneer-low-fat",
    nameEn: "Low-Fat Paneer / Cottage Cheese",
    nameTe: "తక్కువ కొవ్వు పన్నీర్",
    category: "curry",
    state: "raw",
    per100g: { calories: 180, proteinG: 18.0, carbsG: 4.5, fatG: 10.0, fiberG: 0.0 },
    standardServingG: 100,
    servingUnitEn: "100g cubes",
    servingUnitTe: "100గ్రా ముక్కలు",
    householdMeasures: [
      { id: "half-cup", nameEn: "Half Cup Cubes (80g)", nameTe: "అర కప్పు ముక్కలు", grams: 80 },
      { id: "full-serving", nameEn: "100g Portion", nameTe: "100గ్రా", grams: 100 },
    ],
    estimatedCostInr: 42,
    isVegetarian: true,
    notesEn: "Made from skimmed milk; high protein meat alternative for vegetarians.",
    notesTe: "మీగడ తీసిన పాలతో చేసిన పన్నీర్; శాకాహారులకు అత్యుత్తమ ప్రోటీన్.",
    iconName: "paneer",
  },
  {
    id: "soya-chunks-curry",
    nameEn: "Soya Chunks Curry (Cooked)",
    nameTe: "సోయా చంక్స్ కర్రీ (మీల్‌మేకర్)",
    category: "curry",
    state: "cooked",
    per100g: { calories: 125, proteinG: 14.5, carbsG: 8.5, fatG: 3.5, fiberG: 4.0 },
    standardServingG: 120,
    servingUnitEn: "1 bowl",
    servingUnitTe: "1 గిన్నె",
    householdMeasures: [
      { id: "katori", nameEn: "1 Katori", nameTe: "1 చిన్న గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Bowl", nameTe: "1 గిన్నె", grams: 150 },
    ],
    estimatedCostInr: 18,
    isVegetarian: true,
    notesEn: "Highly economical plant protein with high dietary fiber.",
    notesTe: "తక్కువ ఖర్చుతో కూడిన అత్యధిక ప్రోటీన్ కలిగిన శాఖాహార కూర.",
    iconName: "curry",
  },
  {
    id: "curd-homemade",
    nameEn: "Homemade Curd / Perugu",
    nameTe: "ఇంటి తాజా పెరుగు",
    category: "curry",
    state: "cooked",
    per100g: { calories: 60, proteinG: 3.5, carbsG: 4.7, fatG: 3.1, fiberG: 0.0 },
    standardServingG: 150,
    servingUnitEn: "1 katori (approx 150g)",
    servingUnitTe: "1 గిన్నె",
    householdMeasures: [
      { id: "small-katori", nameEn: "1 Small Katori", nameTe: "1 చిన్న గిన్నె", grams: 100 },
      { id: "bowl", nameEn: "1 Cup", nameTe: "1 కప్పు", grams: 150 },
    ],
    estimatedCostInr: 8,
    isVegetarian: true,
    notesEn: "Probiotic gut friendly fermented dairy staple in Telugu households.",
    notesTe: "జీర్ణవ్యవస్థకు మేలు చేసే సహజ ప్రోబయోటిక్ పెరుగు.",
    iconName: "curd",
  },
  {
    id: "chana-sundal",
    nameEn: "Boiled Chickpeas / Senagalu Sundal",
    nameTe: "ఉడకబెట్టిన గుగ్గిళ్ళు (సెనగలు)",
    category: "snack",
    state: "cooked",
    per100g: { calories: 164, proteinG: 8.9, carbsG: 27.4, fatG: 2.6, fiberG: 7.6 },
    standardServingG: 100,
    servingUnitEn: "1 small cup (100g)",
    servingUnitTe: "1 చిన్న కప్పు",
    householdMeasures: [
      { id: "half-cup", nameEn: "Half Cup", nameTe: "అర కప్పు", grams: 60 },
      { id: "cup", nameEn: "1 Cup", nameTe: "1 కప్పు", grams: 100 },
    ],
    estimatedCostInr: 15,
    isVegetarian: true,
    notesEn: "High-fiber evening snack tempered with curry leaves and mustard.",
    notesTe: "సాయంత్రం స్నాక్స్‌గా పీచు మరియు శక్తినిచ్చే సెనగల గుగ్గిళ్ళు.",
    iconName: "snack",
  },
  {
    id: "phool-makhana-roasted",
    nameEn: "Roasted Phool Makhana (Fox Nuts, Dry Roasted)",
    nameTe: "వేయించిన మఖానా (తామర గింజలు)",
    category: "snack",
    state: "cooked",
    per100g: { calories: 350, proteinG: 9.7, carbsG: 76.0, fatG: 0.5, fiberG: 7.6 },
    standardServingG: 30,
    servingUnitEn: "1 large bowl (30g)",
    servingUnitTe: "1 పెద్ద బౌల్ (30గ్రా)",
    householdMeasures: [
      { id: "small-bowl", nameEn: "Small Bowl (20g)", nameTe: "చిన్న గిన్నె (20గ్రా)", grams: 20 },
      { id: "large-bowl", nameEn: "Large Bowl (30g)", nameTe: "పెద్ద గిన్నె (30గ్రా)", grams: 30 },
    ],
    estimatedCostInr: 30,
    isVegetarian: true,
    notesEn: "Low calorie density crunchy snack; 30g serving is only ~105 kcal.",
    notesTe: "తక్కువ క్యాలరీలతో కరకరలాడే తేలికపాటి స్నాక్ (30గ్రాములలో కేవలం 105 క్యాలరీలు).",
    iconName: "snack",
  },
  {
    id: "spiced-majjiga",
    nameEn: "Spiced Majjiga (Buttermilk with Curry Leaves & Jeera)",
    nameTe: "తాజా మజ్జిగ (జీలకర్ర, కరివేపాకుతో)",
    category: "drink",
    state: "cooked",
    per100g: { calories: 15, proteinG: 1.2, carbsG: 1.8, fatG: 0.4, fiberG: 0.1 },
    standardServingG: 250,
    servingUnitEn: "1 tall glass (250ml)",
    servingUnitTe: "1 గ్లాసు (250మి.లీ)",
    householdMeasures: [
      { id: "glass", nameEn: "1 Regular Glass (200ml)", nameTe: "1 గ్లాసు (200మి.లీ)", grams: 200 },
      { id: "tall-glass", nameEn: "1 Tall Glass (250ml)", nameTe: "1 పెద్ద గ్లాసు (250మి.లీ)", grams: 250 },
    ],
    estimatedCostInr: 5,
    isVegetarian: true,
    notesEn: "Electrolyte-rich cooling drink; hydrating and very low in calories.",
    notesTe: "శరీరానికి చలువ చేసే, డీహైడ్రేషన్ నివారించే సంప్రదాయ పానీయం.",
    iconName: "drink",
  },
  {
    id: "cucumber-tomato-salad",
    nameEn: "Fresh Cucumber & Tomato Salad",
    nameTe: "దోసకాయ & టమోటా సలాడ్",
    category: "fruit_vegetable",
    state: "raw",
    per100g: { calories: 16, proteinG: 0.8, carbsG: 3.2, fatG: 0.2, fiberG: 1.2 },
    standardServingG: 150,
    servingUnitEn: "1 plate (approx 150g)",
    servingUnitTe: "1 ప్లేటు",
    householdMeasures: [
      { id: "plate", nameEn: "1 Plate", nameTe: "1 ప్లేటు", grams: 150 },
    ],
    estimatedCostInr: 10,
    isVegetarian: true,
    notesEn: "High water volume, zero added oil, provides crunch and fullness.",
    notesTe: "ఎక్కువ నీరు మరియు పీచు కలిగిన తాజా కూరగాయల సలాడ్.",
    iconName: "salad",
  },
  {
    id: "papaya-fresh",
    nameEn: "Fresh Papaya Cubes",
    nameTe: "తాజా బొప్పాయి ముక్కలు",
    category: "fruit_vegetable",
    state: "raw",
    per100g: { calories: 43, proteinG: 0.5, carbsG: 11.0, fatG: 0.3, fiberG: 1.7 },
    standardServingG: 150,
    servingUnitEn: "1 cup cubes (150g)",
    servingUnitTe: "1 కప్పు ముక్కలు",
    householdMeasures: [
      { id: "cup", nameEn: "1 Cup", nameTe: "1 కప్పు", grams: 150 },
    ],
    estimatedCostInr: 12,
    isVegetarian: true,
    notesEn: "Rich in papain enzyme aiding digestion, vitamin C, and beta-carotene.",
    notesTe: "జీర్ణక్రియకు మేలు చేసే పపైన్ మరియు విటమిన్ సి కలిగిన బొప్పాయి.",
    iconName: "fruit",
  },
  {
    id: "whey-protein-isolate",
    nameEn: "Whey Protein Isolate (1 Scoop)",
    nameTe: "వే ప్రోటీన్ ఐసోలేట్ (1 స్కూప్)",
    category: "protein_supplement",
    state: "raw",
    per100g: { calories: 370, proteinG: 82.0, carbsG: 4.0, fatG: 2.0, fiberG: 0.0 },
    standardServingG: 30,
    servingUnitEn: "1 scoop (30g)",
    servingUnitTe: "1 స్కూప్ (30గ్రా)",
    householdMeasures: [
      { id: "one-scoop", nameEn: "1 Scoop (30g)", nameTe: "1 స్కూప్", grams: 30 },
    ],
    estimatedCostInr: 90,
    isVegetarian: true,
    notesEn: "Convenient supplement to meet 100-120g daily target if diet falls short.",
    notesTe: "రోజూ ఆహారంలో ప్రోటీన్ లోపం రాకుండా సహాయపడే సప్లిమెంట్.",
    iconName: "supplement",
  },
];

export function getFoodItemById(id: string): FoodItemNutrition | undefined {
  return FOOD_CATALOG.find((f) => f.id === id);
}

export function searchFoodItems(query: string): FoodItemNutrition[] {
  if (!query || !query.trim()) return FOOD_CATALOG;
  const q = query.trim().toLowerCase();
  return FOOD_CATALOG.filter(
    (item) =>
      item.nameEn.toLowerCase().includes(q) ||
      item.nameTe.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  );
}

export function calculatePortionNutrition(
  food: FoodItemNutrition,
  grams: number
) {
  const ratio = grams / 100;
  return {
    grams,
    calories: Math.round(food.per100g.calories * ratio),
    proteinG: Math.round(food.per100g.proteinG * ratio * 10) / 10,
    carbsG: Math.round(food.per100g.carbsG * ratio * 10) / 10,
    fatG: Math.round(food.per100g.fatG * ratio * 10) / 10,
    fiberG: Math.round(food.per100g.fiberG * ratio * 10) / 10,
    estimatedCostInr: Math.round(food.estimatedCostInr * ratio),
  };
}

