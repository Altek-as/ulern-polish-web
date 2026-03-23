import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "uLern Polish - Learn Polish Language",
  description: "Interactive Polish language learning platform with lessons, exercises, and progress tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <ThemeProvider>
          {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PL</span>
              </div>
               <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-red-600 transition-colors">
                uLern<span className="text-red-600">Polish</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors">
                Home
              </Link>
              <Link href="/lessons" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors">
                Lessons
              </Link>
              <Link href="/exercises" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors">
                Exercises
              </Link>
              <Link href="/level-test" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors">
                Level Test
              </Link>
              <Link href="/progress" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors">
                Progress
              </Link>
              <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors">
                Login
              </Link>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Get Started
              </button>
              <ThemeToggle />
            </nav>

            {/* Mobile navigation - CSS-only toggle */}
            <div className="md:hidden relative">
              <input 
                type="checkbox" 
                id="mobile-menu-toggle" 
                className="hidden peer"
                aria-label="Toggle mobile menu"
              />
              <label 
                htmlFor="mobile-menu-toggle"
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer block"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <div className="absolute left-0 right-0 top-full border-t border-gray-200 bg-white px-4 py-3 hidden peer-checked:block">
                <div className="flex flex-col space-y-3">
                  <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium py-2">
                    Home
                  </a>
                  <a href="/lessons" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium py-2">
                    Lessons
                  </a>
                  <a href="/exercises" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium py-2">
                    Exercises
                  </a>
                  <a href="/level-test" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium py-2">
                    Level Test
                  </a>
                  <a href="/progress" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium py-2">
                    Progress
                  </a>
                  <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium py-2">
                    Login
                  </a>
                  <div className="py-2">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PL</span>
                  </div>
                   <span className="text-xl font-bold text-gray-900 dark:text-gray-100">uLern<span className="text-red-600">Polish</span></span>
                </div>
                 <p className="text-gray-600 dark:text-gray-400 mt-2">Learn Polish language effectively with interactive lessons and exercises.</p>
              </div>
               <div className="text-gray-600 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} uLern Polish. All rights reserved.</p>
                <p className="text-sm mt-1">Made with ❤️ for Polish learners worldwide.</p>
              </div>
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}