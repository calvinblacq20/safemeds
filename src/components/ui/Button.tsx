"use client";

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-ink shadow-brand hover:bg-brand-hover active:bg-brand-hover",
  secondary:
    "bg-surface text-ink border border-line hover:bg-surface-muted active:bg-surface-muted",
  ghost: "text-ink-muted hover:bg-surface-muted hover:text-ink active:bg-surface-muted",
  danger: "bg-danger text-white hover:brightness-95 active:brightness-90",
};

/* Heights clear the 44px minimum touch target at md and lg. `sm` is only for
   controls that sit inside an already-tappable row (chips, table actions). */
const SIZES: Record<Size, string> = {
  // Fully rounded — every button in the reference is a pill.
  sm: "h-9 px-4 text-sm rounded-full gap-1.5",
  md: "h-11 px-5 text-sm rounded-full gap-2",
  lg: "h-14 px-7 text-base rounded-full gap-2",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return cn(
    "inline-flex items-center justify-center font-medium cursor-pointer",
    "transition-colors duration-200 select-none",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
    VARIANTS[variant],
    SIZES[size],
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClasses(variant, size), fullWidth && "w-full", className)}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
