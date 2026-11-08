-- Fit90 Telugu - Seed Reference Data
-- Seed: supabase/seed.sql

-- 1. Insert Reference Foods (Telugu & Indian Staples)
INSERT INTO public.food_items (name_en, name_te, category, state, serving_unit, serving_size_g, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, estimated_cost_inr, is_verified)
VALUES
    ('Steamed Sona Masoori Rice', 'వండిన సోనా మసూరి అన్నం', 'rice_grain', 'cooked', '100g', 100.0, 130.0, 2.7, 28.2, 0.3, 0.4, 8.0, true),
    ('Brown Rice (Cooked)', 'వండిన బ్రౌన్ రైస్', 'rice_grain', 'cooked', '100g', 100.0, 111.0, 2.6, 23.0, 0.9, 1.8, 12.0, true),
    ('Toor Dal / Pappu (Cooked)', 'కంది పప్పు (వండినది)', 'dal', 'cooked', '100g', 100.0, 116.0, 7.2, 18.5, 1.5, 4.2, 14.0, true),
    ('Tomato Pappu', 'టమోటా పప్పు', 'dal', 'cooked', '100g', 100.0, 105.0, 5.8, 16.0, 2.1, 3.8, 15.0, true),
    ('Palakura Pappu (Spinach Dal)', 'పాలకూర పప్పు', 'dal', 'cooked', '100g', 100.0, 98.0, 6.0, 14.5, 2.0, 4.5, 16.0, true),
    ('Plain Idli', 'ఇడ్లీ', 'breakfast', 'cooked', 'piece (approx 50g)', 50.0, 136.0, 4.5, 27.5, 0.5, 1.5, 10.0, true),
    ('Pesarattu (Moong Dal Dosa)', 'పెసరట్టు', 'breakfast', 'cooked', 'piece (approx 75g)', 75.0, 175.0, 9.0, 26.0, 3.5, 5.0, 20.0, true),
    ('Upma (Rava, Cooked)', 'రవ్వ ఉప్మా', 'breakfast', 'cooked', '100g', 100.0, 145.0, 3.5, 22.0, 4.8, 2.2, 12.0, true),
    ('Boiled Egg (Whole)', 'ఉడకబెట్టిన గుడ్డు', 'curry', 'cooked', '1 egg (50g)', 50.0, 155.0, 13.0, 1.1, 10.6, 0.0, 7.0, true),
    ('Boiled Egg White', 'గుడ్డు తెల్లసొన', 'curry', 'cooked', '1 white (33g)', 33.0, 52.0, 11.0, 0.7, 0.2, 0.0, 6.0, true),
    ('Chicken Breast Curry (Home Style, Light Oil)', 'చికెన్ కర్రీ (ఇంటి పద్ధతి)', 'curry', 'cooked', '100g', 100.0, 165.0, 22.0, 3.5, 7.0, 0.8, 45.0, true),
    ('Paneer (Low Fat)', 'తక్కువ కొవ్వు పన్నీర్', 'curry', 'raw', '100g', 100.0, 180.0, 18.0, 4.5, 10.0, 0.0, 40.0, true),
    ('Curd / Homemade Perugu', 'ఇంటి పెరుగు', 'curry', 'cooked', '100g', 100.0, 60.0, 3.5, 4.7, 3.1, 0.0, 8.0, true),
    ('Chana / Boiled Chickpeas Sundal', 'ఉడకబెట్టిన గుగ్గిళ్ళు (సెనగలు)', 'snack', 'cooked', '100g', 100.0, 164.0, 8.9, 27.4, 2.6, 7.6, 15.0, true),
    ('Roasted Phool Makhana', 'వేయించిన మఖానా', 'snack', 'cooked', '30g', 30.0, 350.0, 9.7, 76.0, 0.5, 7.6, 25.0, true),
    ('Buttermilk (Majjiga with Curry Leaves & Jeera)', 'తాజా మజ్జిగ', 'drink', 'cooked', '200ml glass', 200.0, 20.0, 1.5, 2.2, 0.6, 0.1, 5.0, true)
ON CONFLICT DO NOTHING;

-- 2. Insert Core Low-Impact & Knee-Safe Exercises
INSERT INTO public.exercises (name_en, name_te, category, difficulty_level, instructions_en, instructions_te, is_knee_safe, illustration_url)
VALUES
    (
        'Brisk Walking (Flat Surface)',
        'వేగంగా నడక (సమతల ఉపరితలం)',
        'walking',
        'beginner',
        'Walk at a pace where you can talk in short sentences but cannot sing. Keep your chest up and arms swinging naturally.',
        'చిన్న వాక్యాలలో మాట్లాడగలిగేంత వేగంతో నడవండి. వీపు నిటారుగా ఉంచి, చేతులను సహజంగా ఊపుతూ నడవండి.',
        true,
        '/exercises/brisk-walking.svg'
    ),
    (
        'Seated Chair Squats',
        'కుర్చీ సాయంతో స్క్వాట్స్',
        'knee_friendly',
        'beginner',
        'Sit on a sturdy chair, stand up fully pressing through your heels, and lower back down gently without plumping.',
        'దృఢమైన కుర్చీపై కూర్చుని, మడమలపై భారం మోపుతూ పైకి లేచి నిలబడండి, మళ్ళీ నెమ్మదిగా కూర్చోండి.',
        true,
        '/exercises/chair-squats.svg'
    ),
    (
        'Wall Push-Ups',
        'గోడ పుష్-అప్స్',
        'strength',
        'beginner',
        'Place hands on wall at shoulder height. Step back slightly. Lower your chest toward the wall and press away.',
        'చేతులను భుజాల ఎత్తులో గోడపై ఆనించండి. కొద్దిగా వెనక్కి నిలబడి, ఛాతీని గోడ వైపు దించి మళ్ళీ వెనక్కి నెట్టండి.',
        true,
        '/exercises/wall-pushups.svg'
    ),
    (
        'Standing Calf Raises',
        'నిలబడి కాఫ్ రైజెస్',
        'strength',
        'beginner',
        'Stand tall near a wall for balance. Rise up onto your toes, hold for 1 second, and slowly lower.',
        'సహాయం కోసం గోడను పట్టుకుని నిలబడండి. కాలి వేళ్ళపై పైకి లేచి 1 సెకను ఆగి, నెమ్మదిగా కిందికి రండి.',
        true,
        '/exercises/calf-raises.svg'
    ),
    (
        'Glute Bridges (Floor/Mat)',
        'గ్లూట్ బ్రిడ్జెస్',
        'knee_friendly',
        'beginner',
        'Lie on back with knees bent and feet flat. Squeeze glutes and lift hips toward ceiling until thighs and torso align.',
        'నేలపై వెల్లకిలా పడుకుని మోకాళ్లను మడచి, పిరుదులను బిగించి నడుమును పైకి లేపండి.',
        true,
        '/exercises/glute-bridge.svg'
    ),
    (
        'Seated Knee Extensions',
        'కుర్చీలో కూర్చుని మోకాలు స్ట్రెచ్',
        'knee_friendly',
        'beginner',
        'Sit upright in a chair. Straighten one leg forward, flex the quadriceps for 2 seconds, and lower slowly. Repeat on both legs.',
        'కుర్చీలో కూర్చుని ఒక కాలును ముందుకు నిఠారుగా చాచి 2 సెకన్లు ఆపి నెమ్మదిగా కిందికి దించండి.',
        true,
        '/exercises/knee-extension.svg'
    )
ON CONFLICT DO NOTHING;

