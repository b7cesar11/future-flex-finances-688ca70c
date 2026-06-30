import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

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
}

const Ctx = createContext<PeriodCtx | null>(null);

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay(); // 0 sun
  const diff = (day + 6) % 7; // mon=0
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

export function buildRange(kind: PeriodKind, custom?: { start: Date; end: Date }): PeriodRange {
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
  // mensal default
  return {
    kind: "mensal",
    start: startOfMonth(now),
    end: endOfMonth(now),
    label: now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  };
}

export function PeriodFilterProvider({ children }: { children: ReactNode }) {
  const [kind, setKindState] = useState<PeriodKind>("mensal");
  const [custom, setCustomState] = useState<{ start: Date; end: Date } | undefined>();

  const range = useMemo(() => buildRange(kind, custom), [kind, custom]);

  const value = useMemo<PeriodCtx>(
    () => ({
      range,
      setKind: (k) => setKindState(k),
      setCustom: (s, e) => {
        setCustomState({ start: s, end: e });
        setKindState("personalizado");
      },
      isInRange: (iso: string) => {
        if (!iso) return false;
        const d = new Date(iso + "T00:00:00");
        return d >= range.start && d <= range.end;
      },
    }),
    [range],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePeriod() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePeriod must be inside PeriodFilterProvider");
  return v;
}
