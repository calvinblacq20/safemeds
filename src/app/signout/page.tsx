"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function SignOutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        setIsLoggingOut(false);

        // Redirect to auth page after a brief delay
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } catch (error) {
        console.error("Logout error:", error);
        setError("Failed to sign out. Please try again.");
        setIsLoggingOut(false);
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-bg p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          {isLoggingOut ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-6 h-16 w-16 rounded-full border-2 border-line border-t-ink"
              />
              <h1 className="mb-4 text-2xl text-ink">
                Signing Out...
              </h1>
              <p className="mb-6 text-ink-muted">
                Goodbye, {user?.name || user?.username}! We&apos;re signing you
                out securely.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-ink-muted">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-ink-faint"
                  />
                  <span>Ending your session</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-ink-muted">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    className="h-2 w-2 rounded-full bg-ink-faint"
                  />
                  <span>Clearing local data</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-ink-muted">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                    className="h-2 w-2 rounded-full bg-ink-faint"
                  />
                  <span>Redirecting to login</span>
                </div>
              </div>
            </>
          ) : error ? (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="mb-4 text-2xl text-ink">
                Sign Out Error
              </h1>
              <p className="mb-6 text-danger">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/auth")}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand text-sm text-brand-ink transition-colors hover:bg-brand-hover"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-surface-muted text-sm text-ink transition-colors hover:bg-surface-sunken"
                >
                  Try Again
                </button>
              </div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0, type: "spring" }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ok-soft"
              >
                <span className="text-2xl">✅</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="mb-4 text-2xl text-ink"
              >
                Successfully Signed Out
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="mb-6 text-ink-muted"
              >
                You have been securely signed out of your SafeMeds account.
                Redirecting you to the login page...
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-ink-muted"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-ok"
                />
                <span>Redirecting in 2 seconds...</span>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
