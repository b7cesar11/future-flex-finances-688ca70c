import { useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  requireType?: string; // require typing this string
  destructive?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  requireType,
  destructive = false,
  onClose,
  onConfirm,
}: Props) {
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  if (!open) return null;
  const canConfirm = !requireType || typed === requireType;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button aria-label="Fechar" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center gap-2">
          {destructive && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </span>
          )}
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        {description && <div className="mb-3 text-sm text-muted-foreground">{description}</div>}
        {requireType && (
          <label className="mb-3 block">
            <span className="mb-1 block text-[11px] uppercase text-muted-foreground">
              Digite <strong className="text-destructive">{requireType}</strong> para confirmar
            </span>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-destructive"
            />
          </label>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold text-foreground"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={!canConfirm || busy}
            onClick={async () => {
              if (!canConfirm || busy) return;
              setBusy(true);
              try {
                await onConfirm();
                setTyped("");
                onClose();
              } finally {
                setBusy(false);
              }
            }}
            className={`flex-1 rounded-2xl py-2.5 text-sm font-semibold disabled:opacity-40 ${
              destructive
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {busy ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
