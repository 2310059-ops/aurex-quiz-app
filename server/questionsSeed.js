const { allQuery, runQuery, getQuery } = require('./db');

const initialQuestions = [
  // --- GENERAL KNOWLEDGE ---
  {
    category: 'General Knowledge',
    question_text: 'Which chemical element has the atomic symbol "Au"?',
    options: JSON.stringify(['Silver', 'Gold', 'Copper', 'Aluminum']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'General Knowledge',
    question_text: 'What is the capital city of Australia?',
    options: JSON.stringify(['Sydney', 'Melbourne', 'Canberra', 'Brisbane']),
    correct_option: 2,
    difficulty: 'medium'
  },
  {
    category: 'General Knowledge',
    question_text: 'Which planet in our solar system is known as the "Red Planet"?',
    options: JSON.stringify(['Venus', 'Jupiter', 'Mars', 'Saturn']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'General Knowledge',
    question_text: 'Who painted the ceiling of the Sistine Chapel in Rome?',
    options: JSON.stringify(['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'General Knowledge',
    question_text: 'What is the longest river in the world?',
    options: JSON.stringify(['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'General Knowledge',
    question_text: 'Which continent has the largest human population?',
    options: JSON.stringify(['Africa', 'Europe', 'Asia', 'North America']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'General Knowledge',
    question_text: 'What instrument is used to measure atmospheric pressure?',
    options: JSON.stringify(['Thermometer', 'Barometer', 'Hygrometer', 'Anemometer']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'General Knowledge',
    question_text: 'What is the speed of light in a vacuum approximately?',
    options: JSON.stringify(['150,000 km/s', '300,000 km/s', '500,000 km/s', '1,000,000 km/s']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'General Knowledge',
    question_text: 'What official currency is used in Japan?',
    options: JSON.stringify(['Yuan', 'Yen', 'Won', 'Ringgit']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'General Knowledge',
    question_text: 'Which organ is the largest organ in the human body?',
    options: JSON.stringify(['Liver', 'Brain', 'Skin', 'Lungs']),
    correct_option: 2,
    difficulty: 'easy'
  },

  // --- CRICKET & SPORTS ---
  {
    category: 'Cricket & Sports',
    question_text: 'Who holds the record for the highest individual score in a single Test innings (400 not out)?',
    options: JSON.stringify(['Sachin Tendulkar', 'Brian Lara', 'Sir Don Bradman', 'Ricky Ponting']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'Which team won the inaugural ICC Men\'s T20 World Cup in 2007?',
    options: JSON.stringify(['Pakistan', 'Australia', 'India', 'West Indies']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'Who was the first batsman to score 100 international centuries across Test and ODI cricket?',
    options: JSON.stringify(['Virat Kohli', 'Sachin Tendulkar', 'Ricky Ponting', 'Kumar Sangakkara']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'Which country won the FIFA World Cup in 2022 held in Qatar?',
    options: JSON.stringify(['France', 'Brazil', 'Argentina', 'Croatia']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'How many regulation players are on the court for a single basketball team during play?',
    options: JSON.stringify(['5', '6', '7', '11']),
    correct_option: 0,
    difficulty: 'easy'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'Who has won the most Wimbledon Men\'s Singles tennis titles in history?',
    options: JSON.stringify(['Rafael Nadal', 'Novak Djokovic', 'Roger Federer', 'Pete Sampras']),
    correct_option: 2,
    difficulty: 'medium'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'Which country won the ICC Men\'s T20 World Cup in 2024?',
    options: JSON.stringify(['South Africa', 'England', 'India', 'Australia']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'Who hit six 6s in an over during the 2007 T20 World Cup match against Stuart Broad?',
    options: JSON.stringify(['MS Dhoni', 'Yuvraj Singh', 'Chris Gayle', 'AB de Villiers']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'How many rings make up the official Olympic Games emblem symbol?',
    options: JSON.stringify(['4', '5', '6', '7']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'Which sport is contested during the famous annual Tour de France tournament?',
    options: JSON.stringify(['Motor Racing', 'Cycling', 'Marathon Running', 'Rowing']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Cricket & Sports',
    question_text: 'Who holds the world record for the 100-meter sprint (9.58 seconds)?',
    options: JSON.stringify(['Carl Lewis', 'Usain Bolt', 'Justin Gatlin', 'Tyson Gay']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- MOVIES & ENTERTAINMENT ---
  {
    category: 'Movies & Entertainment',
    question_text: 'Which movie won the Academy Award for Best Picture at the 96th Oscars in 2024?',
    options: JSON.stringify(['Barbie', 'Oppenheimer', 'Poor Things', 'Killers of the Flower Moon']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Movies & Entertainment',
    question_text: 'Who plays the character of Tony Stark / Iron Man in the Marvel Cinematic Universe?',
    options: JSON.stringify(['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Movies & Entertainment',
    question_text: 'Which TV series features the fictional continent of Westeros?',
    options: JSON.stringify(['The Witcher', 'The Lord of the Rings', 'Game of Thrones', 'House of the Dragon']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Movies & Entertainment',
    question_text: 'Which movie is currently the highest-grossing film of all time worldwide?',
    options: JSON.stringify(['Avengers: Endgame', 'Avatar', 'Titanic', 'Star Wars: The Force Awakens']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Movies & Entertainment',
    question_text: 'Who directed the sci-fi masterpieces "Inception", "Interstellar", and "Oppenheimer"?',
    options: JSON.stringify(['Steven Spielberg', 'Christopher Nolan', 'Denis Villeneuve', 'Quentin Tarantino']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Movies & Entertainment',
    question_text: 'In the animated film "Frozen", what is the name of the lovable talking snowman?',
    options: JSON.stringify(['Sven', 'Olaf', 'Kristoff', 'Hans']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Movies & Entertainment',
    question_text: 'Which iconic sci-fi movie franchise was created by George Lucas in 1977?',
    options: JSON.stringify(['Star Trek', 'Star Wars', 'Dune', 'The Matrix']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Movies & Entertainment',
    question_text: 'Which blockbuster 2023 movie was directed by Greta Gerwig starring Margot Robbie?',
    options: JSON.stringify(['Barbie', 'La La Land', 'Mean Girls', 'Little Women']),
    correct_option: 0,
    difficulty: 'easy'
  },
  {
    category: 'Movies & Entertainment',
    question_text: 'Which Japanese animation studio created "Spirited Away" and "My Neighbor Totoro"?',
    options: JSON.stringify(['Kyoto Animation', 'Studio Ghibli', 'Toei Animation', 'MAPPA']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- DAILY NEWS & WORLD AFFAIRS ---
  {
    category: 'Daily News & World Affairs',
    question_text: 'Which space agency successfully landed the Chandrayaan-3 lunar lander near the Moon\'s south pole?',
    options: JSON.stringify(['NASA', 'ISRO', 'ESA', 'JAXA']),
    correct_option: 1,
    difficulty: 'easy',
    source: 'news'
  },
  {
    category: 'Daily News & World Affairs',
    question_text: 'Which city hosted the 2024 Summer Olympic Games?',
    options: JSON.stringify(['Tokyo', 'Paris', 'Los Angeles', 'Brisbane']),
    correct_option: 1,
    difficulty: 'easy',
    source: 'news'
  },
  {
    category: 'Daily News & World Affairs',
    question_text: 'What term describes autonomous software systems using LLMs to solve multi-step coding & web tasks?',
    options: JSON.stringify(['Agentic AI', 'Edge Logic', 'Quantum Swarm', 'Neural Render']),
    correct_option: 0,
    difficulty: 'medium',
    source: 'news'
  },
  {
    category: 'Daily News & World Affairs',
    question_text: 'Which European country officially joined NATO in 2024 as its 32nd member state?',
    options: JSON.stringify(['Finland', 'Sweden', 'Ukraine', 'Austria']),
    correct_option: 1,
    difficulty: 'medium',
    source: 'news'
  },
  {
    category: 'Daily News & World Affairs',
    question_text: 'Which city hosted the United Nations COP28 Climate Summit in late 2023?',
    options: JSON.stringify(['Dubai', 'London', 'New York', 'Paris']),
    correct_option: 0,
    difficulty: 'medium',
    source: 'news'
  },
  {
    category: 'Daily News & World Affairs',
    question_text: 'Which country hosted the world\'s first major international AI Safety Summit at Bletchley Park?',
    options: JSON.stringify(['United States', 'United Kingdom', 'Germany', 'Japan']),
    correct_option: 1,
    difficulty: 'medium',
    source: 'news'
  },
  {
    category: 'Daily News & World Affairs',
    question_text: 'Where is the global headquarters of the World Health Organization (WHO) located?',
    options: JSON.stringify(['Geneva, Switzerland', 'New York, USA', 'Vienna, Austria', 'Brussels, Belgium']),
    correct_option: 0,
    difficulty: 'easy',
    source: 'news'
  },

  // --- TECH & ARTIFICIAL INTELLIGENCE ---
  {
    category: 'Tech & AI',
    question_text: 'Which organization created ChatGPT and the GPT-4 language models?',
    options: JSON.stringify(['Google', 'OpenAI', 'Meta', 'Anthropic']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Tech & AI',
    question_text: 'What does "HTTP" stand for in web technology?',
    options: JSON.stringify([
      'HyperText Transfer Protocol',
      'High Transfer Text Program',
      'Hyperlink Terminal Test Process',
      'Host Text Transit Portal'
    ]),
    correct_option: 0,
    difficulty: 'easy'
  },
  {
    category: 'Tech & AI',
    question_text: 'Which programming language is known as the primary script engine running inside web browsers?',
    options: JSON.stringify(['Python', 'JavaScript', 'C++', 'Java']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Tech & AI',
    question_text: 'What does GPU stand for in computer hardware systems?',
    options: JSON.stringify([
      'General Processing Unit',
      'Graphics Processing Unit',
      'Global Power Utility',
      'Grid Program Unit'
    ]),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Tech & AI',
    question_text: 'Who is regarded as the father of modern computer science and artificial intelligence?',
    options: JSON.stringify(['Alan Turing', 'Ada Lovelace', 'Steve Jobs', 'Bill Gates']),
    correct_option: 0,
    difficulty: 'medium'
  },
  {
    category: 'Tech & AI',
    question_text: 'Which operating system kernel was created by Linus Torvalds in 1991?',
    options: JSON.stringify(['UNIX', 'Linux', 'MS-DOS', 'Solaris']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Tech & AI',
    question_text: 'What base number system is used in standard digital binary computer systems?',
    options: JSON.stringify(['Base 2', 'Base 8', 'Base 10', 'Base 16']),
    correct_option: 0,
    difficulty: 'easy'
  },
  {
    category: 'Tech & AI',
    question_text: 'What is the basic unit of quantum information in quantum computing?',
    options: JSON.stringify(['Bit', 'Byte', 'Qubit', 'Pixel']),
    correct_option: 2,
    difficulty: 'medium'
  },
  {
    category: 'Tech & AI',
    question_text: 'Which tech company original developer acquired and maintains the Android operating system?',
    options: JSON.stringify(['Apple', 'Microsoft', 'Google', 'Samsung']),
    correct_option: 2,
    difficulty: 'easy'
  },

  // --- SPACE & ASTRONOMY ---
  {
    category: 'Space & Astronomy',
    question_text: 'What type of galaxy is our home galaxy, the Milky Way?',
    options: JSON.stringify(['Elliptical', 'Barred Spiral', 'Irregular', 'Lenticular']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Space & Astronomy',
    question_text: 'What is the largest planet in our Solar System?',
    options: JSON.stringify(['Saturn', 'Jupiter', 'Neptune', 'Uranus']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Space & Astronomy',
    question_text: 'Which space telescope replaced Hubble as NASA\'s flagship observatory in 2021?',
    options: JSON.stringify(['Kepler', 'James Webb Space Telescope', 'Spitzer', 'Chandra']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Space & Astronomy',
    question_text: 'What boundary around a black hole marks the point of no return for light and matter?',
    options: JSON.stringify(['Event Horizon', 'Singularity', 'Photon Sphere', 'Accretion Boundary']),
    correct_option: 0,
    difficulty: 'medium'
  },
  {
    category: 'Space & Astronomy',
    question_text: 'Which star system is nearest to our Solar System at about 4.24 light-years away?',
    options: JSON.stringify(['Sirius', 'Alpha Centauri / Proxima Centauri', 'Betelgeuse', 'Vega']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Space & Astronomy',
    question_text: 'Which planet in our Solar System is famous for having the most prominent ring system?',
    options: JSON.stringify(['Jupiter', 'Saturn', 'Uranus', 'Neptune']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Space & Astronomy',
    question_text: 'Who was the first human to walk on the Moon in July 1969 during Apollo 11?',
    options: JSON.stringify(['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'Michael Collins']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Space & Astronomy',
    question_text: 'Which is the hottest planet in our Solar System despite not being closest to the Sun?',
    options: JSON.stringify(['Mercury', 'Venus', 'Mars', 'Jupiter']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- SCIENCE & NATURE ---
  {
    category: 'Science & Nature',
    question_text: 'What process do green plants use to synthesize foods from sunlight, carbon dioxide, and water?',
    options: JSON.stringify(['Respiration', 'Photosynthesis', 'Osmosis', 'Transpiration']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Science & Nature',
    question_text: 'What is the hardest natural substance known on Earth?',
    options: JSON.stringify(['Titanium', 'Diamond', 'Quartz', 'Graphene']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Science & Nature',
    question_text: 'How many bones are in the adult human body?',
    options: JSON.stringify(['186', '206', '216', '300']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Science & Nature',
    question_text: 'Which gas makes up approximately 78% of Earth\'s atmosphere?',
    options: JSON.stringify(['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Science & Nature',
    question_text: 'Which cellular structure is known as the "powerhouse of the cell"?',
    options: JSON.stringify(['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Science & Nature',
    question_text: 'Which chemical element has the chemical symbol "Fe"?',
    options: JSON.stringify(['Fluorine', 'Iron', 'Francium', 'Fermium']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Science & Nature',
    question_text: 'What mammal is the only mammal capable of true, sustained flight?',
    options: JSON.stringify(['Flying Squirrel', 'Bat', 'Sugar Glider', 'Colugo']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- HISTORY & CIVILIZATIONS ---
  {
    category: 'History & Civilizations',
    question_text: 'In which year did World War II end?',
    options: JSON.stringify(['1918', '1939', '1945', '1950']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'History & Civilizations',
    question_text: 'Which ancient civilization built the Pyramids of Giza?',
    options: JSON.stringify(['Ancient Romans', 'Ancient Greeks', 'Ancient Egyptians', 'Mayans']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'History & Civilizations',
    question_text: 'Who was the first Emperor of a unified China, famous for building the Terracotta Army?',
    options: JSON.stringify(['Qin Shi Huang', 'Kublai Khan', 'Han Wudi', 'Emperor Taizong']),
    correct_option: 0,
    difficulty: 'medium'
  },
  {
    category: 'History & Civilizations',
    question_text: 'Which famous wall split the city of Berlin during the Cold War until its fall in 1989?',
    options: JSON.stringify(['Hadrian\'s Wall', 'Berlin Wall', 'Iron Curtain', 'Maginot Line']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'History & Civilizations',
    question_text: 'Which Roman general was assassinated on the Ides of March (March 15, 44 BC)?',
    options: JSON.stringify(['Augustus', 'Julius Caesar', 'Mark Antony', 'Nero']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'History & Civilizations',
    question_text: 'In which year was the historic Magna Carta signed in England?',
    options: JSON.stringify(['1066', '1215', '1492', '1776']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'History & Civilizations',
    question_text: 'What ancient network of trade routes connected East Asia to the Mediterranean world?',
    options: JSON.stringify(['Amber Road', 'Silk Road', 'Spice Route', 'Incense Route']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- GEOGRAPHY & WONDERS ---
  {
    category: 'Geography & Wonders',
    question_text: 'What is the smallest country in the world by both area and population?',
    options: JSON.stringify(['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Geography & Wonders',
    question_text: 'In which country would you find the ancient Inca citadel of Machu Picchu?',
    options: JSON.stringify(['Brazil', 'Peru', 'Chile', 'Colombia']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Geography & Wonders',
    question_text: 'Which is the largest desert in the world by total surface area?',
    options: JSON.stringify(['Sahara Desert', 'Gobi Desert', 'Antarctic Desert', 'Arabian Desert']),
    correct_option: 2,
    difficulty: 'medium'
  },
  {
    category: 'Geography & Wonders',
    question_text: 'Which ocean is the deepest and largest on planet Earth?',
    options: JSON.stringify(['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Geography & Wonders',
    question_text: 'Which country has the longest total coastline of any nation in the world?',
    options: JSON.stringify(['Russia', 'Canada', 'Australia', 'Indonesia']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Geography & Wonders',
    question_text: 'What is the official federal capital city of Brazil?',
    options: JSON.stringify(['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador']),
    correct_option: 2,
    difficulty: 'medium'
  },
  {
    category: 'Geography & Wonders',
    question_text: 'What is the highest mountain peak above sea level on Earth?',
    options: JSON.stringify(['K2', 'Mount Kilimanjaro', 'Mount Everest', 'Denali']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Geography & Wonders',
    question_text: 'Which is the largest island in the world that is not considered a continent?',
    options: JSON.stringify(['Madagascar', 'Greenland', 'Borneo', 'New Guinea']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- MUSIC & POP CULTURE ---
  {
    category: 'Music & Pop Culture',
    question_text: 'Which legendary artist released the world\'s best-selling album of all time, "Thriller"?',
    options: JSON.stringify(['Prince', 'Michael Jackson', 'Elvis Presley', 'Madonna']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Music & Pop Culture',
    question_text: 'Which pop superstar embarked on the record-shattering "Eras Tour" in 2023-2024?',
    options: JSON.stringify(['Beyoncé', 'Taylor Swift', 'Ariana Grande', 'Lady Gaga']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Music & Pop Culture',
    question_text: 'Which K-pop group became the first South Korean act to top the US Billboard Hot 100 with "Dynamite"?',
    options: JSON.stringify(['BLACKPINK', 'BTS', 'EXO', 'SEVENTEEN']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Music & Pop Culture',
    question_text: 'Which instrument has 88 keys in a standard modern acoustic setup?',
    options: JSON.stringify(['Harp', 'Piano', 'Organ', 'Accordion']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Music & Pop Culture',
    question_text: 'Which legendary British rock group released the album "Abbey Road" in 1969?',
    options: JSON.stringify(['The Rolling Stones', 'Led Zeppelin', 'The Beatles', 'Pink Floyd']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Music & Pop Culture',
    question_text: 'Who was the lead singer of the iconic rock band Queen, born Farrokh Bulsara?',
    options: JSON.stringify(['Freddie Mercury', 'David Bowie', 'Elton John', 'Mick Jagger']),
    correct_option: 0,
    difficulty: 'easy'
  },

  // --- FOOD & GLOBAL CUISINE ---
  {
    category: 'Food & Global Cuisine',
    question_text: 'Which country is famous as the birthplace of Pizza and Pasta?',
    options: JSON.stringify(['Greece', 'France', 'Italy', 'Spain']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Food & Global Cuisine',
    question_text: 'What is the main ingredient used in traditional Japanese Miso soup?',
    options: JSON.stringify(['Fermented Soybean Paste', 'Sesame Oil', 'Rice Flour', 'Fish Sauce']),
    correct_option: 0,
    difficulty: 'medium'
  },
  {
    category: 'Food & Global Cuisine',
    question_text: 'Which spice is considered the most expensive spice in the world by weight?',
    options: JSON.stringify(['Vanilla', 'Saffron', 'Cardamom', 'Cinnamon']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Food & Global Cuisine',
    question_text: 'Which beverage is consumed the most worldwide after water?',
    options: JSON.stringify(['Coffee', 'Tea', 'Orange Juice', 'Soda']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Food & Global Cuisine',
    question_text: 'Which traditional Mexican dish consists of a folded corn or wheat tortilla filled with meats and salsa?',
    options: JSON.stringify(['Taco', 'Empanada', 'Tamale', 'Arepa']),
    correct_option: 0,
    difficulty: 'easy'
  },
  {
    category: 'Food & Global Cuisine',
    question_text: 'What iconic Spanish rice dish is cooked in a wide shallow pan with saffron and seafood/meat?',
    options: JSON.stringify(['Risotto', 'Paella', 'Jambalaya', 'Biryani']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Food & Global Cuisine',
    question_text: 'Which classic French buttery bakery item is famous for its flaky layers and crescent shape?',
    options: JSON.stringify(['Brioche', 'Croissant', 'Baguette', 'Eclair']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- GAMING & ESPORTS ---
  {
    category: 'Gaming & Esports',
    question_text: 'What is the best-selling video game of all time, surpassing 300 million copies sold?',
    options: JSON.stringify(['Tetris', 'Grand Theft Auto V', 'Minecraft', 'Wii Sports']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Gaming & Esports',
    question_text: 'Which company created the iconic Mario, Zelda, and Pokémon franchises?',
    options: JSON.stringify(['Sony', 'Nintendo', 'Sega', 'Capcom']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Gaming & Esports',
    question_text: 'In the game Fortnite, how many players enter a standard Battle Royale match?',
    options: JSON.stringify(['50', '80', '100', '150']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Gaming & Esports',
    question_text: 'Which legendary esports MOBA holds the record for the largest prize pool in esports history ("The International")?',
    options: JSON.stringify(['League of Legends', 'Dota 2', 'Counter-Strike 2', 'VALORANT']),
    correct_option: 1,
    difficulty: 'medium'
  },
  {
    category: 'Gaming & Esports',
    question_text: 'Which classic 1980 arcade game featured a yellow chomping hero navigating a maze with ghosts?',
    options: JSON.stringify(['Galaga', 'PAC-MAN', 'Space Invaders', 'Donkey Kong']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Gaming & Esports',
    question_text: 'Which home video game console is the highest-selling console of all time (over 155 million units)?',
    options: JSON.stringify(['Nintendo Switch', 'PlayStation 2', 'Xbox 360', 'PlayStation 4']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- MYTHOLOGY & LITERATURE ---
  {
    category: 'Mythology & Literature',
    question_text: 'In Greek mythology, who is the King of the Gods and ruler of Mount Olympus?',
    options: JSON.stringify(['Poseidon', 'Hades', 'Zeus', 'Apollo']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Mythology & Literature',
    question_text: 'Who wrote the legendary epic fantasy trilogy "The Lord of the Rings"?',
    options: JSON.stringify(['J.K. Rowling', 'J.R.R. Tolkien', 'George R.R. Martin', 'C.S. Lewis']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Mythology & Literature',
    question_text: 'In Norse mythology, which powerful hammer is wielded by Thor, God of Thunder?',
    options: JSON.stringify(['Excalibur', 'Mjölnir', 'Gungnir', 'Aegis']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Mythology & Literature',
    question_text: 'Who wrote the classic tragic play "Romeo and Juliet"?',
    options: JSON.stringify(['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Mythology & Literature',
    question_text: 'In Roman mythology, who is the goddess of love, beauty, and fertility?',
    options: JSON.stringify(['Minerva', 'Venus', 'Diana', 'Juno']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Mythology & Literature',
    question_text: 'Which ancient epic poem attributed to Homer describes the hero Odysseus\'s 10-year journey home?',
    options: JSON.stringify(['The Iliad', 'The Aeneid', 'The Odyssey', 'Beowulf']),
    correct_option: 2,
    difficulty: 'easy'
  },
  {
    category: 'Literature & Art',
    question_text: 'Who is the author of the best-selling "Harry Potter" fantasy book series?',
    options: JSON.stringify(['Rick Riordan', 'J.K. Rowling', 'Suzanne Collins', 'Philip Pullman']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- LITERATURE & ART ---
  {
    category: 'Literature & Art',
    question_text: 'Which Renaissance artist painted the famous masterpiece "Mona Lisa" housed in the Louvre?',
    options: JSON.stringify(['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Vincent van Gogh']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Literature & Art',
    question_text: 'Which Post-Impressionist painter created the famous masterpiece "The Starry Night"?',
    options: JSON.stringify(['Claude Monet', 'Pablo Picasso', 'Vincent van Gogh', 'Salvador Dalí']),
    correct_option: 2,
    difficulty: 'easy'
  },

  // --- BRANDS & BUSINESS ---
  {
    category: 'Brands & Business',
    question_text: 'Which iconic brand uses the famous tagline slogan "Just Do It"?',
    options: JSON.stringify(['Adidas', 'Nike', 'Puma', 'Under Armour']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Brands & Business',
    question_text: 'Which tech giant was co-founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976?',
    options: JSON.stringify(['Microsoft', 'Apple', 'IBM', 'Intel']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- CELEBRITY & MEDIA ---
  {
    category: 'Celebrity & Media',
    question_text: 'Which celebrity star host hosted "The Oprah Winfrey Show" for 25 seasons?',
    options: JSON.stringify(['Ellen DeGeneres', 'Oprah Winfrey', 'Tyra Banks', 'Kelly Ripa']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- DECADES TRIVIA (80s, 90s, 2000s) ---
  {
    category: 'Decades Trivia (80s, 90s, 2000s)',
    question_text: '[90s Trivia] Which hit sitcom featured the characters Ross, Rachel, Monica, Chandler, Joey, and Phoebe?',
    options: JSON.stringify(['Seinfeld', 'Friends', 'Frasier', 'Cheers']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'Decades Trivia (80s, 90s, 2000s)',
    question_text: '[80s Trivia] Which portable audio cassette tape player was released by Sony in 1979 and exploded in popularity in the 1980s?',
    options: JSON.stringify(['Discman', 'Walkman', 'iPod', 'Boombox']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- CONNECTIONS ROUND ---
  {
    category: 'Connections Round',
    question_text: '[Connections Round] Mercury, Venus, Earth, Mars, Jupiter: What is the hidden connection uniting these items?',
    options: JSON.stringify(['Chemical Elements', 'Solar System Planets', 'Greek Gods', 'Roman Emperors']),
    correct_option: 1,
    difficulty: 'medium'
  },

  // --- TRUE OR FALSE / MYTHBUSTERS ---
  {
    category: 'True or False / Mythbusters',
    question_text: 'Mythbusters Check: Is it True or False that Goldfish have a memory span of only 3 seconds?',
    options: JSON.stringify(['True', 'False (They have months of memory)', 'True only for wild fish', 'True only in cold water']),
    correct_option: 1,
    difficulty: 'easy'
  },
  {
    category: 'True or False / Mythbusters',
    question_text: 'True or False: The Great Wall of China is clearly visible from space with the naked eye.',
    options: JSON.stringify(['True', 'False (Common myth - not visible without lens magnification)', 'True in low orbit', 'True at night']),
    correct_option: 1,
    difficulty: 'easy'
  },

  // --- PICTURE & VISUAL ROUND ---
  {
    category: 'Picture & Visual Round',
    question_text: '[Visual Poster Identification] Which iconic sci-fi movie poster features a yellow crawling opening crawl text over space?',
    options: JSON.stringify(['Star Trek', 'Star Wars', '2001: A Space Odyssey', 'Interstellar']),
    correct_option: 1,
    difficulty: 'easy'
  }
];

async function seedQuestionsIfEmpty() {
  try {
    let seededCount = 0;
    for (const q of initialQuestions) {
      const existing = await getQuery('SELECT id FROM questions WHERE question_text = ?', [q.question_text]);
      if (!existing) {
        await runQuery(
          `INSERT INTO questions (category, question_text, options, correct_option, difficulty, source)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [q.category, q.question_text, q.options, q.correct_option, q.difficulty || 'medium', q.source || 'static']
        );
        seededCount++;
      }
    }
    if (seededCount > 0) {
      console.log(`Seeded ${seededCount} new questions across categories into SQLite database.`);
    } else {
      console.log('All seed questions are present in SQLite database.');
    }
  } catch (err) {
    console.error('Error seeding question bank:', err);
  }
}

module.exports = {
  initialQuestions,
  seedQuestionsIfEmpty
};
