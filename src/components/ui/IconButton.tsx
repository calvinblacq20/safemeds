"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "surface" | "onBrand";

const TONES: Record<Tone, string> = {
  surface: "bg-surface text-ink shadow-card hover:bg-surface-muted",
  // Sits on top of a brand-coloured card.
  onBrand: "bg-brand-ink/20 text-brand-ink hover:bg-brand-ink/30",
};

interface BaseProps {
  /** Required — these buttons are icon-only, so this is their whole name. */
  label: string;
  icon: ReactNode;
  tone?: Tone;
  className?: string;
}

/** The circular control used throughout the design — header actions, card
 *  corners, call controls. Always 44px so it clears the touch-target floor. */
export default function IconButton({
  label,
  icon,
  tone = "surface",
  className,
  href,
  ...props
}: BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & { href?: string }) {
  const classes = cn(
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
    "cursor-pointer transition-colors duration-200",
    TONES[tone],
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} className={classes} {...props}>
      {icon}
    </button>
  );
}
