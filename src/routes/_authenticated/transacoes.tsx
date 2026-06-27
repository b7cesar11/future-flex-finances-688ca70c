import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { formatBRLFull, useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/transacoes")({
  head: () => ({
    meta: [
      { title: "Transações — Extrato" },
      { name: "description", content: "Despesas e receitas do mês." },
    ],
  }),
  component: Transacoes,
});

function Transacoes() {
  const { transacoes, categorias, contas } = useFinance();
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const catMap = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);
  const contaMap = useMemo(() => new Map(contas.map((c) => [c.id, c])), [contas]);

  const monthTx = useMemo(
    () =>
      transacoes
        .filter((t) => {
          const d = new Date(t.data + "T00:00:00");
          return d.getFullYear() === cursor.year && d.getMonth() === cursor.month;
        })
        .sort((a, b) => (a.data < b.data ? 1 : -1)),
    [transacoes, cursor],
  );

  const totals = useMemo(() => {
    let receitas = 0;
    let despesas = 0;
    for (const t of monthTx) {
      if (t.kind === "receita") receitas += t.valor;
      else despesas += t.valor;
    }
    return { receitas, despesas, balanco: receitas - despesas };
  }, [monthTx]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof monthTx>();
    for (const t of monthTx) {
      const arr = map.get(t.data) ?? [];
      arr.push(t);
      map.set(t.data, arr);
    }
    return Array.from(map.entries());
  }, [monthTx]);

  const shift = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const tabMonths = [-1, 0, 1].map((d) => {
    const dt = new Date(cursor.year, cursor.month + d, 1);
    return {
      delta: d,
      label: dt.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      active: d === 0,
    };
  });

  return (
    <AppShell title="Transações" subtitle="Seu extrato do mês">
      {/* Month switcher */}
      <div className="flex items-center justify-between rounded-2xl bg-card p-2 shadow-card">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-1 items-center justify-center gap-2">
          {tabMonths.map((m) => (
            <button
              key={m.delta}
              type="button"
              onClick={() => shift(m.delta)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                m.active ? "bg-primary/15 text-primary" : "text-muted-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => shift(1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-2 text-center text-xs capitalize text-muted-foreground">{monthLabel}</p>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <SummaryCard label="Receitas" value={totals.receitas} tone="primary" />
        <SummaryCard label="Despesas" value={totals.despesas} tone="destructive" />
        <SummaryCard
          label="Balanço"
          value={totals.balanco}
          tone={totals.balanco >= 0 ? "primary" : "destructive"}
        />
      </div>

      {/* Grouped list */}
      <section className="mt-5 space-y-5">
        {grouped.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhuma transação neste mês.
          </p>
        )}
        {grouped.map(([day, list]) => {
          const d = new Date(day + "T00:00:00");
          const dayLabel = d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            weekday: "short",
          });
          return (
            <div key={day}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {dayLabel.replace(".", "")}
              </p>
              <ul className="overflow-hidden rounded-2xl bg-card shadow-card">
                {list.map((t, i) => {
                  const cat = catMap.get(t.categoriaId);
                  const conta = contaMap.get(t.contaId);
                  const positivo = t.kind === "receita";
                  return (
                    <li
                      key={t.id}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        i < list.length - 1 ? "border-b border-border/60" : ""
                      }`}
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                        style={{ background: `${cat?.cor ?? "#94a3b8"}22`, color: cat?.cor }}
                      >
                        {cat?.emoji ?? "✨"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{t.descricao}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {cat?.nome} · {conta?.nome}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          positivo ? "text-primary" : "text-destructive"
                        }`}
                      >
                        {positivo ? "+" : "−"} {formatBRLFull(t.valor)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "destructive";
}) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-sm font-bold tabular-nums ${
          tone === "primary" ? "text-primary" : "text-destructive"
        }`}
      >
        {formatBRLFull(value)}
      </p>
    </div>
  );
}
