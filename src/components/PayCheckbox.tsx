import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  paid: boolean;
  onToggle: () => Promise<void> | void;
  size?: "sm" | "md";
  ariaLabel?: string;
}

export function PayCheckbox({ paid, onToggle, size = "md", ariaLabel = "Alternar pago" }: Props) {
  const [busy, setBusy] = useState(false);
  const dim = size === "sm" ? "h-6 w-6" : "h-7 w-7";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={paid}
      disabled={busy}
      onClick={async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        try {
          await onToggle();
        } finally {
          setBusy(false);
        }
      }}
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
        paid
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-transparent text-transparent hover:border-primary/60"
      }`}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      ) : (
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      )}
    </button>
  );
}
