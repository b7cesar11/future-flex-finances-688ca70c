import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Plus, Trash2, Pencil, Check, X, ListOrdered } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PayCheckbox } from "@/components/PayCheckbox";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { OverdueBadge } from "@/components/OverdueBadge";
import { ParcelasList } from "@/components/ParcelasList";
import {
  formatBRLFull,
  useFinance,
  type ThirdParty,
  type ThirdPartyType,
  type Transaction,
} from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/terceiros")({
  head: () => ({ meta: [{ title: "Terceiros" }] }),
  component: Terceiros,
});

const TYPE_LABEL: Record<ThirdPartyType, string> = {
  emprestei_dinheiro: "Emprestei",
  usou_meu_cartao: "Usou meu cartão",
  devo_a_terceiro: "Devo",
};

/**
 * Calcula o valor pendente real de um ThirdParty.
 * - Se tiver purchaseGroupId: soma apenas as parcelas não pagas (paid_at IS NULL)
 * - Se não tiver (lançamento avulso): usa t.amount quando status !== "pago"
 */
function pendingAmount(t: ThirdParty, transacoes: Transaction[]): number {
  if (t.status === "pago") return 0;

  if (t.purchaseGroupId) {
    // Soma parcelas não pagas do grupo
    const unpaid = transacoes
      .filter(
        (tx) =>
          tx.purchaseGroupId === t.purchaseGroupId &&
          tx.paidAt === null
      )
      .reduce((s, tx) => s + tx.valor, 0);
    return unpaid;
  }

  return t.amount;
}

/** Sinal: +1 = terceiro me deve; -1 = eu devo ao terceiro */
function signedPending(t: ThirdParty, transacoes: Transaction[]): number {
  const sign = t.type === "devo_a_terceiro" ? -1 : 1;
  return sign * pendingAmount(t, transacoes);
}

/** Informações de progresso para lançamentos parcelados */
function installmentProgress(
  t: ThirdParty,
  transacoes: Transaction[]
): { total: number; paid: number } | null {
  if (!t.purchaseGroupId) return null;
  const parcelas = transacoes.filter(
    (tx) => tx.purchaseGroupId === t.purchaseGroupId
  );
  if (parcelas.length === 0) return null;
  const paid = parcelas.filter((tx) => tx.paidAt !== null).length;
  return { total: parcelas.length, paid };
}

function Terceiros() {
  const { terceiros, cartoes, transacoes, setThirdPartyStatus, updateThirdParty, deleteThirdParty } =
    useFinance();
  const cartaoNome = (id: string | null) =>
    id ? cartoes.find((c) => c.id === id)?.name : null;
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDue, setEditDue] = useState("");
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, { items: ThirdParty[]; personId: string | null }>();
    for (const t of terceiros) {
      const key = t.personId ?? `__name__${(t.personName || "—").trim()}`;
      if (!map.has(key)) map.set(key, { items: [], personId: t.personId });
      map.get(key)!.items.push(t);
    }
    return Array.from(map.entries())
      .map(([, v]) => ({
        name: (v.items[0].personName || "—").trim(),
        personId: v.personId,
        items: v.items.sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? "")),
        // Gap 1: subtotal usa parcelas não pagas, não o total
        subtotal: v.items.reduce((s, t) => s + signedPending(t, transacoes), 0),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [terceiros, transacoes]);

  const totalGeral = groups.reduce((s, g) => s + g.subtotal, 0);

  const startEdit = (t: ThirdParty) => {
    setEditing(t.id);
    setEditAmount(String(t.amount));
    setEditDue(t.dueDate ?? "");
  };

  const saveEdit = async (id: string) => {
    const v = parseFloat(editAmount.replace(",", "."));
    await updateThirdParty(id, {
      amount: v > 0 ? v : undefined,
      dueDate: editDue || null,
    });
    setEditing(null);
  };

  return (
    <AppShell title="Terceiros" subtitle="Empréstimos, cartão emprestado e dívidas com pessoas">
      {/* Total Geral */}
      <div className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <p className="text-[11px] uppercase tracking-wide opacity-80">Saldo consolidado</p>
        <p className="mt-1 text-3xl font-bold tabular-nums">
          {totalGeral >= 0 ? "+" : "−"}
          {formatBRLFull(Math.abs(totalGeral))}
        </p>
        <p className="mt-1 text-[11px] opacity-80">
          {totalGeral >= 0
            ? "A receber de terceiros (líquido)"
            : "A pagar a terceiros (líquido)"}
        </p>
      </div>

      {terceiros.length === 0 && (
        <div className="mt-5 rounded-3xl bg-card p-8 text-center shadow-card">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">Nenhum registro ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cadastre quem te deve ou para quem você deve.
          </p>
          <Link
            to="/nova-transacao"
            search={{ kind: "despesa", terceiro: true }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </Link>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {groups.map((g) => (
          <section
            key={`${g.personId ?? g.name}`}
            className="rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="min-w-0">
                {g.personId ? (
                  <Link
                    to="/contatos/$id"
                    params={{ id: g.personId }}
                    className="truncate text-base font-semibold text-foreground underline-offset-2 hover:underline"
                  >
                    {g.name}
                  </Link>
                ) : (
                  <p className="truncate text-base font-semibold text-foreground">{g.name}</p>
                )}
                <p className="text-[11px] text-muted-foreground">{g.items.length} lançamento(s)</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Saldo devedor
                </p>
                <p
                  className={`text-base font-bold tabular-nums ${
                    g.subtotal >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {g.subtotal >= 0 ? "+" : "−"}
                  {formatBRLFull(Math.abs(g.subtotal))}
                </p>
              </div>
            </div>

            <ul className="space-y-2">
              {g.items.map((t) => {
                const pago = t.status === "pago";
                const isEdit = editing === t.id;
                const progress = installmentProgress(t, transacoes);
                const pendente = pendingAmount(t, transacoes);

                return (
                  <li
                    key={t.id}
                    className={`rounded-2xl bg-surface-elevated px-3 py-2.5 ${
                      !pago ? "ring-1 ring-warning/25" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PayCheckbox
                        paid={pago}
                        onToggle={() => setThirdPartyStatus(t.id, pago ? "pendente" : "pago")}
                        ariaLabel="Alternar pagamento"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium text-foreground">
                            {TYPE_LABEL[t.type]}
                          </p>
                          <OverdueBadge dueDate={t.dueDate} status={t.status} />
                        </div>
                        {!isEdit && (
                          <>
                            <p className="text-[11px] text-muted-foreground">
                              {t.dueDate
                                ? `Venc ${new Date(t.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}`
                                : "Sem vencimento"}
                              {progress
                                ? ` · ${progress.paid}/${progress.total} parcelas pagas`
                                : t.isInstallment
                                ? ` · ${t.installmentsLeft}x restantes`
                                : ""}
                              {cartaoNome(t.creditCardId)
                                ? ` · 💳 ${cartaoNome(t.creditCardId)}`
                                : ""}
                            </p>
                            {/* Barra de progresso para parcelamentos */}
                            {progress && progress.total > 1 && (
                              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-border/40">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{
                                    width: `${(progress.paid / progress.total) * 100}%`,
                                  }}
                                />
                              </div>
                            )}
                          </>
                        )}
                        {isEdit && (
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <input
                              inputMode="decimal"
                              value={editAmount}
                              onChange={(e) =>
                                setEditAmount(e.target.value.replace(/[^\d.,]/g, ""))
                              }
                              placeholder="Valor"
                              className="rounded-lg bg-card px-2 py-1 text-xs outline-none ring-1 ring-primary"
                            />
                            <input
                              type="date"
                              value={editDue}
                              onChange={(e) => setEditDue(e.target.value)}
                              className="rounded-lg bg-card px-2 py-1 text-xs outline-none ring-1 ring-border"
                            />
                          </div>
                        )}
                      </div>
                      {!isEdit ? (
                        <>
                          <div className="text-right">
                            {/* Gap 1: mostra valor pendente real (parcelas não pagas) */}
                            <p
                              className={`text-sm font-semibold tabular-nums ${
                                !pago ? "" : "opacity-60"
                              } ${t.type === "devo_a_terceiro" ? "text-destructive" : "text-success"}`}
                            >
                              {formatBRLFull(pago ? t.amount : pendente)}
                            </p>
                            {progress && !pago && pendente !== t.amount && (
                              <p className="text-[10px] text-muted-foreground">
                                de {formatBRLFull(t.amount)}
                              </p>
                            )}
                          </div>
                          {t.purchaseGroupId && (
                            <button
                              type="button"
                              aria-label="Ver parcelas"
                              title="Ver parcelas"
                              onClick={() => setOpenGroup(t.purchaseGroupId!)}
                              className="text-primary hover:text-primary/80"
                            >
                              <ListOrdered className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            aria-label="Editar"
                            onClick={() => startEdit(t)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Excluir"
                            onClick={() => setConfirmDel(t.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-label="Salvar"
                            onClick={() => saveEdit(t.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Cancelar"
                            onClick={() => setEditing(null)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <Link
        to="/nova-transacao"
        search={{ kind: "despesa", terceiro: true }}
        className="fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Novo
      </Link>

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir registro?"
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDel(null)}
        onConfirm={async () => {
          if (confirmDel) await deleteThirdParty(confirmDel);
        }}
      />

      {openGroup && (
        <ParcelasList groupId={openGroup} onClose={() => setOpenGroup(null)} />
      )}
    </AppShell>
  );
}
