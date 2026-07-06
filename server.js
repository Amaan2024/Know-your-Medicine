// Import the Express library and path utility
const express = require('express');
const path = require('path');

// Configure environment variables (kept for PORT)
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- Mock Database (FULLY EXPANDED) ---
const mockDB = [
    // 1. Paracetamol (Crocin)
    { 
        id: 1, 
        name: 'Paracetamol 500mg', 
        brand: 'Crocin', 
        price: 30.50,
        manufacturer: 'GlaxoSmithKline',
        description: 'Crocin 500mg Tablet helps relieve pain and fever by blocking the release of certain chemical messengers responsible for fever and pain. It is used to treat headaches, migraine, toothaches, sore throats, period (menstrual) pains, arthritis, muscle aches, and the common cold.',
        uses: [
            'Pain relief',
            'Fever'
        ],
        how_it_works: 'This medicine is an analgesic (pain reliever) and antipyretic (fever reducer). It works by blocking the release of certain chemical messengers in the brain that are responsible for pain and fever.',
        how_to_use: 'Take this medicine in the dose and duration as advised by your doctor. Swallow it as a whole. Do not chew, crush or break it. This medicine is to be taken with food.',
        side_effects: 'Nausea, stomach pain, loss of appetite, or dark urine. Allergic reactions are rare.',
        safety_advice: {
            alcohol: 'SAFE_WITH_CAUTION',
            pregnancy: 'CONSULT_DOCTOR',
            driving: 'SAFE',
            lactation: 'SAFE',
            kidney: 'SAFE_WITH_CAUTION',
            liver: 'UNSAFE'
        },
        drug_interactions: 'May interact with Warfarin, Carbamazepine, or Phenytoin. Avoid taking with other paracetamol-containing products.',
        quick_tips: [
            'It is generally safe and well-tolerated.',
            'Do not take more than 4 grams (4000mg) in a 24-hour period.',
            'Consult your doctor if your fever lasts for more than 3 days.',
            'Avoid alcohol as it may increase the risk of liver damage.'
        ],
        also_known_as: ['Acetaminophen', 'Tylenol', 'Panadol'],
        chemical_class: 'Anilide',
        habit_forming: 'No',
        therapeutic_class: 'Analgesics and Antipyretics',
        action_class: 'NSAID',
        image_url: 'https://i.imgur.com/7l6P3sL.png'
    },
    // 2. Ibuprofen (Brufen)
    { 
        id: 3, 
        name: 'Ibuprofen 200mg', 
        brand: 'Brufen', 
        price: 45.00,
        manufacturer: 'Abbott Laboratories',
        description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID). It works by reducing hormones that cause inflammation and pain in the body. It is used to reduce fever and treat pain or inflammation caused by many conditions.',
        uses: [
            'Pain relief',
            'Inflammation',
            'Fever',
            'Menstrual cramps'
        ],
        how_it_works: 'It works by blocking the effect of chemicals called cyclo-oxygenase (COX) enzymes. These enzymes help to make other chemicals in the body, called prostaglandins. Some prostaglandins are produced at sites of injury or damage, and cause pain and inflammation.',
        how_to_use: 'Take with food or milk to prevent stomach upset. Do not lie down for at least 10 minutes after taking this drug.',
        side_effects: 'Upset stomach, heartburn, nausea, vomiting, headache. Can increase risk of heart attack or stroke with long-term use.',
        safety_advice: {
            alcohol: 'UNSAFE',
            pregnancy: 'UNSAFE',
            driving: 'SAFE',
            lactation: 'CONSULT_DOCTOR',
            kidney: 'UNSAFE',
            liver: 'SAFE_WITH_CAUTION'
        },
        drug_interactions: 'Do not take with Aspirin or other NSAIDs. May interact with blood thinners (like Warfarin), or blood pressure medication.',
        quick_tips: [
            'Take it with food or a glass of milk to avoid stomach upset.',
            'Do not take it for longer than 10 days for pain without consulting your doctor.',
            'Stop taking the medicine and inform your doctor if you experience ringing in your ears.'
        ],
        also_known_as: ['Advil', 'Motrin'],
        chemical_class: 'Propionic Acid Derivative',
        habit_forming: 'No',
        therapeutic_class: 'Analgesics, Antipyretics, NSAIDs',
        action_class: 'COX Inhibitor',
        image_url: 'https://i.imgur.com/7l6P3sL.png'
    },
    // 3. Cetirizine (Zyrtec)
    { 
        id: 4, 
        name: 'Cetirizine 10mg', 
        brand: 'Zyrtec', 
        price: 50.00,
        manufacturer: 'UCB',
        description: 'An antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, and sneezing. It is also used to relieve itching and swelling from hives.',
        uses: ['Allergy symptoms', 'Hay fever', 'Hives (Urticaria)'],
        how_it_works: 'It works by blocking a certain natural substance (histamine) that your body makes during an allergic reaction.',
        how_to_use: 'Take this medication by mouth, usually once daily in the evening. May be taken with or without food.',
        side_effects: 'Drowsiness, dry mouth, tiredness, stomach pain (especially in children).',
        safety_advice: {
            alcohol: 'SAFE_WITH_CAUTION',
            pregnancy: 'CONSULT_DOCTOR',
            driving: 'CAUTION',
            lactation: 'SAFE_WITH_CAUTION',
            kidney: 'SAFE_WITH_CAUTION',
            liver: 'SAFE'
        },
        drug_interactions: 'May increase drowsiness if taken with other sedatives or alcohol. Inform your doctor about all other medications.',
        quick_tips: [
            'It is less likely to cause drowsiness than older antihistamines, but it can still happen.',
            'Avoid driving or operating machinery until you know how it affects you.',
            'Stop taking this medicine at least 3 days before an allergy test.'
        ],
        also_known_as: ['Aller-Tec', 'Cetiriz'],
        chemical_class: 'Piperazine derivative',
        habit_forming: 'No',
        therapeutic_class: 'Antihistamine',
        action_class: 'H1-receptor antagonist',
        image_url: 'https://i.imgur.com/7l6P3sL.png'
    },
    // 4. Atorvastatin (Lipitor)
    { 
        id: 7, 
        name: 'Atorvastatin 10mg', 
        brand: 'Lipitor', 
        price: 150.00,
        manufacturer: 'Pfizer',
        description: 'Atorvastatin belongs to a group of medicines called statins. It is used to lower cholesterol and to reduce the risk of heart disease, heart attacks, or strokes.',
        uses: ['High cholesterol', 'Prevention of heart attack & stroke'],
        how_it_works: 'It works by blocking an enzyme (HMG-CoA-reductase) in the liver that is needed to make cholesterol. This reduces the amount of cholesterol in the blood.',
        how_to_use: 'Can be taken at any time of the day, with or without food. Try to take it at the same time each day.',
        side_effects: 'Muscle pain, diarrhea, upset stomach, joint pain. Liver problems are a rare but serious side effect.',
        safety_advice: {
            alcohol: 'UNSAFE',
            pregnancy: 'UNSAFE',
            driving: 'SAFE',
            lactation: 'UNSAFE',
            kidney: 'SAFE',
            liver: 'UNSAFE'
        },
        drug_interactions: 'Do not take with grapefruit juice. May interact with many other drugs; provide your doctor with a full list of your medications.',
        quick_tips: [
            'Lifestyle changes like a low-fat diet and regular exercise are important.',
            'Your doctor will monitor your liver function before and during treatment.',
            'Report any unexplained muscle pain or weakness immediately.'
        ],
        also_known_as: ['Atorva', 'Lipvas'],
        chemical_class: 'Statin',
        habit_forming: 'No',
        therapeutic_class: 'Hypolipidemic Agents',
        action_class: 'HMG-CoA Reductase Inhibitor',
        image_url: 'https.imgur.com/7l6P3sL.png'
    },
    // 5. Metformin (Glucophage)
    { 
        id: 8, 
        name: 'Metformin 500mg', 
        brand: 'Glucophage', 
        price: 40.00,
        manufacturer: 'Merck',
        description: 'Metformin is a first-line medication for the treatment of type 2 diabetes. It helps control blood sugar levels.',
        uses: ['Type 2 diabetes', 'Polycystic Ovary Syndrome (PCOS)'],
        how_it_works: 'It works by decreasing glucose production in the liver and improving your body\'s sensitivity to insulin.',
        how_to_use: 'Usually taken 1-3 times a day with meals. Swallow the tablet whole with a glass of water.',
        side_effects: 'Nausea, vomiting, diarrhea, stomach ache, loss of appetite. These are usually temporary.',
        safety_advice: {
            alcohol: 'UNSAFE',
            pregnancy: 'CONSULT_DOCTOR',
            driving: 'SAFE',
            lactation: 'SAFE_WITH_CAUTION',
            kidney: 'UNSAFE',
            liver: 'SAFE_WITH_CAUTION'
        },
        drug_interactions: 'Avoid alcohol. May interact with contrast dye used for X-rays or CT scans. Can also interact with cimetidine or certain diuretics.',
        quick_tips: [
            'Take it with or after food to reduce side effects like nausea and stomach upset.',
            'It does not cause weight gain, and may even cause slight weight loss.',
            'Regularly monitor your blood sugar levels.'
        ],
        also_known_as: ['Glycomet', 'Riomet'],
        chemical_class: 'Biguanide',
        habit_forming: 'No',
        therapeutic_class: 'Antidiabetic',
        action_class: 'Insulin Sensitizer',
        image_url: 'https.imgur.com/7l6P3sL.png'
    },
    // 6. Amoxicillin (Mox)
    { 
        id: 9, 
        name: 'Amoxicillin 500mg', 
        brand: 'Mox', 
        price: 85.00,
        manufacturer: 'Sun Pharma',
        description: 'Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infections caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.',
        uses: ['Bacterial infections', 'Ear infection', 'Strep throat', 'Pneumonia', 'Urinary tract infection (UTI)'],
        how_it_works: 'It is an antibiotic. It works by preventing the formation of the bacterial protective covering (cell wall) which is essential for the survival of bacteria.',
        how_to_use: 'Take this medicine exactly as prescribed by your doctor. It can be taken with or without food, usually every 8 or 12 hours.',
        side_effects: 'Nausea, vomiting, diarrhea, rash.',
        safety_advice: {
            alcohol: 'SAFE_WITH_CAUTION',
            pregnancy: 'SAFE',
            driving: 'SAFE',
            lactation: 'SAFE',
            kidney: 'SAFE_WITH_CAUTION',
            liver: 'SAFE'
        },
        drug_interactions: 'May interact with blood thinners (Warfarin) or other antibiotics (like Tetracycline). Can make birth control pills less effective.',
        quick_tips: [
            'Complete the full course of treatment even if you feel better.',
            'Stopping the medicine early may allow bacteria to continue to grow.',
            'Diarrhea may occur, but should stop when your course is complete.'
        ],
        also_known_as: ['Amoxil', 'Moxatag'],
        chemical_class: 'Penicillin',
        habit_forming: 'No',
        therapeutic_class: 'Antibiotic',
        action_class: 'Beta-lactam',
        image_url: 'https.imgur.com/7l6P3sL.png'
    },
    // 7. Paracetamol (Calpol)
    { 
        id: 2, 
        name: 'Paracetamol 500mg', 
        brand: 'Calpol', 
        price: 28.00,
        manufacturer: 'Janssen Pharmaceuticals',
        description: 'Calpol 500mg Tablet is a common painkiller used to treat aches and pains. It can also be used to reduce fever. It is generally safe and effective when used as directed.',
        uses: [ 'Pain relief', 'Fever' ],
        how_it_works: 'This medicine is an analgesic (pain reliever) and antipyretic (fever reducer). It works by blocking the release of certain chemical messengers in the brain that are responsible for pain and fever.',
        how_to_use: 'Take this medicine in the dose and duration as advised by your doctor. Swallow it as a whole. Do not chew, crush or break it. This medicine is to be taken with food.',
        side_effects: 'Generally well-tolerated; rare skin rashes.',
        safety_advice: {
            alcohol: 'SAFE_WITH_CAUTION',
            pregnancy: 'CONSULT_DOCTOR',
            driving: 'SAFE',
            lactation: 'SAFE',
            kidney: 'SAFE_WITH_CAUTION',
            liver: 'UNSAFE'
        },
        drug_interactions: 'May interact with Warfarin, Carbamazepine, or Phenytoin. Avoid taking with other paracetamol-containing products.',
        quick_tips: [
            'It is generally safe and well-tolerated.',
            'Do not take more than 4 grams (4000mg) in a 24-hour period.',
            'Avoid alcohol as it may increase the risk of liver damage.'
        ],
        also_known_as: ['Acetaminophen', 'Tylenol', 'Panadol'],
        chemical_class: 'Anilide',
        habit_forming: 'No',
        therapeutic_class: 'Analgesics and Antipyretics',
        action_class: 'NSAID',
        image_url: 'https.imgur.com/7l6P3sL.png'
    },
    // 8. Aspirin (Disprin)
    { 
        id: 5, 
        name: 'Aspirin 75mg', 
        brand: 'Disprin', 
        price: 21.00,
        manufacturer: 'Reckitt',
        description: 'Often used at a low dose as a blood thinner to prevent blood clots, reducing the risk of heart attacks and strokes. Higher doses are used for pain and fever.',
        uses: ['Prevent heart attacks', 'Prevent strokes', 'Pain relief (at higher doses)'],
        how_it_works: 'It works by preventing platelets in your blood from clumping together, which can lead to blood clots.',
        how_to_use: 'Take with food to prevent stomach upset. Swallow whole with a full glass of water.',
        side_effects: 'Upset stomach, heartburn, easy bruising/bleeding.',
        safety_advice: {
            alcohol: 'UNSAFE',
            pregnancy: 'UNSAFE',
            driving: 'SAFE',
            lactation: 'UNSAFE',
            kidney: 'SAFE_WITH_CAUTION',
            liver: 'SAFE_WITH_CAUTION'
        },
        drug_interactions: 'Do not take with other NSAIDs like Ibuprofen. Interacts with blood thinners and some antidepressants.',
        quick_tips: [
            'Take with food to prevent stomach irritation.',
            'Do not give to children or teenagers with flu-like symptoms (risk of Reye\'s syndrome).',
            'Inform your doctor or dentist you are taking aspirin before any surgery.'
        ],
        also_known_as: ['ASA', 'Ecosprin'],
        chemical_class: 'Salicylate',
        habit_forming: 'No',
        therapeutic_class: 'Antiplatelet / NSAID',
        action_class: 'COX Inhibitor (irreversible)',
        image_url: 'https.imgur.com/7l6P3sL.png'
    },
    // 9. Paracetamol (Dolo)
    { 
        id: 6, 
        name: 'Paracetamol 650mg', 
        brand: 'Dolo 650', 
        price: 40.00,
        manufacturer: 'Micro Labs',
        description: 'A higher dose of Paracetamol for effective relief from fever and moderate pain, such as headaches and body aches.',
        uses: ['Pain relief (moderate)', 'Fever'],
        how_it_works: 'This medicine is an analgesic (pain reliever) and antipyretic (fever reducer). It works by blocking the release of certain chemical messengers in the brain that are responsible for pain and fever.',
        how_to_use: 'Take this medicine in the dose and duration as advised by your doctor. Swallow it as a whole.',
        side_effects: 'Rarely, allergic reactions may occur. Overdose can cause serious liver damage.',
        safety_advice: {
            alcohol: 'SAFE_WITH_CAUTION',
            pregnancy: 'CONSULT_DOCTOR',
            driving: 'SAFE',
            lactation: 'SAFE',
            kidney: 'SAFE_WITH_CAUTION',
            liver: 'UNSAFE'
        },
        drug_interactions: 'May interact with Warfarin, Carbamazepine, or Phenytoin. Avoid taking with other paracetamol-containing products.',
        quick_tips: [
            'It is generally safe and well-tolerated.',
            'Do not take more than 3 grams (3000mg) of the 650mg tablet in 24 hours.',
            'Avoid alcohol as it may increase the risk of liver damage.'
        ],
        also_known_as: ['Acetaminophen 650mg'],
        chemical_class: 'Anilide',
        habit_forming: 'No',
        therapeutic_class: 'Analgesics and Antipyretics',
        action_class: 'NSAID',
        image_url: 'https.imgur.com/7l6P3sL.png'
    },
    // 10. Omeprazole (Omez)
    { 
        id: 10, 
        name: 'Omeprazole 20mg', 
        brand: 'Omez', 
        price: 55.00,
        manufacturer: 'Dr. Reddy\'s Labs',
        description: 'Omeprazole is a proton pump inhibitor (PPI). It reduces the amount of acid your stomach makes. It\'s used to treat acid reflux, heartburn, and stomach ulcers.',
        uses: ['Acid reflux (GERD)', 'Heartburn', 'Stomach ulcers', 'Zollinger-Ellison syndrome'],
        how_it_works: 'It works by blocking the action of an enzyme called the proton pump in the stomach wall, which is responsible for producing acid.',
        how_to_use: 'Usually taken once a day in the morning, at least 30 minutes before a meal. Swallow the capsule whole.',
        side_effects: 'Headache, diarrhea, stomach pain, nausea, or constipation.',
        safety_advice: {
            alcohol: 'SAFE',
            pregnancy: 'CONSULT_DOCTOR',
            driving: 'SAFE',
            lactation: 'SAFE_WITH_CAUTION',
            kidney: 'SAFE',
            liver: 'SAFE_WITH_CAUTION'
        },
        drug_interactions: 'May interact with clopidogrel, methotrexate, or certain antifungal medications.',
        quick_tips: [
            'It may take 1-4 days to feel the full effect.',
            'Long-term use (over a year) may increase the risk of bone fractures.',
            'Inform your doctor if you have diarrhea that does not improve.'
        ],
        also_known_as: ['Prilosec', 'Losec'],
        chemical_class: 'Benzimidazole',
        habit_forming: 'No',
        therapeutic_class: 'Proton Pump Inhibitor (PPI)',
        action_class: 'Proton Pump Inhibitor',
        image_url: 'https.imgur.com/7l6P3sL.png'
    },
    // 11. Amlodipine (Amlong)
    { 
        id: 11, 
        name: 'Amlodipine 5mg', 
        brand: 'Amlong', 
        price: 60.00,
        manufacturer: 'Cipla',
        description: 'Amlodipine is a calcium channel blocker used to treat high blood pressure (hypertension) and chest pain (angina).',
        uses: ['High blood pressure', 'Chest pain (Angina)'],
        how_it_works: 'It works by relaxing blood vessels so blood can flow more easily, which lowers blood pressure. It also increases the supply of blood and oxygen to the heart.',
        how_to_use: 'Taken once a day, with or without food. It is best to take it at the same time each day.',
        side_effects: 'Swelling of the ankles or feet, headache, dizziness, tiredness, flushing (warmth in the face).',
        safety_advice: {
            alcohol: 'SAFE_WITH_CAUTION',
            pregnancy: 'CONSULT_DOCTOR',
            driving: 'CAUTION',
            lactation: 'SAFE_WITH_CAUTION',
            kidney: 'SAFE',
            liver: 'SAFE_WITH_CAUTION'
        },
        drug_interactions: 'May interact with other blood pressure medications or simvastatin. Avoid grapefruit juice as it can increase the level of amlodipine in your blood.',
        quick_tips: [
            'You may feel dizzy when you first start; stand up slowly.',
            'Ankle swelling is a common side effect.',
            'Do not stop taking the medicine suddenly without consulting your doctor.'
        ],
        also_known_as: ['Norvasc', 'Amlopres'],
        chemical_class: 'Dihydropyridine',
        habit_forming: 'No',
        therapeutic_class: 'Antihypertensive',
        action_class: 'Calcium Channel Blocker',
        image_url: 'https.imgur.com/7l6P3sL.png'
    },
    // 12. Azithromycin (Azee)
    { 
        id: 12, 
        name: 'Azithromycin 500mg', 
        brand: 'Azee', 
        price: 115.00,
        manufacturer: 'Cipla',
        description: 'Azithromycin is an antibiotic used to treat a wide variety of bacterial infections. This includes respiratory infections, skin infections, ear infections, and sexually transmitted diseases.',
        uses: ['Bacterial infections', 'Pneumonia', 'Bronchitis', 'Typhoid fever'],
        how_it_works: 'It works by stopping the growth of bacteria. It will not work for viral infections (such as common cold, flu).',
        how_to_use: 'Usually taken once a day for 3 or 5 days. Can be taken with or without food, but taking it with food may reduce stomach upset.',
        side_effects: 'Diarrhea, nausea, vomiting, stomach pain, headache.',
        safety_advice: {
            alcohol: 'SAFE_WITH_CAUTION',
            pregnancy: 'CONSULT_DOCTOR',
            driving: 'SAFE',
            lactation: 'SAFE_WITH_CAUTION',
            kidney: 'SAFE',
            liver: 'SAFE_WITH_CAUTION'
        },
        drug_interactions: 'Do not take antacids containing aluminum or magnesium within 2 hours of this medicine. May interact with Warfarin or Digoxin.',
        quick_tips: [
            'Take it at the same time each day.',
            'Do not stop taking it early, even if you feel better.',
            'Contact your doctor if you experience severe diarrhea.'
        ],
        also_known_as: ['Zithromax', 'Z-Pak'],
        chemical_class: 'Macrolide',
        habit_forming: 'No',
        therapeutic_class: 'Antibiotic',
        action_class: 'Protein Synthesis Inhibitor',
        image_url: 'https.imgur.com/7l6P3sL.png'
    }
];

// --- Middleware ---
// Assumes a 'public' folder exists for static files
app.use(express.static(path.join(__dirname, 'public')));

// --- API Endpoints ---

/**
 * 1. Search API Route
 * Searches the mockDB for medicine names, brands, or alternative names
 * based on the 'q' query parameter.
 * Example: GET /api/search?q=paro
 */
app.get('/api/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    if (!query) return res.json(mockDB.map(med => ({
        id: med.id,
        name: med.name,
        brand: med.brand,
        price: med.price,
        manufacturer: med.manufacturer
    }))); // Return all if no query, but only selected fields

    const results = mockDB.filter(med => 
        med.name.toLowerCase().includes(query) ||
        med.brand.toLowerCase().includes(query) ||
        med.also_known_as.some(alt => alt.toLowerCase().includes(query))
    ).map(med => ({
        id: med.id,
        name: med.name,
        brand: med.brand,
        price: med.price,
        manufacturer: med.manufacturer
    })); 
    res.json(results);
});

/**
 * 2. Get Medicine Details API Route
 * Retrieves the full details of a medicine by its unique ID.
 * Example: GET /api/medicine/1
 */
app.get('/api/medicine/:id', (req, res) => {
    const medicineId = parseInt(req.params.id, 10);
    const medicine = mockDB.find(med => med.id === medicineId);
    if (medicine) {
        res.json(medicine);
    } else {
        res.status(404).json({ error: 'Medicine not found' });
    }
});

/**
 * 3. Featured Medicines API Route
 * Returns a fixed list of 'featured' medicines.
 * Example: GET /api/featured
 */
app.get('/api/featured', (req, res) => {
    // Pick 4 from the list
    const featured = [
        mockDB.find(m => m.brand === 'Crocin'),
        mockDB.find(m => m.brand === 'Brufen'),
        mockDB.find(m => m.brand === 'Omez'),
        mockDB.find(m => m.brand === 'Amlong')
    ].filter(Boolean); // Filter out any that weren't found
    res.json(featured);
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});