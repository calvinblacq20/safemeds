"use client";

import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function SearchField({
  label = "Search",
  className,
  ...props
}: SearchFieldProps) {
  const id = useId();

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-ink-faint pointer-events-none"
        aria-hidden
      />
      <input
        {...props}
        id={id}
        type="search"
        className={cn(
          "w-full h-12 pl-11 pr-4 rounded-2xl text-sm",
          "bg-surface text-ink placeholder:text-ink-faint",
          "border border-transparent shadow-card",
          "transition-colors duration-200 focus:border-brand",
        )}
      />
    </div>
  );
}
