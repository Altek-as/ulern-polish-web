"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookOpen, Clock, CheckCircle, ArrowLeft, ArrowRight, Bookmark, ChevronRight, Volume2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { getLessonById, getPreviousLessonId, getNextLessonId } from "@/lib/data/lessons";
import { useProgressStore } from "@/lib/store/progress";

export default function LessonPage() {
  const params = useParams();
  const lessonId = parseInt(params.id as string);
  const lesson = getLessonById(lessonId);
  
  const { startLesson, completeLesson, getLessonProgress } = useProgressStore();
  const [activeSection, setActiveSection] = useState(0);
  const [showVocabulary, setShowVocabulary] = useState(true);
  const [showExercises, setShowExercises] = useState(false);
  
  const progress = lesson ? getLessonProgress(lesson.id) : undefined;
  const completed = progress?.completed || false;
  const started = progress?.started || false;
  
  // Auto-start lesson if not started
  useEffect(() => {
    if (lesson && !started) {
      startLesson(lesson.id);
    }
  }, [lesson, started, startLesson]);
  
  if (!lesson) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
            <p className="text-gray-700 mb-8">The requested lesson does not exist.</p>
            <Link
              href="/lessons"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Lessons
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const previousLessonId = getPreviousLessonId(lesson.id);
  const nextLessonId = getNextLessonId(lesson.id);
  
  const handleCompleteLesson = () => {
    completeLesson(lesson.id, 100);
  };
  
  const totalSections = lesson.sections.length;
  const progressPercent = completed ? 100 : Math.round((activeSection / totalSections) * 100);
  
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/lessons"
              className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              All Lessons
            </Link>
            {completed ? (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Completed
              </span>
            ) : started ? (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                In Progress
              </span>
            ) : null}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <p className="text-gray-700 text-lg">{lesson.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{lesson.duration}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Lesson content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sections */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lesson Content</h2>
              <div className="space-y-6">
                {lesson.sections.map((section, index) => (
                  <div 
                    key={section.id} 
                    className={`pb-6 ${index < lesson.sections.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="flex items-start mb-4">
                      <div className="bg-red-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                        <div className="flex items-center text-gray-600 mb-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            section.type === 'text' ? 'bg-gray-100 text-gray-800' :
                            section.type === 'video' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setActiveSection(index)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          activeSection === index
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {activeSection === index ? 'Active' : 'Focus on this section'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Vocabulary */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vocabulary</h2>
                <button
                  onClick={() => setShowVocabulary(!showVocabulary)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {showVocabulary ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {showVocabulary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.vocabulary.map((word) => (
                    <div 
                      key={word.polish} 
                      className={`border rounded-lg p-4 ${word.mastered ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{word.polish}</h3>
                        {word.mastered ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                            Mastered
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                            Learning
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{word.english}</p>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Volume2 className="h-4 w-4 mr-1" />
                        <span>{word.phonetic}</span>
                      </div>
                       <p className="text-gray-600 text-sm italic">&quot;{word.exampleSentence}&quot;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Exercises */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Practice Exercises</h2>
                <button
                  onClick={() => setShowExercises(!showExercises)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {showExercises ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {showExercises && (
                <div className="space-y-6">
                  {lesson.exercises.map((exercise) => (
                    <div key={exercise.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium mr-4 ${
                          exercise.type === 'multiple-choice' ? 'bg-blue-100 text-blue-800' :
                          exercise.type === 'fill-blank' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {exercise.type.replace('-', ' ').charAt(0).toUpperCase() + exercise.type.replace('-', ' ').slice(1)}
                        </span>
                        <h3 className="font-bold text-gray-900">Question {exercise.id}</h3>
                      </div>
                      <p className="text-gray-900 mb-4">{exercise.question}</p>
                      {exercise.options && (
                        <div className="space-y-2 mb-4">
                          {exercise.options.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded mr-3">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="text-gray-700">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                          <strong>Answer:</strong> {exercise.correctAnswer}
                        </p>
                        <p className="text-gray-600 mt-2">{exercise.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right column: Progress and navigation */}
          <div className="space-y-6">
            {/* Completion card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete This Lesson</h3>
              <p className="text-gray-700 mb-6">
                Finish all sections and practice exercises to mark this lesson as completed.
              </p>
              <button
                onClick={handleCompleteLesson}
                disabled={completed}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  completed
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {completed ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Lesson Completed
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-5 w-5" />
                    Mark as Completed
                  </>
                )}
              </button>
            </div>
            
            {/* Lesson navigation */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lesson Navigation</h3>
              <div className="space-y-4">
                {previousLessonId ? (
                  <Link
                    href={`/lessons/${previousLessonId}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <ArrowLeft className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Previous Lesson</p>
                        <p className="font-medium text-gray-900">
                          {getLessonById(previousLessonId)?.title}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 rotate-180" />
                  </Link>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-600 text-sm">This is the first lesson</p>
                  </div>
                )}
                
                {nextLessonId ? (
                  <Link
                    href={`/lessons/${nextLessonId}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <ArrowRight className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Next Lesson</p>
                        <p className="font-medium text-gray-900">
                          {getLessonById(nextLessonId)?.title}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-600 text-sm">This is the final lesson</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lesson Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sections</span>
                  <span className="font-bold text-gray-900">{lesson.sections.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Vocabulary Words</span>
                  <span className="font-bold text-gray-900">{lesson.vocabulary.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Exercises</span>
                  <span className="font-bold text-gray-900">{lesson.exercises.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Your Progress</span>
                  <span className="font-bold text-gray-900">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}