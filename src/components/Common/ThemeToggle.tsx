"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "icon";
}

const BOX = { sm: "w-9 h-9", md: "w-11 h-11", lg: "w-12 h-12" };
const ICON = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-5 h-5" };

export default function ThemeToggle({
  className = "",
  size = "md",
  variant = "button",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const label = `Switch to ${theme === "light" ? "dark" : "light"} mode`;
  const Icon = theme === "light" ? Moon : Sun;

  const base = cn(
    "flex items-center justify-center cursor-pointer",
    "bg-surface-muted text-ink-muted hover:text-ink hover:bg-surface-sunken",
    "transition-colors duration-200",
  );

  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        aria-label={label}
        className={cn(base, BOX[size], "rounded-full shrink-0", className)}
      >
        <Icon className={ICON[size]} aria-hidden />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      className={cn(base, "h-11 gap-2 rounded-2xl px-4 font-medium", className)}
    >
      <Icon className={ICON[size]} aria-hidden />
      <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
