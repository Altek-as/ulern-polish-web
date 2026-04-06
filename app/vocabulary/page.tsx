"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Volume2, RotateCw, CheckCircle, XCircle, Target, Filter, Shuffle, BarChart3 } from "lucide-react";
import { lessons } from "@/lib/data/lessons";
import { useProgressStore } from "@/lib/store/progress";

type FilterTab = 'all' | 'practice' | 'mastered';

export default function VocabularyPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const { recordVocabularyAttempt, getWordMastery, vocabularyProgress } = useProgressStore();

  // Extract all vocabulary from all lessons
  const allVocabulary = useMemo(() => {
    return lessons.flatMap(lesson =>
      lesson.vocabulary.map(word => ({
        ...word,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
      }))
    );
  }, []);

  // Score word priority for "Need Practice" (lowest accuracy first)
  const wordPriority = (word: typeof allVocabulary[0]) => {
    const vp = vocabularyProgress[word.polish];
    if (!vp) return 2; // never practiced — high priority
    const accuracy = vp.totalAttempts > 0 ? vp.correctAttempts / vp.totalAttempts : 0;
    if (accuracy >= 0.7 && vp.totalAttempts >= 3) return 0; // mastered — low priority
    return 1 - accuracy; // lower accuracy = higher priority
  };

  // Filter + sort vocabulary
  const filteredVocabulary = useMemo(() => {
    let words = allVocabulary;

    if (activeTab === 'mastered') {
      words = words.filter(w => getWordMastery(w.polish));
    } else if (activeTab === 'practice') {
      words = words.filter(w => {
        const vp = vocabularyProgress[w.polish];
        if (!vp) return true; // never practiced
        return !vp.mastered;   // not yet mastered
      });
    }

    // Sort by priority for practice tab
    if (activeTab === 'practice') {
      words = [...words].sort((a, b) => wordPriority(a) - wordPriority(b));
    }

    return words;
  }, [activeTab, allVocabulary, getWordMastery, vocabularyProgress]);

  const currentWord = filteredVocabulary[currentIndex];
  const totalFiltered = filteredVocabulary.length;

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
      setShowAnswer(true);
      // Recording attempt lazily — viewing translation counts as a practice
      recordVocabularyAttempt(currentWord?.polish, true);
      setSessionTotal(s => s + 1);
    }
  };

  const handleKnowIt = () => {
    if (!currentWord) return;
    recordVocabularyAttempt(currentWord.polish, true);
    setSessionCorrect(s => s + 1);
    setSessionTotal(s => s + 1);
    advanceToNext();
  };

  const handleStillLearning = () => {
    if (!currentWord) return;
    recordVocabularyAttempt(currentWord.polish, false);
    setSessionTotal(s => s + 1);
    advanceToNext();
  };

  const advanceToNext = () => {
    setFlipped(false);
    setShowAnswer(false);
    setCurrentIndex(i => Math.min(i + 1, totalFiltered - 1));
  };

  const handleShuffle = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setShowAnswer(false);
    setSessionCorrect(0);
    setSessionTotal(0);
  };

  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  // Stats
  const masteredCount = allVocabulary.filter(w => getWordMastery(w.polish)).length;
  const needPracticeCount = allVocabulary.filter(w => !getWordMastery(w.polish)).length;

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Praktyka słownictwa</h1>
        <p className="text-gray-700 text-lg">
          Ucz się słówek dzięki fiszkom z powtórzeniami rozłożonymi w czasie. Priorytetyzujemy słowa, które sprawiają Ci największe trudności.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{allVocabulary.length}</div>
          <div className="text-sm text-gray-600">Wszystkie słówka</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{masteredCount}</div>
          <div className="text-sm text-gray-600">Ukończone</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">{needPracticeCount}</div>
          <div className="text-sm text-gray-600">Do nauki</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
          <div className="text-sm text-gray-600">Ta sesja</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'practice', 'mastered'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentIndex(0); setFlipped(false); setShowAnswer(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            {tab === 'all' ? 'Wszystkie' : tab === 'practice' ? 'Do nauki' : 'Ukończone'}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab ? 'bg-red-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {tab === 'all' ? allVocabulary.length : tab === 'practice' ? needPracticeCount : masteredCount}
            </span>
          </button>
        ))}
        <button
          onClick={handleShuffle}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors ml-auto"
        >
          <Shuffle className="h-4 w-4" />
          Reset sesji
        </button>
      </div>

      {/* Empty state */}
      {totalFiltered === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === 'mastered' ? 'Brak opanowanych słówek!' : 'Wszystko opanowane!'}
          </h2>
          <p className="text-gray-700 mb-6">
            {activeTab === 'mastered'
              ? 'Zacznij się uczyć — opanujesz te słówka!'
              : 'Świetna robota! Wszystkie słówka są opanowane.'}
          </p>
          <button
            onClick={() => setActiveTab(activeTab === 'mastered' ? 'practice' : 'mastered')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            {activeTab === 'mastered' ? 'Przejdź do nauki' : 'Zobacz opanowane'}
          </button>
        </div>
      )}

      {/* Flashcard */}
      {currentWord && totalFiltered > 0 && (
        <div className="max-w-lg mx-auto">
          {/* Progress bar */}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{currentIndex + 1} z {totalFiltered}</span>
            <span>{currentWord.lessonTitle}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalFiltered) * 100}%` }}
            />
          </div>

          {/* Card */}
          <div
            className="relative h-72 cursor-pointer"
            onClick={handleFlip}
          >
            {/* Front */}
            <div className={`absolute inset-0 w-full h-full bg-white border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 transition-opacity duration-200 ${flipped ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-gray-500 text-sm font-medium mb-2">Polski</div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{currentWord.polish}</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <Volume2 className="h-5 w-5 mr-2" />
                <span className="text-lg">{currentWord.phonetic}</span>
              </div>
              <div className="text-gray-700 dark:text-gray-300 italic text-center text-sm">
                "{currentWord.exampleSentence}"
              </div>
              <div className="absolute bottom-4 text-gray-400 text-sm">Kliknij, aby zobaczyć odpowiedź</div>
            </div>

            {/* Back */}
            <div className={`absolute inset-0 w-full h-full bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 transition-opacity duration-200 ${flipped ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-gray-500 text-sm font-medium mb-2">Angielski</div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{currentWord.english}</h2>
              <div className="text-gray-600 mb-4">
                <span className="font-medium">Wymowa:</span> {currentWord.phonetic}
              </div>
              <div className="text-gray-700 dark:text-gray-300 italic text-center text-sm">
                "{currentWord.exampleSentence}"
              </div>
            </div>
          </div>

          {/* Controls */}
          {flipped && (
            <div className="flex gap-4 mt-6 justify-center">
              <button
                onClick={handleStillLearning}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-300 text-orange-700 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
              >
                <XCircle className="h-5 w-5" />
                Jeszcze uczę się
              </button>
              <button
                onClick={handleKnowIt}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-5 w-5" />
                Znam to!
              </button>
            </div>
          )}

          {!flipped && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleFlip}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                <RotateCw className="h-5 w-5" />
                Pokaż odpowiedź
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => { setCurrentIndex(i => Math.max(0, i - 1)); setFlipped(false); setShowAnswer(false); }}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              ← Poprzednie
            </button>
            <button
              onClick={() => { setCurrentIndex(i => Math.min(totalFiltered - 1, i + 1)); setFlipped(false); setShowAnswer(false); }}
              disabled={currentIndex >= totalFiltered - 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              Następne →
            </button>
          </div>

          {/* Mastery indicator */}
          <div className="text-center mt-4">
            {(() => {
              const vp = vocabularyProgress[currentWord?.polish];
              if (!vp) return <span className="text-gray-500 text-sm">Nigdy nie ćwiczone</span>;
              const acc = vp.totalAttempts > 0 ? Math.round((vp.correctAttempts / vp.totalAttempts) * 100) : 0;
              return (
                <span className={`text-sm font-medium ${vp.mastered ? 'text-green-600' : 'text-orange-500'}`}>
                  {vp.mastered ? '✓ Opanowane' : `${acc}% · ${vp.correctAttempts}/${vp.totalAttempts} poprawnych`}
                </span>
              );
            })()}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-gray-600 mb-4">Chcesz poćwiczyć w VR?</p>
        <a
          href={process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          <Target className="h-5 w-5" />
          Uruchom VR Experience
        </a>
      </div>
    </div>
  );
}
