"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Calendar, Edit, Save, LogOut, Award, TrendingUp, Target } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedEmail, setEditedEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoggingOut) {
      router.push("/login");
    }
  }, [user, router, isLoggingOut]);

  // Show loading state while checking auth
  if (!user && !isLoggingOut) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Sprawdzanie uwierzytelniania...</p>
        </div>
      </div>
    );
  }

  // If user is null at this point (and we're logging out), don't render
  if (!user) {
    return null;
  }

  const handleSave = () => {
    setLoading(true);
    updateProfile({ name: editedName, email: editedEmail });
    setTimeout(() => {
      setIsEditing(false);
      setLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.push("/");
  };

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "Recent";

  const stats = [
    { label: "Ukończone lekcje", value: "4", total: "12", icon: Target, color: "bg-blue-500" },
    { label: "Wynik ćwiczeń", value: "87%", icon: TrendingUp, color: "bg-green-500" },
    { label: "Seria nauki", value: "7 dni", icon: Award, color: "bg-purple-500" },
  ];

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Twój profil</h1>
          <p className="text-gray-700 text-lg">
            Zarządzaj swoim kontem i śledź postępy w nauce polskiego.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center">
                  <User className="h-12 w-12 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">Dane osobowe</h2>
                  <p className="text-gray-600">Zaktualizuj szczegóły swojego profilu poniżej.</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-red-600 hover:text-red-700 font-semibold"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  {isEditing ? "Anuluj edycję" : "Edytuj profil"}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-900 font-medium mb-2" htmlFor="name">
                    Imię i nazwisko
                  </label>
                  {isEditing ? (
                    <input
                      id="name"
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                      placeholder="Twoje imię"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-lg">{user.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2" htmlFor="email">
                    Adres email
                  </label>
                  {isEditing ? (
                    <input
                      id="email"
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                      placeholder="your@email.com"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Mail className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-lg">{user.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Członek od</label>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="text-lg">{joinDate}</span>
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Zapisywanie...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Zapisz zmiany
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{stat.label}</h3>
                    {stat.total && (
                      <p className="text-gray-600 text-sm mt-1">{stat.value} z {stat.total} lekcji</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-8">
            {/* Account Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Akcje konta</h2>
              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-4 border border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Wyloguj się
                </button>
                <button className="w-full flex items-center justify-center p-4 border border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <Mail className="h-5 w-5 mr-3" />
                  Zmień hasło
                </button>
                <button className="w-full flex items-center justify-center p-4 border border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <Award className="h-5 w-5 mr-3" />
                  Zobacz osiągnięcia
                </button>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Cele nauki</h2>
               <p className="mb-6">Osiągasz świetne postępy! Kontynuuj codzienną praktykę, aby osiągnąć biegłość.</p>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Dzienne lekcje</span>
                  <span className="font-bold">2/3 ukończone</span>
                </div>
                <div className="w-full bg-red-800 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: "66%" }}></div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Szybkie linki</h2>
              <div className="space-y-3">
                 <Link href="/lessons" className="block text-red-600 hover:text-red-700 font-medium">
                   Kontynuuj naukę
                 </Link>
                 <Link href="/exercises" className="block text-red-600 hover:text-red-700 font-medium">
                   Ćwicz słownictwo
                 </Link>
                 <Link href="/progress" className="block text-red-600 hover:text-red-700 font-medium">
                   Zobacz panel postępów
                 </Link>
                 <Link href="/" className="block text-red-600 hover:text-red-700 font-medium">
                   Wróć do strony głównej
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}