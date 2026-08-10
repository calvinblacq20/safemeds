"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, ShieldPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { cn } from "@/lib/cn";
import type { NavItem } from "./navConfig";

interface SideNavProps {
  primary: NavItem[];
  secondary: NavItem[];
  activeId?: string;
  homeHref: string;
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 h-11 px-3 rounded-2xl text-sm font-medium",
        "transition-colors duration-200",
        isActive
          ? "bg-brand-soft text-brand"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink",
      )}
    >
      <Icon className="w-5 h-5 shrink-0" aria-hidden />
      {item.label}
    </Link>
  );
}

/** Desktop-only rail. Below `lg` the same destinations live in BottomNav. */
export default function SideNav({
  primary,
  secondary,
  activeId,
  homeHref,
}: SideNavProps) {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // Session teardown failed — let the user try again rather than
      // stranding them on a disabled button.
      setLoggingOut(false);
    }
  };

  return (
    <aside
      aria-label="Primary"
      className={cn(
        "hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col",
        "bg-surface border-r border-line print:hidden",
      )}
    >
      <Link
        href={homeHref}
        className="flex items-center gap-2.5 h-20 px-6 shrink-0 text-ink"
      >
        <span className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
          <ShieldPlus className="w-5 h-5 text-brand-ink" aria-hidden />
        </span>
        <span className="text-lg font-bold tracking-tight">SafeMeds</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {primary.map((item) => (
          <NavLink key={item.id} item={item} isActive={item.id === activeId} />
        ))}

        {secondary.length > 0 && (
          <>
            <hr className="my-3 border-line" />
            {secondary.map((item) => (
              <NavLink key={item.id} item={item} isActive={item.id === activeId} />
            ))}
          </>
        )}
      </nav>

      <div className="shrink-0 border-t border-line p-3 space-y-1">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="text-sm text-ink-muted truncate" title={user?.email ?? ""}>
            {user?.name || user?.email || "Signed in"}
          </span>
          <ThemeToggle variant="icon" size="sm" />
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "flex w-full items-center gap-3 h-11 px-3 rounded-2xl text-sm font-medium",
            "text-ink-muted transition-colors duration-200 cursor-pointer",
            "hover:bg-danger-soft hover:text-danger",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" aria-hidden />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
