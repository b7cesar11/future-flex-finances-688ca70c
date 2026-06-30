import { useState } from "react";
import { CalendarRange, Check } from "lucide-react";
import { usePeriod, type PeriodKind } from "@/lib/period-filter";

const OPTIONS: { key: PeriodKind; label: string }[] = [
  { key: "semanal", label: "Semana" },
  { key: "mensal", label: "Mês" },
  { key: "anual", label: "Ano" },
  { key: "personalizado", label: "Custom" },
];

export function PeriodFilter() {
  const { range, setKind, setCustom } = usePeriod();
  const [openCustom, setOpenCustom] = useState(false);
  const [s, setS] = useState("");
  const [e, setE] = useState("");

  return (
    <div className="rounded-2xl bg-card/80 p-1.5 shadow-card ring-1 ring-border/60">
      <div className="flex items-center gap-1">
        {OPTIONS.map((o) => {
          const active = range.kind === o.key;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => {
                if (o.key === "personalizado") setOpenCustom(true);
                else setKind(o.key);
              }}
              className={`flex-1 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <p className="mt-1 flex items-center justify-center gap-1.5 text-[10px] capitalize text-muted-foreground">
        <CalendarRange className="h-3 w-3" />
        {range.label}
      </p>

      {openCustom && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenCustom(false)}
          />
          <div className="relative mx-auto w-full max-w-md rounded-t-3xl border-t border-border bg-card p-5 pb-8">
            <h3 className="mb-3 text-base font-semibold">Período personalizado</h3>
            <label className="mb-2 block">
              <span className="block text-[11px] uppercase text-muted-foreground">De</span>
              <input
                type="date"
                value={s}
                onChange={(ev) => setS(ev.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="mb-3 block">
              <span className="block text-[11px] uppercase text-muted-foreground">Até</span>
              <input
                type="date"
                value={e}
                onChange={(ev) => setE(ev.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm outline-none"
              />
            </label>
            <button
              type="button"
              disabled={!s || !e}
              onClick={() => {
                setCustom(new Date(s + "T00:00:00"), new Date(e + "T23:59:59"));
                setOpenCustom(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
            >
              <Check className="h-4 w-4" /> Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
