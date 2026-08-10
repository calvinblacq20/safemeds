import Image from "next/image";
import { cn } from "@/lib/cn";

const SIZES = {
  sm: { box: "w-9 h-9", text: "text-xs", px: 36 },
  md: { box: "w-12 h-12", text: "text-sm", px: 48 },
  lg: { box: "w-16 h-16", text: "text-base", px: 64 },
  xl: { box: "w-24 h-24", text: "text-xl", px: 96 },
} as const;

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const s = SIZES[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={s.px}
        height={s.px}
        className={cn(s.box, "rounded-full object-cover", className)}
      />
    );
  }

  // No photo: initials on a brand tint. aria-hidden because the adjacent name
  // is always rendered — announcing "JD" as well is noise for screen readers.
  return (
    <div
      aria-hidden
      className={cn(
        s.box,
        s.text,
        "rounded-full bg-brand-soft text-brand font-semibold",
        "flex items-center justify-center shrink-0",
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
