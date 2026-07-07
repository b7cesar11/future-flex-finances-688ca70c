import { useMemo, useState } from "react";
import { X, Lock, CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, Loader as Loader2 } from "lucide-react";
import { formatBRLFull, useFinance } from "@/lib/finance-store";
import {
  installmentStatus,
  INSTALLMENT_STATUS_CLASS,
  INSTALLMENT_STATUS_LABEL,
} from "@/lib/installment-status";
import { ConfirmDialog } from "@/components/ConfirmDialog";

/**
 * Drawer único de parcelas — reutilizado em /transacoes, /terceiros e /cartoes.
 * Recebe purchase_group_id, lista todas as parcelas do grupo, permite marcar
 * cada uma como paga (RPC pagar_parcela) e agrega as ações de quitar/cancelar
 * o parcelamento inteiro no rodapé. Toda invalidação passa pelo MAPA_DE_IMPACTO
 * central do finance-store — este componente não invalida cache manualmente.
 */
export function ParcelasList({
  groupId,
  groupType = "purchase",
  onClose,
}: {
  groupId: string;
  groupType?: "purchase" | "commitment";
  onClose: () => void;
}) {
  const { transacoes, pessoas, pagarParcela, encerrarParcelamento } = useFinance();
  const parcelas = useMemo(
    () =>
      transacoes
        .filter((t) =>
          groupType === "commitment"
            ? t.commitmentGroupId === groupId
            : t.purchaseGroupId === groupId,
        )
        .sort((a, b) => (a.installmentNumber ?? 0) - (b.installmentNumber ?? 0)),
    [transacoes, groupId, groupType],
  );

  const [quitarOpen, setQuitarOpen] = useState(false);
  const [quitarValor, setQuitarValor] = useState("");
  const [cancelarOpen, setCancelarOpen] = useState(false);
  const [busyTxId, setBusyTxId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (parcelas.length === 0) {
    return (
      <Sheet onClose={onClose}>
        <div className="p-5 text-sm text-muted-foreground">Parcelamento não encontrado.</div>
      </Sheet>
    );
  }

  const first = parcelas[0];
  const total = parcelas.reduce((s, t) => s + t.valor, 0);
  const restante = parcelas.filter((t) => t.status !== "pago").reduce((s, t) => s + t.valor, 0);
  const pagas = parcelas.filter((t) => t.status === "pago").length;
  const totalParcelas = first.installmentTotal ?? parcelas.length;
  const valorParcela = total / totalParcelas;
  const restantesQtd = totalParcelas - pagas;
  const descricao = (first.descricao || "").replace(/\s*\(\d+\/\d+\)\s*$/, "");
  const pessoaNome = first.personId ? pessoas.find((p) => p.id === first.personId)?.name : null;
  const podeAgir = restante > 0;

  return (
    <Sheet onClose={onClose}>
      <header className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground">{descricao}</p>
          {pessoaNome && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">👤 {pessoaNome}</p>
          )}
          <div className="mt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Saldo restante
            </p>
            <p className="text-2xl font-bold tabular-nums text-destructive">
              {formatBRLFull(restante)}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {pagas}/{totalParcelas} pagas · Parcela {formatBRLFull(valorParcela)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              de um total de {formatBRLFull(total)}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </header>


      <ul className="max-h-[55vh] divide-y divide-border/60 overflow-y-auto">
        {actionError && (
          <li className="mx-4 mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {actionError}
          </li>
        )}
        {parcelas.map((t) => {
          const st = installmentStatus(t.paidAt, t.dueDate ?? t.data);
          const pago = t.status === "pago";
          const busy = busyTxId === t.id;
          return (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground">
                    {t.installmentNumber ?? "?"}/{totalParcelas}
                  </p>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${INSTALLMENT_STATUS_CLASS[st]}`}
                  >
                    {INSTALLMENT_STATUS_LABEL[st]}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Venc{" "}
                  {new Date((t.dueDate ?? t.data) + "T00:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {formatBRLFull(t.valor)}
              </p>
              {pago ? (
                <span
                  aria-label="Parcela paga — bloqueada"
                  title="Parcela paga"
                  className="flex h-8 w-8 items-center justify-center text-muted-foreground"
                >
                  <Lock className="h-3.5 w-3.5" />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (busyTxId) return;
                    setActionError(null);
                    setBusyTxId(t.id);
                    try {
                      await pagarParcela(t.id);
                    } catch (err) {
                      console.error("[ParcelasList] pagarParcela falhou", err);
                      setActionError(
                        err instanceof Error && /authenticated|jwt|unauthorized|not authorized/i.test(err.message)
                          ? "Sua sessão expirou. Entre novamente e tente marcar a parcela como paga."
                          : "Não foi possível marcar a parcela como paga. Tente novamente.",
                      );
                    } finally {
                      setBusyTxId(null);
                    }
                  }}
                  disabled={!!busyTxId}
                  className="inline-flex min-w-20 items-center justify-center gap-1 rounded-lg bg-primary/15 px-2 py-1.5 text-[11px] font-semibold text-primary disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  {busy ? "Marcando" : "Marcar paga"}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {podeAgir && (
        <footer className="grid grid-cols-2 gap-2 border-t border-border/60 p-3">
          <button
            type="button"
            onClick={() => {
              setQuitarValor(restante.toFixed(2).replace(".", ","));
              setQuitarOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Quitar restante
          </button>
          <button
            type="button"
            onClick={() => setCancelarOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-destructive/10 py-2.5 text-xs font-semibold text-destructive ring-1 ring-destructive/30"
          >
            <XCircle className="h-3.5 w-3.5" />
            Cancelar sem pagamento
          </button>
        </footer>
      )}

      {/* Quitar restante */}
      {quitarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            aria-label="Fechar"
            className="absolute inset-0 bg-black/70"
            onClick={() => setQuitarOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-card p-5 shadow-card">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <h3 className="text-base font-semibold">Quitar restante</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Encerra o parcelamento gerando UMA saída no valor abaixo. Ajuste se houve desconto.
            </p>
            <label className="mb-3 block">
              <span className="mb-1 block text-[11px] uppercase text-muted-foreground">
                Valor final (sugerido {formatBRLFull(restante)})
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
                onClick={() => setQuitarOpen(false)}
                className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const parsed = Number(quitarValor.replace(/\./g, "").replace(",", "."));
                  if (!isFinite(parsed) || parsed < 0) return;
                  setQuitarOpen(false);
                  await encerrarParcelamento(groupId, "quitar", parsed);
                  onClose();
                }}
                className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={cancelarOpen}
        title="Cancelar parcelamento sem pagamento?"
        destructive
        confirmLabel="Cancelar parcelamento"
        cancelLabel="Voltar"
        requireType="CANCELAR"
        description={
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-2 py-1.5 text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">
                {restantesQtd} parcela{restantesQtd === 1 ? "" : "s"} futura
                {restantesQtd === 1 ? "" : "s"} {restantesQtd === 1 ? "será removida" : "serão removidas"}.
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Parcelas já pagas ficam no histórico. Digite <strong>CANCELAR</strong> para confirmar.
            </p>
          </div>
        }
        onClose={() => setCancelarOpen(false)}
        onConfirm={async () => {
          await encerrarParcelamento(groupId, "cancelar");
          onClose();
        }}
      />
    </Sheet>
  );
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 sm:items-center">
      <button aria-label="Fechar" className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-card shadow-card sm:rounded-3xl">
        {children}
      </div>
    </div>
  );
}
