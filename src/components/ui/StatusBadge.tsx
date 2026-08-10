import { cn } from "@/lib/cn";

type Tone = "brand" | "ok" | "warn" | "danger" | "neutral";

const TONES: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-surface-muted text-ink-muted",
};

/** Maps the app's domain statuses onto tones in one place, so a status never
 *  renders yellow on one screen and grey on another. */
const STATUS_TONES: Record<string, Tone> = {
  PENDING: "warn",
  SCHEDULED: "brand",
  IN_PROGRESS: "brand",
  ACTIVE: "brand",
  CONFIRMED: "brand",
  PROCESSING: "brand",
  SHIPPED: "brand",
  OUT_FOR_DELIVERY: "brand",
  COMPLETED: "ok",
  DELIVERED: "ok",
  APPROVED: "ok",
  CANCELLED: "danger",
  FAILED: "danger",
  REJECTED: "danger",
};

export function toneForStatus(status: string): Tone {
  return STATUS_TONES[status.toUpperCase()] ?? "neutral";
}

interface StatusBadgeProps {
  status: string;
  tone?: Tone;
  className?: string;
}

export default function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  const label = status.replace(/_/g, " ").toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full",
        "text-xs font-semibold capitalize whitespace-nowrap",
        TONES[tone ?? toneForStatus(status)],
        className,
      )}
    >
      {label}
    </span>
  );
}
