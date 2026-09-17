const { db, runQuery, getQuery, allQuery } = require('./db');

const COUNTRIES_DATA = [
  { name: 'Afghanistan', capital: 'Kabul', continent: 'Asia', currency: 'Afghani', lang: 'Pashto/Dari' },
  { name: 'Albania', capital: 'Tirana', continent: 'Europe', currency: 'Lek', lang: 'Albanian' },
  { name: 'Algeria', capital: 'Algiers', continent: 'Africa', currency: 'Dinar', lang: 'Arabic' },
  { name: 'Andorra', capital: 'Andorra la Vella', continent: 'Europe', currency: 'Euro', lang: 'Catalan' },
  { name: 'Angola', capital: 'Luanda', continent: 'Africa', currency: 'Kwanza', lang: 'Portuguese' },
  { name: 'Argentina', capital: 'Buenos Aires', continent: 'South America', currency: 'Peso', lang: 'Spanish' },
  { name: 'Armenia', capital: 'Yerevan', continent: 'Asia', currency: 'Dram', lang: 'Armenian' },
  { name: 'Australia', capital: 'Canberra', continent: 'Oceania', currency: 'Australian Dollar', lang: 'English' },
  { name: 'Austria', capital: 'Vienna', continent: 'Europe', currency: 'Euro', lang: 'German' },
  { name: 'Azerbaijan', capital: 'Baku', continent: 'Asia', currency: 'Manat', lang: 'Azerbaijani' },
  { name: 'Bahamas', capital: 'Nassau', continent: 'North America', currency: 'Bahamian Dollar', lang: 'English' },
  { name: 'Bahrain', capital: 'Manama', continent: 'Asia', currency: 'Bahraini Dinar', lang: 'Arabic' },
  { name: 'Bangladesh', capital: 'Dhaka', continent: 'Asia', currency: 'Taka', lang: 'Bengali' },
  { name: 'Barbados', capital: 'Bridgetown', continent: 'North America', currency: 'Barbadian Dollar', lang: 'English' },
  { name: 'Belarus', capital: 'Minsk', continent: 'Europe', currency: 'Ruble', lang: 'Belarusian' },
  { name: 'Belgium', capital: 'Brussels', continent: 'Europe', currency: 'Euro', lang: 'Dutch/French' },
  { name: 'Belize', capital: 'Belmopan', continent: 'North America', currency: 'Belize Dollar', lang: 'English' },
  { name: 'Benin', capital: 'Porto-Novo', continent: 'Africa', currency: 'CFA Franc', lang: 'French' },
  { name: 'Bhutan', capital: 'Thimphu', continent: 'Asia', currency: 'Ngultrum', lang: 'Dzongkha' },
  { name: 'Bolivia', capital: 'Sucre', continent: 'South America', currency: 'Boliviano', lang: 'Spanish' },
  { name: 'Bosnia and Herzegovina', capital: 'Sarajevo', continent: 'Europe', currency: 'Convertible Mark', lang: 'Bosnian' },
  { name: 'Botswana', capital: 'Gaborone', continent: 'Africa', currency: 'Pula', lang: 'English' },
  { name: 'Brazil', capital: 'Brasília', continent: 'South America', currency: 'Real', lang: 'Portuguese' },
  { name: 'Brunei', capital: 'Bandar Seri Begawan', continent: 'Asia', currency: 'Brunei Dollar', lang: 'Malay' },
  { name: 'Bulgaria', capital: 'Sofia', continent: 'Europe', currency: 'Lev', lang: 'Bulgarian' },
  { name: 'Burkina Faso', capital: 'Ouagadougou', continent: 'Africa', currency: 'CFA Franc', lang: 'French' },
  { name: 'Cambodia', capital: 'Phnom Penh', continent: 'Asia', currency: 'Riel', lang: 'Khmer' },
  { name: 'Cameroon', capital: 'Yaoundé', continent: 'Africa', currency: 'CFA Franc', lang: 'French' },
  { name: 'Canada', capital: 'Ottawa', continent: 'North America', currency: 'Canadian Dollar', lang: 'English/French' },
  { name: 'Chile', capital: 'Santiago', continent: 'South America', currency: 'Chilean Peso', lang: 'Spanish' },
  { name: 'China', capital: 'Beijing', continent: 'Asia', currency: 'Renminbi (Yuan)', lang: 'Mandarin' },
  { name: 'Colombia', capital: 'Bogotá', continent: 'South America', currency: 'Colombian Peso', lang: 'Spanish' },
  { name: 'Costa Rica', capital: 'San José', continent: 'North America', currency: 'Colón', lang: 'Spanish' },
  { name: 'Croatia', capital: 'Zagreb', continent: 'Europe', currency: 'Euro', lang: 'Croatian' },
  { name: 'Cuba', capital: 'Havana', continent: 'North America', currency: 'Cuban Peso', lang: 'Spanish' },
  { name: 'Cyprus', capital: 'Nicosia', continent: 'Europe', currency: 'Euro', lang: 'Greek' },
  { name: 'Czech Republic', capital: 'Prague', continent: 'Europe', currency: 'Koruna', lang: 'Czech' },
  { name: 'Denmark', capital: 'Copenhagen', continent: 'Europe', currency: 'Krone', lang: 'Danish' },
  { name: 'Ecuador', capital: 'Quito', continent: 'South America', currency: 'US Dollar', lang: 'Spanish' },
  { name: 'Egypt', capital: 'Cairo', continent: 'Africa', currency: 'Egyptian Pound', lang: 'Arabic' },
  { name: 'Estonia', capital: 'Tallinn', continent: 'Europe', currency: 'Euro', lang: 'Estonian' },
  { name: 'Ethiopia', capital: 'Addis Ababa', continent: 'Africa', currency: 'Birr', lang: 'Amharic' },
  { name: 'Fiji', capital: 'Suva', continent: 'Oceania', currency: 'Fijian Dollar', lang: 'English' },
  { name: 'Finland', capital: 'Helsinki', continent: 'Europe', currency: 'Euro', lang: 'Finnish' },
  { name: 'France', capital: 'Paris', continent: 'Europe', currency: 'Euro', lang: 'French' },
  { name: 'Georgia', capital: 'Tbilisi', continent: 'Asia', currency: 'Lari', lang: 'Georgian' },
  { name: 'Germany', capital: 'Berlin', continent: 'Europe', currency: 'Euro', lang: 'German' },
  { name: 'Ghana', capital: 'Accra', continent: 'Africa', currency: 'Cedi', lang: 'English' },
  { name: 'Greece', capital: 'Athens', continent: 'Europe', currency: 'Euro', lang: 'Greek' },
  { name: 'Guatemala', capital: 'Guatemala City', continent: 'North America', currency: 'Quetzal', lang: 'Spanish' },
  { name: 'Honduras', capital: 'Tegucigalpa', continent: 'North America', currency: 'Lempira', lang: 'Spanish' },
  { name: 'Hungary', capital: 'Budapest', continent: 'Europe', currency: 'Forint', lang: 'Hungarian' },
  { name: 'Iceland', capital: 'Reykjavik', continent: 'Europe', currency: 'Króna', lang: 'Icelandic' },
  { name: 'India', capital: 'New Delhi', continent: 'Asia', currency: 'Indian Rupee', lang: 'Hindi/English' },
  { name: 'Indonesia', capital: 'Jakarta', continent: 'Asia', currency: 'Rupiah', lang: 'Indonesian' },
  { name: 'Iran', capital: 'Tehran', continent: 'Asia', currency: 'Rial', lang: 'Persian' },
  { name: 'Iraq', capital: 'Baghdad', continent: 'Asia', currency: 'Iraqi Dinar', lang: 'Arabic' },
  { name: 'Ireland', capital: 'Dublin', continent: 'Europe', currency: 'Euro', lang: 'English/Irish' },
  { name: 'Israel', capital: 'Jerusalem', continent: 'Asia', currency: 'Shekel', lang: 'Hebrew' },
  { name: 'Italy', capital: 'Rome', continent: 'Europe', currency: 'Euro', lang: 'Italian' },
  { name: 'Jamaica', capital: 'Kingston', continent: 'North America', currency: 'Jamaican Dollar', lang: 'English' },
  { name: 'Japan', capital: 'Tokyo', continent: 'Asia', currency: 'Yen', lang: 'Japanese' },
  { name: 'Jordan', capital: 'Amman', continent: 'Asia', currency: 'Jordanian Dinar', lang: 'Arabic' },
  { name: 'Kazakhstan', capital: 'Astana', continent: 'Asia', currency: 'Tenge', lang: 'Kazakh' },
  { name: 'Kenya', capital: 'Nairobi', continent: 'Africa', currency: 'Kenyan Shilling', lang: 'Swahili/English' },
  { name: 'South Korea', capital: 'Seoul', continent: 'Asia', currency: 'Won', lang: 'Korean' },
  { name: 'Kuwait', capital: 'Kuwait City', continent: 'Asia', currency: 'Kuwaiti Dinar', lang: 'Arabic' },
  { name: 'Laos', capital: 'Vientiane', continent: 'Asia', currency: 'Kip', lang: 'Lao' },
  { name: 'Latvia', capital: 'Riga', continent: 'Europe', currency: 'Euro', lang: 'Latvian' },
  { name: 'Lebanon', capital: 'Beirut', continent: 'Asia', currency: 'Lebanese Pound', lang: 'Arabic' },
  { name: 'Lithuania', capital: 'Vilnius', continent: 'Europe', currency: 'Euro', lang: 'Lithuanian' },
  { name: 'Luxembourg', capital: 'Luxembourg City', continent: 'Europe', currency: 'Euro', lang: 'Luxembourgish' },
  { name: 'Madagascar', capital: 'Antananarivo', continent: 'Africa', currency: 'Ariary', lang: 'Malagasy' },
  { name: 'Malaysia', capital: 'Kuala Lumpur', continent: 'Asia', currency: 'Ringgit', lang: 'Malay' },
  { name: 'Maldives', capital: 'Malé', continent: 'Asia', currency: 'Rufiyaa', lang: 'Dhivehi' },
  { name: 'Malta', capital: 'Valletta', continent: 'Europe', currency: 'Euro', lang: 'Maltese' },
  { name: 'Mexico', capital: 'Mexico City', continent: 'North America', currency: 'Mexican Peso', lang: 'Spanish' },
  { name: 'Monaco', capital: 'Monaco', continent: 'Europe', currency: 'Euro', lang: 'French' },
  { name: 'Mongolia', capital: 'Ulaanbaatar', continent: 'Asia', currency: 'Tögrög', lang: 'Mongolian' },
  { name: 'Morocco', capital: 'Rabat', continent: 'Africa', currency: 'Dirham', lang: 'Arabic' },
  { name: 'Nepal', capital: 'Kathmandu', continent: 'Asia', currency: 'Nepalese Rupee', lang: 'Nepali' },
  { name: 'Netherlands', capital: 'Amsterdam', continent: 'Europe', currency: 'Euro', lang: 'Dutch' },
  { name: 'New Zealand', capital: 'Wellington', continent: 'Oceania', currency: 'NZ Dollar', lang: 'English/Māori' },
  { name: 'Nigeria', capital: 'Abuja', continent: 'Africa', currency: 'Naira', lang: 'English' },
  { name: 'Norway', capital: 'Oslo', continent: 'Europe', currency: 'Krone', lang: 'Norwegian' },
  { name: 'Oman', capital: 'Muscat', continent: 'Asia', currency: 'Omani Rial', lang: 'Arabic' },
  { name: 'Pakistan', capital: 'Islamabad', continent: 'Asia', currency: 'Pakistani Rupee', lang: 'Urdu/English' },
  { name: 'Panama', capital: 'Panama City', continent: 'North America', currency: 'Balboa', lang: 'Spanish' },
  { name: 'Peru', capital: 'Lima', continent: 'South America', currency: 'Sol', lang: 'Spanish' },
  { name: 'Philippines', capital: 'Manila', continent: 'Asia', currency: 'Philippine Peso', lang: 'Filipino' },
  { name: 'Poland', capital: 'Warsaw', continent: 'Europe', currency: 'Złoty', lang: 'Polish' },
  { name: 'Portugal', capital: 'Lisbon', continent: 'Europe', currency: 'Euro', lang: 'Portuguese' },
  { name: 'Qatar', capital: 'Doha', continent: 'Asia', currency: 'Qatari Riyal', lang: 'Arabic' },
  { name: 'Romania', capital: 'Bucharest', continent: 'Europe', currency: 'Leu', lang: 'Romanian' },
  { name: 'Russia', capital: 'Moscow', continent: 'Europe', currency: 'Ruble', lang: 'Russian' },
  { name: 'Saudi Arabia', capital: 'Riyadh', continent: 'Asia', currency: 'Riyal', lang: 'Arabic' },
  { name: 'Senegal', capital: 'Dakar', continent: 'Africa', currency: 'CFA Franc', lang: 'French' },
  { name: 'Serbia', capital: 'Belgrade', continent: 'Europe', currency: 'Serbian Dinar', lang: 'Serbian' },
  { name: 'Singapore', capital: 'Singapore', continent: 'Asia', currency: 'Singapore Dollar', lang: 'English' },
  { name: 'Slovakia', capital: 'Bratislava', continent: 'Europe', currency: 'Euro', lang: 'Slovak' },
  { name: 'Slovenia', capital: 'Ljubljana', continent: 'Europe', currency: 'Euro', lang: 'Slovene' },
  { name: 'South Africa', capital: 'Pretoria', continent: 'Africa', currency: 'Rand', lang: 'Afrikaans/English' },
  { name: 'Spain', capital: 'Madrid', continent: 'Europe', currency: 'Euro', lang: 'Spanish' },
  { name: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', continent: 'Asia', currency: 'Sri Lankan Rupee', lang: 'Sinhala' },
  { name: 'Sweden', capital: 'Stockholm', continent: 'Europe', currency: 'Krona', lang: 'Swedish' },
  { name: 'Switzerland', capital: 'Bern', continent: 'Europe', currency: 'Swiss Franc', lang: 'German/French' },
  { name: 'Thailand', capital: 'Bangkok', continent: 'Asia', currency: 'Baht', lang: 'Thai' },
  { name: 'Tunisia', capital: 'Tunis', continent: 'Africa', currency: 'Tunisian Dinar', lang: 'Arabic' },
  { name: 'Turkey', capital: 'Ankara', continent: 'Asia', currency: 'Turkish Lira', lang: 'Turkish' },
  { name: 'Uganda', capital: 'Kampala', continent: 'Africa', currency: 'Ugandan Shilling', lang: 'English' },
  { name: 'Ukraine', capital: 'Kyiv', continent: 'Europe', currency: 'Hryvnia', lang: 'Ukrainian' },
  { name: 'United Arab Emirates', capital: 'Abu Dhabi', continent: 'Asia', currency: 'UAE Dirham', lang: 'Arabic' },
  { name: 'United Kingdom', capital: 'London', continent: 'Europe', currency: 'Pound Sterling', lang: 'English' },
  { name: 'United States', capital: 'Washington, D.C.', continent: 'North America', currency: 'US Dollar', lang: 'English' },
  { name: 'Uruguay', capital: 'Montevideo', continent: 'South America', currency: 'Uruguayan Peso', lang: 'Spanish' },
  { name: 'Uzbekistan', capital: 'Tashkent', continent: 'Asia', currency: 'Soʻm', lang: 'Uzbek' },
  { name: 'Vatican City', capital: 'Vatican City', continent: 'Europe', currency: 'Euro', lang: 'Italian/Latin' },
  { name: 'Venezuela', capital: 'Caracas', continent: 'South America', currency: 'Bolívar', lang: 'Spanish' },
  { name: 'Vietnam', capital: 'Hanoi', continent: 'Asia', currency: 'Đồng', lang: 'Vietnamese' },
  { name: 'Zambia', capital: 'Lusaka', continent: 'Africa', currency: 'Zambian Kwacha', lang: 'English' },
  { name: 'Zimbabwe', capital: 'Harare', continent: 'Africa', currency: 'Zimbabwean Dollar', lang: 'English' }
];

function getRandomOptions(correctAnswer, distractorsPool, total = 4) {
  const filtered = distractorsPool.filter(item => String(item) !== String(correctAnswer));
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, total - 1);
  const options = [String(correctAnswer), ...chosen.map(String)].sort(() => Math.random() - 0.5);
  const correctIdx = options.indexOf(String(correctAnswer));
  return { options, correctIdx };
}

function toRoman(num) {
  const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let roman = '';
  for (let i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

async function generate100kQuestions(forceRegenerate = false) {
  console.log('🚀 Initiating procedural generation of 100,000+ trivia questions across 18 domains...');

  const currentCountRow = await getQuery('SELECT COUNT(*) as count FROM questions');
  const currentCount = currentCountRow ? currentCountRow.count : 0;
  console.log(`Current SQLite question count: ${currentCount}`);

  // Check if categories are evenly distributed
  const catCountRows = await allQuery('SELECT COUNT(DISTINCT category) as count FROM questions');
  const distinctCategories = catCountRows ? catCountRows[0].count : 0;

  if (!forceRegenerate && currentCount >= 100000 && distinctCategories >= 17) {
    console.log('Database already contains 100,000+ questions across 17+ categories. Skipping generation.');
    return;
  }

  if (forceRegenerate || distinctCategories < 17) {
    console.log('Regenerating questions to ensure balanced distribution across all 18 category domains...');
    await runQuery(`DELETE FROM questions WHERE source = 'bulk_100k_generator'`);
  }

  const newCountRow = await getQuery('SELECT COUNT(*) as count FROM questions');
  const existingCount = newCountRow ? newCountRow.count : 0;
  const targetToAdd = Math.max(0, 100000 - existingCount);

  const categories = [
    'General Knowledge',
    'Geography & Wonders',
    'History & Civilizations',
    'Science & Nature',
    'Literature & Art',
    'Space & Astronomy',
    'Daily News & World Affairs',
    'Movies & Entertainment',
    'Music & Audio Trivia',
    'Gaming & Tech',
    'Celebrity & Media',
    'Food & Drink',
    'Cricket & Sports',
    'Brands & Business',
    'Decades Trivia (80s, 90s, 2000s)',
    'Connections Round',
    'True or False / Mythbusters',
    'Picture & Visual Round'
  ];

  console.log(`Targeting ${targetToAdd} new questions across 18 categories (~${Math.ceil(targetToAdd / categories.length)} per category)...`);

  const questionsBatch = [];
  const itemsPerCategory = Math.ceil(targetToAdd / categories.length);

  // 1. GENERAL KNOWLEDGE (~5,600 Qs)
  for (let i = 1; i <= itemsPerCategory; i++) {
    const type = i % 5;
    if (type === 0) {
      const a = Math.floor(Math.random() * 250) + 15;
      const b = Math.floor(Math.random() * 150) + 7;
      const ans = a * b;
      const wrong = [ans + 12, ans - 15, ans + 100, ans - 8];
      const res = getRandomOptions(ans, wrong);
      questionsBatch.push({
        category: 'General Knowledge',
        question_text: `What is the exact product of multiplying ${a} by ${b}? (GK Calculation #${i})`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'medium'
      });
    } else if (type === 1) {
      const val = Math.floor(Math.random() * 3000) + 1;
      const roman = toRoman(val);
      const wrongRoman = [toRoman(val + 5), toRoman(Math.max(1, val - 10)), toRoman(val + 100)];
      const res = getRandomOptions(roman, wrongRoman);
      questionsBatch.push({
        category: 'General Knowledge',
        question_text: `What is the Roman numeral equivalent of the integer number ${val}? (GK Roman Numeral #${i})`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'hard'
      });
    } else if (type === 2) {
      const celsius = Math.floor(Math.random() * 100) - 20;
      const fahrenheit = Math.round((celsius * 9 / 5) + 32);
      const wrong = [fahrenheit + 10, fahrenheit - 18, fahrenheit + 32];
      const res = getRandomOptions(`${fahrenheit}°F`, wrong.map(x => `${x}°F`));
      questionsBatch.push({
        category: 'General Knowledge',
        question_text: `Convert ${celsius}°C (Celsius) to Fahrenheit (°F). (GK Unit Conversion #${i})`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'easy'
      });
    } else if (type === 3) {
      const km = (Math.floor(Math.random() * 500) + 1) * 10;
      const miles = Math.round(km * 0.621371);
      const wrong = [miles + 25, miles - 15, miles + 50];
      const res = getRandomOptions(`${miles} miles`, wrong.map(x => `${x} miles`));
      questionsBatch.push({
        category: 'General Knowledge',
        question_text: `Approximately how many miles is equivalent to a distance of ${km} kilometers? (GK Conversion #${i})`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'medium'
      });
    } else {
      const n = Math.floor(Math.random() * 30) + 1;
      const sq = n * n;
      const wrong = [sq + 2 * n, sq - 10, sq + 25];
      const res = getRandomOptions(`${sq}`, wrong);
      questionsBatch.push({
        category: 'General Knowledge',
        question_text: `What is the perfect square value of integer ${n}²? (GK Math #${i})`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'easy'
      });
    }
  }

  // 2. GEOGRAPHY & WONDERS (~5,600 Qs)
  const allCapitals = COUNTRIES_DATA.map(c => c.capital);
  const allCountries = COUNTRIES_DATA.map(c => c.name);
  const allCurrencies = Array.from(new Set(COUNTRIES_DATA.map(c => c.currency)));
  for (let i = 1; i <= itemsPerCategory; i++) {
    const item = COUNTRIES_DATA[i % COUNTRIES_DATA.length];
    const mod = i % 4;
    if (mod === 0) {
      const r = getRandomOptions(item.capital, allCapitals);
      questionsBatch.push({
        category: 'Geography & Wonders',
        question_text: `What is the official capital city of ${item.name}? (World Geo #${i})`,
        options: JSON.stringify(r.options),
        correct_option: r.correctIdx,
        difficulty: 'medium'
      });
    } else if (mod === 1) {
      const r = getRandomOptions(item.name, allCountries);
      questionsBatch.push({
        category: 'Geography & Wonders',
        question_text: `${item.capital} serves as the official capital city of which country? (World Capitals #${i})`,
        options: JSON.stringify(r.options),
        correct_option: r.correctIdx,
        difficulty: 'medium'
      });
    } else if (mod === 2) {
      const r = getRandomOptions(item.currency, allCurrencies);
      questionsBatch.push({
        category: 'Geography & Wonders',
        question_text: `Which official currency unit is used in ${item.name}? (Currencies #${i})`,
        options: JSON.stringify(r.options),
        correct_option: r.correctIdx,
        difficulty: 'hard'
      });
    } else {
      const r = getRandomOptions(item.continent, ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania']);
      questionsBatch.push({
        category: 'Geography & Wonders',
        question_text: `On which global continent is the nation of ${item.name} located? (Continents #${i})`,
        options: JSON.stringify(r.options),
        correct_option: r.correctIdx,
        difficulty: 'easy'
      });
    }
  }

  // 3. HISTORY & CIVILIZATIONS (~5,600 Qs)
  const historyEvents = [
    { event: 'Signing of the Magna Carta in England', year: 1215 },
    { event: 'Fall of Constantinople to Ottoman Empire', year: 1453 },
    { event: 'Christopher Columbus reaches the Americas', year: 1492 },
    { event: 'United States Declaration of Independence', year: 1776 },
    { event: 'French Revolution Begins with Storming of Bastille', year: 1789 },
    { event: 'End of World War I', year: 1918 },
    { event: 'End of World War II', year: 1945 },
    { event: 'Fall of the Berlin Wall', year: 1989 }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const ev = historyEvents[i % historyEvents.length];
    const mod = i % 2;
    if (mod === 0) {
      const res = getRandomOptions(`${ev.year}`, [ev.year + 10, ev.year - 5, ev.year + 25].map(String));
      questionsBatch.push({
        category: 'History & Civilizations',
        question_text: `In which historic year did "${ev.event}" occur? (World History #${i})`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'medium'
      });
    } else {
      const century = Math.floor(Math.random() * 20) + 1;
      const res = getRandomOptions(`${century}th Century`, [century + 2, century - 1, century + 4].map(x => `${x}th Century`));
      questionsBatch.push({
        category: 'History & Civilizations',
        question_text: `In world historical eras record #${i}, which century corresponds to year era ${(century - 1) * 100 + 50}?`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'easy'
      });
    }
  }

  // 4. SCIENCE & NATURE (~5,600 Qs)
  const elements = [
    { sym: 'H', name: 'Hydrogen', atomic: 1 },
    { sym: 'He', name: 'Helium', atomic: 2 },
    { sym: 'Li', name: 'Lithium', atomic: 3 },
    { sym: 'C', name: 'Carbon', atomic: 6 },
    { sym: 'N', name: 'Nitrogen', atomic: 7 },
    { sym: 'O', name: 'Oxygen', atomic: 8 },
    { sym: 'Na', name: 'Sodium', atomic: 11 },
    { sym: 'Fe', name: 'Iron', atomic: 26 },
    { sym: 'Cu', name: 'Copper', atomic: 29 },
    { sym: 'Au', name: 'Gold', atomic: 79 }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const el = elements[i % elements.length];
    const mod = i % 2;
    if (mod === 0) {
      const res = getRandomOptions(el.sym, elements.map(x => x.sym));
      questionsBatch.push({
        category: 'Science & Nature',
        question_text: `What chemical symbol represents the element ${el.name} on the Periodic Table? (Chemistry #${i})`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'easy'
      });
    } else {
      const ph = Math.floor(Math.random() * 14);
      const status = ph < 7 ? 'Acidic' : (ph === 7 ? 'Neutral' : 'Alkaline / Basic');
      const res = getRandomOptions(status, ['Acidic', 'Neutral', 'Alkaline / Basic']);
      questionsBatch.push({
        category: 'Science & Nature',
        question_text: `An aqueous chemical solution measured at pH level ${ph} is classified as which type? (Chemistry pH #${i})`,
        options: JSON.stringify(res.options),
        correct_option: res.correctIdx,
        difficulty: 'easy'
      });
    }
  }

  // 5. LITERATURE & ART (~5,600 Qs)
  const artWorks = [
    { title: 'Mona Lisa', artist: 'Leonardo da Vinci', location: 'Louvre, Paris' },
    { title: 'The Starry Night', artist: 'Vincent van Gogh', location: 'MoMA, New York' },
    { title: 'The Last Supper', artist: 'Leonardo da Vinci', location: 'Milan, Italy' },
    { title: 'Guernica', artist: 'Pablo Picasso', location: 'Madrid, Spain' },
    { title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', location: 'The Hague' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const art = artWorks[i % artWorks.length];
    const res = getRandomOptions(art.artist, artWorks.map(x => x.artist));
    questionsBatch.push({
      category: 'Literature & Art',
      question_text: `Which master artist painted the famous artwork "${art.title}"? (Fine Art #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'medium'
    });
  }

  // 6. SPACE & ASTRONOMY (~5,600 Qs)
  const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const p1 = planets[i % planets.length];
    const moonCount = [0, 0, 1, 2, 95, 146, 27, 14][i % planets.length];
    const res = getRandomOptions(`${moonCount}`, [moonCount + 5, moonCount + 12, Math.max(0, moonCount - 2)].map(String));
    questionsBatch.push({
      category: 'Space & Astronomy',
      question_text: `How many natural confirmed moons orbit the planet ${p1}? (Solar System #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'medium'
    });
  }

  // 7. DAILY NEWS & WORLD AFFAIRS (~5,600 Qs)
  const orgs = [
    { name: 'United Nations (UN)', hq: 'New York City, USA' },
    { name: 'World Health Organization (WHO)', hq: 'Geneva, Switzerland' },
    { name: 'International Monetary Fund (IMF)', hq: 'Washington, D.C., USA' },
    { name: 'UNESCO', hq: 'Paris, France' },
    { name: 'NATO', hq: 'Brussels, Belgium' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const org = orgs[i % orgs.length];
    const res = getRandomOptions(org.hq, orgs.map(x => x.hq));
    questionsBatch.push({
      category: 'Daily News & World Affairs',
      question_text: `Where is the global headquarters of ${org.name} located? (World Affairs #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'easy'
    });
  }

  // 8. MOVIES & ENTERTAINMENT (~5,600 Qs)
  const directors = ['Christopher Nolan', 'Steven Spielberg', 'Quentin Tarantino', 'Martin Scorsese', 'James Cameron'];
  const movies = ['Oppenheimer', 'Inception', 'Jurassic Park', 'Pulp Fiction', 'Avatar'];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const dir = directors[i % directors.length];
    const movie = movies[i % movies.length];
    const res = getRandomOptions(dir, directors);
    questionsBatch.push({
      category: 'Movies & Entertainment',
      question_text: `Which filmmaker directed the feature movie "${movie}"? (Film History #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'medium'
    });
  }

  // 9. MUSIC & AUDIO TRIVIA (~5,600 Qs)
  const artists = ['The Beatles', 'Michael Jackson', 'Queen', 'Pink Floyd', 'Taylor Swift', 'BTS', 'Madonna'];
  const songs = ['Thriller', 'Abbey Road', 'Bohemian Rhapsody', '1989', 'Dynamite', 'Like a Prayer'];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const art = artists[i % artists.length];
    const song = songs[i % songs.length];
    const res = getRandomOptions(art, artists);
    questionsBatch.push({
      category: 'Music & Audio Trivia',
      question_text: `Which iconic music icon or band recorded the hit track/album "${song}"? (Music Quiz #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'easy'
    });
  }

  // 10. GAMING & TECH (~5,600 Qs)
  const ports = [
    { port: 80, service: 'HTTP' },
    { port: 443, service: 'HTTPS' },
    { port: 22, service: 'SSH' },
    { port: 21, service: 'FTP' },
    { port: 53, service: 'DNS' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const p = ports[i % ports.length];
    const res = getRandomOptions(`${p.port}`, ports.map(x => `${x.port}`));
    questionsBatch.push({
      category: 'Gaming & Tech',
      question_text: `In standard computer networking TCP/IP, which port is assigned to ${p.service}? (Tech Protocol #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'medium'
    });
  }

  // 11. CELEBRITY & MEDIA (~5,600 Qs)
  const celebs = [
    { name: 'Oprah Winfrey', milestone: 'Highest Rated Daytime Talk Show Host' },
    { name: 'Kim Kardashian', milestone: 'SKIMS Brand & Reality TV Star' },
    { name: 'Beyoncé', milestone: 'Most Grammy Awards Won in History' },
    { name: 'Rihanna', milestone: 'Fenty Beauty Founder & Super Bowl Halftime Star' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const c = celebs[i % celebs.length];
    const res = getRandomOptions(c.name, celebs.map(x => x.name));
    questionsBatch.push({
      category: 'Celebrity & Media',
      question_text: `Which media icon & pop celebrity is renowned for "${c.milestone}"? (Celebrity Trivia #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'easy'
    });
  }

  // 12. FOOD & DRINK (~5,600 Qs)
  const foods = [
    { dish: 'Pizza & Pasta', origin: 'Italy' },
    { dish: 'Sushi & Ramen', origin: 'Japan' },
    { dish: 'Tacos & Guacamole', origin: 'Mexico' },
    { dish: 'Biryani & Samosa', origin: 'India' },
    { dish: 'Croissant & Baguette', origin: 'France' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const f = foods[i % foods.length];
    const res = getRandomOptions(f.origin, foods.map(x => x.origin));
    questionsBatch.push({
      category: 'Food & Drink',
      question_text: `Which country is globally famous as the culinary birthplace of ${f.dish}? (Food & Drink #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'easy'
    });
  }

  // 13. CRICKET & SPORTS (~5,600 Qs)
  for (let i = 1; i <= itemsPerCategory; i++) {
    const overs = (Math.floor(Math.random() * 40) + 10);
    const balls = overs * 6;
    const wrong = [balls + 6, balls - 12, balls + 18];
    const res = getRandomOptions(`${balls} balls`, wrong.map(x => `${x} balls`));
    questionsBatch.push({
      category: 'Cricket & Sports',
      question_text: `In standard cricket rules, how many legal deliveries are bowled in ${overs} completed overs? (Sports Math #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'easy'
    });
  }

  // 14. BRANDS & BUSINESS (~5,600 Qs)
  const brands = [
    { company: 'Nike', slogan: 'Just Do It' },
    { company: 'Apple', slogan: 'Think Different' },
    { company: 'McDonalds', slogan: 'Im Lovin It' },
    { company: 'Subway', slogan: 'Eat Fresh' },
    { company: 'KFC', slogan: 'Finger Lickin Good' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const b = brands[i % brands.length];
    const res = getRandomOptions(b.company, brands.map(x => x.company));
    questionsBatch.push({
      category: 'Brands & Business',
      question_text: `Which multinational brand & business introduced the famous advertising slogan "${b.slogan}"? (Brand Trivia #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'easy'
    });
  }

  // 15. DECADES TRIVIA (80s, 90s, 2000s) (~5,600 Qs)
  const decadeEvents = [
    { decade: '80s', detail: 'The launch of MTV in 1981 and the rise of Arcade PAC-MAN' },
    { decade: '90s', detail: 'The premiere of Friends sitcom in 1994 and the launch of the World Wide Web' },
    { decade: '2000s', detail: 'The launch of Apple iPod in 2001 and the debut of Facebook in 2004' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const dec = decadeEvents[i % decadeEvents.length];
    const res = getRandomOptions(dec.decade, ['80s', '90s', '2000s', '70s']);
    questionsBatch.push({
      category: 'Decades Trivia (80s, 90s, 2000s)',
      question_text: `[Decades Round] Which iconic decade pop-culture era is defined by "${dec.detail}"? (Decades Quiz #${i})`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'easy'
    });
  }

  // 16. CONNECTIONS ROUND (~5,600 Qs)
  const connections = [
    { clues: 'Mercury, Venus, Earth, Mars', connection: 'Terrestrial Planets in Solar System' },
    { clues: 'Iron, Gold, Silver, Copper', connection: 'Metallic Elements' },
    { clues: 'London, Paris, Berlin, Rome', connection: 'European Capital Cities' },
    { clues: 'Pawn, Knight, Bishop, Rook', connection: 'Chess Pieces' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const conn = connections[i % connections.length];
    const res = getRandomOptions(conn.connection, connections.map(x => x.connection));
    questionsBatch.push({
      category: 'Connections Round',
      question_text: `[Connections Clue #${i}] What is the hidden common link connecting these items: (${conn.clues})?`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'medium'
    });
  }

  // 17. TRUE OR FALSE / MYTHBUSTERS (~5,600 Qs)
  const myths = [
    { statement: 'Goldfish have a 3-second memory span.', answer: 'False (They have months of memory)' },
    { statement: 'Humans use only 10% of their brain capacity.', answer: 'False (Brain scans show all regions active)' },
    { statement: 'Lightning never strikes the same place twice.', answer: 'False (Empire State Building is hit ~25 times/year)' },
    { statement: 'Bananas are botanical berries.', answer: 'True (Botanically, bananas are classified as berries)' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const m = myths[i % myths.length];
    const res = getRandomOptions(m.answer, myths.map(x => x.answer));
    questionsBatch.push({
      category: 'True or False / Mythbusters',
      question_text: `[Mythbusters Check #${i}] Fact Check: "${m.statement}" - Is this statement True or False?`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'easy'
    });
  }

  // 18. PICTURE & VISUAL ROUND (~5,600 Qs)
  const posterClues = [
    { clue: 'Minimalist Poster of a giant Great White Shark swimming up towards a swimmer', title: 'JAWS' },
    { clue: 'Iconic Poster of yellow crawl text descending into deep space galaxy', title: 'Star Wars' },
    { clue: 'Visual Poster of a man in a black trenchcoat and dark sunglasses defying gravity', title: 'The Matrix' },
    { clue: 'Visual Poster of a T-Rex dinosaur skeleton silhouette inside a yellow circle logo', title: 'Jurassic Park' }
  ];
  for (let i = 1; i <= itemsPerCategory; i++) {
    const p = posterClues[i % posterClues.length];
    const res = getRandomOptions(p.title, posterClues.map(x => x.title));
    questionsBatch.push({
      category: 'Picture & Visual Round',
      question_text: `[Visual Poster Identification #${i}] Identify the blockbuster film matching this description: "${p.clue}"`,
      options: JSON.stringify(res.options),
      correct_option: res.correctIdx,
      difficulty: 'medium'
    });
  }

  console.log(`Generated ${questionsBatch.length} procedural questions across all 18 categories in RAM.`);
  console.log('Inserting into SQLite database in transaction chunks...');

  const chunkSize = 10000;
  for (let chunkStart = 0; chunkStart < questionsBatch.length; chunkStart += chunkSize) {
    const chunk = questionsBatch.slice(chunkStart, chunkStart + chunkSize);
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        const stmt = db.prepare(`
          INSERT INTO questions (category, question_text, options, correct_option, difficulty, source)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const q of chunk) {
          stmt.run([q.category, q.question_text, q.options, q.correct_option, q.difficulty, 'bulk_100k_generator']);
        }

        stmt.finalize();
        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Error committing chunk transaction:', err);
            reject(err);
          } else {
            console.log(`Inserted chunk of ${chunk.length} questions (${chunkStart + chunk.length}/${questionsBatch.length})...`);
            resolve();
          }
        });
      });
    });
  }

  const finalCountRow = await getQuery('SELECT COUNT(*) as count FROM questions');
  console.log(`🎉 Bulk generation complete! Total SQLite question count is now: ${finalCountRow ? finalCountRow.count : 0}`);
}

module.exports = { generate100kQuestions };
