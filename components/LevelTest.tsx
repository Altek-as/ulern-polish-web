"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, HelpCircle, Trophy, ArrowRight, Award } from "lucide-react";
import { levelTestQuestions, levelThresholds, levelDescriptions } from "@/lib/data/levelTest";
import { useProgressStore } from "@/lib/store/progress";

type QuizState = 'question' | 'correct' | 'incorrect' | 'completed';

export default function LevelTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('question');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [levelResult, setLevelResult] = useState<string | null>(null);
  const { setPolishLevel } = useProgressStore();

  const currentQuestion = levelTestQuestions[currentIndex];

  useEffect(() => {
    console.log('quizState changed:', quizState);
  }, [quizState]);

  const handleOptionSelect = (index: number) => {
    if (quizState !== 'question') return;
    setSelectedOption(index);
    
    const isCorrect = index === currentQuestion.correctAnswer;
    if (isCorrect) {
      setQuizState('correct');
      setScore(prev => prev + 1);
    } else {
      setQuizState('incorrect');
    }
    setQuestionsAnswered(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < levelTestQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuizState('question');
    } else {
      // Calculate level
      const level = calculateLevel(score);
      setPolishLevel(level);
      setLevelResult(level);
      setQuizState('completed');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuestionsAnswered(0);
    setSelectedOption(null);
    setQuizState('question');
    setLevelResult(null);
  };

  const calculateLevel = (score: number): string => {
    const threshold = levelThresholds.find(
      t => score >= t.minScore && score <= t.maxScore
    );
    return threshold ? threshold.level : 'A1';
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700">No questions available.</p>
      </div>
    );
  }

  if (quizState === 'completed' && levelResult) {
    const levelInfo = levelDescriptions[levelResult];
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-4xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Award className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Level Test Completed!</h2>
          <p className="text-gray-700 mb-8">
            Great job! You've completed the Polish language level test.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-gray-900 mb-2">{score}</div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-gray-900 mb-2">{levelTestQuestions.length}</div>
              <div className="text-gray-600">Total Questions</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {Math.round((score / levelTestQuestions.length) * 100)}%
              </div>
              <div className="text-gray-600">Accuracy</div>
            </div>
          </div>

          {/* Level Result */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-left mb-6 md:mb-0">
                <div className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">Your Polish Level</div>
                <div className="text-5xl font-bold text-gray-900 mb-2">{levelInfo.title}</div>
                <p className="text-gray-700 max-w-2xl">{levelInfo.description}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-6xl font-bold text-red-600">{levelResult}</div>
                <div className="text-gray-600 text-sm mt-2">CEFR Level</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="text-left mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Next Steps</h3>
            <ul className="space-y-4">
              {levelInfo.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                    <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-800">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Retake Test
            </button>
            <a
              href="/lessons"
              className="px-8 py-4 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors text-center"
            >
              Browse Lessons
            </a>
            <a
              href="/exercises"
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors text-center"
            >
              Practice Exercises
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-3xl mx-auto">
      {/* Quiz header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Polish Language Level Test</h2>
          <p className="text-gray-600">Determine your CEFR level (A1–C2)</p>
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
          <span>{currentIndex + 1} of {levelTestQuestions.length}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / levelTestQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Difficulty badge */}
      <div className="mb-8">
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
          currentQuestion.difficulty === 'A1' || currentQuestion.difficulty === 'A2' 
            ? 'bg-green-100 text-green-800' 
            : currentQuestion.difficulty === 'B1' || currentQuestion.difficulty === 'B2'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          <span className="mr-2">Level:</span> {currentQuestion.difficulty}
        </span>
      </div>

      {/* Question */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <HelpCircle className="h-6 w-6 text-red-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">{currentQuestion.question}</h3>
        </div>
      </div>

      {/* Options */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            
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
                onClick={() => handleOptionSelect(index)}
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

      {/* Feedback and explanation */}
      {quizState === 'correct' && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h4 className="text-lg font-bold text-gray-900">Correct!</h4>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
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
              <p className="text-gray-700">{currentQuestion.explanation}</p>
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
              Question {currentIndex + 1} of {levelTestQuestions.length}
            </p>
          )}
        </div>
        <button
          onClick={handleNext}
          disabled={quizState === 'question'}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-colors flex items-center"
        >
          {currentIndex < levelTestQuestions.length - 1 ? 'Next Question' : 'Finish Test'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}