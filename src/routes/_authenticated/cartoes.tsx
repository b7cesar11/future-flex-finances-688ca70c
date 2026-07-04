import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCard as CardIcon, Plus, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ParcelasList } from "@/components/ParcelasList";
import { formatBRLFull, useFinance, type CreditCardInvoice } from "@/lib/finance-store";
import {
  INSTALLMENT_STATUS_CLASS,
  INSTALLMENT_STATUS_LABEL,
  installmentStatus,
} from "@/lib/installment-status";

export const Route = createFileRoute("/_authenticated/cartoes")({
  head: () => ({ meta: [{ title: "Cartões de crédito" }] }),
  component: CartoesPage,
});

function CartoesPage() {
  const {
    cartoes,
    faturas,
    transacoes,
    pessoas,
    contas,
    addCreditCard,
    pagarFatura,
    estornarFatura,
  } = useFinance();
  const [showNew, setShowNew] = useState(false);
  const [confirmPay, setConfirmPay] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const pessoasById = useMemo(() => {
    const m = new Map<string, string>();
    pessoas.forEach((p) => m.set(p.id, p.name));
    return m;
  }, [pessoas]);

  const faturasPorCartao = useMemo(() => {
    const m = new Map<string, CreditCardInvoice[]>();
    faturas.forEach((f) => {
      const arr = m.get(f.creditCardId) ?? [];
      arr.push(f);
      m.set(f.creditCardId, arr);
    });
    return m;
  }, [faturas]);

  return (
    <AppShell title="Cartões" subtitle="Faturas, parcelas e pagamentos" hidePeriodFilter>
      <button
        type="button"
        onClick={() => setShowNew(true)}
        className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Novo cartão
      </button>

      {cartoes.length === 0 && (
        <div className="rounded-3xl bg-card p-8 text-center shadow-card">
          <CardIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold">Nenhum cartão ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cadastre para começar a lançar compras parceladas.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {cartoes.filter((c) => c.active).map((cc) => {
          const cardInvoices = (faturasPorCartao.get(cc.id) ?? []).slice(0, 6);
          const conta = contas.find((c) => c.id === cc.paymentAccountId);
          return (
            <section key={cc.id} className="rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50">
              <header className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-foreground">{cc.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Fecha dia {cc.closingDay} · Vence dia {cc.dueDay}
                    {conta ? ` · Pgto: ${conta.nome}` : ""}
                  </p>
                </div>
              </header>

              {cardInvoices.length === 0 && (
                <p className="rounded-xl bg-surface-elevated px-3 py-2 text-xs text-muted-foreground">
                  Nenhuma fatura registrada ainda.
                </p>
              )}

              <div className="space-y-3">
                {cardInvoices.map((inv) => {
                  const items = transacoes.filter((t) => t.invoiceId === inv.id);
                  return (
                    <details key={inv.id} className="rounded-2xl bg-surface-elevated open:ring-1 open:ring-primary/30">
                      <summary className="flex cursor-pointer items-center justify-between px-3 py-2.5 text-sm">
                        <span className="font-medium">
                          {new Date(inv.referenceMonth + "T00:00:00").toLocaleDateString("pt-BR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusFaturaClass(inv.status)}`}
                          >
                            {inv.status}
                          </span>
                          <span className="tabular-nums font-semibold">{formatBRLFull(inv.total)}</span>
                        </span>
                      </summary>
                      <ul className="space-y-1 px-3 pb-3">
                        {items.length === 0 && (
                          <li className="rounded-lg bg-card px-2 py-1.5 text-xs text-muted-foreground">
                            Sem lançamentos.
                          </li>
                        )}
                        {items.map((t) => {
                          const st = installmentStatus(t.paidAt, t.dueDate);
                          const nomePessoa = t.personId ? pessoasById.get(t.personId) : null;
                          return (
                            <li key={t.id} className="rounded-lg bg-card px-2 py-2 text-xs">
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium text-foreground">{t.descricao}</p>
                                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <span className={`rounded px-1.5 py-0.5 ${INSTALLMENT_STATUS_CLASS[st]}`}>
                                      {INSTALLMENT_STATUS_LABEL[st]}
                                    </span>
                                    {nomePessoa && (
                                      <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-primary">
                                        <User className="h-2.5 w-2.5" /> {nomePessoa}
                                      </span>
                                    )}
                                    {t.installmentTotal && t.installmentNumber && (
                                      <span>
                                        {t.installmentNumber}/{t.installmentTotal}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="tabular-nums font-semibold">{formatBRLFull(t.valor)}</span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      {(inv.status === "aberta" || inv.status === "fechada") && inv.total > 0 && (
                        <div className="border-t border-border/60 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => setConfirmPay(inv.id)}
                            className="w-full rounded-lg bg-gradient-primary py-2 text-xs font-bold text-primary-foreground"
                          >
                            Pagar fatura ({formatBRLFull(inv.total)})
                          </button>
                        </div>
                      )}
                      {inv.status === "paga" && (
                        <div className="border-t border-border/60 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => estornarFatura(inv.id)}
                            className="w-full rounded-lg bg-secondary py-2 text-xs font-semibold text-foreground"
                          >
                            Estornar fatura
                          </button>
                        </div>
                      )}
                    </details>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {showNew && (
        <NewCardDialog
          contas={contas.map((c) => ({ id: c.id, nome: c.nome }))}
          onClose={() => setShowNew(false)}
          onSave={async (v) => {
            await addCreditCard(v);
            setShowNew(false);
          }}
        />
      )}

      <ConfirmDialog
        open={!!confirmPay}
        title="Pagar fatura?"
        confirmLabel="Pagar"
        onClose={() => setConfirmPay(null)}
        onConfirm={async () => {
          if (confirmPay) await pagarFatura(confirmPay);
        }}
      />
    </AppShell>
  );
}

function statusFaturaClass(s: string) {
  if (s === "paga") return "bg-success/15 text-success";
  if (s === "fechada") return "bg-warning/15 text-warning";
  if (s === "aberta") return "bg-primary/15 text-primary";
  return "bg-muted text-muted-foreground";
}

function NewCardDialog({
  contas,
  onClose,
  onSave,
}: {
  contas: { id: string; nome: string }[];
  onClose: () => void;
  onSave: (v: {
    name: string;
    closingDay: number;
    dueDay: number;
    paymentAccountId?: string | null;
    creditLimit?: number | null;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [closingDay, setClosingDay] = useState("1");
  const [dueDay, setDueDay] = useState("10");
  const [paymentAccountId, setPaymentAccountId] = useState<string>("");
  const [creditLimit, setCreditLimit] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || saving) return;
    setSaving(true);
    try {
      await onSave({
        name,
        closingDay: Number(closingDay),
        dueDay: Number(dueDay),
        paymentAccountId: paymentAccountId || null,
        creditLimit: creditLimit ? parseFloat(creditLimit.replace(",", ".")) : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-3 rounded-3xl bg-card p-5 shadow-card"
      >
        <h3 className="text-base font-semibold">Novo cartão</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome (ex: Nubank)"
          className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={closingDay}
            onChange={(e) => setClosingDay(e.target.value.replace(/\D/g, ""))}
            placeholder="Dia de fechamento"
            inputMode="numeric"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          />
          <input
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value.replace(/\D/g, ""))}
            placeholder="Dia de vencimento"
            inputMode="numeric"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <select
          value={paymentAccountId}
          onChange={(e) => setPaymentAccountId(e.target.value)}
          className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
        >
          <option value="">Conta de pagamento (opcional)</option>
          {contas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <input
          value={creditLimit}
          onChange={(e) => setCreditLimit(e.target.value)}
          placeholder="Limite (opcional)"
          inputMode="decimal"
          className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-secondary py-2.5 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
