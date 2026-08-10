"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Info,
  LogOut,
  Menu,
  MessageCircle,
  ClipboardList,
  Truck,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/cn";

interface NavigationProps {
  title: string;
  userRole: "client" | "pharmacy" | "admin";
}

const LINKS = [
  { label: "Consult", href: "/consult", icon: ClipboardList },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Delivery", href: "/delivery", icon: Truck },
  { label: "About", href: "/about", icon: Info },
];

export default function Navigation({ title, userRole }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="px-4 pt-5 sm:px-6">
      <nav className="mx-auto flex max-w-5xl items-center gap-3 rounded-full bg-surface px-4 py-2.5 shadow-card sm:px-6">
        {/* Pages embed this component for their page title, so this is the
            document's h1 — pages must not render another one. */}
        <h1 className="min-w-0 truncate text-lg tracking-tight text-ink">
          {title}
        </h1>

        <div className="ml-6 hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle variant="icon" size="md" />

          <span className="hidden max-w-[12rem] truncate px-2 text-sm text-ink-muted lg:inline">
            {user?.email || user?.username}
            <span className="sr-only"> — {userRole} account</span>
          </span>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "hidden h-11 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm",
              "text-ink transition-colors hover:bg-surface-muted",
              "disabled:cursor-not-allowed disabled:opacity-50 md:inline-flex",
            )}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-card bg-surface p-3 shadow-card md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-11 items-center gap-3 rounded-2xl px-4 text-sm text-ink transition-colors hover:bg-surface-muted"
            >
              <link.icon className="h-4 w-4 text-ink-muted" aria-hidden />
              {link.label}
            </Link>
          ))}

          <div className="mt-2 border-t border-line pt-2">
            <p className="truncate px-4 py-2 text-xs text-ink-muted">
              {user?.email || user?.username} · {userRole} account
            </p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-2xl px-4 text-sm text-ink transition-colors hover:bg-surface-muted disabled:opacity-50"
            >
              <LogOut className="h-4 w-4 text-ink-muted" aria-hidden />
              {isLoggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
