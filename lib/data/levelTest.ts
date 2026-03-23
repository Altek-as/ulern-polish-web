export type LevelTestQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option (0-3)
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  explanation: string;
};

export const levelTestQuestions: LevelTestQuestion[] = [
  {
    id: 1,
    question: "What does 'cześć' mean?",
    options: ["Hello", "Thank you", "Goodbye", "Please"],
    correctAnswer: 0,
    difficulty: 'A1',
    explanation: "'Cześć' is a casual way to say 'Hello' or 'Hi' in Polish."
  },
  {
    id: 2,
    question: "How do you say 'thank you' in Polish?",
    options: ["Dzień dobry", "Przepraszam", "Dziękuję", "Proszę"],
    correctAnswer: 2,
    difficulty: 'A1',
    explanation: "'Dziękuję' means 'thank you'. 'Dzień dobry' is 'good day', 'Przepraszam' is 'excuse me', 'Proszę' is 'please'."
  },
  {
    id: 3,
    question: "Which of these is the correct translation for 'book'?",
    options: ["książka", "okno", "drzwi", "stół"],
    correctAnswer: 0,
    difficulty: 'A1',
    explanation: "'Książka' means 'book'. 'Okno' is 'window', 'drzwi' is 'door', 'stół' is 'table'."
  },
  {
    id: 4,
    question: "What is the Polish word for 'water'?",
    options: ["chleb", "woda", "mleko", "kawa"],
    correctAnswer: 1,
    difficulty: 'A1',
    explanation: "'Woda' means 'water'. 'Chleb' is 'bread', 'mleko' is 'milk', 'kawa' is 'coffee'."
  },
  {
    id: 5,
    question: "Which verb form means 'I am' in Polish?",
    options: ["jesteś", "jest", "jesteśmy", "jestem"],
    correctAnswer: 3,
    difficulty: 'A2',
    explanation: "'Jestem' is the first person singular of 'być' (to be). 'Jesteś' means 'you are', 'jest' means 'he/she/it is', 'jesteśmy' means 'we are'."
  },
  {
    id: 6,
    question: "How do you say 'I have a cat' in Polish?",
    options: ["Mam kota", "Masz kota", "Ma kota", "Mamy kota"],
    correctAnswer: 0,
    difficulty: 'A2',
    explanation: "'Mam kota' means 'I have a cat'. 'Masz kota' is 'You have a cat', 'Ma kota' is 'He/She has a cat', 'Mamy kota' is 'We have a cat'."
  },
  {
    id: 7,
    question: "What is the plural form of 'dom' (house)?",
    options: ["domy", "domów", "domami", "domach"],
    correctAnswer: 0,
    difficulty: 'B1',
    explanation: "The plural nominative of 'dom' is 'domy'. The other forms are different grammatical cases."
  },
  {
    id: 8,
    question: "Which sentence means 'Where is the train station?'",
    options: [
      "Kiedy odjeżdża pociąg?",
      "Gdzie jest dworzec kolejowy?",
      "Ile kosztuje bilet?",
      "Który peron?"
    ],
    correctAnswer: 1,
    difficulty: 'B1',
    explanation: "'Gdzie jest dworzec kolejowy?' is 'Where is the train station?'. The other options ask about departure time, ticket price, and platform."
  },
  {
    id: 9,
    question: "Choose the correct past tense form: 'On _____ książkę' (He read a book).",
    options: ["czyta", "przeczyta", "czytał", "przeczytał"],
    correctAnswer: 3,
    difficulty: 'B2',
    explanation: "'Przeczytał' is the past perfective masculine singular form of 'przeczytać' (to read). 'Czytał' is imperfective past, 'czyta' is present, 'przeczyta' is future/imperative."
  },
  {
    id: 10,
    question: "Which phrase means 'I would like to order coffee'?",
    options: [
      "Poproszę kawę.",
      "Chcę kawę.",
      "Mógłbym kawę.",
      "Zamawiam kawę."
    ],
    correctAnswer: 0,
    difficulty: 'B2',
    explanation: "'Poproszę kawę' is the polite way to say 'I would like coffee' (literally 'I'll ask for coffee'). The other options are less idiomatic or too direct."
  }
];

export const levelThresholds = [
  { level: 'A1', minScore: 0, maxScore: 2 },
  { level: 'A2', minScore: 3, maxScore: 4 },
  { level: 'B1', minScore: 5, maxScore: 6 },
  { level: 'B2', minScore: 7, maxScore: 8 },
  { level: 'C1', minScore: 9, maxScore: 9 },
  { level: 'C2', minScore: 10, maxScore: 10 }
];

export const levelDescriptions: Record<string, { title: string, description: string, recommendations: string[] }> = {
  A1: {
    title: 'Beginner (A1)',
    description: 'You can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type.',
    recommendations: [
      'Start with Lesson 1: Polish Alphabet & Pronunciation',
      'Practice basic greetings and vocabulary',
      'Try flashcard exercises for common words'
    ]
  },
  A2: {
    title: 'Elementary (A2)',
    description: 'You can understand sentences and frequently used expressions related to areas of most immediate relevance (e.g., personal and family information, shopping, local geography, employment).',
    recommendations: [
      'Review Lessons 1-3: Greetings, Numbers, Basic Phrases',
      'Work on present tense verb conjugations',
      'Try multiple-choice quizzes to reinforce vocabulary'
    ]
  },
  B1: {
    title: 'Intermediate (B1)',
    description: 'You can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc.',
    recommendations: [
      'Continue with Lessons 4-6: Present Tense Verbs, Food Vocabulary, Directions',
      'Practice constructing sentences with correct grammar',
      'Engage with listening and fill-in-the-blank exercises'
    ]
  },
  B2: {
    title: 'Upper Intermediate (B2)',
    description: 'You can understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in your field of specialization.',
    recommendations: [
      'Review all lessons and focus on intermediate content',
      'Practice speaking and writing with more complex sentences',
      'Challenge yourself with advanced exercises'
    ]
  },
  C1: {
    title: 'Advanced (C1)',
    description: 'You can understand a wide range of demanding, longer texts, and recognize implicit meaning.',
    recommendations: [
      'Explore advanced Polish materials beyond this app',
      'Consider conversation practice with native speakers',
      'Polish your understanding of nuanced grammar'
    ]
  },
  C2: {
    title: 'Proficient (C2)',
    description: 'You can understand with ease virtually everything heard or read. You can summarize information from different spoken and written sources.',
    recommendations: [
      'You have mastered the basics! Continue using Polish in real-world contexts.',
      'Consider teaching or tutoring others.',
      'Explore Polish literature and media.'
    ]
  }
};