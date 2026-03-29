"use client";

import { BookOpen, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { lessons } from "@/lib/data/lessons";
import { useProgressStore } from "@/lib/store/progress";

export default function LessonsPage() {
  const router = useRouter();
  const { getLessonProgress, getOverallProgress } = useProgressStore();
  
  // Merge lesson data with progress data
  const lessonsWithProgress = lessons.map(lesson => {
    const progress = getLessonProgress(lesson.id);
    return {
      ...lesson,
      completed: progress?.completed || lesson.completed,
      started: progress?.started || lesson.started,
    };
  });
  
  const overallProgress = getOverallProgress();

  function handleLessonClick(lesson: typeof lessonsWithProgress[0]) {
    // Store lesson context for VR conversation
    sessionStorage.setItem('ulern_selected_lesson', JSON.stringify({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
    }));
  }

  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Polish Lessons</h1>
        <p className="text-gray-700 text-lg">
          Step-by-step lessons designed to build your Polish language skills from beginner to intermediate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {lessonsWithProgress.map((lesson) => (
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
                  <CheckCircle className="inline h-4 w-4 mr-1" /> Completed
                </span>
              ) : lesson.started ? (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  In Progress
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  Not Started
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
              {lesson.completed ? "Review Lesson" : lesson.started ? "Continue Lesson" : "Start Lesson"}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Track Your Progress</h2>
        <p className="text-gray-700 mb-6">
          Complete lessons to unlock new content and track your improvement over time.
        </p>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Progress</span>
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
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}