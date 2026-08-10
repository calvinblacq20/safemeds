import { cn } from "@/lib/cn";

/** Placeholder block. Callers size it, so the reserved space matches the real
 *  content and nothing jumps when data lands. */
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-xl bg-surface-sunken", className)}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-card bg-surface shadow-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}
