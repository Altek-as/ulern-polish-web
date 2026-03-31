import LevelTest from "@/components/LevelTest";
import { Brain, Target, BarChart } from "lucide-react";

export default function LevelTestPage() {
  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test poziomu języka polskiego</h1>
        <p className="text-gray-700 text-lg">
          Sprawdź swój aktualny poziom biegłości w języku polskim (CEFR A1–C2) dzięki tej krótkiej ocenie.
          Test pomoże spersonalizować Twoją ścieżkę nauki.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
            <Brain className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Ocena adaptacyjna</h3>
          <p className="text-gray-700">
            Pytania obejmują poziomy od początkującego do zaawansowanego, aby dokładnie określić Twoją biegłość.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
            <Target className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Spersonalizowane rekomendacje</h3>
          <p className="text-gray-700">
            Otrzymaj dostosowane sugestie lekcji na podstawie wyników, aby skupić się na obszarach wymagających poprawy.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
            <BarChart className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Śledź postępy</h3>
          <p className="text-gray-700">
            Powtórz test później, aby zmierzyć swoją poprawę i zobaczyć, jak daleko zaszłeś.
          </p>
        </div>
      </div>

      <div className="mb-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Zanim zaczniesz</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-gray-800">Ten test składa się z 10 pytań wielokrotnego wyboru.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-gray-800">Odpowiadaj na podstawie swojej aktualnej wiedzy — bez zgadywania!</span>
            </li>
            <li className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-gray-800">Każde pytanie jest przypisane do określonego poziomu CEFR (A1–C2).</span>
            </li>
            <li className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <div className="h-2 w-2 bg-red-600 rounded-full"></div>
              </div>
              <span className="text-gray-800">Twój końcowy poziom zostanie wyświetlony wraz z wyjaśnieniami i sugestiami.</span>
            </li>
          </ul>
        </div>

        <LevelTest />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">O poziomach CEFR</h2>
        <p className="text-gray-700 mb-6">
          Wspólne Europejskie Ramy Odniesienia dla Języków (CEFR) to międzynarodowy standard opisu umiejętności językowych.
          Używa sześciu poziomów od A1 (początkujący) do C2 (zaawansowany). Znajomość poziomu CEFR pomaga ustalać realistyczne cele i wybierać odpowiednie materiały do nauki.
        </p>
        <a 
          href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 font-semibold hover:text-red-700 inline-flex items-center"
        >
          Dowiedz się więcej o poziomach CEFR
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}