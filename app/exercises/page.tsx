"use client";

import { Brain, CreditCard, BarChart, Target, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import Flashcard from "@/components/Flashcard";
import MultipleChoiceQuiz from "@/components/MultipleChoiceQuiz";
import { lessons } from "@/lib/data/lessons";
import { useProgressStore } from "@/lib/store/progress";

export default function ExercisesPage() {
  const [activeTab, setActiveTab] = useState<'flashcard' | 'quiz'>('flashcard');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { getWordMastery } = useProgressStore();

  // Extract all vocabulary from lessons
  const allVocabulary = useMemo(() => lessons.flatMap(lesson => lesson.vocabulary), []);

  // Memoize the words passed to MultipleChoiceQuiz to prevent unnecessary re-renders
  const quizWords = useMemo(() => allVocabulary.slice(0, 10), [allVocabulary]);

  const exerciseTypes = [
    {
      icon: CreditCard,
      title: "Flashcards",
      description: "Learn vocabulary with interactive flip cards.",
      count: allVocabulary.length,
      color: "bg-blue-100 text-blue-600",
      type: 'flashcard' as const,
    },
    {
      icon: Brain,
      title: "Multiple Choice",
      description: "Test your knowledge with Polish grammar questions.",
      count: 85,
      color: "bg-green-100 text-green-600",
      type: 'quiz' as const,
    },
    {
      icon: Target,
      title: "Listening Practice",
      description: "Improve comprehension with audio exercises.",
      count: 42,
      color: "bg-purple-100 text-purple-600",
      type: 'flashcard' as const,
    },
    {
      icon: BarChart,
      title: "Fill in the Blanks",
      description: "Complete sentences with missing words.",
      count: 67,
      color: "bg-orange-100 text-orange-600",
      type: 'quiz' as const,
    },
  ];

  const recentExercises = [
    { id: 1, title: "Basic Greetings", type: "Flashcards", score: "95%", date: "Today" },
    { id: 2, title: "Present Tense Conjugation", type: "Multiple Choice", score: "78%", date: "Yesterday" },
    { id: 3, title: "Food Vocabulary", type: "Fill in the Blanks", score: "88%", date: "2 days ago" },
  ];

  const currentWord = allVocabulary[currentWordIndex] || allVocabulary[0];
  const isCurrentWordMastered = currentWord ? getWordMastery(currentWord.polish) : false;

  const handleNextWord = () => {
    setCurrentWordIndex(prev => (prev + 1) % allVocabulary.length);
  };

  const handlePreviousWord = () => {
    setCurrentWordIndex(prev => (prev - 1 + allVocabulary.length) % allVocabulary.length);
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
  };

  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Vocabulary Exercises</h1>
        <p className="text-gray-700 text-lg">
          Practice and reinforce your Polish language skills with interactive exercises tailored to your level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {exerciseTypes.map((exercise) => (
          <div
            key={exercise.title}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`${exercise.color} w-14 h-14 rounded-lg flex items-center justify-center mb-6`}>
              <exercise.icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{exercise.title}</h3>
            <p className="text-gray-700 mb-4">{exercise.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{exercise.count} exercises</span>
              <button
                onClick={() => setActiveTab(exercise.type)}
                className="text-red-600 font-semibold hover:text-red-700"
              >
                Start →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Exercises Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Try It Now</h2>
            <p className="text-gray-700">Practice with interactive exercises using real vocabulary from your lessons.</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('flashcard')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'flashcard'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Flashcard Mode
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quiz Mode
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Restart
            </button>
          </div>
        </div>

          <>
            {activeTab === 'flashcard' && currentWord && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Flashcard Exercise</h3>
                  <p className="text-gray-700">Click the card to flip and reveal the translation</p>
                </div>
                <Flashcard
                  word={currentWord}
                  onNext={handleNextWord}
                  onPrevious={handlePreviousWord}
                />
                <div className="mt-8 text-center text-gray-600">
                  <p>Word {currentWordIndex + 1} of {allVocabulary.length} • {isCurrentWordMastered ? 'Mastered' : 'Learning'}</p>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && allVocabulary.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Multiple Choice Quiz</h3>
                  <p className="text-gray-700">Test your knowledge of Polish vocabulary</p>
                </div>
                <MultipleChoiceQuiz words={quizWords} />
              </div>
            )}
          </>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {recentExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-bold text-gray-900">{exercise.title}</h3>
                  <p className="text-gray-600">{exercise.type} • {exercise.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{exercise.score}</div>
                  <div className="text-gray-600 text-sm">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercise Tips</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Maximize Your Learning</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-gray-800">Practice daily for 15-20 minutes</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-gray-800">Review difficult exercises regularly</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-gray-800">Use flashcards for vocabulary retention</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-gray-800">Focus on pronunciation with listening exercises</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}