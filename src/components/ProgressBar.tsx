import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  rightLabel?: string;
  tone?: "primary" | "destructive" | "warning";
  size?: "sm" | "md";
}

/**
 * Progress bar with label ALWAYS outside the fill area (above).
 * Guarantees legibility on small screens.
 */
export function ProgressBar({ value, label, rightLabel, tone = "primary", size = "md" }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const fillClass =
    tone === "destructive"
      ? "bg-destructive"
      : tone === "warning"
        ? "bg-warning"
        : "bg-gradient-primary";

  return (
    <div className="w-full">
      {(label || rightLabel) && (
        <div className="mb-2 flex items-baseline justify-between gap-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {rightLabel && <span className="text-sm font-semibold text-muted-foreground tabular-nums">{rightLabel}</span>}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-secondary",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", fillClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
