/**
 * Espelho EXATO da função Postgres public.installment_status().
 * Fonte de verdade continua no banco. O front nunca deve divergir dessa fórmula.
 *
 * SQL:
 *   CASE
 *     WHEN paid_at IS NOT NULL THEN 'paga'
 *     WHEN due_date < CURRENT_DATE THEN 'atrasada'
 *     WHEN date_trunc('month', due_date) = date_trunc('month', ref_month) THEN 'a_vencer'
 *     ELSE 'futura'
 *   END
 */
export type InstallmentStatus = "paga" | "atrasada" | "a_vencer" | "futura";

function toDate(iso?: string | null): Date | null {
  if (!iso) return null;
  return new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function installmentStatus(
  paidAt: string | null | undefined,
  dueDate: string | null | undefined,
  refMonth: Date = new Date(),
): InstallmentStatus {
  if (paidAt) return "paga";
  const due = toDate(dueDate);
  if (!due) return "futura";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (due < today) return "atrasada";
  if (sameMonth(due, refMonth)) return "a_vencer";
  return "futura";
}

export const INSTALLMENT_STATUS_LABEL: Record<InstallmentStatus, string> = {
  paga: "Paga",
  atrasada: "Atrasada",
  a_vencer: "A vencer",
  futura: "Futura",
};

export const INSTALLMENT_STATUS_CLASS: Record<InstallmentStatus, string> = {
  paga: "bg-success/15 text-success",
  atrasada: "bg-destructive/15 text-destructive",
  a_vencer: "bg-warning/15 text-warning",
  futura: "bg-muted text-muted-foreground",
};
