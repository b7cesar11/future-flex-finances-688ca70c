import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type PeriodKind = "semanal" | "mensal" | "anual" | "personalizado";

export interface PeriodRange {
  kind: PeriodKind;
  start: Date;
  end: Date;
  label: string;
}

interface PeriodCtx {
  range: PeriodRange;
  setKind: (k: PeriodKind) => void;
  setCustom: (start: Date, end: Date) => void;
  isInRange: (isoDate: string) => boolean;
  shiftMonth: (delta: number) => void;
  monthRef: Date;
}

const Ctx = createContext<PeriodCtx | null>(null);

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = (day + 6) % 7;
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfWeek(d: Date) {
  const x = startOfWeek(d);
  x.setDate(x.getDate() + 6);
  x.setHours(23, 59, 59, 999);
  return x;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function buildRange(
  kind: PeriodKind,
  monthRef: Date,
  custom?: { start: Date; end: Date },
): PeriodRange {
  const now = new Date();
  if (kind === "semanal") {
    const s = startOfWeek(now);
    const e = endOfWeek(now);
    return { kind, start: s, end: e, label: "Esta semana" };
  }
  if (kind === "anual") {
    return {
      kind,
      start: new Date(now.getFullYear(), 0, 1),
      end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      label: `${now.getFullYear()}`,
    };
  }
  if (kind === "personalizado" && custom) {
    return {
      kind,
      start: custom.start,
      end: custom.end,
      label: `${custom.start.toLocaleDateString("pt-BR")} → ${custom.end.toLocaleDateString("pt-BR")}`,
    };
  }
  return {
    kind: "mensal",
    start: startOfMonth(monthRef),
    end: endOfMonth(monthRef),
    label: monthRef.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  };
}

export function PeriodFilterProvider({ children }: { children: ReactNode }) {
  const [kind, setKindState] = useState<PeriodKind>("mensal");
  const [custom, setCustomState] = useState<{ start: Date; end: Date } | undefined>();
  const [monthRef, setMonthRef] = useState<Date>(() => startOfMonth(new Date()));

  const range = useMemo(() => buildRange(kind, monthRef, custom), [kind, monthRef, custom]);

  const shiftMonth = useCallback((delta: number) => {
    setKindState("mensal");
    setMonthRef((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      const now = new Date();
      const maxRef = new Date(now.getFullYear(), now.getMonth() + 24, 1);
      if (next > maxRef) return prev;
      return next;
    });
  }, []);

  const value = useMemo<PeriodCtx>(
    () => ({
      range,
      monthRef,
      setKind: (k) => setKindState(k),
      setCustom: (s, e) => {
        setCustomState({ start: s, end: e });
        setKindState("personalizado");
      },
      shiftMonth,
      isInRange: (iso: string) => {
        if (!iso) return false;
        const d = iso.length <= 10 ? new Date(iso + "T00:00:00") : new Date(iso);
        if (Number.isNaN(d.getTime())) return false;
        return d >= range.start && d <= range.end;
      },
    }),
    [range, monthRef, shiftMonth],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePeriod() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePeriod must be inside PeriodFilterProvider");
  return v;
}

/**
 * Fase 5 — Hook único de navegação de mês.
 * Compartilha estado com PeriodFilter, evitando duplicação em Lançamentos e Cartão.
 */
export function useMonthNavigator() {
  const { monthRef, shiftMonth, range } = usePeriod();
  const now = new Date();
  const maxRef = new Date(now.getFullYear(), now.getMonth() + 24, 1);
  const canGoNext =
    new Date(monthRef.getFullYear(), monthRef.getMonth() + 1, 1) <= maxRef;
  return {
    currentReferenceMonth: monthRef,
    label: range.label,
    goToNextMonth: () => shiftMonth(1),
    goToPreviousMonth: () => shiftMonth(-1),
    canGoNext,
    canGoPrevious: true,
  };
}
