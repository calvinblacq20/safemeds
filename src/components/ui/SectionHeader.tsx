import Link from "next/link";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  title: string;
  /** Renders the trailing "See all" link. Omit for sections with no index page. */
  href?: string;
  action?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  href,
  action = "See all",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 mb-4", className)}>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-brand hover:text-brand-hover transition-colors shrink-0"
        >
          {action}
          {/* Names the section so "See all" isn't ambiguous out of context. */}
          <span className="sr-only"> in {title}</span>
        </Link>
      )}
    </div>
  );
}
