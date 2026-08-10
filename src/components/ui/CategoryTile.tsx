import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface CategoryTileProps {
  label: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}

/** Circular icon + caption, used in the horizontally-scrolling category rail. */
export default function CategoryTile({
  label,
  icon: Icon,
  href,
  className,
}: CategoryTileProps) {
  return (
    <Link
      href={href}
      className={cn("group w-20 shrink-0 text-center cursor-pointer", className)}
    >
      <span
        className={cn(
          "mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full",
          "bg-surface shadow-card transition-colors duration-200",
          "group-hover:bg-brand-soft",
        )}
      >
        <Icon className="h-6 w-6 text-brand" aria-hidden />
      </span>
      <span className="block text-xs font-medium leading-tight text-ink-muted transition-colors duration-200 group-hover:text-ink">
        {label}
      </span>
    </Link>
  );
}
