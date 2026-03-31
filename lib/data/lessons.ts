export type Lesson = {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  started: boolean;
  /** Maps to a ComfyUI lesson theme in lib/lesson-themes.js */
  visualTheme?: string;
  sections: LessonSection[];
  vocabulary: VocabularyWord[];
  exercises: Exercise[];
};

export type LessonSection = {
  id: number;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive';
};

export type VocabularyWord = {
  polish: string;
  english: string;
  phonetic: string;
  exampleSentence: string;
  mastered: boolean;
};

export type Exercise = {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
};

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Polish Alphabet & Pronunciation",
    description: "Learn the Polish alphabet, special characters, and basic pronunciation rules.",
    duration: "30 min",
    difficulty: 'beginner',
    completed: true,
    started: true,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Introduction to Polish Alphabet",
        content: "The Polish alphabet has 32 letters: 9 vowels and 23 consonants. It uses the Latin script with additional diacritical marks like ą, ć, ę, ł, ń, ó, ś, ź, ż.",
        type: 'text'
      },
      {
        id: 2,
        title: "Special Characters and Sounds",
        content: "Polish has unique sounds represented by special characters. For example: 'ł' sounds like English 'w', 'ń' like 'ny' in 'canyon', 'ś' like 'sh' in 'sheep'.",
        type: 'text'
      },
      {
        id: 3,
        title: "Pronunciation Practice",
        content: "Practice repeating after native speaker: A, ą, B, C, ć, D, E, ę, F, G, H, I, J, K, L, ł, M, N, ń, O, ó, P, R, S, ś, T, U, W, Y, Z, ź, ż.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "alfabet",
        english: "alphabet",
        phonetic: "al-fa-bet",
        exampleSentence: "Polski alfabet ma 32 litery.",
        mastered: true
      },
      {
        polish: "litera",
        english: "letter",
        phonetic: "lee-te-ra",
        exampleSentence: "Ta litera to 'ł'.",
        mastered: true
      },
      {
        polish: "wymowa",
        english: "pronunciation",
        phonetic: "vi-mo-va",
        exampleSentence: "Wymowa 'ś' jest ważna.",
        mastered: true
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How many letters are in the Polish alphabet?",
        options: ["26", "32", "28", "30"],
        correctAnswer: 1,
        explanation: "The Polish alphabet has 32 letters, including 9 vowels and 23 consonants."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "The Polish letter 'ł' sounds like the English letter '___'.",
        correctAnswer: "w",
        explanation: "The letter 'ł' is pronounced like the English 'w' as in 'water'."
      }
    ]
  },
  {
    id: 2,
    title: "Greetings & Basic Phrases",
    description: "Learn essential Polish greetings, introductions, and polite expressions.",
    duration: "45 min",
    difficulty: 'beginner',
    completed: true,
    started: true,
    visualTheme: 'street_cafe',
    sections: [
      {
        id: 1,
        title: "Basic Greetings",
        content: "Common greetings in Polish: Cześć (Hello), Dzień dobry (Good day), Dobry wieczór (Good evening), Do widzenia (Goodbye).",
        type: 'text'
      },
      {
        id: 2,
        title: "Introducing Yourself",
        content: "Learn to introduce yourself: Nazywam się... (My name is...), Mam ... lat (I am ... years old), Jestem z... (I am from...).",
        type: 'text'
      },
      {
        id: 3,
        title: "Polite Expressions",
        content: "Important polite phrases: Proszę (Please), Dziękuję (Thank you), Przepraszam (Excuse me/Sorry), Nie ma za co (You're welcome).",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "cześć",
        english: "hello/hi",
        phonetic: "cheshch",
        exampleSentence: "Cześć, jak się masz?",
        mastered: true
      },
      {
        polish: "dzień dobry",
        english: "good day",
        phonetic: "jen dob-ri",
        exampleSentence: "Dzień dobry, pani Kowalska.",
        mastered: true
      },
      {
        polish: "do widzenia",
        english: "goodbye",
        phonetic: "do vee-dze-nya",
        exampleSentence: "Do widzenia, do jutra!",
        mastered: true
      },
      {
        polish: "dziękuję",
        english: "thank you",
        phonetic: "jen-koo-ye",
        exampleSentence: "Dziękuję za pomoc.",
        mastered: true
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'matching',
        question: "Match the Polish phrases with their English meanings:",
        options: ["Cześć", "Dzień dobry", "Dziękuję", "Do widzenia"],
        correctAnswer: 0,
        explanation: "Cześć = Hello, Dzień dobry = Good day, Dziękuję = Thank you, Do widzenia = Goodbye"
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "The Polish phrase for 'Thank you' is '___________'.",
        correctAnswer: "dziękuję",
        explanation: "Dziękuję is the standard way to say thank you in Polish."
      }
    ]
  },
  {
    id: 3,
    title: "Numbers 1-100",
    description: "Learn to count, tell time, and use numbers in everyday situations.",
    duration: "40 min",
    difficulty: 'beginner',
    completed: false,
    started: true,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Numbers 1-20",
        content: "Basic numbers: jeden (1), dwa (2), trzy (3), cztery (4), pięć (5), sześć (6), siedem (7), osiem (8), dziewięć (9), dziesięć (10).",
        type: 'text'
      },
      {
        id: 2,
        title: "Tens and Patterns",
        content: "Learn the pattern: dwadzieścia (20), trzydzieści (30), czterdzieści (40), pięćdziesiąt (50), etc. Notice patterns to make learning easier.",
        type: 'text'
      },
      {
        id: 3,
        title: "Practical Usage",
        content: "Using numbers for prices, ages, phone numbers, and telling time in Polish.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "jeden",
        english: "one",
        phonetic: "ye-den",
        exampleSentence: "Mam jedną książkę.",
        mastered: true
      },
      {
        polish: "pięć",
        english: "five",
        phonetic: "pyench",
        exampleSentence: "Spotkamy się za pięć minut.",
        mastered: true
      },
      {
        polish: "dziesięć",
        english: "ten",
        phonetic: "je-shench",
        exampleSentence: "Mam dziesięć lat.",
        mastered: false
      },
      {
        polish: "sto",
        english: "one hundred",
        phonetic: "sto",
        exampleSentence: "Książka kosztuje sto złotych.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "What is the Polish word for 'seven'?",
        options: ["sześć", "siedem", "osiem", "dziewięć"],
        correctAnswer: 1,
        explanation: "Siedem means seven. Sześć is six, osiem is eight, dziewięć is nine."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "The number 50 in Polish is '___________'.",
        correctAnswer: "pięćdziesiąt",
        explanation: "Pięćdziesiąt is the Polish word for fifty, following the pattern of pięć (five) + dziesiąt (tens)."
      }
    ]
  },
  {
    id: 4,
    title: "Present Tense Verbs",
    description: "Learn basic Polish verb conjugation in present tense for common actions.",
    duration: "60 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Verb Conjugation Basics",
        content: "Polish verbs change endings based on person (I, you, he/she, we, you plural, they). Learn the patterns for -ać, -eć, -ić verbs.",
        type: 'text'
      },
      {
        id: 2,
        title: "Common Regular Verbs",
        content: "Practice conjugating: czytać (to read), pisać (to write), mówić (to speak), uczyć się (to learn).",
        type: 'text'
      },
      {
        id: 3,
        title: "Irregular Verbs",
        content: "Important irregular verbs: być (to be), mieć (to have), iść (to go), wiedzieć (to know).",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "czytać",
        english: "to read",
        phonetic: "chi-tach",
        exampleSentence: "Lubię czytać książki.",
        mastered: false
      },
      {
        polish: "mówić",
        english: "to speak",
        phonetic: "moo-veech",
        exampleSentence: "Mówię po polsku.",
        mastered: false
      },
      {
        polish: "być",
        english: "to be",
        phonetic: "bich",
        exampleSentence: "Jestem studentem.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "Which is the correct conjugation of 'czytać' for 'I read'?",
        options: ["czytam", "czytasz", "czyta", "czytamy"],
        correctAnswer: 0,
        explanation: "Czytam is the first person singular form of czytać (I read)."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "The Polish verb 'to be' is '___________'.",
        correctAnswer: "być",
        explanation: "Być is the infinitive form of the verb 'to be' in Polish."
      }
    ]
  },
  {
    id: 5,
    title: "Food & Restaurant Vocabulary",
    description: "Learn vocabulary for food, drinks, ordering in restaurants, and Polish cuisine.",
    duration: "50 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Common Foods",
        content: "Learn names of fruits, vegetables, meats, dairy products, and Polish specialties like pierogi, bigos, żurek.",
        type: 'text'
      },
      {
        id: 2,
        title: "Restaurant Phrases",
        content: "Useful phrases for dining: Poproszę... (I would like...), Rachunek proszę (Check please), Czy mogę zobaczyć menu? (Can I see the menu?)",
        type: 'text'
      },
      {
        id: 3,
        title: "Polish Cuisine",
        content: "Introduction to traditional Polish dishes and dining customs.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "chleb",
        english: "bread",
        phonetic: "hlep",
        exampleSentence: "Kup chleb w piekarni.",
        mastered: false
      },
      {
        polish: "woda",
        english: "water",
        phonetic: "vo-da",
        exampleSentence: "Poproszę wodę mineralną.",
        mastered: false
      },
      {
        polish: "pierogi",
        english: "dumplings",
        phonetic: "pye-ro-ghee",
        exampleSentence: "Lubię pierogi z mięsem.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'matching',
        question: "Match Polish food items with their English translations:",
        options: ["chleb", "woda", "pierogi", "ser"],
        correctAnswer: 0,
        explanation: "chleb = bread, woda = water, pierogi = dumplings, ser = cheese"
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "The Polish word for 'water' is '___________'.",
        correctAnswer: "woda",
        explanation: "Woda means water, both drinking water and water in general."
      }
    ]
  },
  {
    id: 6,
    title: "Asking for Directions",
    description: "Learn how to ask for and give directions, understand location prepositions.",
    duration: "55 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Direction Phrases",
        content: "Key phrases: Gdzie jest...? (Where is...?), Jak dojść do...? (How to get to...?), Proszę mi pokazać na mapie (Please show me on the map).",
        type: 'text'
      },
      {
        id: 2,
        title: "Location Prepositions",
        content: "Learn prepositions: w (in), na (on), przy (at/near), obok (next to), między (between), za (behind).",
        type: 'text'
      },
      {
        id: 3,
        title: "Practice Dialogues",
        content: "Interactive dialogues for asking directions to common places like train station, hotel, restaurant, museum.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "gdzie",
        english: "where",
        phonetic: "gdje",
        exampleSentence: "Gdzie jest dworzec?",
        mastered: false
      },
      {
        polish: "prosto",
        english: "straight",
        phonetic: "pros-to",
        exampleSentence: "Idź prosto przez pięć minut.",
        mastered: false
      },
      {
        polish: "skręć",
        english: "turn",
        phonetic: "skrench",
        exampleSentence: "Skręć w lewo na skrzyżowaniu.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How do you say 'Where is the station?' in Polish?",
        options: ["Kiedy jest pociąg?", "Gdzie jest dworzec?", "Ile kosztuje bilet?", "Która jest godzina?"],
        correctAnswer: 1,
        explanation: "Gdzie jest dworzec? means 'Where is the station?'"
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "The Polish word for 'straight' (as in 'go straight') is '___________'.",
        correctAnswer: "prosto",
        explanation: "Prosto means straight, used in directions like 'idź prosto' (go straight)."
      }
    ]
  },
  {
    id: 7,
    title: "Days of the Week & Time",
    description: "Learn the days of the week, months, seasons, and how to tell time in Polish.",
    duration: "40 min",
    difficulty: 'beginner',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Days of the Week",
        content: "Polish days: poniedziałek (Monday), wtorek (Tuesday), środa (Wednesday), czwartek (Thursday), piątek (Friday), sobota (Saturday), niedziela (Sunday). Note: days are not capitalised in Polish.",
        type: 'text'
      },
      {
        id: 2,
        title: "Months & Seasons",
        content: "Months: styczeń (January), luty (February), marzec (March), kwiecień (April), maj (May), czerwiec (June), lipiec (July), sierpień (August), wrzesień (September), październik (October), listopad (November), grudzień (December). Seasons: wiosna (spring), lato (summer), jesień (autumn), zima (winter).",
        type: 'text'
      },
      {
        id: 3,
        title: "Telling Time",
        content: "Key phrases: Która godzina? (What time?), Jest piąta (It's 5 o'clock), Jest wpół do szóstej (It's half past five / 5:30). Note: Poles use the 24-hour clock in official contexts but 12-hour in conversation.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "poniedziałek",
        english: "Monday",
        phonetic: "po-nye-dzya-wek",
        exampleSentence: "W poniedziałek mam zajęcia.",
        mastered: false
      },
      {
        polish: "godzina",
        english: "hour / o'clock",
        phonetic: "go-dzhi-na",
        exampleSentence: "Która godzina? Jest ósma.",
        mastered: false
      },
      {
        polish: "wiosna",
        english: "spring",
        phonetic: "vyo-sna",
        exampleSentence: "Wiosna jest piękna w Polsce.",
        mastered: false
      },
      {
        polish: "dzisiaj",
        english: "today",
        phonetic: "dzhi-shay",
        exampleSentence: "Dzisiaj jest środa.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How do you say 'Monday' in Polish?",
        options: ["wtorek", "poniedziałek", "środa", "piątek"],
        correctAnswer: 1,
        explanation: "Poniedziałek is Monday. Wtorek is Tuesday, środa is Wednesday, piątek is Friday."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "The season between winter and summer is '___________' (spring).",
        correctAnswer: "wiosna",
        explanation: "Wiosna means spring. The four seasons are: wiosna (spring), lato (summer), jesień (autumn), zima (winter)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "How do you say 'Która godzina?' in English?",
        options: ["What day is it?", "What time is it?", "Which month?", "What year?"],
        correctAnswer: 1,
        explanation: "Która godzina? means 'What time is it?'. For 'what day', use 'Jaki jest dzień?'"
      }
    ]
  },
  {
    id: 8,
    title: "Family Members",
    description: "Learn Polish vocabulary for family relationships, describing your family, and possessive phrases.",
    duration: "45 min",
    difficulty: 'beginner',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Immediate Family",
        content: "Core family: mama (mother/mom), tata (father/dad), siostra (sister), brat (brother), dziecko (child), syn (son), córka (daughter). Note: Polish family terms are the same for mother/father and mom/dad.",
        type: 'text'
      },
      {
        id: 2,
        title: "Extended Family",
        content: "Extended family: babcia (grandmother), dziadek (grandfather), wujek (uncle), ciotka (aunt), kuzyn (cousin), siostrzenica (niece), bratanek (nephew).",
        type: 'text'
      },
      {
        id: 3,
        title: "Talking About Your Family",
        content: "Practice: Mam dwójkę dzieci. (I have two children.) To jest moja siostra. (This is my sister.) Ona ma na imię Anna. (Her name is Anna.) Use 'mój/moja/moje' for 'my' (agrees in gender: mój tata, moja mama, moje dziecko).",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "mama",
        english: "mother / mom",
        phonetic: "ma-ma",
        exampleSentence: "Moja mama pracuje w szkole.",
        mastered: false
      },
      {
        polish: "tata",
        english: "father / dad",
        phonetic: "ta-ta",
        exampleSentence: "Mój tata lubi gotować.",
        mastered: false
      },
      {
        polish: "siostra",
        english: "sister",
        phonetic: "shos-tra",
        exampleSentence: "Mam jedną siostrę.",
        mastered: false
      },
      {
        polish: "dziadek",
        english: "grandfather",
        phonetic: "dzha-dek",
        exampleSentence: "Dziadek mieszka w górach.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "What does 'siostra' mean?",
        options: ["brother", "sister", "daughter", "cousin"],
        correctAnswer: 1,
        explanation: "Siostra means sister. Brat means brother, córka means daughter, kuzyn means cousin."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Babcia' means '___________' (grandmother).",
        correctAnswer: "grandmother",
        explanation: "Babcia is grandmother. The male equivalent is dziadek (grandfather). Both are often used as terms of endearment."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "How do you say 'My mom' in Polish?",
        options: ["Mój tata", "Moja mama", "Moje dziecko", "Twój brat"],
        correctAnswer: 1,
        explanation: "Moja mama means 'my mom'. Mój is used with masculine nouns, moja with feminine, moje with neuter."
      }
    ]
  },
  {
    id: 9,
    title: "Colors & Describing Things",
    description: "Learn Polish colour names, adjectives, and how to describe objects, people, and places.",
    duration: "40 min",
    difficulty: 'beginner',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Colour Vocabulary",
        content: "Polish colours: biały (white), czarny (black), czerwony (red), niebieski (blue), zielony (green), żółty (yellow), pomarańczowy (orange), różowy (pink), szary (grey), brązowy (brown). Colours are adjectives and agree with the noun they modify.",
        type: 'text'
      },
      {
        id: 2,
        title: "Describing Size, Shape & Character",
        content: "Size: duży (big), mały (small), wysoki (tall), niski (short). Shape: okrągły (round), kwadratowy (square). Character: ładny (pretty), brzydki (ugly), miły (nice), sympatyczny (friendly).",
        type: 'text'
      },
      {
        id: 3,
        title: "Building Descriptive Sentences",
        content: "Polish adjective order is flexible but adjectives typically come before the noun: 'biały kot' (white cat). For people, use: 'On jest wysoki.' (He is tall.) 'Ona ma niebieskie oczy.' (She has blue eyes.) Note: colours as predicates don't change gender.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "biały",
        english: "white",
        phonetic: "bya-wi",
        exampleSentence: "Kot jest biały.",
        mastered: false
      },
      {
        polish: "niebieski",
        english: "blue",
        phonetic: "nye-bye-ski",
        exampleSentence: "Niebieskie morze jest piękne.",
        mastered: false
      },
      {
        polish: "duży",
        english: "big / large",
        phonetic: "doo-zhi",
        exampleSentence: "To jest duży dom.",
        mastered: false
      },
      {
        polish: "ładny",
        english: "pretty / handsome",
        phonetic: "wad-ni",
        exampleSentence: "Ładny dzień dziś jest.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "What colour is 'zielony'?",
        options: ["red", "yellow", "green", "blue"],
        correctAnswer: 2,
        explanation: "Zielony means green. Czerwony is red, żółty is yellow, niebieski is blue."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Wysoki' means '___________' (tall).",
        correctAnswer: "tall",
        explanation: "Wysoki means tall (for people/objects). Its opposite is niski (short/low)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "How do you say 'The cat is white' in Polish?",
        options: ["Kot ma biały.", "Kot jest biały.", "Biały jest kot.", "Kot biały."],
        correctAnswer: 1,
        explanation: "'Kot jest biały' literally means 'The cat is white.' In Polish, colours as predicates (after 'jest') are adjectives and remain in the masculine form for animals and things."
      }
    ]
  },
  {
    id: 10,
    title: "Shopping & Clothing",
    description: "Learn vocabulary for shopping, clothing items, sizes, and bargaining in Polish stores.",
    duration: "50 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Clothing Vocabulary",
        content: "Clothing items: koszulka (t-shirt), spodnie (trousers), sukienka (dress), kurtka (jacket), buty (shoes), czapka (hat), skarpetki (socks), pasek (belt). Polish clothing shopping uses European sizes.",
        type: 'text'
      },
      {
        id: 2,
        title: "Shopping Phrases",
        content: "Useful phrases: Ile to kosztuje? (How much does it cost?), Czy jest tańszy? (Is there something cheaper?), Może być. (I'll take it / That'll do.), Czy mogę przymierzyć? (Can I try it on?). Price negotiation is uncommon in Polish shops but acceptable at markets.",
        type: 'text'
      },
      {
        id: 3,
        title: "At the Checkout",
        content: "Checkout phrases: Płacę kartą (I pay by card), Płacę gotówką (I pay cash), Poproszę paragon (A receipt please), Czy przyjmujecie karty? (Do you accept cards?). Paragon (receipt) is important for tax reasons in Poland.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "koszulka",
        english: "t-shirt",
        phonetic: "ko-shool-ka",
        exampleSentence: "Kupiłem czerwoną koszulkę.",
        mastered: false
      },
      {
        polish: "spodnie",
        english: "trousers / pants",
        phonetic: "spod-nye",
        exampleSentence: "Te spodnie są za duże.",
        mastered: false
      },
      {
        polish: "ile to kosztuje",
        english: "how much does it cost",
        phonetic: "ee-le to kosh-too-ye",
        exampleSentence: "Ile to kosztuje? — Dwadzieścia złotych.",
        mastered: false
      },
      {
        polish: "płacić",
        english: "to pay",
        phonetic: "pwa-chich",
        exampleSentence: "Płacę kartą.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How do you ask 'How much does it cost?' in Polish?",
        options: ["Co to jest?", "Ile to kosztuje?", "Czy jest nowy?", "Gdzie jest sklep?"],
        correctAnswer: 1,
        explanation: "Ile to kosztuje? means 'How much does it cost?'. Co to jest? means 'What is this?'"
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Kurtka' means '___________' (jacket).",
        correctAnswer: "jacket",
        explanation: "Kurtka is a jacket. Other clothing: koszulka (t-shirt), spodnie (trousers), sukienka (dress)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "Which phrase means 'I pay by card'?",
        options: ["Płacę gotówką.", "Płacę kartą.", "Ile kosztuje?", "Dziękuję."],
        correctAnswer: 1,
        explanation: "Płacę kartą means 'I pay by card.' Płacę gotówką means 'I pay cash.'"
      }
    ]
  },
  {
    id: 11,
    title: "Travel & Transportation",
    description: "Navigate Polish transportation — trains, buses, taxis, airports, and booking tickets.",
    duration: "55 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Public Transport",
        content: "Key vocabulary: pociąg (train), autobus (bus), tramwaj (tram), metro (metro/subway), taksówka (taxi). Polish trains: PKP (national rail), Polregio (regional). City transport uses one ticket for tram + bus transfers within 20–90 minutes.",
        type: 'text'
      },
      {
        id: 2,
        title: "Buying Tickets",
        content: "Useful phrases: Bilet do... proszę (A ticket to... please), O której odjeżdża pociąg? (What time does the train leave?), Czy jest rezerwacja? (Is there a reservation?), W jedną stronę / w obie strony (one way / round trip). Online: pkp.pl for train bookings.",
        type: 'text'
      },
      {
        id: 3,
        title: "At the Station & Airport",
        content: "Station vocabulary: Peron (platform), kasownik (ticket validator), przesiadka (connection/transfer), opóźnienie (delay). Airport: lotnisko (airport), odprawa (check-in), bramka (gate), bagaż (luggage), podróż służbowa (business trip), wakacje (holiday).",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "pociąg",
        english: "train",
        phonetic: "po-chonk",
        exampleSentence: "Pociąg do Krakowa odjeżdża o szóstej.",
        mastered: false
      },
      {
        polish: "bilet",
        english: "ticket",
        phonetic: "bi-let",
        exampleSentence: "Kupiłem bilet na autobus.",
        mastered: false
      },
      {
        polish: "peron",
        english: "platform",
        phonetic: "pe-ron",
        exampleSentence: "Peron numer trzy.",
        mastered: false
      },
      {
        polish: "odprawa",
        english: "check-in",
        phonetic: "od-pra-va",
        exampleSentence: "Odprawa bagażowa zaczyna się o piątej.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How do you say 'train' in Polish?",
        options: ["autobus", "pociąg", "tramwaj", "samolot"],
        correctAnswer: 1,
        explanation: "Pociąg means train. Autobus is bus, tramwaj is tram, samolot is airplane."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'W jedną stronę' means '___________' (one way / one direction).",
        correctAnswer: "one way",
        explanation: "W jedną stronę is 'one way' (a single journey). The opposite is 'w obie strony' (round trip / both ways)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "What does 'opóźnienie' mean?",
        options: ["connection", "platform", "delay", "ticket"],
        correctAnswer: 2,
        explanation: "Opóźnienie means delay. Przesiadka is connection, peron is platform, bilet is ticket."
      }
    ]
  },
  {
    id: 12,
    title: "Weather & Seasons",
    description: "Talk about weather conditions, seasons, and make small talk about the Polish climate.",
    duration: "40 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Weather Conditions",
        content: "Polish weather vocabulary: pada deszcz (it's raining), śnieg (snow), słońce (sun), chmury (clouds), wiatr (wind), burza (storm), mgła (fog). Temperature: jest ciepło (it's warm), jest zimno (it's cold), jest gorąco (it's hot), jest chłodno (it's cool).",
        type: 'text'
      },
      {
        id: 2,
        title: "Talking About the Weather",
        content: "Common phrases: Jaka jest pogoda? (What's the weather like?), Prognoza pogody (weather forecast), Dziś jest ładnie (It's nice today). Small talk opener: Piękny dzień, prawda? (Beautiful day, isn't it?). Poles often discuss weather — it's a safe, neutral topic.",
        type: 'text'
      },
      {
        id: 3,
        title: "Polish Climate quirks",
        content: "Poland has four distinct seasons. Winters can be cold (-10°C is normal) and summers warm (25–35°C). 'Jesień' (autumn) is called Polish winter's starter — grey, rainy from October. Polish spring is brief. Weather conversation is a genuine social skill in Poland.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "pogoda",
        english: "weather",
        phonetic: "po-go-da",
        exampleSentence: "Jaka jest dzisiaj pogoda?",
        mastered: false
      },
      {
        polish: "deszcz",
        english: "rain",
        phonetic: "deshch",
        exampleSentence: "Pada deszcz od rana.",
        mastered: false
      },
      {
        polish: "ciepło",
        english: "warm / hot",
        phonetic: "chep-wo",
        exampleSentence: "Dzisiaj jest ciepło i słonecznie.",
        mastered: false
      },
      {
        polish: "śnieg",
        english: "snow",
        phonetic: "shnyek",
        exampleSentence: "Zimą pada śnieg.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How do you say 'It's raining' in Polish?",
        options: ["Pada śnieg.", "Pada deszcz.", "Jest słonecznie.", "Jest zimno."],
        correctAnswer: 1,
        explanation: "Pada deszcz means 'it's raining.' Pada śnieg is 'it's snowing', jest słonecznie is 'it's sunny', jest zimno is 'it's cold'."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Ciepło' means '___________' (warm).",
        correctAnswer: "warm",
        explanation: "Ciepło means warm/hot (pleasant temperature). Jest ciepło = it's warm. Zimno is cold, gorąco is very hot."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "What does 'Prognoza pogody' mean?",
        options: ["Weather report", "Weather forecast", "Weather condition", "Weather app"],
        correctAnswer: 1,
        explanation: "Prognoza pogody means weather forecast. Pogoda by itself means weather. Prognoza means forecast."
      }
    ]
  },
  {
    id: 13,
    title: "Health & Body Parts",
    description: "Learn body part vocabulary, describe symptoms, and navigate healthcare situations in Poland.",
    duration: "50 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Body Parts",
        content: "Key vocabulary: głowa (head), oczy (eyes), uszy (ears), nos (nose), usta (mouth), ręka (hand/arm), noga (leg/foot), serce (heart), żołądek (stomach). Note: 'noga' means both leg and foot in Polish, and 'ręka' means both hand and arm.",
        type: 'text'
      },
      {
        id: 2,
        title: "At the Doctor",
        content: "Useful phrases: Boli mnie... (I have pain in...), Czuję się źle (I feel unwell), Mam gorączkę (I have a fever), Czy to poważne? (Is it serious?). Polish doctors often ask: Co panu/pani dolega? (What bothers you?). Have your PESEL (national ID number) ready.",
        type: 'text'
      },
      {
        id: 3,
        title: "Pharmacy & Medicines",
        content: "Pharmacy: apteka. Common phrases: Mam ból głowy (I have a headache), Potrzebuję lekarstwo na... (I need medicine for...). Polish pharmacies (apteka) are widely available. Many medicines are available over the counter, but some require a prescription (recepta).",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "głowa",
        english: "head",
        phonetic: "gwo-va",
        exampleSentence: "Bolí mnie głowa.",
        mastered: false
      },
      {
        polish: "żołądek",
        english: "stomach",
        phonetic: "zho-won-dek",
        exampleSentence: "Mam ból żołądka.",
        mastered: false
      },
      {
        polish: "gorączka",
        english: "fever",
        phonetic: "go-ronch-ka",
        exampleSentence: "Mam wysoką gorączkę.",
        mastered: false
      },
      {
        polish: "apteka",
        english: "pharmacy",
        phonetic: "ap-te-ka",
        exampleSentence: "Apteka jest na rogu ulicy.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How do you say 'I have a headache' in Polish?",
        options: ["Bolą mnie nogi.", "Bolí mnie głowa.", "Mam kaszel.", "Jestem chory."],
        correctAnswer: 1,
        explanation: "Bolí mnie głowa literally means 'Head hurts me' — the standard Polish way to express headache. 'Bolą mnie nogi' means 'my legs hurt', 'mam kaszel' means 'I have a cough'."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "The Polish word for 'pharmacy' is '___________'.",
        correctAnswer: "apteka",
        explanation: "Apteka is pharmacy. You can find them on almost every street corner in Polish cities."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "What does 'Mam gorączkę' mean?",
        options: ["I have a cough.", "I have a headache.", "I have a fever.", "I feel dizzy."],
        correctAnswer: 2,
        explanation: "Mam gorączkę means 'I have a fever.' Gorączka literally means heat/fever. If you feel generally unwell, say 'Czuję się źle'."
      }
    ]
  },
  {
    id: 14,
    title: "Polish Grammar: Cases",
    description: "Understand the seven Polish grammatical cases and how they change article meaning.",
    duration: "75 min",
    difficulty: 'advanced',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Why Polish Cases Matter",
        content: "Polish has 7 grammatical cases: Mianownik (Nominative), Dopełniacz (Genitive), Celownik (Dative), Biernik (Accusative), Narzędnik (Instrumental), Miejscownik (Locative), and Wołacz (Vocative). Unlike English, word order is flexible because cases show grammatical role. For example: 'Ja widzę psa' = I see a dog; 'Pies widzi mnie' = The dog sees me — the case ending on 'psa' (genitive) vs 'pies' (nominative) tells us who sees whom.",
        type: 'text'
      },
      {
        id: 2,
        title: "Genitive — possession and negation",
        content: "The genitive case (dopełniacz) is used for possession and negation. For masculine nouns: 'książka' (book, nom.) → 'książki' (gen.). Example: 'To jest książka' (This is a book, nom.) → 'Nie mam książki' (I don't have a book, gen.). Negation almost always triggers genitive: 'Nie widzę kota' (I don't see the cat, gen. 'kota').",
        type: 'text'
      },
      {
        id: 3,
        title: "Accusative — direct objects",
        content: "The accusative case (biernik) marks the direct object of a verb. For animate masculine nouns: 'Widzę psa' (I see the dog). For inanimate masculine and neuter: form often equals nominative. For feminine: 'Widzę kobietę' (I see the woman) — note the '-ę' ending instead of '-a'. Example: 'Czytam książkę' (I read the book, accusative 'książkę').",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "mianownik",
        english: "nominative case",
        phonetic: "mya-no-vnik",
        exampleSentence: "Mianownik jest pierwszym przypadkiem.",
        mastered: false
      },
      {
        polish: "dopełniacz",
        english: "genitive case",
        phonetic: "do-pel-nyanch",
        exampleSentence: "Używamy dopełniacza po przeczeniu 'nie mam'.",
        mastered: false
      },
      {
        polish: "przypadek",
        english: "grammatical case",
        phonetic: "pris-pa-dek",
        exampleSentence: "Polski ma siedem przypadków.",
        mastered: false
      },
      {
        polish: "odmiana",
        english: "conjugation/declension",
        phonetic: "od-mya-na",
        exampleSentence: "Odmiana czasownika 'być' jest nieregularna.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "Which case is used after negation ('nie mam')?",
        options: ["Nominative", "Genitive", "Accusative", "Dative"],
        correctAnswer: 1,
        explanation: "The genitive case is used after negation. 'Nie mam książki' (I don't have a book) uses genitive 'książki'. Compare: 'Mam książkę' (I have a book) uses accusative."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "Polish has ____________ grammatical cases (number).",
        correctAnswer: "7",
        explanation: "Polish has 7 grammatical cases. They are: Mianownik (Nominative), Dopełniacz (Genitive), Celownik (Dative), Biernik (Accusative), Narzędnik (Instrumental), Miejscownik (Locative), and Wołacz (Vocative)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "In 'Widzę kobietę', what case is 'kobietę'?",
        options: ["Nominative", "Genitive", "Accusative", "Vocative"],
        correctAnswer: 2,
        explanation: "'Kobietę' is accusative. The feminine accusative ending '-ę' replaces the nominative '-a': kobieta → kobietę. This marks 'woman' as the direct object of 'widzę' (I see)."
      }
    ]
  },
  {
    id: 15,
    title: "Technology & Internet",
    description: "Talk about technology, use computers, browse the internet, and handle tech problems in Polish.",
    duration: "45 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Basic Tech Vocabulary",
        content: "Key words: komputer (computer), telefon (phone), laptop (laptop), internet (internet), strona (website), hasło (password), e-mail (email). Polish tech vocabulary is often similar to English with slight adaptations: 'smartfon' (smartphone), 'tablet' (tablet), 'Wi-Fi' (Wi-Fi).",
        type: 'text'
      },
      {
        id: 2,
        title: "Online Activities",
        content: "Useful phrases: Szukam informacji o... (I'm looking for info about...), Chcę pobrać aplikację (I want to download an app), Czy jest dostęp do Wi-Fi? (Is there Wi-Fi access?), Mój internet nie działa (My internet isn't working). Poland has excellent internet coverage in cities.",
        type: 'text'
      },
      {
        id: 3,
        title: "Tech Problems & Support",
        content: "Common phrases: Komputer się zawiesił (The computer froze), Ekran jest czarny (The screen is black), Nie pamiętam hasła (I don't remember the password), Jak się zalogować? (How do I log in?). For tech support: 'Czy może mi pan/pani pomóc?' (Can you help me, sir/ma'am?).",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "internet",
        english: "internet",
        phonetic: "in-ter-net",
        exampleSentence: "Internet w Polsce jest bardzo szybki.",
        mastered: false
      },
      {
        polish: "hasło",
        english: "password",
        phonetic: "has-wo",
        exampleSentence: "Nie pamiętam mojego hasła.",
        mastered: false
      },
      {
        polish: "pobierać",
        english: "to download",
        phonetic: "po-bye-ra-ch",
        exampleSentence: "Chcę pobrać tę aplikację.",
        mastered: false
      },
      {
        polish: "zalogować się",
        english: "to log in",
        phonetic: "za-lo-go-va-ch she",
        exampleSentence: "Musisz się zalogować, żeby mieć dostęp.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How do you say 'password' in Polish?",
        options: ["login", "hasło", "ekran", "aplikacja"],
        correctAnswer: 1,
        explanation: "Hasło means password. It's used in tech contexts and beyond — a password to a building, a access code, etc."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Zalogować się' means '___________' (to log in).",
        correctAnswer: "to log in",
        explanation: "Zalogować się means 'to log in'. The reflexive 'się' makes it reciprocal. The opposite is 'wylogować się' (to log out)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "What does 'Mój internet nie działa' mean?",
        options: ["My computer is slow.", "My internet isn't working.", "The Wi-Fi is off.", "I need a new phone."],
        correctAnswer: 1,
        explanation: "'Mój internet nie działa' means 'My internet isn't working.' 'Nie działa' means 'doesn't work/isn't functioning' — used for devices, machines, and services."
      }
    ]
  },
  {
    id: 16,
    title: "Phone Calls & Messaging",
    description: "Handle phone conversations, leave messages, text in Polish, and choose between formal and informal speech.",
    duration: "45 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Answering the Phone",
        content: "Polish phone etiquette: When answering, Poles usually say 'Słucham?' or 'Tak, proszę?' (formal) or just 'Cześć?' (informal). To ask for someone: 'Czy mogę rozmawiać z...?' (Can I speak with...?). If the person isn't available: 'Niestety, nie ma go/jej' (Unfortunately, he/she isn't here).",
        type: 'text'
      },
      {
        id: 2,
        title: "Leaving Messages",
        content: "To leave a message: 'Proszę zostawić wiadomość' (Please leave a message). Useful phrases: 'Odezwę się' (I'll get back to you), 'Zadzwonię później' (I'll call later), 'Może pan/pani do mnie zadzwonić?' (Can you call me?). When texting: 'Odezwij się' (Get in touch), 'Napisz do mnie' (Write to me).",
        type: 'text'
      },
      {
        id: 3,
        title: "Formal vs Informal on the Phone",
        content: "Phone calls require careful formality choice. Use 'Pan/Pani' (Sir/Ma'am) with strangers: 'Czy mogę rozmawiać z panem Kowalskim?' (Can I speak with Mr. Kowalski?). Use first names with friends. If you start informal with a stranger, it can seem rude — start formal and let them invite informality. If calling a business, always start formal.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "słucham",
        english: "speaking (phone answer)",
        phonetic: "swu-ham",
        exampleSentence: "Słucham, kto mówi?",
        mastered: false
      },
      {
        polish: "zadzwonię",
        english: "I will call",
        phonetic: "zadz-vo-nye",
        exampleSentence: "Zadzwonię do ciebie jutro.",
        mastered: false
      },
      {
        polish: "wiadomość",
        english: "message",
        phonetic: "vya-do-moshch",
        exampleSentence: "Zostawiłem ci wiadomość na WhatsApp.",
        mastered: false
      },
      {
        polish: "numer telefonu",
        english: "phone number",
        phonetic: "no-mer te-le-fo-nu",
        exampleSentence: "Jaki jest twój numer telefonu?",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "What do you typically say when answering the phone formally in Polish?",
        options: ["Cześć!", "Słucham?", "Halo, kto tam?", "Dzień dobry, mówię."],
        correctAnswer: 1,
        explanation: "'Słucham?' (literally 'I'm listening?') is the standard formal phone answer in Polish. 'Cześć!' is informal. 'Dzień dobry' can be used but 'Słucham?' is more distinctly phone-related."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Zadzwonię' means '___________' (I will call).",
        correctAnswer: "I will call",
        explanation: "Zadzwonię is the first person singular future of 'zadzwonić' (to call). Zadzwonię do ciebie = I'll call you. The verb comes from 'dzwonić' (to ring)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "How do you say 'Can I speak with Mr. Kowalski?' formally?",
        options: ["Czy mogę rozmawiać z Kowalskim?", "Czy mogę rozmawiać z panem Kowalskim?", "Czy jest pan Kowalski?", "Zadzwoń do Kowalskiego."],
        correctAnswer: 1,
        explanation: "'Czy mogę rozmawiać z panem Kowalskim?' is the formal version. 'Pan' (Mr./Sir) must be used in formal phone contexts. Using just the surname without 'pan' is too direct; using first name only is informal."
      }
    ]
  },
  {
    id: 17,
    title: "Jobs & Careers",
    description: "Talk about professions, workplaces, describe your job, and understand Polish work culture.",
    duration: "50 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Professions",
        content: "Common jobs: lekarz (doctor), nauczyciel (teacher), inżynier (engineer), prawnik (lawyer), kelner (waiter), kierowca (driver), policjant (police officer), strażak (firefighter), artysta (artist), programista (programmer). Women's versions often end in -ka: lekarka, nauczycielka, prawniczka.",
        type: 'text'
      },
      {
        id: 2,
        title: "Workplaces & Work Life",
        content: "Places of work: biuro (office), fabryka (factory), szpital (hospital), sklep (shop), restauracja (restaurant). Useful phrases: Gdzie pracujesz? (Where do you work?), Kim jesteś z zawodu? (What is your profession?), Ile zarabiasz? (How much do you earn? — can be considered personal).",
        type: 'text'
      },
      {
        id: 3,
        title: "Polish Work Culture",
        content: "Polish work culture values punctuality (nie punktualny = not punctual = very negative), hierarchy, and formal titles. Use 'pan/pani' with colleagues until invited otherwise. 'Praca' means work/job. 'Zatrudniony' means employed. Unemployment in Poland is relatively low. Working hours are typically 8:00–16:00 Monday to Friday, with some flex.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "praca",
        english: "work / job",
        phonetic: "pra-tsa",
        exampleSentence: "Szukam pracy w Krakowie.",
        mastered: false
      },
      {
        polish: "biuro",
        english: "office",
        phonetic: "byu-ro",
        exampleSentence: "Pracuję w biurze w centrum miasta.",
        mastered: false
      },
      {
        polish: "zarabiać",
        english: "to earn",
        phonetic: "za-ra-bya-ch",
        exampleSentence: "Ile zarabiasz miesięcznie?",
        mastered: false
      },
      {
        polish: "pracownik",
        english: "employee",
        phonetic: "pra-tso-vnik",
        exampleSentence: "Jestem nowym pracownikiem w tej firmie.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "What is the feminine form of 'nauczyciel' (teacher)?",
        options: ["nauczycielka", "nauczycielowa", "nauczycielnia", "nauczycielnica"],
        correctAnswer: 0,
        explanation: "The feminine form is 'nauczycielka'. Polish forms many female professional titles by adding '-ka': lekarz → lekarka, prawnik → prawniczka, kierowca → kierowczyni (irregular)."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Biuro' means '___________' (office).",
        correctAnswer: "office",
        explanation: "Biuro is an office. A 'pracownik biurowy' is an office worker. 'Biuro' can also mean agency (e.g., 'biuro podróży' = travel agency)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "How do you ask 'Where do you work?' in Polish?",
        options: ["Gdzie mieszkasz?", "Gdzie pracujesz?", "Co robisz?", "Ile zarabiasz?"],
        correctAnswer: 1,
        explanation: "'Gdzie pracujesz?' means 'Where do you work?' — 'pracujesz' is the second person singular of 'pracować' (to work). 'Gdzie mieszkasz?' means 'Where do you live?', 'Co robisz?' means 'What do you do?', 'Ile zarabiasz?' means 'How much do you earn?'"
      }
    ]
  },
  {
    id: 18,
    title: "Housing & Daily Life",
    description: "Talk about homes, apartments, rooms, and daily routines in Polish.",
    duration: "50 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Types of Housing",
        content: "Polish housing vocabulary: mieszkanie (apartment), dom (house), pokój (room), akademik (student dormitory), pensjonat (guesthouse). Most Poles live in apartments (blok/mieszkanie) in cities; houses are more common in suburbs and rural areas. 'Blok' refers specifically to large multi-apartment buildings — a defining feature of Polish cities.",
        type: 'text'
      },
      {
        id: 2,
        title: "Rooms & Furniture",
        content: "Room names: kuchnia (kitchen), łazienka (bathroom), sypialnia (bedroom), salon (living room), przedpokój (hallway), balkon (balcony), piwnica (basement/cellar). Common furniture: łóżko (bed), stół (table), krzesło (chair), sofa/kanapa (sofa), szafa (wardrobe), biurko (desk).",
        type: 'text'
      },
      {
        id: 3,
        title: "Daily Routines",
        content: "Daily routine phrases: Wstaję o siódmej (I get up at seven), Idę do pracy (I go to work), Jem śniadanie (I eat breakfast), Kąpię się (I bathe). Poles typically eat three main meals: śniadanie (breakfast, around 7-9am), obiad (the main hot meal, around 2-4pm), kolacja (light evening meal, around 6-8pm).",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "mieszkanie",
        english: "apartment",
        phonetic: "mye-shka-nye",
        exampleSentence: "Mam małe mieszkanie w centrum.",
        mastered: false
      },
      {
        polish: "pokój",
        english: "room",
        phonetic: "po-koo",
        exampleSentence: "Mój pokój jest na drugim piętrze.",
        mastered: false
      },
      {
        polish: "kuchnia",
        english: "kitchen",
        phonetic: "kookh-nya",
        exampleSentence: "Kuchnia jest połączona z salonem.",
        mastered: false
      },
      {
        polish: "łazienka",
        english: "bathroom",
        phonetic: "wa-zhen-ka",
        exampleSentence: "Łazienka jest obok sypialni.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "How do you say 'apartment' in Polish?",
        options: ["dom", "pokój", "mieszkanie", "balkon"],
        correctAnswer: 2,
        explanation: "Mieszkanie means apartment. Dom is house, pokój is room, balkon is balcony."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Kuchnia' means '___________' (kitchen).",
        correctAnswer: "kitchen",
        explanation: "Kuchnia is the kitchen. It's also the word for cuisine (e.g., 'polska kuchnia' = Polish cuisine)."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "What does 'Wstaję o siódmej' mean?",
        options: ["I go to sleep at seven.", "I wake up at seven.", "I eat at seven.", "I work at seven."],
        correctAnswer: 1,
        explanation: "Wstaję means 'I get up/wake up.' Wstawać is the imperfective form of 'to get up.' The perfective version is 'wstać' (completed action)."
      }
    ]
  },
  {
    id: 19,
    title: "Polish Cuisine & Dining Etiquette",
    description: "Explore Polish food culture, traditional dishes, restaurant customs, and cooking vocabulary.",
    duration: "55 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Classic Polish Dishes",
        content: "Traditional Polish dishes: pierogi (dumplings — the national dish, with various fillings: mięso/meat, kapusta/kimchi, grzyby/mushroom, ruskie/potato & cheese), bigos (hunter's stew with cabbage and meat), żurek (sour rye soup, traditionally served in bread bowl), barszcz (beetroot soup, especially at Christmas), gołąbki (stuffed cabbage rolls), kotlet schabowy (breaded pork cutlet).",
        type: 'text'
      },
      {
        id: 2,
        title: "Polish Drinks & Desserts",
        content: "Drinks: herbata (tea — very popular, Poles drink it with lemon or sugar), kawa (coffee — usually espresso-style 'kawa'), wódka (vodka — Poland's famous spirit, 'czysta' is plain, 'pieprzowa' is pepper-flavoured), kompot (fruit compote, traditional). Desserts: sernik (Polish cheesecake), szarlotka (apple pie), makowiec (poppy seed cake), pączki (doughnuts, traditionally eaten on Fat Thursday).",
        type: 'text'
      },
      {
        id: 3,
        title: "Dining Customs & Manners",
        content: "Polish dining customs: 'Na zdrowie!' (Cheers!/Bless you after a sneeze), 'Smacznego!' (Enjoy your meal!), 'Dobry apetyt!' (Good appetite!). At a Polish home, hosts will insist you eat more — it's polite to accept at least a little. 'Czy mogę pomóc?' (Can I help?) is expected if you're a guest. Leaving a little food on your plate is normal — it signals you're satisfied.",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "pierogi",
        english: "dumplings",
        phonetic: "pye-ro-ghee",
        exampleSentence: "Lubię pierogi z kapustą i grzybami.",
        mastered: false
      },
      {
        polish: "bigos",
        english: "hunter's stew",
        phonetic: "bi-gos",
        exampleSentence: "Bigos to tradycyjna polska potrawa.",
        mastered: false
      },
      {
        polish: "herbata",
        english: "tea",
        phonetic: "her-ba-ta",
        exampleSentence: "Piję herbatę z cytryną codziennie.",
        mastered: false
      },
      {
        polish: "smacznego",
        english: "enjoy your meal",
        phonetic: "smach-ne-go",
        exampleSentence: "Smacznego! — Dziękuję, równi",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "What are 'pierogi'?",
        options: ["Stuffed cabbage rolls", "Breaded pork cutlet", "Dumplings", "Beetroot soup"],
        correctAnswer: 2,
        explanation: "Pierogi are dumplings — one of Poland's most famous dishes. Gołąbki are stuffed cabbage rolls, kotlet schabowy is breaded pork cutlet, barszcz is beetroot soup."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Herbata' means '___________' (tea).",
        correctAnswer: "tea",
        explanation: "Herbata is tea. Poles typically drink it with a slice of lemon (cytryna) or sugar (cukier). Coffee is 'kawa.'"
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "What do you say before eating in Polish?",
        options: ["Do widzenia!", "Smacznego!", "Dziękuję!", "Na zdrowie!"],
        correctAnswer: 1,
        explanation: "'Smacznego!' means 'Enjoy your meal!' — said before eating. 'Na zdrowie!' means 'Cheers!/Bless you!' and is used when drinking or when someone sneezes."
      }
    ]
  },
  {
    id: 20,
    title: "Culture & Polish Traditions",
    description: "Learn about Polish holidays, customs, social etiquette, and the cultural values that shape everyday life.",
    duration: "55 min",
    difficulty: 'intermediate',
    completed: false,
    started: false,
    visualTheme: 'polish_classroom',
    sections: [
      {
        id: 1,
        title: "Major Polish Holidays",
        content: "Key holidays: Wigilia (Christmas Eve, December 24 — the most important day of Christmas, not Christmas Day itself), Boże Narodzenie (Christmas, Dec 25-26), Wielkanoc (Easter), Dzień Babci/Dziadka (Grandmother's/Grandfather's Day, Jan 21/22), Dzień Kobiet (Women's Day, March 8 — big in Poland, men give flowers and small gifts to women).",
        type: 'text'
      },
      {
        id: 2,
        title: "Polish Social Customs",
        content: "Important customs: Punctuality is highly valued — being late is disrespectful. When visiting someone's home, always bring a small gift (flowers, sweets, wine). Remove shoes indoors — this is standard in Polish homes. Greetings: shake hands with a firm grip, close friends kiss on both cheeks (started from right). Polish people are warm but indirect — small talk comes before business.",
        type: 'text'
      },
      {
        id: 3,
        title: "Polish Identity & Values",
        content: "Poland has a strong sense of national and regional identity. Family is central — 'rodzina' is deeply valued. Catholic tradition is historically significant (about 87% of Poles identify as Catholic), though church attendance varies. Poles take pride in their history, literature (Mickiewicz, Sienkiewicz), and composers (Chopin was Polish).",
        type: 'interactive'
      }
    ],
    vocabulary: [
      {
        polish: "święta",
        english: "holidays / Christmas",
        phonetic: "shfyen-ta",
        exampleSentence: "W Polsce święta są bardzo rodzinne.",
        mastered: false
      },
      {
        polish: "tradycja",
        english: "tradition",
        phonetic: "tra-di-tsya",
        exampleSentence: "Polska tradycja jest bogata i różnorodna.",
        mastered: false
      },
      {
        polish: "rodzina",
        english: "family",
        phonetic: "ro-dzi-na",
        exampleSentence: "Rodzina jest dla mnie najważniejsza.",
        mastered: false
      },
      {
        polish: "kultura",
        english: "culture",
        phonetic: "kool-tu-ra",
        exampleSentence: "Polska kultura jest bardzo interesująca.",
        mastered: false
      }
    ],
    exercises: [
      {
        id: 1,
        type: 'multiple-choice',
        question: "What is 'Wigilia'?",
        options: ["Easter Sunday", "Christmas Eve", "New Year's Eve", "Good Friday"],
        correctAnswer: 1,
        explanation: "Wigilia is Christmas Eve (December 24) — the most important Christmas celebration in Poland. Boże Narodzenie (Dec 25-26) is Christmas Day. The Wigilia dinner is a major tradition with 12 dishes representing the 12 apostles."
      },
      {
        id: 2,
        type: 'fill-blank',
        question: "'Rodzina' means '___________' (family).",
        correctAnswer: "family",
        explanation: "Rodzina means family. Poles place enormous importance on family ties — Sunday family dinners are still common. 'Moja rodzina' = my family."
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: "What should you do when visiting a Polish home?",
        options: ["Keep your shoes on", "Bring a small gift", "Start eating immediately", "Avoid complimenting the food"],
        correctAnswer: 1,
        explanation: "In Polish culture, guests are expected to bring a small gift (flowers, sweets, or wine). Removing shoes indoors is mandatory, not optional. It's polite to compliment the food and wait for the host to invite you to start eating."
      }
    ]
  }
];

export function getLessonById(id: number): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id);
}

export function getNextLessonId(currentId: number): number | null {
  const currentIndex = lessons.findIndex(lesson => lesson.id === currentId);
  return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1].id : null;
}

export function getPreviousLessonId(currentId: number): number | null {
  const currentIndex = lessons.findIndex(lesson => lesson.id === currentId);
  return currentIndex > 0 ? lessons[currentIndex - 1].id : null;
}

export function calculateOverallProgress(): number {
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  return Math.round((completedLessons / lessons.length) * 100);
}