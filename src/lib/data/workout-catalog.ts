export interface WalkingWeekPlan {
  weekNumber: number;
  phaseId: number;
  phaseNameEn: string;
  phaseNameTe: string;
  targetMinutesDaily: number;
  targetStepsDaily: number;
  daysPerWeek: number;
  instructionsEn: string;
  instructionsTe: string;
  clinicalNoteEn: string;
  clinicalNoteTe: string;
}

export interface ExerciseItem {
  id: string;
  nameEn: string;
  nameTe: string;
  category: "strength" | "knee_friendly" | "mobility" | "walking";
  targetMusclesEn: string;
  targetMusclesTe: string;
  defaultSets: number;
  defaultReps: number;
  defaultRestSeconds: number;
  isKneeSafe: boolean;
  kneeAlternativeId?: string;
  instructionsEn: string[];
  instructionsTe: string[];
  formCuesEn: string[];
  formCuesTe: string[];
  illustrationIcon: string;
}

// -------------------------------------------------------------
// 13-Week Low-Impact Walking Progression
// -------------------------------------------------------------
export const WALKING_13_WEEK_PLAN: WalkingWeekPlan[] = [
  // Phase 1: Habit Foundation (Weeks 1 - 3)
  {
    weekNumber: 1,
    phaseId: 1,
    phaseNameEn: "Phase 1: Habit Foundation",
    phaseNameTe: "దశ 1: అలవాటు నిర్మాణం",
    targetMinutesDaily: 20,
    targetStepsDaily: 4500,
    daysPerWeek: 4,
    instructionsEn: "Walk at a comfortable, conversational pace on flat, even terrain. Wear cushioned walking shoes.",
    instructionsTe: "చదునైన ఉపరితలంపై సుఖంగా మాట్లాడగలిగేంత సాధారణ వేగంతో నడవండి. కుషనింగ్ ఉన్న పాదరక్షలు ధరించండి.",
    clinicalNoteEn: "Gentle introduction allows synovial fluid to lubricate knee joints and prevents patellar tendon inflammation.",
    clinicalNoteTe: "తేలికపాటి నడక మోకాలి కీళ్లలో సైనోవియల్ ద్రవాన్ని పెంచి, నొప్పి రాకుండా నివారిస్తుంది.",
  },
  {
    weekNumber: 2,
    phaseId: 1,
    phaseNameEn: "Phase 1: Habit Foundation",
    phaseNameTe: "దశ 1: అలవాటు నిర్మాణం",
    targetMinutesDaily: 25,
    targetStepsDaily: 5000,
    daysPerWeek: 4,
    instructionsEn: "Maintain upright posture, shoulders relaxed, arms gently swinging with elbows at 90 degrees.",
    instructionsTe: "భుజాలను వదులుగా ఉంచి వీపు నిటారుగా నడవండి. చేతులను మోచేతుల వద్ద కొద్దిగా వంచి ఊపండి.",
    clinicalNoteEn: "Builds basal cardiovascular endurance without elevating stress cortisol.",
    clinicalNoteTe: "గుండె సామర్థ్యాన్ని క్రమంగా పెంచుతూ రక్తపోటు నియంత్రణకు సహకరిస్తుంది.",
  },
  {
    weekNumber: 3,
    phaseId: 1,
    phaseNameEn: "Phase 1: Habit Foundation",
    phaseNameTe: "దశ 1: అలవాటు నిర్మాణం",
    targetMinutesDaily: 25,
    targetStepsDaily: 5500,
    daysPerWeek: 5,
    instructionsEn: "Add 1 additional day of walking. Focus on smooth heel-to-toe rolling stride.",
    instructionsTe: "వారంలో మరో రోజు నడకను చేర్చండి. మడమ నుంచి కాలివేళ్ల వైపు సహజంగా అడుగులు వేయండి.",
    clinicalNoteEn: "Consistent 5-day frequency activates peripheral muscle glucose uptake.",
    clinicalNoteTe: "వారానికి 5 రోజుల స్థిరమైన నడక కండరాలలో గ్లూకోజ్ శోషణను మెరుగుపరుస్తుంది.",
  },

  // Phase 2: Aerobic Efficiency (Weeks 4 - 6)
  {
    weekNumber: 4,
    phaseId: 2,
    phaseNameEn: "Phase 2: Aerobic Efficiency",
    phaseNameTe: "దశ 2: ఏరోబిక్ శక్తి పెంపు",
    targetMinutesDaily: 30,
    targetStepsDaily: 6000,
    daysPerWeek: 5,
    instructionsEn: "Increase pace slightly to brisk walking: breathing is elevated, but still able to speak in short sentences.",
    instructionsTe: "నడక వేగాన్ని కొద్దిగా పెంచండి: శ్వాస కొద్దిగా పెరగాలి, కానీ చిన్న వాక్యాలలో మాట్లాడగలగాలి.",
    clinicalNoteEn: "Reaching the 30-minute threshold stimulates visceral fat oxidation and lowers resting heart rate.",
    clinicalNoteTe: "30 నిమిషాల నిరంతర నడక అంతర్గత కొవ్వు (విసెరల్ ఫ్యాట్) కరగడాన్ని వేగవంతం చేస్తుంది.",
  },
  {
    weekNumber: 5,
    phaseId: 2,
    phaseNameEn: "Phase 2: Aerobic Efficiency",
    phaseNameTe: "దశ 2: ఏరోబిక్ శక్తి పెంపు",
    targetMinutesDaily: 30,
    targetStepsDaily: 6500,
    daysPerWeek: 5,
    instructionsEn: "Split into 2 brisk 15-minute walks (morning + post-dinner) if continuous 30 minutes feels tiring.",
    instructionsTe: "ఒకేసారి 30 నిమిషాలు కష్టమైతే, ఉదయం 15 నిమిషాలు + రాత్రి భోజనం తర్వాత 15 నిమిషాలుగా విభజించండి.",
    clinicalNoteEn: "Post-prandial (post-meal) walking significantly blunts post-meal glucose spikes.",
    clinicalNoteTe: "భోజనం తర్వాత నడవడం వల్ల రక్తంలో షుగర్ స్థాయిలు అకస్మాత్తుగా పెరగకుండా నియంత్రణలో ఉంటాయి.",
  },
  {
    weekNumber: 6,
    phaseId: 2,
    phaseNameEn: "Phase 2: Aerobic Efficiency",
    phaseNameTe: "దశ 2: ఏరోబిక్ శక్తి పెంపు",
    targetMinutesDaily: 35,
    targetStepsDaily: 7000,
    daysPerWeek: 5,
    instructionsEn: "Push your stride smoothly. Ensure 300ml water hydration before starting.",
    instructionsTe: "సాఫీగా అడుగులు వేయండి. నడక ప్రారంభించే ముందు 1 గ్లాసు (300మి.లీ) నీరు త్రాగండి.",
    clinicalNoteEn: "Solidifies metabolic adaptation and enhances lower limb venous return.",
    clinicalNoteTe: "కాళ్ల రక్తనాళాల పనితీరును మెరుగుపరిచి రక్తప్రసరణను వేగవంతం చేస్తుంది.",
  },

  // Phase 3: Metabolic Acceleration (Weeks 7 - 9)
  {
    weekNumber: 7,
    phaseId: 3,
    phaseNameEn: "Phase 3: Metabolic Acceleration",
    phaseNameTe: "దశ 3: జీవక్రియ వేగవంతం",
    targetMinutesDaily: 35,
    targetStepsDaily: 7500,
    daysPerWeek: 5,
    instructionsEn: "Incorporate 1-minute faster bursts every 5 minutes, returning to steady brisk pace.",
    instructionsTe: "ప్రతి 5 నిమిషాలకు ఒక నిమిషం పాటు వేగంగా నడిచి, మళ్ళీ సాధారణ వేగానికి రండి.",
    clinicalNoteEn: "Mild intervals improve mitochondrial density without joint impact.",
    clinicalNoteTe: "తేలికపాటి వేగ మార్పులు కణాల శక్తి కేంద్రాలను (మైటోకాండ్రియా) ఉత్తేజపరుస్తాయి.",
  },
  {
    weekNumber: 8,
    phaseId: 3,
    phaseNameEn: "Phase 3: Metabolic Acceleration",
    phaseNameTe: "దశ 3: జీవక్రియ వేగవంతం",
    targetMinutesDaily: 40,
    targetStepsDaily: 8000,
    daysPerWeek: 5,
    instructionsEn: "Total daily step target is now 8,000. Take active walking breaks during sedentary work hours.",
    instructionsTe: "రోజుకు 8,000 అడుగులు లక్ష్యం. ఆఫీసులో పని మధ్యలో ప్రతి 1 గంటకు 2 నిమిషాలు నడవండి.",
    clinicalNoteEn: "8,000 steps/day correlates with a 50% risk reduction in all-cause cardiovascular mortality.",
    clinicalNoteTe: "రోజూ 8,000 అడుగులు వేయడం గుండె జబ్బుల ప్రమాదాన్ని సగానికి తగ్గిస్తుందని నిరూపించబడింది.",
  },
  {
    weekNumber: 9,
    phaseId: 3,
    phaseNameEn: "Phase 3: Metabolic Acceleration",
    phaseNameTe: "దశ 3: జీవక్రియ వేగవంతం",
    targetMinutesDaily: 40,
    targetStepsDaily: 8500,
    daysPerWeek: 5,
    instructionsEn: "Keep cadence steady at 100-110 steps per minute. Use nasal breathing if comfortable.",
    instructionsTe: "నిమిషానికి సుమారు 100-110 అడుగుల స్థిరమైన వేగాన్ని కొనసాగించండి.",
    clinicalNoteEn: "Nasal breathing maintains parasympathetic balance and reduces perceived exertion.",
    clinicalNoteTe: "ముక్కు ద్వారా శ్వాస తీసుకోవడం అలసటను తగ్గించి గుండెపై ఒత్తిడిని నియంత్రిస్తుంది.",
  },

  // Phase 4: Peak Consistency & Fat-Loss (Weeks 10 - 13)
  {
    weekNumber: 10,
    phaseId: 4,
    phaseNameEn: "Phase 4: Peak Consistency",
    phaseNameTe: "దశ 4: స్థిరమైన కొవ్వు కరిగింపు",
    targetMinutesDaily: 45,
    targetStepsDaily: 9000,
    daysPerWeek: 5,
    instructionsEn: "45 minutes sustained brisk walk. Monitor knee comfort and use level paths.",
    instructionsTe: "45 నిమిషాల నిరంతర చురుకైన నడక. మోకాలికి సుఖంగా ఉండే సమతల దారులను ఎంచుకోండి.",
    clinicalNoteEn: "Substantial daily calorie burn (~250-320 kcal) without joint micro-trauma.",
    clinicalNoteTe: "కీళ్లకు ఎటువంటి హాని కలగకుండా రోజుకు సుమారు 250-320 క్యాలరీల కొవ్వు ఖర్చవుతుంది.",
  },
  {
    weekNumber: 11,
    phaseId: 4,
    phaseNameEn: "Phase 4: Peak Consistency",
    phaseNameTe: "దశ 4: స్థిరమైన కొవ్వు కరిగింపు",
    targetMinutesDaily: 45,
    targetStepsDaily: 9500,
    daysPerWeek: 6,
    instructionsEn: "Expand to 6 days. Keep day 7 as full active recovery (gentle leisure stroll or stretching).",
    instructionsTe: "వారంలో 6 రోజులకు విస్తరించండి. 7వ రోజు శరీరాన్ని విశ్రాంతిగా ఉంచే తేలికపాటి స్ట్రెచింగ్ చేయండి.",
    clinicalNoteEn: "High-volume low-impact movement supports long-term visceral adiposity reduction.",
    clinicalNoteTe: "పొట్ట మరియు నడుము చుట్టూ పేరుకుపోయిన కొవ్వును తగ్గించడంలో అత్యంత కీలకమైన దశ.",
  },
  {
    weekNumber: 12,
    phaseId: 4,
    phaseNameEn: "Phase 4: Peak Consistency",
    phaseNameTe: "దశ 4: స్థిరమైన కొవ్వు కరిగింపు",
    targetMinutesDaily: 45,
    targetStepsDaily: 10000,
    daysPerWeek: 6,
    instructionsEn: "Achieve the 10,000 steps milestone! Maintain steady pacing and smile—you built this over 12 weeks.",
    instructionsTe: "10,000 అడుగుల మైలురాయిని చేరుకోండి! 12 వారాల కృషితో మీరు సాధించిన గొప్ప మార్పు ఇది.",
    clinicalNoteEn: "Substantial improvement in HDL cholesterol, insulin sensitivity, and resting arterial pressure.",
    clinicalNoteTe: "మంచి కొలెస్ట్రాల్ (HDL) మరియు ఇన్సులిన్ సామర్థ్యంలో స్పష్టమైన మెరుగుదల కనిపిస్తుంది.",
  },
  {
    weekNumber: 13,
    phaseId: 4,
    phaseNameEn: "Phase 4: Peak Consistency",
    phaseNameTe: "దశ 4: స్థిరమైన కొవ్వు కరిగింపు",
    targetMinutesDaily: 45,
    targetStepsDaily: 10000,
    daysPerWeek: 6,
    instructionsEn: "Mastery week: Walk consistently with ease. This is your permanent lifestyle habit for decades ahead.",
    instructionsTe: "మాస్టరీ వారం: నడకను మీ జీవితాంతం కొనసాగించే సహజమైన జీవనశైలి అలవాటుగా మార్చుకోండి.",
    clinicalNoteEn: "Habit automaticity established. Lean muscle preservation and metabolic rate defended.",
    clinicalNoteTe: "బరువు తిరిగి పెరగకుండా నిరోధించే శాశ్వత జీవనశైలి సాధన పూర్తయింది.",
  },
];

// -------------------------------------------------------------
// Knee-Safe Strength & Mobility Exercise Library
// -------------------------------------------------------------
export const EXERCISE_LIBRARY: ExerciseItem[] = [
  // 1. Chair Squats (Compound lower body - quadriceps, glutes)
  {
    id: "chair-squats",
    nameEn: "Seated Chair Squats",
    nameTe: "కుర్చీ సాయంతో స్క్వాట్స్",
    category: "knee_friendly",
    targetMusclesEn: "Quadriceps, Glutes, Hamstrings",
    targetMusclesTe: "తొడ కండరాలు, పిరుదులు",
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    isKneeSafe: true,
    kneeAlternativeId: "glute-bridges",
    instructionsEn: [
      "Stand 4 inches in front of a sturdy chair with feet shoulder-width apart.",
      "Hinge hips back and bend knees slowly until your glutes touch the seat.",
      "Pause for 1 second without relaxing your core or dropping your weight.",
      "Press firmly through your heels and stand back up to starting position.",
    ],
    instructionsTe: [
      "దృఢమైన కుర్చీ ముందు నిలబడి కాళ్లను భుజాల వెడల్పులో ఉంచండి.",
      "నడుమును వెనక్కి నెట్టి మోకాళ్లను వంచుతూ కుర్చీపై కూర్చున్నట్లు నెమ్మదిగా కిందికి రండి.",
      "కుర్చీని తాకిన వెంటనే ఆగకుండా, మడమలపై బరువు మోపుతూ నెమ్మదిగా పైకి లేవండి.",
      "మోకాళ్లపై అధిక భారం పడకుండా నడుము కండరాలను బిగించండి.",
    ],
    formCuesEn: [
      "Keep knees tracking in line with second toe; never let knees collapse inwards.",
      "Chest remains proud and upright; don't round your lower back.",
    ],
    formCuesTe: [
      "మోకాళ్లు లోపలికి వంగకూడదు, కాలి వేళ్లకు సమాంతరంగా ఉండాలి.",
      "ఛాతీ నిటారుగా ఉంచండి, వీపు వంచవద్దు.",
    ],
    illustrationIcon: "chair-squat",
  },

  // 2. Glute Bridges (Zero knee compression alternative to squats)
  {
    id: "glute-bridges",
    nameEn: "Floor Glute Bridges",
    nameTe: "గ్లూట్ బ్రిడ్జెస్ (కీళ్లపై భారం లేనిది)",
    category: "knee_friendly",
    targetMusclesEn: "Gluteus Maximus, Hamstrings, Core",
    targetMusclesTe: "పిరుదులు, తొడ వెనుక భాగం, పొత్తికడుపు",
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    isKneeSafe: true,
    instructionsEn: [
      "Lie comfortably on your back on a mat with knees bent and feet flat on floor.",
      "Arms resting flat at your sides for stability.",
      "Drive through your heels to raise hips towards ceiling until thighs and torso form a straight line.",
      "Squeeze glutes tightly at the top for 2 seconds, then slowly lower hips back down.",
    ],
    instructionsTe: [
      "నేలపై మ్యాట్ వేసుకుని వెల్లకిలా పడుకోండి. మోకాళ్లను మడచి పాదాలను నేలపై సమాంతరంగా ఉంచండి.",
      "మడమలపై భారం వేసి నడుమును నెమ్మదిగా పైకి లేపండి.",
      "పైకి లేపిన స్థితిలో పిరుదులను 2 సెకన్లు గట్టిగా బిగించి ఉంచి, నెమ్మదిగా కిందికి దించండి.",
      "మోకాళ్లపై అసలు భారం పడదు, ఇది అత్యంత సురక్షితమైన వ్యాయామం.",
    ],
    formCuesEn: [
      "Do not arch your lower back excessively; lift from the glutes, not the lumbar spine.",
      "Exhale on the way up, inhale on the way down.",
    ],
    formCuesTe: [
      "నడుమును అతిగా వంచవద్దు, పిరుదుల బలం ద్వారానే పైకి లేపండి.",
      "పైకి లేచేటప్పుడు శ్వాస వదలండి, కిందికి వచ్చేటప్పుడు పీల్చుకోండి.",
    ],
    illustrationIcon: "glute-bridge",
  },

  // 3. Wall Push-Ups (Upper body pushing - chest, shoulders, triceps)
  {
    id: "wall-pushups",
    nameEn: "Standing Wall Push-Ups",
    nameTe: "గోడ పుష్-అప్స్ (భుజాలు & ఛాతీ)",
    category: "strength",
    targetMusclesEn: "Chest, Anterior Deltoids, Triceps",
    targetMusclesTe: "ఛాతీ, భుజాలు, చేతులు",
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 60,
    isKneeSafe: true,
    instructionsEn: [
      "Stand facing a wall approximately arm-length away.",
      "Place palms flat on the wall at shoulder height and shoulder-width apart.",
      "Keep body in a rigid plank line. Bend elbows and lower chest smoothly toward the wall.",
      "Push firmly away until arms are extended without locking elbows.",
    ],
    instructionsTe: [
      "గోడకు చేతుల దూరంలో ఎదురుగా నిలబడండి.",
      "చేతులను భుజాల ఎత్తులో గోడపై ఆనించండి.",
      "శరీరాన్ని నిటారుగా ఉంచి, మోచేతులను వంచుతూ ఛాతీని గోడ వైపు నెమ్మదిగా దించండి.",
      "మళ్ళీ చేతులతో నెట్టి ప్రారంభ స్థితికి రండి.",
    ],
    formCuesEn: [
      "Keep core braced and neck neutral; do not sag your hips forward.",
      "Elbows track at roughly a 45-degree angle from your torso, not flared out wide.",
    ],
    formCuesTe: [
      "పొట్టను బిగించి ఉంచండి, నడుము ముందుకు జారకూడదు.",
      "మోచేతులను మరీ పక్కకు చాచకుండా 45 డిగ్రీల కోణంలో ఉంచండి.",
    ],
    illustrationIcon: "wall-pushup",
  },

  // 4. Standing Calf Raises (Calf complex & lower leg circulation)
  {
    id: "calf-raises",
    nameEn: "Standing Calf Raises",
    nameTe: "నిలబడి కాఫ్ రైజెస్ (పిక్కల బలం)",
    category: "strength",
    targetMusclesEn: "Gastrocnemius, Soleus, Ankle Complex",
    targetMusclesTe: "పిక్కలు, చీలమండల కీళ్ళు",
    defaultSets: 3,
    defaultReps: 15,
    defaultRestSeconds: 45,
    isKneeSafe: true,
    instructionsEn: [
      "Stand tall near a wall or sturdy table for light finger-touch balance.",
      "Slowly raise up onto the balls of your feet, lifting heels as high as possible.",
      "Hold the peak contraction for 1 full second.",
      "Lower heels slowly over a 2-second count to the floor.",
    ],
    instructionsTe: [
      "గోడ లేదా కుర్చీని సమతుల్యత కోసం తేలికగా పట్టుకోండి.",
      "కాలి వేళ్లపై శరీరాన్ని సాధ్యమైనంత పైకి లేపండి.",
      "పైకి లేచిన స్థితిలో 1 సెకను ఆగి, నెమ్మదిగా మడమలను నేలపైకి దించండి.",
    ],
    formCuesEn: [
      "Avoid bouncing quickly; controlled tempo maximizes blood pumping effect.",
      "Distribute weight evenly across the ball of the foot.",
    ],
    formCuesTe: [
      "వేగంగా ఎగరవద్దు, నెమ్మదిగా చేయడం వల్ల రక్త ప్రసరణ బాగుంటుంది.",
      "కాలి వేళ్లపై సమానంగా బరువు వేయండి.",
    ],
    illustrationIcon: "calf-raise",
  },

  // 5. Seated Knee Extensions (Direct quadriceps isometric strengthening)
  {
    id: "seated-knee-extension",
    nameEn: "Seated Knee Extensions",
    nameTe: "కుర్చీలో కూర్చుని మోకాలు స్ట్రెచ్",
    category: "knee_friendly",
    targetMusclesEn: "Vastus Medialis, Quadriceps",
    targetMusclesTe: "మోకాలి పైభాగపు కండరాలు",
    defaultSets: 3,
    defaultReps: 12,
    defaultRestSeconds: 45,
    isKneeSafe: true,
    instructionsEn: [
      "Sit upright in a chair with back flat against the backrest.",
      "Extend your right leg straight out in front until fully parallel with the floor.",
      "Flex and squeeze the quadriceps muscle tightly for 2 seconds.",
      "Lower leg under control and repeat. Complete on both legs.",
    ],
    instructionsTe: [
      "కుర్చీలో వీపు ఆనించి నిటారుగా కూర్చోండి.",
      "ఒక కాలును ముందుకు నేలకు సమాంతరంగా పైకి చాచండి.",
      "మోకాలి పైభాగపు కండరాన్ని 2 సెకన్లు గట్టిగా బిగించి ఉంచండి.",
      "నెమ్మదిగా కిందికి దించి, రెండో కాలుతో పునరావృతం చేయండి.",
    ],
    formCuesEn: [
      "Strengthens the Vastus Medialis (VMO) which stabilizes patellar tracking and prevents knee pain.",
      "Keep upper body still without leaning back.",
    ],
    formCuesTe: [
      "ఈ వ్యాయామం మోకాలి చిప్పను స్థిరంగా ఉంచి నొప్పిని నివారిస్తుంది.",
      "వెనక్కి వాలకుండా శరీరాన్ని నిటారుగా ఉంచండి.",
    ],
    illustrationIcon: "knee-extension",
  },

  // 6. Doorframe Standing Rows (Upper back posture & anti-slouch)
  {
    id: "doorframe-rows",
    nameEn: "Doorframe Standing Rows",
    nameTe: "డోర్‌ఫ్రేమ్ రోస్ (వీపు & భుజాల బలం)",
    category: "strength",
    targetMusclesEn: "Rhomboids, Latissimus Dorsi, Posterior Deltoids",
    targetMusclesTe: "వీపు కండరాలు, భుజాలు",
    defaultSets: 3,
    defaultReps: 10,
    defaultRestSeconds: 60,
    isKneeSafe: true,
    instructionsEn: [
      "Stand in a doorway with toes near the frame. Grip the frame securely with both hands at chest height.",
      "Lean torso back gently until your arms are fully extended.",
      "Pull chest firmly toward the doorframe by squeezing shoulder blades together.",
      "Slowly lower back to arm's length.",
    ],
    instructionsTe: [
      "తలుపు ఫ్రేమ్ దగ్గర నిలబడి రెండు చేతులతో ఛాతీ ఎత్తులో పట్టుకోండి.",
      "చేతులు పూర్తిగా సాగేలా శరీరాన్ని కొద్దిగా వెనక్కి వంచండి.",
      "భుజాల వెనుక కండరాలను దగ్గరకు లాగుతూ ఛాతీని ఫ్రేమ్ వైపు లాగండి.",
      "నెమ్మదిగా వెనక్కి వచ్చి మళ్ళీ చేయండి.",
    ],
    formCuesEn: [
      "Crucial for desk job workers to counter rounded shoulders and reduce neck strain.",
      "Pull with your back muscles, not just your forearms.",
    ],
    formCuesTe: [
      "కంప్యూటర్ ముందు కూర్చునే వారికి భుజాల నొప్పి రాకుండా సహాయపడుతుంది.",
      "కేవలం చేతులతో కాకుండా వీపు కండరాల బలంతో లాగండి.",
    ],
    illustrationIcon: "doorframe-row",
  },

  // 7. Bird-Dog (Core stability without spinal flexion)
  {
    id: "bird-dog",
    nameEn: "Bird-Dog Core Stability",
    nameTe: "బర్డ్-డాగ్ కోర్ స్టెబిలిటీ (పొట్ట & వెన్నెముక)",
    category: "knee_friendly",
    targetMusclesEn: "Transverse Abdominis, Multifidus, Glutes",
    targetMusclesTe: "పొట్ట లోపలి కండరాలు, వెన్నెముక",
    defaultSets: 3,
    defaultReps: 8,
    defaultRestSeconds: 60,
    isKneeSafe: true,
    instructionsEn: [
      "Begin on hands and knees on a soft mat (hands under shoulders, knees under hips).",
      "Reach your right arm forward and extend your left leg straight back simultaneously.",
      "Hold parallel to the floor for 2 seconds with hips level.",
      "Return to starting position and switch to left arm and right leg.",
    ],
    instructionsTe: [
      "మ్యాట్‌పై నాలుగు కాళ్ల స్థితిలో మోకాళ్ళు, చేతులపై నిలబడండి.",
      "కుడి చేతిని ముందుకు, ఎడమ కాలును వెనక్కి ఒకేసారి నిటారుగా చాచండి.",
      "2 సెకన్లు ఆగి ప్రారంభ స్థితికి రండి. తర్వాత ఎడమ చేయి, కుడి కాలుతో చేయండి.",
    ],
    formCuesEn: [
      "Safer than crunches for high-BMI individuals; protects lumbar discs while building core endurance.",
      "Do not let your lower back sag or hips rotate.",
    ],
    formCuesTe: [
      "పొట్టను లోపలికి లాగి వెన్నెముకపై ఒత్తిడి పడకుండా కాపాడుతుంది.",
      "నడుమును పక్కకు తిప్పవద్దు.",
    ],
    illustrationIcon: "bird-dog",
  },
];

// Helper to look up exercise by ID
export function getExerciseById(id: string): ExerciseItem | undefined {
  return EXERCISE_LIBRARY.find((e) => e.id === id);
}

// Default 4-Exercise Daily Knee-Safe Beginner Routine
export const DEFAULT_BEGINNER_ROUTINE_IDS = [
  "chair-squats",
  "wall-pushups",
  "doorframe-rows",
  "calf-raises",
];

