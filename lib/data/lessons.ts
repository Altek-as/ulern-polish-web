export type Lesson = {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  started: boolean;
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