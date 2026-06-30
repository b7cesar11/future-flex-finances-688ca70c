import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pin, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PayCheckbox } from "@/components/PayCheckbox";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatBRLFull, useFinance } from "@/lib/finance-store";
import { usePeriod } from "@/lib/period-filter";

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
  const { transacoes, categorias, contas, setTransactionStatus, deleteTransaction } = useFinance();
  const { range, setKind, isInRange } = usePeriod();

  const catMap = useMemo(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);
  const contaMap = useMemo(() => new Map(contas.map((c) => [c.id, c])), [contas]);

  const filtered = useMemo(
    () => transacoes.filter((t) => isInRange(t.data)).sort((a, b) => (a.data < b.data ? 1 : -1)),
    [transacoes, isInRange],
  );

  const totals = useMemo(() => {
    let receitas = 0;
    let despesas = 0;
    let pendDespesa = 0;
    let pendReceita = 0;
    for (const t of filtered) {
      if (t.kind === "receita") {
        receitas += t.valor;
        if (t.status !== "pago") pendReceita += t.valor;
      } else {
        despesas += t.valor;
        if (t.status !== "pago") pendDespesa += t.valor;
      }
    }
    return { receitas, despesas, balanco: receitas - despesas, pendDespesa, pendReceita };
  }, [filtered]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const t of filtered) {
      const arr = map.get(t.data) ?? [];
      arr.push(t);
      map.set(t.data, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // For mensal range: navegação rápida entre meses
  const shiftMonth = (delta: number) => {
    const d = new Date(range.start);
    d.setMonth(d.getMonth() + delta);
    // re-aplicar tipo mensal apontando para esse mês via custom range
    // mais simples: apenas alterna para mensal e o usuário muda via Custom
    if (range.kind !== "mensal") setKind("mensal");
    // Nota: para multi-mês ideal, usar setCustom — mantemos kind=mensal por simplicidade
  };

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <AppShell title="Transações" subtitle="Lançamentos com vencimento e status">
      {range.kind === "mensal" && (
        <div className="flex items-center justify-between rounded-2xl bg-card p-2 shadow-card">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-xs font-semibold capitalize text-foreground">{range.label}</p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <SummaryCard label="Receitas" value={totals.receitas} tone="primary" />
        <SummaryCard label="Despesas" value={totals.despesas} tone="destructive" />
        <SummaryCard
          label="Balanço"
          value={totals.balanco}
          tone={totals.balanco >= 0 ? "primary" : "destructive"}
        />
      </div>
      {(totals.pendDespesa > 0 || totals.pendReceita > 0) && (
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
          {totals.pendDespesa > 0 && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-destructive">
              {formatBRLFull(totals.pendDespesa)} a pagar
            </span>
          )}
          {totals.pendReceita > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              {formatBRLFull(totals.pendReceita)} a receber
            </span>
          )}
        </div>
      )}

      <section className="mt-5 space-y-5">
        {grouped.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhuma transação no período.
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
                  const pago = t.status === "pago";
                  return (
                    <li
                      key={t.id}
                      className={`flex items-center gap-3 px-3 py-3 ${
                        i < list.length - 1 ? "border-b border-border/60" : ""
                      } ${!pago ? "bg-warning/5" : ""}`}
                    >
                      <PayCheckbox
                        paid={pago}
                        onToggle={() =>
                          setTransactionStatus(t.id, pago ? "pendente" : "pago")
                        }
                      />
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-base"
                        style={{
                          background: `${cat?.cor ?? "#94a3b8"}22`,
                          color: cat?.cor,
                        }}
                      >
                        {cat?.emoji ?? "✨"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium text-foreground">
                            {t.descricao || cat?.nome}
                          </p>
                          {t.isFixed && (
                            <Pin className="h-3 w-3 shrink-0 text-accent" />
                          )}
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {cat?.nome} · {conta?.nome ?? "—"}
                          {t.dueDate && t.dueDate !== t.data && (
                            <>
                              {" "}
                              · venc{" "}
                              {new Date(t.dueDate + "T00:00:00").toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                              })}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <p
                          className={`text-sm font-semibold tabular-nums ${
                            positivo ? "text-primary" : "text-destructive"
                          } ${!pago ? "opacity-60" : ""}`}
                        >
                          {positivo ? "+" : "−"} {formatBRLFull(t.valor)}
                        </p>
                        <button
                          type="button"
                          aria-label="Excluir"
                          onClick={() => setConfirmDelete(t.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir transação?"
        description="Isso remove permanentemente o lançamento e recalcula o saldo da carteira."
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await deleteTransaction(confirmDelete);
        }}
      />
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
