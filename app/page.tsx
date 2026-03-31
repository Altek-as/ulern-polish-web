"use client";

import Link from "next/link";
import { BookOpen, Brain, TrendingUp, Users, BotMessageSquare, ArrowRight, Zap } from "lucide-react";
import { useProgressStore } from "@/lib/store/progress";
import { lessons } from "@/lib/data/lessons";
import { useMemo } from "react";

const MASTERY_THRESHOLD = 3;

export default function Home() {
  const { vocabularyProgress } = useProgressStore();

  const needsPracticeCount = useMemo(() => {
    let count = 0;
    lessons.forEach((lesson) => {
      lesson.vocabulary.forEach((word) => {
        const vp = vocabularyProgress[word.polish];
        const correct = vp?.correctAttempts || 0;
        const total = vp?.totalAttempts || 0;
        const accuracy = total > 0 ? correct / total : 0;
        const effectiveMastery = total >= 3 && accuracy >= 0.7 ? 3 : total;
        if (effectiveMastery < MASTERY_THRESHOLD) count++;
      });
    });
    return count;
  }, [vocabularyProgress]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
       <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24">
        <div className="container relative mx-auto px-4 md:px-8 text-center animate-fade-in">
           <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Ucz się <span className="text-red-600">polskiego</span> mądrze
          </h1>
           <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Opanuj język polski dzięki interaktywnym lekcjom, ćwiczeniom słownikowym i śledzeniu postępów, zaprojektowanym dla uczniów na każdym poziomie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lessons"
              className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Zacznij się uczyć
            </Link>
            <Link
              href="/exercises"
              className="inline-flex items-center justify-center bg-white text-red-600 border border-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors"
            >
              <Brain className="mr-2 h-5 w-5" />
              Wypróbuj ćwiczenia
            </Link>
            <a
              href="http://localhost:5000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              <BotMessageSquare className="mr-2 h-5 w-5" />
              Uruchom VR
            </a>
          </div>
        </div>
      </section>

      {/* Quick Review Widget */}
      {needsPracticeCount > 0 && (
        <section className="py-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-y border-yellow-200 dark:border-yellow-800">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/40 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Słowa wymagające powtórki
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Masz <strong className="text-yellow-700 dark:text-yellow-400">{needsPracticeCount}</strong> {needsPracticeCount === 1 ? "słowo" : needsPracticeCount < 5 ? "słowa" : "słów"}, które wymagają praktyki.
                    Ćwicz je, zanim zapomnisz!
                  </p>
                </div>
              </div>
              <Link
                href="/practice"
                className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex-shrink-0"
              >
                Zacznij powtórkę
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
       <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8">
           <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">Dlaczego uLern Polish?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Strukturalne lekcje</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Krok po kroku lekcje od początkującego do średniozaawansowanego, obejmujące gramatykę, słownictwo i wymowę.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Interaktywne ćwiczenia</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Fiszki, quizy i ćwiczenia mówienia, które utrwalają wiedzę i poprawiają zapamiętywanie.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Śledzenie postępów</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Monitoruj swoje postępy dzięki szczegółowym statystykom, osiągnięciom i spersonalizowanym rekomendacjom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Rozpocznij swoją przygodę z polskim już dziś</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Dołącz do tysięcy uczniów, którzy poprawili swoje umiejętności języka polskiego dzięki uLern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
               className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Users className="mr-2 h-5 w-5" />
              Utwórz darmowe konto
            </Link>
            <Link
              href="/lessons"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              Przeglądaj lekcje
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
