"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Shows a back control that pops the history stack. */
  back?: boolean;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  back = false,
  actions,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        // Sticky so the title and back control stay reachable while scrolling
        // a long list on a phone. The blur keeps cards legible underneath.
        "sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10",
        "bg-bg/85 backdrop-blur-md",
        "flex items-center gap-3 py-4 lg:py-6",
        className,
      )}
    >
      {back && (
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className={cn(
            "w-11 h-11 -ml-1 shrink-0 rounded-full flex items-center justify-center",
            "bg-surface text-ink shadow-card cursor-pointer",
            "transition-colors duration-200 hover:bg-surface-muted",
          )}
        >
          <ChevronLeft className="w-5 h-5" aria-hidden />
        </button>
      )}

      <div className="min-w-0 flex-1">
        <h1 className="text-xl lg:text-2xl font-normal text-ink truncate">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ink-muted truncate mt-0.5">{subtitle}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
