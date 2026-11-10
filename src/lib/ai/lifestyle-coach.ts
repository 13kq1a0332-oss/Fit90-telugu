import { WeeklyDigest } from "../insights-store";

const AI_CONSENT_KEY = "fit90_ai_lifestyle_consent";

export interface CoachContext {
  userName?: string;
  dayNumber?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  todayCalories?: number;
  targetCaloriesMin?: number;
  targetCaloriesMax?: number;
  todayProteinG?: number;
  targetProteinMinG?: number;
  targetProteinMaxG?: number;
  todayWaterMl?: number;
  targetWaterMl?: number;
  latestHbA1c?: number;
  latestBpSystolic?: number;
  latestBpDiastolic?: number;
}

const DEFAULT_FALLBACK_DIGEST: WeeklyDigest = {
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  avgCalories: 2050,
  targetCaloriesMin: 2000,
  targetCaloriesMax: 2200,
  avgProteinG: 110,
  targetProteinMinG: 100,
  targetProteinMaxG: 120,
  avgWaterMl: 3400,
  targetWaterMl: 3500,
  avgSleepHours: 7.2,
  totalSteps: 36500,
  targetWeeklySteps: 35000,
  activeWorkoutDays: 5,
  targetWorkoutDays: 5,
  latestWeightKg: 117.2,
  baselineWeightKg: 118.0,
  weightDeltaKg: -0.8,
  latestWaistCm: 149.0,
  baselineWaistCm: 150.0,
  waistDeltaCm: -1.0,
  avgSystolic: 126,
  avgDiastolic: 82,
  adherenceWins: [],
  courseCorrections: [],
};

export interface CoachMessage {
  id: string;
  sender: "user" | "coach";
  textEn: string;
  textTe: string;
  isRedFlagWarning?: boolean;
  timestamp: string;
}

export function hasUserConsentedToAi(): boolean {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem(AI_CONSENT_KEY) === "true";
    } catch {}
  }
  return false;
}

export function setUserAiConsent(consented: boolean): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AI_CONSENT_KEY, consented ? "true" : "false");
    } catch {}
  }
}

/**
 * Red flag medical symptom scanner (emergency deflection)
 */
export function checkMedicalRedFlags(query: string): boolean {
  const normalized = query.toLowerCase();
  const redFlags = [
    "chest pain",
    "pain in chest",
    "pressure in chest",
    "left arm pain",
    "shortness of breath",
    "severe breathlessness",
    "cannot breathe",
    "dizziness",
    "fainting",
    "passed out",
    "syncope",
    "severe headache",
    "face drooping",
    "arm weakness",
    "blood in stool",
    "coughing blood",
    "ఛాతీ నొప్పి",
    "ఆయాసం",
    "కళ్ళు తిరగడం",
    "శ్వాస ఆడకపోవడం",
    "స్పృహ తప్పడం",
  ];

  return redFlags.some((rf) => normalized.includes(rf));
}

/**
 * Emergency response for acute symptoms
 */
export const EMERGENCY_DEFLECTION_MESSAGE: CoachMessage = {
  id: "emergency-alert",
  sender: "coach",
  isRedFlagWarning: true,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  textEn:
    "⚠️ CRITICAL MEDICAL ALERT: You have mentioned symptoms requiring urgent clinical evaluation (such as chest pain, severe breathlessness, or dizziness). Fit90 Telugu is an informational lifestyle tool and CANNOT handle medical emergencies. Please immediately call 108 or 112 (or your local emergency services) or visit the nearest hospital emergency room without delay.",
  textTe:
    "⚠️ అత్యవసర వైద్య హెచ్చరిక: మీరు అత్యవసర వైద్య పరీక్ష అవసరమైన లక్షణాలను (ఛాతీ నొప్పి, తీవ్ర ఆయాసం లేదా కళ్ళు తిరగడం వంటివి) పేర్కొన్నారు. ఫిట్90 తెలుగు కేవలం జీవనశైలి సాధనం మాత్రమే మరియు అత్యవసర వైద్య సేవలను అందించలేదు. దయచేసి వెంటనే 108 లేదా 112 కు కాల్ చేయండి లేదా సమీపంలోని ఆసుపత్రి ఎమర్జెన్సీ విభాగానికి వెళ్ళండి.",
};

/**
 * Deterministic evidence-based coaching engine for offline / standard use
 */
export function generateCoachResponse(
  query: string,
  digest?: WeeklyDigest,
  context?: CoachContext
): CoachMessage {
  // 1. First priority: Check red flags
  if (checkMedicalRedFlags(query)) {
    return EMERGENCY_DEFLECTION_MESSAGE;
  }

  const effectiveDigest = digest || DEFAULT_FALLBACK_DIGEST;
  const q = query.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const userName = context?.userName || "Member";
  const dayNumber = context?.dayNumber || 1;
  const todayCalories = context?.todayCalories ?? effectiveDigest.avgCalories;
  const targetCalMin = context?.targetCaloriesMin ?? effectiveDigest.targetCaloriesMin;
  const targetCalMax = context?.targetCaloriesMax ?? effectiveDigest.targetCaloriesMax;
  const todayProtein = context?.todayProteinG ?? effectiveDigest.avgProteinG;
  const targetProteinMin = context?.targetProteinMinG ?? effectiveDigest.targetProteinMinG;
  const currentWeight = context?.currentWeightKg ?? effectiveDigest.latestWeightKg;
  const targetWeight = context?.targetWeightKg ?? 80;

  // 2. Prescription / Drug Deflection
  if (
    q.includes("prescribe") ||
    q.includes("statin") ||
    q.includes("metformin") ||
    q.includes("medicine") ||
    q.includes("dosage") ||
    q.includes("diagnose") ||
    q.includes("మందులు") ||
    q.includes("రోగ నిర్ధారణ") ||
    q.includes("టాబ్లెట్")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn:
        "Non-Diagnostic Boundary: As an AI lifestyle habits coach, I cannot diagnose medical conditions, prescribe pharmaceutical drugs, or recommend medication dosages. Please discuss specific lab markers and medications directly with your primary care physician or endocrinologist.",
      textTe:
        "వైద్య నిరాకరణ: AI లైఫ్‌స్టైల్ కోచ్‌గా నేను వ్యాధులను నిర్ధారించలేను లేదా మందుల మోతాదులను సూచించలేను. మీ రక్త పరీక్షలు మరియు ఔషధాల వివరాల కోసం దయచేసి మీ వ్యక్తిగత వైద్యుడిని సంప్రదించండి.",
    };
  }

  // 3. Greetings & Casual Pleasantries
  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "hola" ||
    q.includes("namaste") ||
    q.includes("నమస్తే") ||
    q.includes("నమస్కారం") ||
    q.includes("హాయ్") ||
    q.includes("good morning") ||
    q.includes("good evening") ||
    q.includes("how are you") ||
    q.includes("బాగున్నారా") ||
    q.includes("who are you") ||
    q.includes("నువ్వు ఎవరు")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Hello ${userName}! 👋 I am your dedicated Fit90 Telugu Lifestyle Coach. 
You are currently on Day ${dayNumber} of your 90-day metabolic journey (Current weight: ${currentWeight} kg → Goal: ${targetWeight} kg).
Today's snapshot: ${todayCalories} kcal consumed, ${todayProtein}g protein logged.

How can I help you right now?
• Ask: "How is my weekly protein adherence?"
• Ask: "Suggest low-calorie South Indian dinner ideas"
• Ask: "What are knee-safe exercises for weight loss?"
• Ask: "Why does body weight fluctuate day to day?"`,
      textTe: `నమస్కారం ${userName} గారు! 👋 నేను మీ ఫిట్90 తెలుగు లైఫ్‌స్టైల్ కోచ్‌ని.
మీరు ప్రస్తుతం మీ 90 రోజుల ప్రయాణంలో డే ${dayNumber} లో ఉన్నారు (ప్రస్తుత బరువు: ${currentWeight} kg → లక్ష్యం: ${targetWeight} kg).
నేటి వివరాలు: ${todayCalories} కేలరీలు, ${todayProtein} గ్రాముల ప్రోటీన్ నమోదైంది.

నేను మీకు ఎలా సహాయపడగలను?
• "నా ప్రోటీన్ స్థాయి సరిపోతుందా?"
• "రాత్రి భోజనానికి ఆరోగ్యకరమైన తెలుగు వంటకాలు ఏమిటి?"
• "మోకాళ్ల నొప్పి రాకుండా ఏ వ్యాయామాలు చేయాలి?"
• "రోజూ బరువు ఎందుకు మారుతుంటుంది?" అని నన్ను అడగవచ్చు!`,
    };
  }

  // 4. Protein & Nutrition
  if (
    q.includes("protein") ||
    q.includes("ప్రోటీన్") ||
    q.includes("egg") ||
    q.includes("dal") ||
    q.includes("paneer") ||
    q.includes("గుడ్లు") ||
    q.includes("పప్పు")
  ) {
    const proteinDiff = targetProteinMin - todayProtein;
    if (todayProtein >= targetProteinMin) {
      return {
        id: `coach_${Date.now()}`,
        sender: "coach",
        timestamp,
        textEn: `Outstanding job on protein, ${userName}! You've logged ${todayProtein}g protein today against your target of ${targetProteinMin}–${context?.targetProteinMaxG || 120}g. 
Maintaining adequate protein protects your lean muscle tissue and keeps satiety high during a fat-loss phase. Great South Indian protein anchors include: Pesarattu (14g per 2 pcs), Thick Dal/Palakura Pappu (10g/cup), Boiled whole eggs (13g per 2 eggs), Paneer (18g per 100g), and Spiced Majjiga.`,
        textTe: `ప్రోటీన్ విషయంలో అద్భుతమైన పురోగతి, ${userName} గారు! మీరు ఈరోజు ${todayProtein} గ్రాముల ప్రోటీన్ పూర్తి చేశారు (లక్ష్యం: ${targetProteinMin}–120 గ్రాములు).
సరైన ప్రోటీన్ తీసుకోవడం వల్ల కండరాలు దృఢంగా ఉండి ఆకలి నియంత్రణలో ఉంటుంది. మంచి ఆహారాలు: పెసరట్టు (2 ముక్కలకు 14 గ్రాములు), పాలకూర పప్పు (1 కప్పుకు 10 గ్రాములు), ఉడకబెట్టిన గుడ్లు (2 గుడ్లకు 13 గ్రాములు), పన్నీర్ (100 గ్రాములకు 18 గ్రాములు) మరియు మజ్జిగ.`,
      };
    } else {
      return {
        id: `coach_${Date.now()}`,
        sender: "coach",
        timestamp,
        textEn: `You currently have ${todayProtein}g of protein logged today, leaving about ${proteinDiff > 0 ? proteinDiff : 15}g to reach your minimum daily foundation of ${targetProteinMin}g.
Here are quick, reliable South Indian additions for your next meal:
1. Add 2 Boiled Eggs or Egg Whites to dinner (+13g protein).
2. Take a cup of thick Palakura Pappu or Pesara Pappu (+10g protein).
3. Add 50g fresh Paneer or Soya chunks to your curry (+9g protein).
4. Drink a large chilled glass of Spiced Majjiga with roasted cumin (+3g protein, excellent gut probiotics).`,
        textTe: `మీరు ఈరోజు ${todayProtein} గ్రాముల ప్రోటీన్ నమోదు చేశారు, మీ కనీస లక్ష్యం ${targetProteinMin} గ్రాములకు చేరడానికి ఇంకా సుమారు ${proteinDiff > 0 ? proteinDiff : 15} గ్రాములు అవసరం.
తక్షణమే ప్రోటీన్ పెంచుకోవడానికి సులువైన మార్గాలు:
1. రాత్రి భోజనంలో 2 ఉడకబెట్టిన గుడ్లు లేదా గుడ్డు తెల్లసొన చేర్చండి (+13 గ్రాములు).
2. ఒక కప్పు చిక్కటి పాలకూర పప్పు లేదా పెసరపప్పు తీసుకోండి (+10 గ్రాములు).
3. 50 గ్రాముల పన్నీర్ లేదా సోయా ముక్కలు కూరలో వేయండి (+9 గ్రాములు).
4. జీలకర్ర వేసిన ఒక పెద్ద గ్లాసు మజ్జిగ త్రాగండి (+3 గ్రాములు).`,
      };
    }
  }

  // 5. Workouts, Exercise, Steps, Walking, Knee Safety
  if (
    q.includes("workout") ||
    q.includes("exercise") ||
    q.includes("walk") ||
    q.includes("walking") ||
    q.includes("steps") ||
    q.includes("knee") ||
    q.includes("squat") ||
    q.includes("gym") ||
    q.includes("నడక") ||
    q.includes("వ్యాయామం") ||
    q.includes("కసరత్తు") ||
    q.includes("మోకాలు") ||
    q.includes("అడుగులు")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Here is your customized exercise strategy for ${userName}:
1. 🚶‍♂️ Post-Meal 15-Minute Glucose Walks: Walking for 15 minutes within 30 minutes after your main meals (lunch and dinner) activates GLUT4 muscle transporters, clearing blood sugar naturally without insulin surges.
2. 🦵 Knee-Safe Bodyweight Routine: If your BMI is elevated or you feel knee stiffness, strictly avoid deep jump squats or jump lunges. Instead, perform:
   • Seated Chair Squats (3 sets of 10)
   • Glute Bridges on floor/mat (3 sets of 12)
   • Wall Push-Ups or Incline Push-Ups (3 sets of 8)
   • Standing Calf Raises (3 sets of 15)
3. Consistency Rule: Accumulating 7,000–8,000 daily steps with 20 minutes of joint-safe movement burns visceral fat reliably without joint inflammation!`,
      textTe: `${userName} గారి కోసం ప్రత్యేక వ్యాయామ సూచనలు:
1. 🚶‍♂️ భోజనం తర్వాత 15 నిమిషాల నడక: మధ్యాహ్నం లేదా రాత్రి భోజనం చేసిన 30 నిమిషాలలోపు 15 నిమిషాలు నడవడం వల్ల రక్తంలో షుగర్ స్థాయి అదుపులోకి వస్తుంది.
2. 🦵 మోకాళ్ల భద్రత కసరత్తులు: మోకాళ్ల నొప్పులు రాకుండా ఉండటానికి జంపింగ్ వ్యాయామాలు చేయవద్దు. వీటికి బదులుగా:
   • కుర్చీపై కూర్చుని లేచే స్క్వాట్స్ (Seated Chair Squats - 3 సెట్లు x 10)
   • నేలపై గ్లూట్ బ్రిడ్జెస్ (Glute Bridges - 3 సెట్లు x 12)
   • గోడకు చేతులు పెట్టి చేసే వాల్ పుష్-అప్స్ (3 సెట్లు x 8)
   • నిలబడి మడమలు పైకెత్తే కాఫ్ రైజెస్ (3 సెట్లు x 15)
3. రోజుకు 7,000–8,000 అడుగులు వేయడం మరియు 20 నిమిషాల తేలికపాటి వ్యాయామం చేయడం వల్ల పొట్ట దగ్గరి విసెరల్ కొవ్వు కరుగుతుంది!`,
    };
  }

  // 6. Food, South Indian Swaps, Dinner, Lunch, Rice, Sweets
  if (
    q.includes("dinner") ||
    q.includes("lunch") ||
    q.includes("breakfast") ||
    q.includes("swap") ||
    q.includes("recipe") ||
    q.includes("food") ||
    q.includes("rice") ||
    q.includes("sweet") ||
    q.includes("curry") ||
    q.includes("భోజనం") ||
    q.includes("అన్నం") ||
    q.includes("టిఫిన్") ||
    q.includes("కూర") ||
    q.includes("స్వీట్")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Here are 3 nutritious, low-glycemic South Indian meal swaps:
1. Breakfast: Two Moong Dal Pesarattu with allam (ginger) chutney and 1 boiled egg (~320 kcal, 19g protein). Far better satiety than refined rava idli or maida poori!
2. Lunch: Reduce white rice to 1 measured katori (150g). Fill half your plate with thick Palakura Pappu (spinach dal) and a bowl of fresh cucumber-tomato salad (~410 kcal, 18g protein).
3. Dinner: 2 Jowar rotis or 1 bowl Ragi Mudde with vegetable chicken curry or paneer bhurji, paired with 1 glass tempered Majjiga (~390 kcal, 24g protein).
💡 Craving sweets? Enjoy a bowl of sweet curd with a pinch of cardamom and sliced almonds instead of sugar syrups!`,
      textTe: `ఆరోగ్యకరమైన 3 తెలుగు భోజన ప్రత్యామ్నాయాలు:
1. అల్పాహారం: అల్లం పచ్చడితో రెండు పెసరట్లు మరియు 1 ఉడకబెట్టిన గుడ్డు (~320 కేలరీలు, 19 గ్రాముల ప్రోటీన్). పూరీ, మైదా దోసల కంటే ఇది చాలా ఉత్తమం.
2. మధ్యాహ్నం: తెల్ల అన్నం ఒక చిన్న కప్పుకు పరిమితం చేసి, ప్లేట్‌లో సగం భాగం పాలకూర పప్పు మరియు దోసకాయ-టమాటా ముక్కలతో నింపండి (~410 కేలరీలు, 18 గ్రాముల ప్రోటీన్).
3. రాత్రి భోజనం: 2 జొన్న రొట్టెలు లేదా రాగి సంకటితో కోడికూర/పన్నీర్ మరియు ఒక గ్లాసు పోపు మజ్జిగ (~390 కేలరీలు, 24 గ్రాముల ప్రోటీన్).
💡 తీపి తినాలనిపిస్తే: పంచదార స్వీట్లకు బదులుగా యాలకుల పొడి వేసిన తియ్యటి తాజా పెరుగును ఎంచుకోండి!`,
    };
  }

  // 7. Weight Fluctuation, Scale Stalling, Plateau
  if (
    q.includes("fluctuate") ||
    q.includes("scale") ||
    q.includes("why did my weight") ||
    q.includes("gain") ||
    q.includes("plateau") ||
    q.includes("stuck") ||
    q.includes("not losing") ||
    q.includes("బరువు") ||
    q.includes("తగ్గడం లేదు")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Day-to-day scale fluctuations of ±0.5 to 1.5 kg are completely normal and reflect water, sodium, and digestive bulk—NEVER pure fat gain!
• If you had slightly saltier sambar or pickle yesterday, each gram of excess sodium holds ~400ml of water.
• If you lifted weights or took a brisk long walk, micro-inflammation causes temporary muscle water retention.
• True fat loss is measured over weekly rolling average (${effectiveDigest.latestWeightKg} kg). At ${currentWeight} kg, stay patient and track your waist measurement (${effectiveDigest.latestWaistCm} cm), which reflects genuine visceral fat reduction.`,
      textTe: `రోజువారీ బరువులో ±0.5 నుండి 1.5 కిలోల హెచ్చుతగ్గులు కేవలం నీరు, ఉప్పు మరియు జీర్ణక్రియ వల్లనే వస్తాయి—ఇది కొవ్వు కాదు!
• నిన్న పచ్చడి లేదా ఎక్కువ ఉప్పు ఉన్న కూర తింటే, శరీరం అదనపు నీటిని నిలుపుకుంటుంది.
• వ్యాయామం లేదా ఎక్కువ దూరం నడిచినప్పుడు కండరాలలో నీరు చేరి బరువు ఎక్కువగా కనిపిస్తుంది.
• మీ 7 రోజుల సగటు బరువు (${effectiveDigest.latestWeightKg} kg) మరియు నడుము కొలత (${effectiveDigest.latestWaistCm} cm) మాత్రమే మీ నిజమైన కొవ్వు తగ్గుదలను తెలియజేస్తాయి. స్థిరంగా కొనసాగించండి.`,
    };
  }

  // 8. Waist Circumference & Visceral Fat
  if (
    q.includes("waist") ||
    q.includes("visceral") ||
    q.includes("belly") ||
    q.includes("fat") ||
    q.includes("నడుము") ||
    q.includes("పొట్ట")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Visceral fat sits deep beneath the abdominal wall surrounding your vital organs (liver, pancreas, intestines).
For South Asian individuals, cardiometabolic risk increases when waist circumference exceeds 90 cm in men (80 cm in women).
The good news: Because visceral fat is metabolically active and sensitive to catecholamines, it is the FIRST type of fat to mobilize when you maintain your calorie target (${targetCalMin}–${targetCalMax} kcal) and complete your daily walking. Keep tracking your waist weekly with a flexible tape!`,
      textTe: `విసెరల్ కొవ్వు పొట్ట లోపలి భాగంలో కాలేయం, క్లోమం వంటి అవయవాల చుట్టూ పేరుకుపోతుంది.
దక్షిణాసియా పురుషులలో 90 సెం.మీ (మహిళల్లో 80 సెం.మీ) కంటే ఎక్కువ నడుము ఉండటం మధుమేహం మరియు గుండె జబ్బుల ప్రమాదాన్ని పెంచుతుంది.
శుభవార్త ఏమిటంటే: రోజూ 20-30 నిమిషాల నడక మరియు సమతుల్య కేలరీలు (${targetCalMin}–${targetCalMax} kcal) తీసుకున్నప్పుడు ఈ విసెరల్ కొవ్వే అందరికంటే వేగంగా కరిగిపోతుంది! వారానికొకసారి నడుము కొలత చూసుకోండి.`,
    };
  }

  // 9. Blood Sugar, Diabetes, HbA1c, Blood Pressure, Labs
  if (
    q.includes("sugar") ||
    q.includes("diabetes") ||
    q.includes("hba1c") ||
    q.includes("glucose") ||
    q.includes("bp") ||
    q.includes("blood pressure") ||
    q.includes("cholesterol") ||
    q.includes("lipid") ||
    q.includes("lab") ||
    q.includes("షుగర్") ||
    q.includes("రక్తపోటు") ||
    q.includes("కొలెస్ట్రాల్")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Regarding metabolic biomarkers & lab health:
• Glycemic Control: Fiber is your best friend. Eating fiber-rich vegetables (palakura, bendakaya, dosakaya) before rice blunts the glycemic response. 
• Post-meal walks for 15 minutes reduce glucose spikes by up to 25–30%.
• Blood Pressure & Lipids: Keep daily sodium moderate, avoid re-used deep-frying oils, and replace refined grains with millets and whole pulses.
⚠️ Non-Diagnostic Disclaimer: Fit90 provides lifestyle and nutritional optimization. Always share changes in lab values with your healthcare provider.`,
      textTe: `రక్త పరీక్షలు మరియు జీవక్రియ ఆరోగ్యం గురించి:
• షుగర్ నియంత్రణ: అన్నం తినడానికి ముందే ఆకుకూరలు, కూరగాయలు (పాలకూర, బెండకాయ, దోసకాయ) తినడం వల్ల రక్తంలో షుగర్ అకస్మాత్తుగా పెరగదు.
• భోజనం తర్వాత 15 నిమిషాల నడక షుగర్ స్పైక్‌ను 25–30% వరకు తగ్గిస్తుంది.
• రక్తపోటు & కొలెస్ట్రాల్: ఉప్పు తగ్గించండి, పదే పదే వేడి చేసిన నూనెలను వాడవద్దు, చిరుధాన్యాలు మరియు పప్పుదినుసులు తీసుకోండి.
⚠️ గమనిక: ఇది కేవలం జీవనశైలి మార్గదర్శనం మాత్రమే. వైద్య సలహా కోసం మీ వైద్యుడిని సంప్రదించండి.`,
    };
  }

  // 10. Water & Hydration
  if (
    q.includes("water") ||
    q.includes("hydrate") ||
    q.includes("hydration") ||
    q.includes("drink") ||
    q.includes("నీరు") ||
    q.includes("మంచినీళ్ళు") ||
    q.includes("మజ్జిగ")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Hydration is essential for metabolic rate and lipolysis (fat breakdown).
Aim for 3.0 to 3.5 liters daily:
• Drink 1 glass of room-temperature water upon waking up.
• Drink 1 glass 30 minutes before each meal (prevents mistaking thirst for hunger).
• Include 1-2 glasses of thin buttermilk (Majjiga) with curry leaves and ginger to replenish electrolytes.
• Stop heavy water intake 1 hour before bed to prevent interrupted sleep.`,
      textTe: `కొవ్వు కరగడానికి మరియు జీవక్రియకు నీరు చాలా ముఖ్యం.
రోజూ 3.0 నుండి 3.5 లీటర్ల నీరు త్రాగడం అలవాటు చేసుకోండి:
• ఉదయం లేవగానే ఒక గ్లాసు గోరువెచ్చని లేదా సాధారణ నీరు త్రాగండి.
• భోజనానికి 30 నిమిషాల ముందు ఒక గ్లాసు నీరు త్రాగండి (అతిగా తినకుండా చూస్తుంది).
• మధ్యాహ్నం అల్లం, కరివేపాకు వేసిన పల్చటి మజ్జిగ త్రాగండి.
• రాత్రి నిద్రకు గంట ముందు ఎక్కువ నీరు త్రాగడం ఆపండి.`,
    };
  }

  // 11. Sleep & Recovery
  if (
    q.includes("sleep") ||
    q.includes("rest") ||
    q.includes("tired") ||
    q.includes("stress") ||
    q.includes("నిద్ర") ||
    q.includes("అలసట")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Sleep is when your hormonal fat-loss recovery happens.
When you sleep less than 7 hours, ghrelin (the hunger hormone) spikes, making you crave high-carbohydrate foods like sweets and biscuits the next day.
Aim for 7 to 8 hours of uninterrupted rest. Try to finish your dinner by 8:30 PM and keep screens away 30 minutes before bedtime.`,
      textTe: `నిద్రలోనే శరీర కొవ్వు కరిగే ప్రక్రియ మరియు రికవరీ జరుగుతాయి.
7 గంటల కంటే తక్కువ నిద్రపోతే ఆకలిని పెంచే హార్మోన్లు పెరిగి, మరుసటి రోజు తీపి పదార్థాలు తినాలనిపిస్తుంది.
రోజూ 7 నుండి 8 గంటల గాఢ నిద్ర అవసరం. రాత్రి 8:30 కల్లా భోజనం ముగించి, పడుకునే అరగంట ముందు మొబైల్ స్క్రీన్లను పక్కన పెట్టండి.`,
    };
  }

  // 12. Dynamic Context-Aware Default Response
  return {
    id: `coach_${Date.now()}`,
    sender: "coach",
    timestamp,
    textEn: `Thanks for asking, ${userName}! 
On Day ${dayNumber} of your 90-day progress (Current weight: ${currentWeight} kg → Goal: ${targetWeight} kg), consistency is your biggest superpower.
Today's tracking shows ${todayCalories} kcal consumed and ${todayProtein}g protein logged.
To best support you, feel free to ask about South Indian meal recipes, knee-safe exercises, post-meal walking intervals, or lab report interpretations!`,
    textTe: `మంచి ప్రశ్న ${userName} గారు!
మీ 90 రోజుల ప్రయాణంలో డే ${dayNumber} లో (ప్రస్తుత బరువు: ${currentWeight} kg → లక్ష్యం: ${targetWeight} kg) ప్రతిరోజూ క్రమశిక్షణ పాటించడమే మీ విజయ రహస్యం.
నేడు ${todayCalories} కేలరీలు మరియు ${todayProtein} గ్రాముల ప్రోటీన్ నమోదైంది.
మీకు ఎలాంటి సహాయం కావాలన్నా తెలుగు వంటకాలు, మోకాళ్ల భద్రత వ్యాయామాలు, భోజనం తర్వాత నడక లేదా రక్త పరీక్షల విశ్లేషణ గురించి అడగవచ్చు!`,
  };
}
