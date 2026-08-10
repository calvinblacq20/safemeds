"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft">
          <AlertTriangle className="h-7 w-7 text-danger" aria-hidden />
        </div>
        <h1 className="text-3xl text-ink">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="mt-7 inline-flex h-12 cursor-pointer items-center rounded-full bg-brand px-7 text-sm text-brand-ink transition-colors hover:bg-brand-hover"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
