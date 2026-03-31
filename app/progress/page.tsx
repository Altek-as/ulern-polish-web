"use client";

import { TrendingUp, Award, Calendar, BookOpen, Clock, Star } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useProgressStore } from "@/lib/store/progress";
import { lessons } from "@/lib/data/lessons";
import { useState } from "react";

export default function ProgressPage() {
  const { user } = useAuthStore();
  const {
    getOverallProgress,
    getCompletedLessons,
    getStartedLessons,
    getVocabularyMasteryRate,
    totalLearningTime,
    streakDays,
    lessonProgress,
    vocabularyProgress
  } = useProgressStore();
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [weeklyActivity, _setWeeklyActivity] = useState([
    { day: "Mon", value: 60 },
    { day: "Tue", value: 80 },
    { day: "Wed", value: 45 },
    { day: "Thu", value: 90 },
    { day: "Fri", value: 70 },
    { day: "Sat", value: 95 },
    { day: "Sun", value: 50 },
  ]);

  // Calculate real stats
  const completedLessons = getCompletedLessons().length;
  const startedLessons = getStartedLessons().length;
  const overallProgress = getOverallProgress();
  const vocabularyMasteryRate = getVocabularyMasteryRate();
  const totalWords = Object.keys(vocabularyProgress).length;
  const masteredWords = Object.values(vocabularyProgress).filter(v => v.mastered).length;
  const learningWords = Object.values(vocabularyProgress).filter(v => !v.mastered && v.totalAttempts > 0).length;
  const newWords = 10 - masteredWords - learningWords; // Total vocabulary words in lessons is 10

  const stats = [
    { 
      label: "Ukończone lekcje", 
      value: completedLessons.toString(), 
      total: lessons.length.toString(), 
      color: "bg-blue-500",
      icon: BookOpen
    },
    { 
      label: "Ogólny postęp", 
      value: `${overallProgress}%`, 
      color: "bg-green-500",
      icon: TrendingUp
    },
    { 
      label: "Seria nauki", 
      value: `${streakDays} ${streakDays !== 1 ? 'dni' : 'dzień'}`, 
      color: "bg-purple-500",
      icon: Calendar
    },
    { 
      label: "Opanowane słówka", 
      value: masteredWords.toString(), 
      total: totalWords > 0 ? totalWords.toString() : undefined,
      color: "bg-orange-500",
      icon: Star
    },
  ];

  const recentAchievements = [
    { 
      title: "Pierwsza lekcja", 
      description: completedLessons > 0 ? "Ukończyłeś lekcję alfabetu polskiego" : "Ukończ pierwszą lekcję, aby odblokować", 
      date: "2026-03-20",
      unlocked: completedLessons > 0
    },
    { 
      title: "Mistrz słownictwa", 
      description: masteredWords >= 10 ? `Nauczyłeś się ${masteredWords} polskich słów` : "Naucz się 10 słów, aby odblokować", 
      date: "2026-03-18",
      unlocked: masteredWords >= 10
    },
    { 
      title: "Konsystencja", 
      description: streakDays >= 7 ? `${streakDays}-dniowa seria nauki` : "Utrzymuj 7-dniową serię, aby odblokować", 
      date: "2026-03-22",
      unlocked: streakDays >= 7
    },
  ];

  // Format learning time
  const formatLearningTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {user ? `Postępy w nauce ${user.name}` : "Twoje postępy w nauce"}
        </h1>
        <p className="text-gray-700 text-lg">
          Śledź swoje postępy, osiągnięcia i statystyki nauki w czasie.
          {user && <span className="block text-red-600 font-medium mt-2">Kontynuuj świetną pracę!</span>}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{stat.label}</h3>
            {stat.total && (
              <p className="text-gray-600 text-sm mt-1">{stat.value} z {stat.total} {stat.label.includes('Lekc') ? 'lekcji' : 'słów'}</p>
            )}
            {!stat.total && stat.label === "Ogólny postęp" && (
              <p className="text-gray-600 text-sm mt-1">{startedLessons} lekcji rozpoczętych</p>
            )}
            {!stat.total && stat.label === "Seria nauki" && (
              <p className="text-gray-600 text-sm mt-1">Kontynuuj!</p>
            )}
          </div>
        ))}
       </div>

       {/* Vocabulary Breakdown */}
       <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-gray-900">Podział słownictwa</h2>
           <div className="text-gray-700">
             <span className="font-medium">{totalWords} słów ogółem</span>
           </div>
         </div>
         <div className="flex flex-col md:flex-row gap-8">
           {/* Chart visualization */}
           <div className="flex-1">
             <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex mb-4">
               <div 
                 className="bg-green-600 h-full transition-all duration-500"
                 style={{ width: `${(masteredWords / 10) * 100}%` }}
                 title={`${masteredWords} mastered`}
               ></div>
               <div 
                 className="bg-yellow-500 h-full transition-all duration-500"
                 style={{ width: `${(learningWords / 10) * 100}%` }}
                 title={`${learningWords} learning`}
               ></div>
               <div 
                 className="bg-gray-400 h-full transition-all duration-500"
                 style={{ width: `${(newWords / 10) * 100}%` }}
                 title={`${newWords} new`}
               ></div>
             </div>
             <div className="flex justify-between text-sm text-gray-600">
               <span>{Math.round((masteredWords / 10) * 100)}% opanowane</span>
               <span>{Math.round((learningWords / 10) * 100)}% w nauce</span>
               <span>{Math.round((newWords / 10) * 100)}% nowe</span>
             </div>
           </div>
           {/* Legend and stats */}
           <div className="md:w-64 space-y-4">
             <div className="flex items-center">
               <div className="w-4 h-4 bg-green-600 rounded mr-3"></div>
               <div>
                 <div className="font-medium text-gray-900">Opanowane</div>
                 <div className="text-gray-600 text-sm">{masteredWords} słów · {vocabularyMasteryRate}% opanowania</div>
               </div>
             </div>
             <div className="flex items-center">
               <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
               <div>
                 <div className="font-medium text-gray-900">W nauce</div>
                 <div className="text-gray-600 text-sm">{learningWords} słów · Ćwiczysz</div>
               </div>
             </div>
             <div className="flex items-center">
               <div className="w-4 h-4 bg-gray-400 rounded mr-3"></div>
               <div>
                 <div className="font-medium text-gray-900">Nowe</div>
                 <div className="text-gray-600 text-sm">{newWords} słów · Jeszcze nie ćwiczyłeś</div>
               </div>
             </div>
           </div>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Aktywność tygodniowa</h2>
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2" />
              <span>Całkowity czas nauki: {formatLearningTime(totalLearningTime)}</span>
            </div>
          </div>
          <div className="flex items-end h-64 gap-2">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div className="text-gray-600 text-sm mb-2">{day.day}</div>
                <div
                  className="w-full bg-red-100 rounded-t-lg transition-all hover:bg-red-200"
                  style={{ height: `${day.value}%` }}
                />
                <div className="text-gray-900 font-medium mt-2">{day.value}%</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Wskaźnik opanowania słownictwa</h3>
              <p className="text-gray-600">{vocabularyMasteryRate}% słów opanowanych</p>
            </div>
            <button className="text-red-600 font-semibold hover:text-red-700">
              Zobacz szczegóły →
            </button>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ostatnie osiągnięcia</h2>
          <div className="space-y-6">
            {recentAchievements.map((achievement) => (
              <div key={achievement.title} className={`flex items-start p-4 rounded-lg ${
                achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className={`rounded-full p-2 mr-4 ${
                  achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Award className={`h-5 w-5 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {achievement.title}
                    {!achievement.unlocked && <span className="text-gray-400 text-sm ml-2">(Zablokowane)</span>}
                  </h3>
                  <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="flex items-center mt-2 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {achievement.date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 text-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors">
            Zobacz wszystkie osiągnięcia
          </button>
        </div>
      </div>

      {/* Lesson Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Postępy lekcji</h2>
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const progress = lessonProgress[lesson.id];
            const isCompleted = progress?.completed || lesson.completed;
            const isStarted = progress?.started || lesson.started;
            
            return (
              <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                    isCompleted ? 'bg-green-100' : isStarted ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <BookOpen className={`h-5 w-5 ${
                      isCompleted ? 'text-green-600' : isStarted ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                    <p className="text-gray-600 text-sm">{lesson.duration} • {lesson.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-48 mr-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Postęp</span>
                      <span>{isCompleted ? '100%' : isStarted ? 'W trakcie' : 'Nie rozpoczęto'}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-green-600' : isStarted ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        style={{ width: isCompleted ? '100%' : isStarted ? '50%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <button className="text-red-600 font-semibold hover:text-red-700">
                    {isCompleted ? 'Przeglądaj' : isStarted ? 'Kontynuuj' : 'Rozpocznij'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Ustaw swoje cele nauki</h2>
            <p className="max-w-2xl">
              Zdefiniuj cotygodniowe cele, aby pozostać zmotywowanym i śledzić swoje postępy w dążeniu do biegłości.
              {completedLessons === 0 && " Ukończ pierwszą lekcję, aby rozpocząć!"}
            </p>
          </div>
          <button className="mt-6 md:mt-0 bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Ustaw cele
          </button>
        </div>
      </div>
    </div>
  );
}