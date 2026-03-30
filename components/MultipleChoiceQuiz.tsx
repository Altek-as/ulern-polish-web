"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle, XCircle, HelpCircle, Trophy } from "lucide-react";
import { VocabularyWord } from "@/lib/data/lessons";
import { useProgressStore } from "@/lib/store/progress";



interface MultipleChoiceQuizProps {
  words: VocabularyWord[];
}

type QuizState = 'question' | 'correct' | 'incorrect' | 'completed';

export default function MultipleChoiceQuiz({ words }: MultipleChoiceQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('question');
  const [score, setScore] = useState(0);

  const { recordVocabularyAttempt } = useProgressStore();

  // Deterministic shuffle based on seed
  const deterministicShuffle = <T,>(array: T[], seed: number): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Simple seeded random using Mulberry32
      let t = seed + 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      const random = ((t ^ t >>> 14) >>> 0) / 4294967296;
      const j = Math.floor(random * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      seed = t;
    }
    return shuffled;
  };

  // Simple hash function for string seed
  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  useEffect(() => {
    console.log('quizState changed:', quizState);
  }, [quizState]);

  const currentWord = words[currentIndex];

  // Generate multiple choice options for current word - memoized to prevent re-shuffling
  const { options: currentOptions, correctAnswerIndex: currentCorrectAnswerIndex } = useMemo(() => {
    console.log('useMemo running, currentIndex:', currentIndex, 'currentWord:', currentWord?.polish);
    if (!currentWord) return { options: [], correctAnswerIndex: 0 };

    // Deterministic seed based on word and index
    const seed = simpleHash(currentWord.polish) + currentIndex;

    // Pick 3 wrong answers deterministically
    const wrongWords = words
      .filter(w => w.polish !== currentWord.polish)
      .slice(0, 20); // limit to avoid large arrays
    const shuffledWrongWords = deterministicShuffle(wrongWords, seed).slice(0, 3).map(w => w.english);

    const allOptions = [currentWord.english, ...shuffledWrongWords];
    
    // Shuffle options deterministically (use seed + 1 to get different shuffle)
    const shuffled = deterministicShuffle(allOptions, seed + 1);
    console.log('shuffled options:', shuffled, 'correct answer index:', shuffled.indexOf(currentWord.english));
    return {
      options: shuffled,
      correctAnswerIndex: shuffled.indexOf(currentWord.english)
    };
  }, [currentIndex, currentWord, words]);



   const handleOptionSelect = (index: number) => {
    console.log('handleOptionSelect', { 
      index, 
      quizState, 
      currentCorrectAnswerIndex, 
      currentWord: currentWord?.polish,
      currentOptions,
      correctAnswer: currentOptions[currentCorrectAnswerIndex]
    });
    if (quizState !== 'question') return;
    setSelectedOption(index);
    
    const isCorrect = index === currentCorrectAnswerIndex;
    console.log('isCorrect check:', { index, currentCorrectAnswerIndex, isCorrect, selectedAnswer: currentOptions[index], correctAnswer: currentOptions[currentCorrectAnswerIndex] });
    if (isCorrect) {
      setQuizState('correct');
      console.log('setQuizState correct');
      setScore(prev => prev + 1);
    } else {
      setQuizState('incorrect');
      console.log('setQuizState incorrect');
    }
    
    // Record vocabulary attempt with correctness
    recordVocabularyAttempt(currentWord.polish, isCorrect);

  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizState('completed');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);

    setSelectedOption(null);
    setQuizState('question');
  };

  if (!currentWord) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">No vocabulary words available.</p>
      </div>
    );
  }

  if (quizState === 'completed') {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Trophy className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
          <p className="text-gray-700 mb-8">
             Great job! You&apos;ve completed the vocabulary quiz.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-gray-900 mb-2">{score}</div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-gray-900 mb-2">{words.length}</div>
              <div className="text-gray-600">Total Questions</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {Math.round((score / words.length) * 100)}%
              </div>
              <div className="text-gray-600">Accuracy</div>
            </div>
          </div>
          
          <button
            onClick={handleRestart}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
      {/* Quiz header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Multiple Choice Quiz</h2>
          <p className="text-gray-600">Choose the correct English translation</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{score}</div>
          <div className="text-gray-600">Score</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentIndex + 1} of {words.length}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <HelpCircle className="h-6 w-6 text-red-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">What does this Polish word mean?</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-gray-600 text-sm font-medium mb-2">Polish Word</div>
          <div className="text-5xl font-bold text-gray-900 mb-4">{currentWord.polish}</div>
          <div className="text-gray-700 italic">&quot;{currentWord.exampleSentence}&quot;</div>
        </div>
      </div>

      {/* Options */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentOptions.map((option, index) => {
            const isSelected = selectedOption === index;
    const isCorrect = index === currentCorrectAnswerIndex;
            
            let buttonClass = "w-full p-6 text-left border rounded-xl transition-all duration-200 ";
            
            if (quizState === 'question') {
              buttonClass += "border-gray-300 hover:border-red-300 hover:bg-red-50 ";
            } else if (isCorrect) {
              buttonClass += "border-green-500 bg-green-50 ";
            } else if (isSelected && !isCorrect) {
              buttonClass += "border-red-500 bg-red-50 ";
            } else {
              buttonClass += "border-gray-300 bg-gray-50 ";
            }

            return (
               <button
                key={index}
                onClick={() => {
                  console.log('Option button clicked, index:', index, 'quizState:', quizState);
                  handleOptionSelect(index);
                }}
                disabled={quizState !== 'question'}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-4 ${
                      quizState === 'question' 
                        ? 'bg-gray-100 text-gray-800' 
                        : isCorrect 
                          ? 'bg-green-100 text-green-800'
                          : isSelected && !isCorrect
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <div className="text-lg font-medium text-gray-900">{option}</div>
                      {quizState !== 'question' && isCorrect && (
                        <div className="text-sm text-gray-600">Correct answer</div>
                      )}
                    </div>
                  </div>
                  {quizState !== 'question' && isCorrect && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                  {quizState !== 'question' && isSelected && !isCorrect && (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback and next button */}
      {quizState === 'correct' && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h4 className="text-lg font-bold text-gray-900">Correct!</h4>
              <p className="text-gray-700">
                <span className="font-medium">{currentWord.polish}</span> means{" "}
                <span className="font-medium">{currentWord.english}</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {quizState === 'incorrect' && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h4 className="text-lg font-bold text-gray-900">Incorrect</h4>
              <p className="text-gray-700">
                The correct answer is{" "}
                <span className="font-medium">{currentWord.english}</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next button */}
      <div className="flex justify-between items-center">
        <div className="text-gray-700">
          {quizState === 'question' ? (
            <p>Select an answer to continue</p>
          ) : (
            <p>
              Question {currentIndex + 1} of {words.length}
            </p>
          )}
        </div>
        <button
          onClick={handleNext}
          disabled={quizState === 'question'}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-colors"
        >
          {currentIndex < words.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
}