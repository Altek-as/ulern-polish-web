"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, ArrowLeft, RotateCcw, ChevronRight } from "lucide-react";
import { lessons } from "@/lib/data/lessons";
import { useProgressStore } from "@/lib/store/progress";
import { Brain } from "lucide-react";

const MASTERY_THRESHOLD = 3; // words below 3 attempts or <70% accuracy need practice

type PracticeMode = "list" | "flashcard" | "quiz";

export default function PracticePage() {
  const { vocabularyProgress, recordVocabularyAttempt } = useProgressStore();
  const [mode, setMode] = useState<PracticeMode>("list");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);

  // Build list of words that need practice (mastery < threshold)
  const needsPractice = useMemo(() => {
    const wordList: Array<{
      polish: string;
      english: string;
      phonetic: string;
      exampleSentence: string;
      lessonTitle: string;
      wordId: string;
    }> = [];

    lessons.forEach((lesson) => {
      lesson.vocabulary.forEach((word) => {
        const wordId = word.polish;
        const vp = vocabularyProgress[wordId];
        // Calculate effective mastery: count successful attempts with 70%+ accuracy
        const correct = vp?.correctAttempts || 0;
        const total = vp?.totalAttempts || 0;
        const accuracy = total > 0 ? correct / total : 0;
        const effectiveMastery = total >= 3 && accuracy >= 0.7 ? 3 : total;

        if (effectiveMastery < MASTERY_THRESHOLD) {
          wordList.push({
            polish: word.polish,
            english: word.english,
            phonetic: word.phonetic,
            exampleSentence: word.exampleSentence,
            lessonTitle: lesson.title,
            wordId,
          });
        }
      });
    });

    // Sort by least mastered first
    return wordList.sort((a, b) => {
      const aVp = vocabularyProgress[a.wordId];
      const bVp = vocabularyProgress[b.wordId];
      const aTotal = aVp?.totalAttempts || 0;
      const bTotal = bVp?.totalAttempts || 0;
      return aTotal - bTotal;
    });
  }, [vocabularyProgress]);

  const currentWord = needsPractice[currentWordIndex];

  function startFlashcards() {
    setReviewQueue(needsPractice.map((w) => w.wordId));
    setCurrentWordIndex(0);
    setShowAnswer(false);
    setMode("flashcard");
  }

  function startQuiz() {
    setReviewQueue(needsPractice.map((w) => w.wordId));
    setCurrentWordIndex(0);
    setShowAnswer(false);
    setQuizSelected(null);
    setQuizSubmitted(false);
    setMode("quiz");
  }

  function handleKnowIt() {
    if (!currentWord) return;
    recordVocabularyAttempt(currentWord.wordId, true);
    moveToNext();
  }

  function handleDontKnow() {
    if (!currentWord) return;
    recordVocabularyAttempt(currentWord.wordId, false);
    moveToNext();
  }

  function handleQuizAnswer(index: number) {
    if (quizSubmitted) return;
    setQuizSelected(index);
  }

  function handleQuizSubmit() {
    if (quizSelected === null || !currentWord) return;
    const isCorrect = quizSelected === quizData?.correctIndex;
    recordVocabularyAttempt(currentWord.wordId, isCorrect);
    setQuizSubmitted(true);
  }

  function moveToNext() {
    setShowAnswer(false);
    setQuizSelected(null);
    setQuizSubmitted(false);
    if (currentWordIndex < needsPractice.length - 1) {
      setCurrentWordIndex((i) => i + 1);
    } else {
      setMode("list");
    }
  }

  // Quiz wrong options: pick 3 random other english translations
  function getQuizOptions(word: typeof currentWord) {
    const allEnglish = lessons
      .flatMap((l) => l.vocabulary.map((v) => v.english))
      .filter((e) => e !== word.english);
    const shuffled = allEnglish.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffled, word.english].sort(() => Math.random() - 0.5);
    return { options, correctIndex: options.indexOf(word.english) };
  }

  const quizData = currentWord ? getQuizOptions(currentWord) : null;

  // --- List view ---
  if (mode === "list") {
    return (
      <div className="py-8">
        <div className="mb-8">
          <Link
            href="/lessons"
            className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Wróć do lekcji
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Brain className="h-8 w-8 text-red-600" />
            Praktyka słownictwa
          </h1>
          <p className="text-gray-700 text-lg">
            Ćwicz słowa, które jeszcze nie opanowałeś. System przypomnień interwałowych pomoże Ci je zapamiętać.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-gray-700">
              Masz <strong className="text-red-600">{needsPractice.length}</strong>{" "}
              {needsPractice.length === 1 ? "słowo" : needsPractice.length < 5 ? "słowa" : "słów"} do przećwiczenia.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Słowa uznawane są za opanowane po 3 poprawnych odpowiedziach z rzędu (co najmniej 70% skuteczności).
            </p>
          </div>
          {needsPractice.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={startFlashcards}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Fiszki
              </button>
              <button
                onClick={startQuiz}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                Quiz
              </button>
            </div>
          )}
        </div>

        {needsPractice.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">Wszystko opanowane!</h2>
            <p className="text-green-700">
              Świetna robota! Wszystkie Twoje słowa są na poziomie mistrzowskim.
            </p>
            <Link
              href="/lessons"
              className="inline-flex items-center mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Przeglądaj lekcje
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {needsPractice.map((word) => {
              const vp = vocabularyProgress[word.wordId];
              const total = vp?.totalAttempts || 0;
              const correct = vp?.correctAttempts || 0;
              const masteryPct = total > 0 ? Math.round((correct / total) * 100) : 0;
              return (
                <div
                  key={word.wordId}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{word.polish}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      total === 0 ? "bg-gray-100 text-gray-600" :
                      masteryPct >= 70 ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {total === 0 ? "Nowe" : `${correct}/${total}`}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{word.english}</p>
                  <p className="text-gray-500 text-sm mb-3 italic">{word.phonetic}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        total === 0 ? "bg-gray-300" : masteryPct >= 70 ? "bg-green-500" : "bg-yellow-400"
                      }`}
                      style={{ width: `${total === 0 ? 0 : masteryPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{word.lessonTitle}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- Flashcard view ---
  if (mode === "flashcard" && currentWord) {
    return (
      <div className="py-8 max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setMode("list")}
            className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Wróć do listy
          </button>
          <span className="text-gray-500 text-sm">
            {currentWordIndex + 1} / {needsPractice.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all"
            style={{ width: `${((currentWordIndex) / needsPractice.length) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div
          onClick={() => setShowAnswer(!showAnswer)}
          className="bg-white border-2 border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-red-400 transition-all min-h-[280px] flex flex-col items-center justify-center shadow-sm"
        >
          <p className="text-3xl font-bold text-gray-900 mb-4">{currentWord.polish}</p>
          {showAnswer ? (
            <div className="animate-fade-in">
              <p className="text-xl text-gray-700 mb-3">{currentWord.english}</p>
              <p className="text-gray-500 text-sm mb-4 italic">{currentWord.phonetic}</p>
              <p className="text-gray-600 text-sm">&quot;{currentWord.exampleSentence}&quot;</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Kliknij, aby zobaczyć odpowiedź</p>
          )}
        </div>

        {showAnswer && (
          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={handleDontKnow}
              className="flex-1 py-3 px-6 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors"
            >
              Jeszcze nie znam
            </button>
            <button
              onClick={handleKnowIt}
              className="flex-1 py-3 px-6 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg transition-colors"
            >
              Znam to!
            </button>
          </div>
        )}

        <p className="text-center text-gray-500 text-sm mt-4">
          Lekcja: {currentWord.lessonTitle}
        </p>
      </div>
    );
  }

  // --- Quiz view ---
  if (mode === "quiz" && currentWord && quizData) {
    return (
      <div className="py-8 max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setMode("list")}
            className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Wróć do listy
          </button>
          <span className="text-gray-500 text-sm">
            {currentWordIndex + 1} / {needsPractice.length}
          </span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all"
            style={{ width: `${(currentWordIndex / needsPractice.length) * 100}%` }}
          />
        </div>

        {/* Quiz card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">{currentWord.lessonTitle}</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentWord.polish}</h2>
          <p className="text-gray-500 text-sm italic mb-6">{currentWord.phonetic}</p>
          <p className="text-gray-700 mb-6">Co oznacza to słowo?</p>

          <div className="space-y-3">
            {quizData.options.map((option, index) => {
              let btnClass =
                "w-full text-left px-4 py-3 border rounded-lg flex items-center transition-colors ";
              if (quizSubmitted) {
                if (index === quizData.correctIndex) {
                  btnClass += "border-green-500 bg-green-50";
                } else if (index === quizSelected) {
                  btnClass += "border-red-500 bg-red-50";
                } else {
                  btnClass += "border-gray-200 bg-gray-50";
                }
              } else {
                btnClass +=
                  index === quizSelected
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-red-400 hover:bg-red-50 cursor-pointer";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  disabled={quizSubmitted}
                  className={btnClass}
                >
                  <span className={`w-8 h-8 flex items-center justify-center border rounded mr-3 text-sm font-medium ${
                    index === quizData.correctIndex
                      ? "bg-green-100 text-green-800 border-green-300"
                      : index === quizSelected
                      ? "bg-red-100 text-red-800 border-red-300"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-800">{option}</span>
                  {quizSubmitted && index === quizData.correctIndex && (
                    <span className="ml-auto text-green-600 text-sm font-medium">✓</span>
                  )}
                  {quizSubmitted && index === quizSelected && index !== quizData.correctIndex && (
                    <span className="ml-auto text-red-600 text-sm font-medium">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={quizSelected === null}
              className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
            >
              Sprawdź
            </button>
          ) : (
            <div className="mt-6 space-y-4">
              <div className={`p-4 rounded-lg ${quizSelected === quizData.correctIndex ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <p className="font-medium">
                  {quizSelected === quizData.correctIndex ? "✓ Poprawnie!" : "✗ Niepoprawnie"}
                </p>
                {quizSelected !== quizData.correctIndex && (
                  <p className="text-gray-600 text-sm mt-1">
                    Poprawna odpowiedź: {currentWord.english}
                  </p>
                )}
              </div>
              <p className="text-gray-600 text-sm italic">&quot;{currentWord.exampleSentence}&quot;</p>
              <button
                onClick={moveToNext}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                {currentWordIndex < needsPractice.length - 1 ? (
                  <>Następne <ChevronRight className="ml-2 h-5 w-5" /></>
                ) : (
                  "Zobacz wyniki"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
