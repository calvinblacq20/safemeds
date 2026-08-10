"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isPublicRoute } from "@/lib/publicRoutes";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authState, setAuthState] = useState<{
    loading: boolean;
    unauthorized?: boolean;
    authorized?: boolean;
  }>({ loading: true });

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/auth");
  };

  const requireAuth = (allowedRoles?: string[]) => {
    if (isLoading) {
      setAuthState({ loading: true });
      return { loading: true };
    }

    if (!isAuthenticated) {
      setAuthState({ loading: false, unauthorized: true });
      return { loading: false, unauthorized: true };
    }

    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
      setAuthState({ loading: false, unauthorized: true });
      return { loading: false, unauthorized: true };
    }

    setAuthState({ loading: false, authorized: true });
    return { loading: false, authorized: true };
  };

  // Handle redirects in useEffect to avoid render-time navigation.
  // This hook is mounted app-wide via NotificationContext/OnboardingContext, so
  // it has to honour the same public-route list as the middleware — otherwise
  // it drags anonymous visitors off /consult, /track and the marketing pages.
  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    if (isPublicRoute(window.location.pathname)) return;
    router.push("/auth");
  }, [isLoading, isAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    requireAuth,
    session,
    authState,
  };
}
