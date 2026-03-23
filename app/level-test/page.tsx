import LevelTest from "@/components/LevelTest";
import { Brain, Target, BarChart } from "lucide-react";

export default function LevelTestPage() {
  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Polish Language Level Test</h1>
        <p className="text-gray-700 text-lg">
          Discover your current Polish proficiency level (CEFR A1–C2) with this short assessment.
          The test will help personalize your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
            <Brain className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Adaptive Assessment</h3>
          <p className="text-gray-700">
            Questions range from beginner to advanced levels to accurately determine your proficiency.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
            <Target className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Recommendations</h3>
          <p className="text-gray-700">
            Get tailored lesson suggestions based on your results to focus on areas that need improvement.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
            <BarChart className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
          <p className="text-gray-700">
            Retake the test later to measure your improvement and see how far you've come.
          </p>
        </div>
      </div>

      <div className="mb-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Before You Start</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-gray-800">This test consists of 10 multiple-choice questions.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-gray-800">Answer based on your current knowledge—no guessing!</span>
            </li>
            <li className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-gray-800">Each question is timed to a specific CEFR level (A1–C2).</span>
            </li>
            <li className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-gray-800">Your final level will be displayed with explanations and suggestions.</span>
            </li>
          </ul>
        </div>

        <LevelTest />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About CEFR Levels</h2>
        <p className="text-gray-700 mb-6">
          The Common European Framework of Reference for Languages (CEFR) is an international standard for describing language ability.
          It uses six levels from A1 (beginner) to C2 (proficient). Understanding your CEFR level helps you set realistic goals and choose appropriate learning materials.
        </p>
        <a 
          href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 font-semibold hover:text-red-700 inline-flex items-center"
        >
          Learn more about CEFR levels
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}