import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pin, Trash2, Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PayCheckbox } from "@/components/PayCheckbox";
import { OverdueBadge } from "@/components/OverdueBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ParcelasList } from "@/components/ParcelasList";
import { formatBRLFull, useFinance } from "@/lib/finance-store";
import { usePeriod, useMonthNavigator } from "@/lib/period-filter";
import {
  installmentStatus,
  INSTALLMENT_STATUS_CLASS,
  INSTALLMENT_STATUS_LABEL,
} from "@/lib/installment-status";

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
  const { transacoes, categorias, contas, setTransactionStatus, deleteTransaction, encerrarParcelamento } = useFinance();
  const { range, isInRange } = usePeriod();
  const { label, goToNextMonth, goToPreviousMonth, canGoNext } = useMonthNavigator();

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

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Fase 11: Parcelamentos ativos (com ao menos uma parcela pendente)
  const parcelamentos = useMemo(() => {
    const map = new Map<
      string,
      {
        groupId: string;
        descricao: string;
        totalParcelas: number;
        pagas: number;
        restanteValor: number;
        proximaData: string | null;
      }
    >();
    for (const t of transacoes) {
      if (!t.purchaseGroupId) continue;
      const cur = map.get(t.purchaseGroupId) ?? {
        groupId: t.purchaseGroupId,
        descricao: t.descricao || "Compra parcelada",
        totalParcelas: t.installmentTotal ?? 0,
        pagas: 0,
        restanteValor: 0,
        proximaData: null as string | null,
      };
      cur.descricao = t.descricao || cur.descricao;
      if (t.installmentTotal && t.installmentTotal > cur.totalParcelas)
        cur.totalParcelas = t.installmentTotal;
      if (t.status === "pago") {
        cur.pagas += 1;
      } else {
        cur.restanteValor += t.valor;
        const d = t.dueDate ?? t.data;
        if (!cur.proximaData || d < cur.proximaData) cur.proximaData = d;
      }
      map.set(t.purchaseGroupId, cur);
    }
    return Array.from(map.values()).filter((g) => g.restanteValor > 0);
  }, [transacoes]);

  const [quitarState, setQuitarState] = useState<
    { groupId: string; descricao: string; sugerido: number } | null
  >(null);
  const [quitarValor, setQuitarValor] = useState("");
  const [cancelarState, setCancelarState] = useState<
    { groupId: string; descricao: string; restantes: number } | null
  >(null);



  return (
    <AppShell title="Transações" subtitle="Lançamentos com vencimento e status">
      {range.kind === "mensal" && (
        <div className="flex items-center justify-between rounded-2xl bg-card p-2 shadow-card">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-xs font-semibold capitalize text-foreground">{label}</p>
          <button
            type="button"
            onClick={goToNextMonth}
            disabled={!canGoNext}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground disabled:opacity-30"
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
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="truncate text-sm font-medium text-foreground">
                            {t.descricao || cat?.nome}
                          </p>
                          {t.isFixed && <Pin className="h-3 w-3 shrink-0 text-accent" />}
                          {/* Badge de status espelhando o helper installment_status() do banco */}
                          {(() => {
                            const st = installmentStatus(t.paidAt, t.dueDate ?? t.data);
                            return (
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${INSTALLMENT_STATUS_CLASS[st]}`}
                              >
                                {INSTALLMENT_STATUS_LABEL[st]}
                              </span>
                            );
                          })()}
                          <OverdueBadge dueDate={t.dueDate ?? t.data} status={t.status} />
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {cat?.nome} · {conta?.nome ?? "—"}
                          {t.installmentNumber && t.installmentTotal && (
                            <> · {t.installmentNumber}/{t.installmentTotal}</>
                          )}
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
                        {t.paidAt ? (
                          // Fase 11: parcela paga não permite editar valor/data — só excluir se
                          // for permitido pela regra do parcelamento. Aqui apenas indicamos bloqueio.
                          <span
                            aria-label="Editar bloqueado — parcela paga"
                            title="Editar valor/data bloqueado após pagamento"
                            className="text-muted-foreground"
                          >
                            <Lock className="h-3 w-3" />
                          </span>
                        ) : (
                          <button
                            type="button"
                            aria-label="Excluir"
                            onClick={() => setConfirmDelete(t.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      {parcelamentos.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Parcelamentos ativos
          </h2>
          <ul className="space-y-2">
            {parcelamentos.map((g) => {
              const restantesQtd = g.totalParcelas - g.pagas;
              return (
                <li key={g.groupId} className="rounded-2xl bg-card p-3 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{g.descricao}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {g.pagas}/{g.totalParcelas} pagas · {restantesQtd} parcela
                        {restantesQtd === 1 ? "" : "s"} restante{restantesQtd === 1 ? "" : "s"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-destructive">
                      {formatBRLFull(g.restanteValor)}
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQuitarState({
                          groupId: g.groupId,
                          descricao: g.descricao,
                          sugerido: g.restanteValor,
                        });
                        setQuitarValor(g.restanteValor.toFixed(2).replace(".", ","));
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Quitar restante
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCancelarState({
                          groupId: g.groupId,
                          descricao: g.descricao,
                          restantes: restantesQtd,
                        })
                      }
                      className="flex items-center justify-center gap-1.5 rounded-2xl bg-destructive/10 py-2.5 text-xs font-semibold text-destructive ring-1 ring-destructive/30"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Cancelar sem pagamento
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

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

      {/* Quitar restante — permite valor final personalizado (desconto de quitação) */}
      {quitarState && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            aria-label="Fechar"
            className="absolute inset-0 bg-black/70"
            onClick={() => setQuitarState(null)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-card p-5 shadow-card">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <h3 className="text-base font-semibold text-foreground">Quitar restante</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Vai encerrar <strong className="text-foreground">{quitarState.descricao}</strong>{" "}
              gerando uma única saída no valor final abaixo. Ajuste se houve desconto de quitação.
            </p>
            <label className="mb-3 block">
              <span className="mb-1 block text-[11px] uppercase text-muted-foreground">
                Valor final (sugerido {formatBRLFull(quitarState.sugerido)})
              </span>
              <input
                inputMode="decimal"
                value={quitarValor}
                onChange={(e) => setQuitarValor(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-primary"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setQuitarState(null)}
                className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold text-foreground"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const parsed = Number(quitarValor.replace(/\./g, "").replace(",", "."));
                  if (!isFinite(parsed) || parsed < 0) return;
                  const gid = quitarState.groupId;
                  setQuitarState(null);
                  await encerrarParcelamento(gid, "quitar", parsed);
                }}
                className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Confirmar quitação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancelar sem pagamento — confirmação extra com aviso destacado */}
      <ConfirmDialog
        open={!!cancelarState}
        title="Cancelar parcelamento sem pagamento?"
        destructive
        confirmLabel="Cancelar parcelamento"
        cancelLabel="Voltar"
        requireType="CANCELAR"
        description={
          cancelarState && (
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-2.5 text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-xs">
                  Esta ação <strong>remove {cancelarState.restantes} parcela
                  {cancelarState.restantes === 1 ? "" : "s"} futura
                  {cancelarState.restantes === 1 ? "" : "s"}</strong> de{" "}
                  <strong>{cancelarState.descricao}</strong>. Nenhum pagamento será registrado.
                </p>
              </div>
              <p className="text-xs">
                As parcelas <strong>já pagas permanecem no histórico</strong> e no saldo da conta.
                Não é possível desfazer.
              </p>
            </div>
          )
        }
        onClose={() => setCancelarState(null)}
        onConfirm={async () => {
          if (cancelarState) await encerrarParcelamento(cancelarState.groupId, "cancelar");
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
