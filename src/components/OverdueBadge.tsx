import { AlertTriangle } from "lucide-react";
import type { PaymentStatus } from "@/lib/finance-store";

export function isOverdue(dueDate: string | null | undefined, status: PaymentStatus | string) {
  if (!dueDate || status === "pago") return false;
  const d = dueDate.length <= 10 ? new Date(dueDate + "T23:59:59") : new Date(dueDate);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function OverdueBadge({ dueDate, status }: { dueDate: string | null | undefined; status: PaymentStatus | string }) {
  if (!isOverdue(dueDate, status)) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive-foreground">
      <AlertTriangle className="h-2.5 w-2.5" strokeWidth={3} />
      Vencida
    </span>
  );
}
