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
  
  const { startLesson, completeLesson, getLessonProgress, recordVocabularyAttempt } = useProgressStore();
  const [activeSection, setActiveSection] = useState(0);
  const [showVocabulary, setShowVocabulary] = useState(true);
  const [showExercises, setShowExercises] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, { selected: number | string; submitted: boolean }>>({});
  const [fillBlankInput, setFillBlankInput] = useState("");
  const [activeFillBlankExerciseId, setActiveFillBlankExerciseId] = useState<number | null>(null);
  
  const progress = lesson ? getLessonProgress(lesson.id) : undefined;
  const completed = progress?.completed || false;
  const started = progress?.started || false;
  
  const handleSelectAnswer = (exerciseId: number, answer: number | string, correctAnswer: number | string) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [exerciseId]: { selected: answer, submitted: true }
    }));
    const isCorrect = String(answer).toLowerCase() === String(correctAnswer).toLowerCase();
    recordVocabularyAttempt(`exercise-${exerciseId}`, isCorrect);
  };
  
  const handleFillBlank = (exerciseId: number, correctAnswer: string) => {
    const input = fillBlankInput.trim();
    setExerciseAnswers(prev => ({
      ...prev,
      [exerciseId]: { selected: input, submitted: true }
    }));
    const isCorrect = input.toLowerCase() === correctAnswer.toLowerCase();
    recordVocabularyAttempt(`exercise-${exerciseId}`, isCorrect);
    setFillBlankInput("");
    setActiveFillBlankExerciseId(null);
  };

  const openFillBlank = (exerciseId: number) => {
    setActiveFillBlankExerciseId(exerciseId);
    setFillBlankInput("");
  };

  const cancelFillBlank = () => {
    setActiveFillBlankExerciseId(null);
    setFillBlankInput("");
  };
  
  const getExerciseState = (exerciseId: number) => exerciseAnswers[exerciseId] || { selected: null, submitted: false };
  
  const isAnswerCorrect = (exerciseId: number, correctAnswer: number | string) => {
    const state = getExerciseState(exerciseId);
    if (!state.submitted) return null;
    return String(state.selected).toLowerCase() === String(correctAnswer).toLowerCase();
  };
  
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Lekcja nie znaleziona</h1>
            <p className="text-gray-700 mb-8">Żądana lekcja nie istnieje.</p>
            <Link
              href="/lessons"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Wróć do lekcji
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
              Wszystkie lekcje
            </Link>
            {completed ? (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Ukończone
              </span>
            ) : started ? (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                W trakcie
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
              <span>Postęp</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Treść lekcji</h2>
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
                        {activeSection === index ? 'Aktywna' : 'Zapisz tę sekcję'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Vocabulary */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Słownictwo</h2>
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
                            Opanowane
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                            Uczące się
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
                <h2 className="text-2xl font-bold text-gray-900">Ćwiczenia praktyczne</h2>
                <button
                  onClick={() => setShowExercises(!showExercises)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {showExercises ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {showExercises && (
                <div className="space-y-6">
                  {lesson.exercises.map((exercise) => {
                    const state = getExerciseState(exercise.id);
                    const correct = isAnswerCorrect(exercise.id, exercise.correctAnswer);
                    const isMultipleChoice = exercise.type === 'multiple-choice' || exercise.type === 'matching';
                    return (
                      <div key={exercise.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium mr-4 ${
                            exercise.type === 'multiple-choice' ? 'bg-blue-100 text-blue-800' :
                            exercise.type === 'fill-blank' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {exercise.type === 'multiple-choice' ? 'Wielokrotny wybór' : exercise.type === 'fill-blank' ? 'Uzupełnij lukę' : exercise.type.replace('-', ' ').charAt(0).toUpperCase() + exercise.type.replace('-', ' ').slice(1)}
                          </span>
                          <h3 className="font-bold text-gray-900">Pytanie {exercise.id}</h3>
                        </div>
                        <p className="text-gray-900 mb-4">{exercise.question}</p>
                        
                        {/* Multiple choice / matching — interactive buttons */}
                        {exercise.options && isMultipleChoice && !state.submitted && (
                          <div className="space-y-2 mb-4">
                            {exercise.options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => handleSelectAnswer(exercise.id, index, exercise.correctAnswer)}
                                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors flex items-center"
                              >
                                <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded mr-3 text-gray-700 font-medium">
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <span className="text-gray-800">{option}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* After submitting multiple choice */}
                        {exercise.options && isMultipleChoice && state.submitted && (
                          <div className="space-y-2 mb-4">
                            {exercise.options.map((option, index) => {
                              const isCorrectOption = index === exercise.correctAnswer;
                              const isSelectedOption = state.selected === index;
                              let btnClass = "w-full text-left px-4 py-3 border rounded-lg flex items-center ";
                              if (isCorrectOption) btnClass += "border-green-500 bg-green-50";
                              else if (isSelectedOption) btnClass += "border-red-500 bg-red-50";
                              else btnClass += "border-gray-200 bg-gray-50";
                              return (
                                <div key={index} className={btnClass}>
                                  <div className={`w-8 h-8 flex items-center justify-center border rounded mr-3 font-medium ${isCorrectOption ? 'bg-green-100 text-green-800 border-green-300' : isSelectedOption ? 'bg-red-100 text-red-800 border-red-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                                    {String.fromCharCode(65 + index)}
                                  </div>
                                  <span className={isCorrectOption ? 'text-green-800 font-medium' : isSelectedOption ? 'text-red-800' : 'text-gray-600'}>{option}</span>
                                  {isCorrectOption && <span className="ml-auto text-green-600 text-sm font-medium">✓ Poprawna</span>}
                                  {isSelectedOption && !isCorrectOption && <span className="ml-auto text-red-600 text-sm font-medium">✗ Twoja odpowiedź</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Fill in blank — inline input if not submitted */}
                        {exercise.type === 'fill-blank' && !state.submitted && activeFillBlankExerciseId !== exercise.id && (
                          <button
                            onClick={() => openFillBlank(exercise.id)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                          >
                            Wpisz odpowiedź
                          </button>
                        )}

                        {exercise.type === 'fill-blank' && !state.submitted && activeFillBlankExerciseId === exercise.id && (
                          <div className="flex flex-col gap-3">
                            <input
                              type="text"
                              value={fillBlankInput}
                              onChange={(e) => setFillBlankInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleFillBlank(exercise.id, exercise.correctAnswer as string);
                                if (e.key === 'Escape') cancelFillBlank();
                              }}
                              placeholder="Wpisz swoją odpowiedź..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              autoFocus
                            />
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleFillBlank(exercise.id, exercise.correctAnswer as string)}
                                disabled={fillBlankInput.trim() === ""}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
                              >
                                Sprawdź
                              </button>
                              <button
                                onClick={cancelFillBlank}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                              >
                                Anuluj
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* After submitting fill-blank */}
                        {exercise.type === 'fill-blank' && state.submitted && (
                          <div className={`p-4 rounded-lg ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <p className="font-medium mb-1">
                              {correct ? '✓ Poprawnie!' : '✗ Spróbuj ponownie'}
                            </p>
                            <p className="text-gray-700">
                              <strong>Twoja odpowiedź:</strong> {String(state.selected)}
                            </p>
                            {!correct && (
                              <p className="text-gray-700 mt-1">
                                <strong>Poprawna odpowiedź:</strong> {String(exercise.correctAnswer)}
                              </p>
                            )}
                            <p className="text-gray-600 mt-2">{exercise.explanation}</p>
                          </div>
                        )}
                        
                        {/* Feedback + explanation shown after any submission */}
                        {state.submitted && (
                          <div className={`mt-4 p-4 rounded-lg ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <p className="text-gray-700">
                              <strong>Wyjaśnienie:</strong> {exercise.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Right column: Progress and navigation */}
          <div className="space-y-6">
            {/* Completion card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ukończ tę lekcję</h3>
              <p className="text-gray-700 mb-6">
                Ukończ wszystkie sekcje i ćwiczenia, aby oznaczyć tę lekcję jako ukończoną.
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
                    Lekcja ukończona
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-5 w-5" />
                    Oznacz jako ukończoną
                  </>
                )}
              </button>
            </div>
            
            {/* Lesson navigation */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nawigacja lekcji</h3>
              <div className="space-y-4">
                {previousLessonId ? (
                  <Link
                    href={`/lessons/${previousLessonId}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <ArrowLeft className="mr-3 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Poprzednia lekcja</p>
                        <p className="font-medium text-gray-900">
                          {getLessonById(previousLessonId)?.title}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 rotate-180" />
                  </Link>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-600 text-sm">To jest pierwsza lekcja</p>
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
                        <p className="text-sm text-gray-600">Następna lekcja</p>
                        <p className="font-medium text-gray-900">
                          {getLessonById(nextLessonId)?.title}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-600 text-sm">To jest ostatnia lekcja</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Statystyki lekcji</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sekcje</span>
                  <span className="font-bold text-gray-900">{lesson.sections.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Słowa</span>
                  <span className="font-bold text-gray-900">{lesson.vocabulary.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ćwiczenia</span>
                  <span className="font-bold text-gray-900">{lesson.exercises.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Twój postęp</span>
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