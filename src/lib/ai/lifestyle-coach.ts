import { WeeklyDigest } from "../insights-store";

const AI_CONSENT_KEY = "fit90_ai_lifestyle_consent";

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
  digest?: WeeklyDigest
): CoachMessage {
  // 1. First priority: Check red flags
  if (checkMedicalRedFlags(query)) {
    return EMERGENCY_DEFLECTION_MESSAGE;
  }

  const effectiveDigest = digest || DEFAULT_FALLBACK_DIGEST;
  const q = query.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 2. Prescription / Drug Deflection
  if (
    q.includes("prescribe") ||
    q.includes("statin") ||
    q.includes("metformin") ||
    q.includes("medicine") ||
    q.includes("dosage") ||
    q.includes("diagnose") ||
    q.includes("మందులు") ||
    q.includes("రోగ నిర్ధారణ")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn:
        "Non-Diagnostic Boundary: As an AI lifestyle habits coach, I cannot diagnose medical conditions, prescribe pharmaceutical drugs, or recommend medication dosages. Please discuss specific lab markers and medications directly with your primary care physician or specialist.",
      textTe:
        "వైద్య నిరాకరణ: AI లైఫ్‌స్టైల్ కోచ్‌గా నేను వ్యాధులను నిర్ధారించలేను లేదా మందుల మోతాదులను సూచించలేను. మీ రక్త పరీక్షలు మరియు ఔషధాల వివరాల కోసం దయచేసి మీ వ్యక్తిగత వైద్యుడిని సంప్రదించండి.",
    };
  }

  // 3. Protein Question
  if (q.includes("protein") || q.includes("ప్రోటీన్")) {
    const avg = effectiveDigest.avgProteinG;
    const diff = 100 - avg;
    if (avg >= 100) {
      return {
        id: `coach_${Date.now()}`,
        sender: "coach",
        timestamp,
        textEn: `Excellent job on protein! Your 7-day average is ${avg}g/day, which is well within your calibrated target window (100–120g). Keep enjoying protein-dense South Indian anchors like pesarattu, thick dal/sambar, homemade curd, and boiled eggs to support recovery and muscle preservation.`,
        textTe: `ప్రోటీన్ విషయంలో అద్భుతమైన పురోగతి! మీ గత 7 రోజుల సగటు ${avg} గ్రాములు/రోజు, ఇది మీ లక్ష్య పరిధికి (100–120 గ్రాములు) సరిపోతుంది. కండరాల రక్షణ కోసం పెసరట్టు, చిక్కటి పప్పు, పెరుగు మరియు ఉడకబెట్టిన గుడ్లు తీసుకోవడం కొనసాగించండి.`,
      };
    } else {
      return {
        id: `coach_${Date.now()}`,
        sender: "coach",
        timestamp,
        textEn: `Your 7-day protein average is currently ${avg}g/day, which is about ${diff}g below your 100g minimum foundation target. Easy South Indian upgrades: (1) Add 2 boiled egg whites or 50g paneer to breakfast, (2) Increase your dal portion to 1.5 katoris with your cooked rice, and (3) Snack on roasted chana or a glass of spiced majjiga.`,
        textTe: `మీ గత 7 రోజుల ప్రోటీన్ సగటు ${avg} గ్రాములు, ఇది మీ 100 గ్రాముల కనీస లక్ష్యం కంటే ${diff} గ్రాములు తక్కువగా ఉంది. సులువైన మార్గాలు: (1) ఉదయం 2 ఉడకబెట్టిన గుడ్లు లేదా 50 గ్రాముల పన్నీర్, (2) మధ్యాహ్నం అన్నంలో 1.5 కటోరీల చిక్కటి పప్పు, (3) సాయంత్రం వేయించిన శనగలు లేదా మజ్జిగ తీసుకోండి.`,
      };
    }
  }

  // 4. Weight Fluctuation / Scale Anxiety
  if (
    q.includes("fluctuate") ||
    q.includes("scale") ||
    q.includes("why did my weight") ||
    q.includes("gain") ||
    q.includes("బరువు")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Day-to-day scale jumps of ±1 to 2 kg are almost entirely water, sodium, and digestive bulk—not body fat. If you ate a slightly saltier curry, had extra water before bed, or had delayed digestion, your body holds temporary fluid. Look at your 7-day rolling average (${effectiveDigest.latestWeightKg} kg) and your waist measurement (${effectiveDigest.latestWaistCm} cm), which reflect true fat-loss progress over time.`,
      textTe: `రోజువారీ బరువులో ±1 నుండి 2 కిలోల మార్పు కేవలం నీరు, ఉప్పు మరియు జీర్ణక్రియ వల్లనే వస్తుంది—ఇది కొవ్వు కాదు. కొద్దిగా ఉప్పు ఎక్కువైనా లేదా రాత్రి ఎక్కువ నీరు త్రాగినా శరీరం తాత్కాలికంగా నీటిని నిలుపుకుంటుంది. మీ 7 రోజుల సగటు బరువు (${effectiveDigest.latestWeightKg} kg) మరియు నడుము కొలత (${effectiveDigest.latestWaistCm} cm) మాత్రమే మీ నిజమైన కొవ్వు తగ్గుదలను తెలియజేస్తాయి.`,
    };
  }

  // 5. South Indian Dinner Swaps
  if (
    q.includes("dinner") ||
    q.includes("swap") ||
    q.includes("recipe") ||
    q.includes("food") ||
    q.includes("భోజనం")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Here are 3 nutritious, low-glycemic South Indian dinner ideas:
1. Two Moong Dal Pesarattu (medium) served with tomato-onion chutney and a bowl of fresh cucumber slices (~380 kcal, 22g protein).
2. Cooked Sona Masoori Rice (1 katori / 100g) with 1.5 katoris Palakura Pappu (spinach dal) and 2 boiled egg whites (~420 kcal, 24g protein).
3. Soft Paneer & Vegetable Bhurji (150g) with 1 jowar or multigrain roti and a glass of salted cumin majjiga (~450 kcal, 26g protein).`,
      textTe: `రాత్రి భోజనానికి 3 అద్భుతమైన తెలుగు ఆరోగ్య ప్రత్యామ్నాయాలు:
1. రెండు పెసరట్లు, టమాటా పచ్చడి మరియు దోసకాయ ముక్కలు (~380 కేలరీలు, 22 గ్రాముల ప్రోటీన్).
2. ఒక కప్పు సోనా మసూరి అన్నం, ఒకటిన్నర కప్పుల పాలకూర పప్పు మరియు 2 ఉడకబెట్టిన గుడ్లు (~420 కేలరీలు, 24 గ్రాముల ప్రోటీన్).
3. 150 గ్రాముల పన్నీర్ బుర్జీ, ఒక జొన్న రొట్టె మరియు జీలకర్ర మజ్జిగ గ్లాసు (~450 కేలరీలు, 26 గ్రాముల ప్రోటీన్).`,
    };
  }

  // 6. Waist Circumference & Visceral Fat
  if (
    q.includes("waist") ||
    q.includes("visceral") ||
    q.includes("belly") ||
    q.includes("నడుము")
  ) {
    return {
      id: `coach_${Date.now()}`,
      sender: "coach",
      timestamp,
      textEn: `Your waist is currently ${effectiveDigest.latestWaistCm} cm (down from ${effectiveDigest.baselineWaistCm} cm baseline). For South Asian men, visceral abdominal fat accumulation starts imposing significant cardiometabolic risk above 90 cm. Visceral fat surrounds organs like the liver and heart. Because visceral fat is metabolically active, it is usually the first to mobilize when you maintain your 2000–2200 kcal balanced diet and daily 20–30 minute walking routine!`,
      textTe: `మీ ప్రస్తుత నడుము కొలత ${effectiveDigest.latestWaistCm} సెం.మీ (ప్రారంభంలో ${effectiveDigest.baselineWaistCm} సెం.మీ). ఆసియా పురుషులలో 90 సెం.మీ కంటే ఎక్కువ నడుము ఉండటం గుండె జబ్బులు మరియు మధుమేహానికి కారణమయ్యే విసెరల్ కొవ్వును సూచిస్తుంది. మీరు రోజువారీ నడక మరియు 2000-2200 కేలరీల సమతుల్య ఆహారం తీసుకుంటున్నప్పుడు ఈ విసెరల్ కొవ్వే ముందుగా కరుగుతుంది!`,
    };
  }

  // 7. General Supportive Advice
  return {
    id: `coach_${Date.now()}`,
    sender: "coach",
    timestamp,
    textEn: `You are on Day 7 of your 90-day journey. Your current stats show ${effectiveDigest.totalSteps.toLocaleString()} steps walked this week, ${effectiveDigest.avgCalories} kcal daily average, and ${effectiveDigest.avgProteinG}g protein. Focus on small, repeatable daily habits: stay hydrated with 3.5 liters, take your 20-minute post-meal strolls, and enjoy wholesome home-cooked Indian meals!`,
    textTe: `మీ 90 రోజుల ప్రయాణంలో మీరు క్రమశిక్షణతో ముందుకు సాగుతున్నారు. ఈ వారం ${effectiveDigest.totalSteps.toLocaleString()} అడుగులు నడిచారు, సగటున ${effectiveDigest.avgCalories} కేలరీలు మరియు ${effectiveDigest.avgProteinG} గ్రాముల ప్రోటీన్ తీసుకున్నారు. రోజుకు 3.5 లీటర్ల నీరు త్రాగడం, భోజనం తర్వాత 20 నిమిషాల నడక మరియు ఇంటి భోజనాన్ని ఆస్వాదించడంపై దృష్టి పెట్టండి!`,
  };
}

