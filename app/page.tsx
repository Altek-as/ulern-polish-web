import Link from "next/link";
import { BookOpen, Brain, TrendingUp, Users, BotMessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
       <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24">
        <div className="container relative mx-auto px-4 md:px-8 text-center animate-fade-in">
           <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Learn <span className="text-red-600">Polish</span> the Smart Way
          </h1>
           <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Master the Polish language with interactive lessons, vocabulary exercises, and progress tracking designed for learners of all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lessons"
              className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Learning
            </Link>
            <Link
              href="/exercises"
              className="inline-flex items-center justify-center bg-white text-red-600 border border-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors"
            >
              <Brain className="mr-2 h-5 w-5" />
              Try Exercises
            </Link>
            <a
              href="http://localhost:5000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              <BotMessageSquare className="mr-2 h-5 w-5" />
              Launch VR Experience
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
       <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8">
           <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">Why Choose uLern Polish?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Structured Lessons</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Step-by-step lessons from beginner to intermediate, covering grammar, vocabulary, and pronunciation.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Interactive Exercises</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Flashcards, quizzes, and speaking exercises to reinforce learning and improve retention.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Progress Tracking</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Monitor your improvement with detailed statistics, achievements, and personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Polish Journey Today</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of learners who have improved their Polish language skills with uLern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
               className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Users className="mr-2 h-5 w-5" />
              Create Free Account
            </Link>
            <Link
              href="/lessons"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              Explore Lessons
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}