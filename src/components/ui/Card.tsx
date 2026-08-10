import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover elevation + pointer cursor. Only for cards that are links. */
  interactive?: boolean;
  /** Inverts to the brand colour — the "featured" card in a rail. */
  tone?: "surface" | "brand";
  padded?: boolean;
}

export default function Card({
  interactive = false,
  tone = "surface",
  padded = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-card",
        tone === "surface" ? "bg-surface shadow-card" : "bg-brand text-brand-ink shadow-brand",
        padded && "p-5",
        interactive &&
          "cursor-pointer transition-shadow duration-200 hover:shadow-raised",
        className,
      )}
    >
      {children}
    </div>
  );
}
