"use client";

import { useState, useMemo } from "react";
import { BookOpen, Clock, CheckCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { lessons } from "@/lib/data/lessons";
import { useProgressStore } from "@/lib/store/progress";

type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

export default function LessonsPage() {
  const router = useRouter();
  const { getLessonProgress, getOverallProgress } = useProgressStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");

  // Merge lesson data with progress data
  const lessonsWithProgress = useMemo(() => {
    return lessons.map(lesson => {
      const progress = getLessonProgress(lesson.id);
      return {
        ...lesson,
        completed: progress?.completed || lesson.completed,
        started: progress?.started || lesson.started,
      };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessonsWithProgress.filter(lesson => {
      const matchesSearch =
        searchQuery === "" ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "all" || lesson.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [lessonsWithProgress, searchQuery, difficultyFilter]);

  const overallProgress = getOverallProgress();

  function handleLessonClick(lesson: typeof lessonsWithProgress[0]) {
    // Store lesson context for VR conversation
    sessionStorage.setItem('ulern_selected_lesson', JSON.stringify({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      vocabulary: lesson.vocabulary || [],
    }));
  }

  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Polskie lekcje</h1>
        <p className="text-gray-700 text-lg">
          Krok po kroku lekcje zaprojektowane, aby budować Twoje umiejętności języka polskiego od początkującego do średniozaawansowanego.
        </p>
      </div>

      {/* Filter + Search bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj lekcji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          />
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2">
          {(["all", "beginner", "intermediate", "advanced"] as DifficultyFilter[]).map((level) => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                difficultyFilter === level
                  ? level === "all"
                    ? "bg-red-600 text-white"
                    : level === "beginner"
                    ? "bg-green-600 text-white"
                    : level === "intermediate"
                    ? "bg-yellow-600 text-white"
                    : "bg-red-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {level === "all"
                ? "Wszystkie"
                : level === "beginner"
                ? "Początkujący"
                : level === "intermediate"
                ? "Średniozaawansowany"
                : "Zaawansowany"}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      {(searchQuery || difficultyFilter !== "all") && (
        <p className="text-gray-600 mb-4 text-sm">
          Znaleziono {filteredLessons.length} {filteredLessons.length === 1 ? "lekcję" : filteredLessons.length < 5 ? "lekcje" : "lekcji"}
          {searchQuery && <> dla &quot;{searchQuery}&quot;</>}
          {difficultyFilter !== "all" && <> na poziomie {difficultyFilter}</>}.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-red-600" />
              </div>
              {lesson.completed ? (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  <CheckCircle className="inline h-4 w-4 mr-1" /> Ukończone
                </span>
              ) : lesson.started ? (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  W trakcie
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  Nie rozpoczęto
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{lesson.title}</h3>
            <p className="text-gray-600 mb-3 text-sm">{lesson.description}</p>
            <div className="flex items-center text-gray-600 mb-6">
              <Clock className="h-5 w-5 mr-2" />
              <span>{lesson.duration} • {lesson.difficulty}</span>
            </div>
            <Link
              href={`/lessons/${lesson.id}`}
              onClick={() => handleLessonClick(lesson)}
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {lesson.completed ? "Przeglądaj lekcję" : lesson.started ? "Kontynuuj lekcję" : "Rozpocznij lekcję"}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Śledź swoje postępy</h2>
        <p className="text-gray-700 mb-6">
          Ukończ lekcje, aby odblokować nowe treści i śledź swoje postępy w czasie.
        </p>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Ogólny postęp</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 rounded-full transition-all duration-500" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
          <Link
            href="/progress"
            className="ml-8 text-red-600 font-semibold hover:text-red-700"
          >
            Zobacz szczegóły →
          </Link>
        </div>
      </div>
    </div>
  );
}