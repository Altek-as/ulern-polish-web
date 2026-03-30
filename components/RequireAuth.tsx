"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * A component that protects routes by checking authentication.
 * If user is not authenticated, redirects to login page.
 * Wrap this around any component that requires authentication.
 */
export default function RequireAuth({ children, redirectTo = "/login" }: RequireAuthProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, router, redirectTo]);

  // Optional: Show loading spinner while checking auth
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}