import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { lessons, type Lesson } from '@/lib/data/lessons';

export type LessonProgress = {
  lessonId: number;
  completed: boolean;
  started: boolean;
  score?: number;
  completedAt?: string;
  timeSpent: number; // in minutes
};

export type VocabularyProgress = {
  wordId: string; // polish word as ID
  mastered: boolean;
  lastPracticed: string;
  correctAttempts: number;
  totalAttempts: number;
};

export type ProgressState = {
  // Lesson progress tracking
  lessonProgress: Record<number, LessonProgress>;
  
  // Vocabulary mastery tracking
  vocabularyProgress: Record<string, VocabularyProgress>;
   
  // Overall statistics
  totalLearningTime: number; // in minutes
  streakDays: number;
  lastLearningDate: string;
  polishLevel: string | null;
   
  // Actions
  startLesson: (lessonId: number) => void;
  completeLesson: (lessonId: number, score?: number) => void;
  updateVocabularyMastery: (wordId: string, mastered: boolean) => void;
  recordVocabularyAttempt: (wordId: string, correct: boolean) => void;
  recordLearningTime: (minutes: number) => void;
  updateStreak: () => void;
  setPolishLevel: (level: string) => void;
   
  // Getters
  getLessonProgress: (lessonId: number) => LessonProgress | undefined;
  getOverallProgress: () => number;
  getCompletedLessons: () => Lesson[];
  getStartedLessons: () => Lesson[];
  getVocabularyMasteryRate: () => number;
  getWordMastery: (wordId: string) => boolean;
  getPolishLevel: () => string | null;
};

const initialLessonProgress: Record<number, LessonProgress> = {};
// Initialize with existing lesson data
lessons.forEach(lesson => {
  initialLessonProgress[lesson.id] = {
    lessonId: lesson.id,
    completed: lesson.completed,
    started: lesson.started,
    timeSpent: 0,
    ...(lesson.completed && { completedAt: new Date().toISOString(), score: 85 })
  };
});

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      lessonProgress: initialLessonProgress,
      vocabularyProgress: {},
      totalLearningTime: 245, // 4 hours 5 minutes in total
      streakDays: 7,
      lastLearningDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      polishLevel: null,
      
      // Actions
      startLesson: (lessonId) => {
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              lessonId,
              completed: false,
              started: true,
              timeSpent: state.lessonProgress[lessonId]?.timeSpent || 0,
            },
          },
        }));
      },
      
      completeLesson: (lessonId, score = 0) => {
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              ...state.lessonProgress[lessonId],
              lessonId,
              completed: true,
              started: true,
              score,
              completedAt: new Date().toISOString(),
              timeSpent: (state.lessonProgress[lessonId]?.timeSpent || 0) + 30, // Add 30 minutes for completion
            },
          },
        }));
        
        // Also update vocabulary for this lesson
        const lesson = lessons.find(l => l.id === lessonId);
        if (lesson) {
          const vocabularyUpdates: Record<string, VocabularyProgress> = {};
          lesson.vocabulary.forEach(word => {
            const wordId = word.polish;
            vocabularyUpdates[wordId] = {
              wordId,
              mastered: true,
              lastPracticed: new Date().toISOString(),
              correctAttempts: 3,
              totalAttempts: 3,
            };
          });
          
          set((state) => ({
            vocabularyProgress: {
              ...state.vocabularyProgress,
              ...vocabularyUpdates,
            },
          }));
        }
      },
      
      updateVocabularyMastery: (wordId, mastered) => {
        set((state) => {
          const existing = state.vocabularyProgress[wordId] || {};
          // Preserve existing attempt counts, default to reasonable values if missing
          const correctAttempts = existing.correctAttempts || (mastered ? 3 : 1);
          const totalAttempts = existing.totalAttempts || 3;
          return {
            vocabularyProgress: {
              ...state.vocabularyProgress,
              [wordId]: {
                ...existing,
                wordId,
                mastered,
                lastPracticed: new Date().toISOString(),
                correctAttempts,
                totalAttempts,
              },
            },
          };
        });
      },
      
      recordVocabularyAttempt: (wordId, correct) => {
        set((state) => {
          const existing = state.vocabularyProgress[wordId];
          const now = new Date().toISOString();
          
          if (!existing) {
            // First attempt for this word
            const newProgress: VocabularyProgress = {
              wordId,
              mastered: false,
              lastPracticed: now,
              correctAttempts: correct ? 1 : 0,
              totalAttempts: 1,
            };
            
            // Check auto-master (unlikely on first attempt, but keep logic)
            const shouldMaster = newProgress.correctAttempts >= 3 && 
                                 newProgress.totalAttempts >= 3 && 
                                 (newProgress.correctAttempts / newProgress.totalAttempts) >= 0.7;
            
            return {
              vocabularyProgress: {
                ...state.vocabularyProgress,
                [wordId]: {
                  ...newProgress,
                  mastered: shouldMaster,
                },
              },
            };
          }
          
          // Update existing progress
          const updatedCorrectAttempts = existing.correctAttempts + (correct ? 1 : 0);
          const updatedTotalAttempts = existing.totalAttempts + 1;
          const accuracy = updatedCorrectAttempts / updatedTotalAttempts;
          const shouldMaster = updatedCorrectAttempts >= 3 && 
                               updatedTotalAttempts >= 3 && 
                               accuracy >= 0.7;
          
          return {
            vocabularyProgress: {
              ...state.vocabularyProgress,
              [wordId]: {
                ...existing,
                wordId,
                mastered: existing.mastered || shouldMaster, // Once mastered, stay mastered
                lastPracticed: now,
                correctAttempts: updatedCorrectAttempts,
                totalAttempts: updatedTotalAttempts,
              },
            },
          };
        });
      },
      
      recordLearningTime: (minutes) => {
        set((state) => ({
          totalLearningTime: state.totalLearningTime + minutes,
          lastLearningDate: new Date().toISOString().split('T')[0],
        }));
      },
      
      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const state = get();
        
        if (state.lastLearningDate === yesterday || state.lastLearningDate === today) {
          // Continue streak
          set({ streakDays: state.streakDays + 1 });
        } else {
          // Break streak, start over
          set({ streakDays: 1 });
        }
      },
      
      setPolishLevel: (level) => {
        set({ polishLevel: level });
      },
      
      // Getters
      getLessonProgress: (lessonId) => {
        return get().lessonProgress[lessonId];
      },
      
      getOverallProgress: () => {
        const state = get();
        const completedLessons = Object.values(state.lessonProgress).filter(
          progress => progress.completed
        ).length;
        return Math.round((completedLessons / lessons.length) * 100);
      },
      
      getCompletedLessons: () => {
        const state = get();
        return lessons.filter(lesson => 
          state.lessonProgress[lesson.id]?.completed
        );
      },
      
      getStartedLessons: () => {
        const state = get();
        return lessons.filter(lesson => 
          state.lessonProgress[lesson.id]?.started
        );
      },
      
      getVocabularyMasteryRate: () => {
        const state = get();
        const mastered = Object.values(state.vocabularyProgress).filter(
          progress => progress.mastered
        ).length;
        const total = Object.keys(state.vocabularyProgress).length;
        return total > 0 ? Math.round((mastered / total) * 100) : 0;
      },
       
      getWordMastery: (wordId) => {
        const state = get();
        return state.vocabularyProgress[wordId]?.mastered || false;
      },

      getPolishLevel: () => {
        const state = get();
        return state.polishLevel;
      },
    }),
    {
      name: 'progress-storage', // LocalStorage key
      partialize: (state) => ({
        lessonProgress: state.lessonProgress,
        vocabularyProgress: state.vocabularyProgress,
        totalLearningTime: state.totalLearningTime,
        streakDays: state.streakDays,
        lastLearningDate: state.lastLearningDate,
        polishLevel: state.polishLevel,
      }),
    }
  )
);