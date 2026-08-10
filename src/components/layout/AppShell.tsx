"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/cn";
import BottomNav from "./BottomNav";
import SideNav from "./SideNav";
import { navForRole, type Role } from "./navConfig";

interface AppShellProps {
  children: ReactNode;
  /** `id` from navConfig — drives the active state in both navs. */
  activeId?: string;
  /** Overrides the signed-in user's role, e.g. on shared staff screens. */
  role?: Role;
  /** Rendered above the content, inside the same column. */
  header?: ReactNode;
  /** `wide` for table-heavy screens that need the extra room on desktop. */
  width?: "default" | "wide";
}

/**
 * The app frame: a floating pill nav on phones, a fixed sidebar from `lg` up.
 * Pages render only their content — never their own chrome — so navigation
 * stays identical across every screen.
 */
export default function AppShell({
  children,
  activeId,
  role,
  header,
  width = "default",
}: AppShellProps) {
  const { user } = useAuth();
  const nav = navForRole(role ?? (user?.role as Role | undefined));

  return (
    <div className="min-h-screen bg-bg">
      <SideNav
        primary={nav.primary}
        secondary={nav.secondary}
        activeId={activeId}
        homeHref={nav.home}
      />

      <div className="lg:pl-64">
        <div
          className={cn(
            "mx-auto w-full px-4 sm:px-6 lg:px-10",
            // Clears the floating nav on mobile; the sidebar needs no offset.
            "pb-32 lg:pb-14",
            width === "wide" ? "max-w-7xl" : "max-w-2xl lg:max-w-5xl",
          )}
        >
          {header}
          <main>{children}</main>
        </div>
      </div>

      <BottomNav items={nav.primary} activeId={activeId} />
    </div>
  );
}
