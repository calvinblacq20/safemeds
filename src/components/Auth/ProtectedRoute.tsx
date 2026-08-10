"use client";

import { useAuth } from "@/hooks/useAuth";
import { Lock, ShieldOff } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  fallback,
}: ProtectedRouteProps) {
  const { isLoading, user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Handle role-based redirects in useEffect
  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      user?.role &&
      allowedRoles.length > 0
    ) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const dashboardPath =
          user.role === "ADMIN"
            ? "/admin"
            : user.role === "PHARMACY"
            ? "/pharmacy-dashboard"
            : "/client-dashboard";
        router.push(dashboardPath);
      }
    }
  }, [isLoading, isAuthenticated, user?.role, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div
            role="status"
            aria-label="Loading"
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-line border-t-ink"
          />
          <h2 className="text-xl text-ink">Loading…</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Checking authentication status
          </p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-4">
        <div className="w-full max-w-md rounded-card bg-surface p-8 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
            <Lock className="h-6 w-6 text-ink" aria-hidden />
          </div>
          <h1 className="text-2xl text-ink">Authentication required</h1>
          <p className="mt-3 text-sm text-ink-muted">
            Please sign in to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (
    allowedRoles.length > 0 &&
    user?.role &&
    !allowedRoles.includes(user.role)
  ) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-4">
        <div className="w-full max-w-md rounded-card bg-surface p-8 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft">
            <ShieldOff className="h-6 w-6 text-danger" aria-hidden />
          </div>
          <h1 className="text-2xl text-ink">Access denied</h1>
          <p className="mt-3 text-sm text-ink-muted">
            You don&apos;t have permission to access this page.
            {allowedRoles.length > 0 && (
              <>
                {" "}
                This area is restricted to {allowedRoles.join(" or ")} users
                only.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
