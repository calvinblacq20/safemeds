"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { NavItem } from "./navConfig";

interface BottomNavProps {
  items: NavItem[];
  activeId?: string;
}

/**
 * Floating pill navigation for small screens. The active item expands into a
 * labelled blue pill; the pill itself is a shared layout element, so moving
 * between tabs slides it rather than cross-fading two backgrounds.
 */
export default function BottomNav({ items, activeId }: BottomNavProps) {
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "lg:hidden fixed inset-x-0 bottom-0 z-40 print:hidden",
        // Sits above the home indicator on iOS rather than under it.
        "px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2",
        "pointer-events-none",
      )}
    >
      <ul
        className={cn(
          "pointer-events-auto mx-auto flex max-w-md items-center justify-between",
          "rounded-full bg-surface p-1.5 shadow-raised",
          "border border-line",
        )}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          const Icon = item.icon;

          return (
            <li key={item.id} className="relative">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-12 items-center justify-center gap-2 rounded-full",
                  "text-sm font-semibold transition-colors duration-200",
                  isActive ? "px-4 text-brand-ink" : "w-12 text-ink-muted hover:text-ink",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-pill"
                    aria-hidden
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                    className="absolute inset-0 rounded-full bg-brand"
                  />
                )}
                <Icon className="relative w-5 h-5 shrink-0" aria-hidden />
                {isActive ? (
                  <span className="relative">{item.label}</span>
                ) : (
                  <span className="sr-only">{item.label}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
