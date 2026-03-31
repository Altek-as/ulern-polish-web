"use client";

import { useState } from "react";
import { Volume2, RotateCw } from "lucide-react";
import { VocabularyWord } from "@/lib/data/lessons";
import { useProgressStore } from "@/lib/store/progress";

interface FlashcardProps {
  word: VocabularyWord;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalWords?: number;
}

export default function Flashcard({ word, onNext, onPrevious, currentIndex = 0, totalWords = 1 }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { recordVocabularyAttempt, getWordMastery } = useProgressStore();
  const isMastered = getWordMastery(word.polish);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipped(!flipped);
    // Record practice attempt when card is flipped (viewing translation counts as practice)
    recordVocabularyAttempt(word.polish, true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={handleFlip}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-label={flipped ? `English translation: ${word.english}` : `Polish word: ${word.polish}`}
      >
        {/* Flashcard */}
        <div className={`absolute inset-0 w-full h-full transition-transform duration-300 preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}>
          {/* Front side */}
           <div className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-lg backface-hidden flex flex-col items-center justify-center p-8">
            <div className="text-center">
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Polish</div>
               <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{word.polish}</h2>
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-6">
                <Volume2 className="h-5 w-5 mr-2" />
                <span className="text-lg">{word.phonetic}</span>
              </div>
              <div className="text-gray-700 dark:text-gray-300 italic text-center">
                "{word.exampleSentence}"
              </div>
            </div>
               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 dark:text-gray-500 text-sm">
              Click or press space to flip
            </div>
          </div>

          {/* Back side */}
           <div className="absolute inset-0 w-full h-full bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl shadow-lg backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8">
            <div className="text-center">
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">English</div>
               <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{word.english}</h2>
              <div className="text-gray-700 dark:text-gray-300 mb-6">
                <div className="font-medium mb-2">Pronunciation:</div>
                <div className="text-lg">{word.phonetic}</div>
              </div>
              <div className="text-gray-700 dark:text-gray-300 italic text-center">
                "{word.exampleSentence}"
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 dark:text-gray-400 text-sm flex items-center">
              <RotateCw className="h-4 w-4 mr-2" />
              Flip back
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          disabled={!onPrevious}
        >
          Previous
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleFlip}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 text-white font-semibold rounded-lg transition-colors flex items-center"
          >
            <RotateCw className="mr-2 h-5 w-5" />
            Flip Card
          </button>
           {isMastered && (
             <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full">
               Mastered
             </span>
           )}
        </div>
        <button
          onClick={onNext}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          disabled={!onNext}
        >
          Next
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-300"
            style={{ width: `${totalWords > 1 ? ((currentIndex + 1) / totalWords) * 100 : 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm">Word {currentIndex + 1} of {totalWords}</p>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}