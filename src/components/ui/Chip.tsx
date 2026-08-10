"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: ReactNode;
}

/** Pill-shaped filter / choice control. Selection is carried by background AND
 *  a border, so it doesn't rely on colour alone. */
export default function Chip({
  selected = false,
  icon,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...props}
      className={cn(
        "inline-flex items-center gap-2 h-11 px-4 rounded-full text-sm font-medium",
        "border transition-colors duration-200 cursor-pointer whitespace-nowrap",
        selected
          ? "bg-brand-soft border-brand text-brand"
          : "bg-surface border-line text-ink-muted hover:text-ink hover:border-ink-faint",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}
