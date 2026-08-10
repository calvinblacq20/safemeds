import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface RatingProps {
  value: number;
  count?: number;
  /** `pill` is the badge that sits on a card corner; `inline` runs in text. */
  variant?: "pill" | "inline";
  className?: string;
}

export default function Rating({
  value,
  count,
  variant = "inline",
  className,
}: RatingProps) {
  const label = count
    ? `Rated ${value.toFixed(1)} out of 5 from ${count} reviews`
    : `Rated ${value.toFixed(1)} out of 5`;

  return (
    <span
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-semibold",
        variant === "pill" &&
          "bg-surface text-ink rounded-full px-2.5 py-1 shadow-card",
        className,
      )}
    >
      <Star className="w-3.5 h-3.5 fill-gold text-gold" aria-hidden />
      <span aria-hidden>{value.toFixed(1)}</span>
      {count !== undefined && (
        <span aria-hidden className="font-normal text-ink-muted">
          ({count.toLocaleString()})
        </span>
      )}
    </span>
  );
}
