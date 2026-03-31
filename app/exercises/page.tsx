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

  // Derive exercise counts from actual lesson data
  const multipleChoiceCount = lessons.flatMap(l => l.exercises).filter(e => e.type === 'multiple-choice').length;
  const fillBlankCount = lessons.flatMap(l => l.exercises).filter(e => e.type === 'fill-blank').length;
  const matchingCount = lessons.flatMap(l => l.exercises).filter(e => e.type === 'matching').length;

  const exerciseTypes = [
    {
      icon: CreditCard,
      title: "Fiszki",
      description: "Ucz się słownictwa dzięki interaktywnym kartom.",
      count: allVocabulary.length,
      color: "bg-blue-100 text-blue-600",
      type: 'flashcard' as const,
    },
    {
      icon: Brain,
      title: "Wielokrotny wybór",
      description: "Sprawdź swoją wiedzę z gramatyki polskiej.",
      count: multipleChoiceCount,
      color: "bg-green-100 text-green-600",
      type: 'quiz' as const,
    },
    {
      icon: Target,
      title: "Ćwiczenia słuchowe",
      description: "Popraw rozumienie dzięki ćwiczeniom audio.",
      count: matchingCount,
      color: "bg-purple-100 text-purple-600",
      type: 'flashcard' as const,
    },
    {
      icon: BarChart,
      title: "Uzupełnij luki",
      description: "Uzupełnij zdania brakującymi słowami.",
      count: fillBlankCount,
      color: "bg-orange-100 text-orange-600",
      type: 'quiz' as const,
    },
  ];

  const recentExercises = [
    { id: 1, title: "Podstawowe pozdrowienia", type: "Fiszki", score: "95%", date: "Dziś" },
    { id: 2, title: "Odmiana czasownika w czasie teraźniejszym", type: "Wielokrotny wybór", score: "78%", date: "Wczoraj" },
    { id: 3, title: "Słownictwo jedzenia", type: "Uzupełnij luki", score: "88%", date: "2 dni temu" },
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ćwiczenia słownictwa</h1>
        <p className="text-gray-700 text-lg">
          Ćwicz i utwierdniaj swoje umiejętności języka polskiego dzięki interaktywnym ćwiczeniom dopasowanym do Twojego poziomu.
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
              <span className="text-gray-600">{exercise.count} ćwiczeń</span>
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
            <h2 className="text-3xl font-bold text-gray-900">Wypróbuj teraz</h2>
            <p className="text-gray-700">Ćwicz z interaktywnymi ćwiczeniami używając prawdziwego słownictwa z lekcji.</p>
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
              Tryb fiszek
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tryb quizu
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
                  <h3 className="text-2xl font-bold text-gray-900">Ćwiczenie z fiszkami</h3>
                  <p className="text-gray-700">Kliknij kartę, aby ją odwrócić i zobaczyć tłumaczenie</p>
                </div>
                <Flashcard
                  word={currentWord}
                  onNext={handleNextWord}
                  onPrevious={handlePreviousWord}
                  currentIndex={currentWordIndex}
                  totalWords={allVocabulary.length}
                />
                <div className="mt-8 text-center text-gray-600">
                  <p>Słowo {currentWordIndex + 1} z {allVocabulary.length} • {isCurrentWordMastered ? 'Opanowane' : 'Uczysz się'}</p>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && allVocabulary.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Quiz wielokrotnego wyboru</h3>
                  <p className="text-gray-700">Sprawdź swoją wiedzę ze słownictwa polskiego</p>
                </div>
                <MultipleChoiceQuiz words={quizWords} />
              </div>
            )}
          </>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ostatnia aktywność</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wskazówki do ćwiczeń</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Zmaksymalizuj swoją naukę</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-gray-800">Ćwicz codziennie przez 15-20 minut</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-gray-800">Regularnie powtarzaj trudne ćwiczenia</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-gray-800">Używaj fiszek do utrwalania słownictwa</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-gray-800">Skup się na wymowie dzięki ćwiczeniom słuchowym</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}