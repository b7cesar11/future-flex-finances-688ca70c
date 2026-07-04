import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, UserPlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  useFinance,
  type ThirdPartyType,
  type ThirdPartyDirection,
  type PaymentMethod,
} from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/nova-terceiros")({
  head: () => ({ meta: [{ title: "Novo registro de terceiros" }] }),
  component: NovoTerceiros,
});

const TIPOS: { key: ThirdPartyType; label: string; direction: ThirdPartyDirection }[] = [
  { key: "emprestei_dinheiro", label: "Emprestei dinheiro", direction: "a_receber" },
  { key: "usou_meu_cartao", label: "Usou meu cartão", direction: "a_receber" },
  { key: "devo_a_terceiro", label: "Devo a alguém", direction: "a_pagar" },
];

function NovoTerceiros() {
  const { addThirdParty, criarCompraParcelada, pessoas, cartoes } = useFinance();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [type, setType] = useState<ThirdPartyType>("emprestei_dinheiro");
  const [personId, setPersonId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsLeft, setInstallmentsLeft] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("sem_transacao");
  const [creditCardId, setCreditCardId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tipoAtual = TIPOS.find((t) => t.key === type)!;
  const direction: ThirdPartyDirection =
    type === "usou_meu_cartao" ? "a_receber" : tipoAtual.direction;
  const isCartao = paymentMethod === "cartao_credito" || type === "usou_meu_cartao";
  const cardsAtivos = cartoes.filter((c) => c.active);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pessoa = pessoas.find((p) => p.id === personId);
    if (!pessoa) {
      setError("Selecione uma pessoa do Hub de Contatos");
      return;
    }
    const valor = parseFloat(amount.replace(",", "."));
    if (!valor || valor <= 0 || saving) return;
    if (isCartao && !creditCardId) {
      setError("Selecione o cartão de crédito");
      return;
    }
    const numInst = isInstallment ? Math.max(1, Number(installmentsLeft) || 1) : 1;
    const finalPaymentMethod: PaymentMethod = isCartao
      ? "cartao_credito"
      : paymentMethod === "conta"
        ? "conta"
        : "sem_transacao";

    setSaving(true);
    setError(null);
    try {
      let purchaseGroupId: string | null = null;

      // Cartão: materializa parcelas (via criar_compra_parcelada) e vincula ao invoice/pessoa.
      // Categoria "terceiros" para distinguir na fatura; o helper cria/attacha o invoice.
      if (isCartao && creditCardId) {
        purchaseGroupId = await criarCompraParcelada({
          description: `Terceiro — ${pessoa.name}${notes ? ` (${notes})` : ""}`,
          amountTotal: valor,
          installments: numInst,
          firstDueDate: dueDate,
          category: "terceiros",
          creditCardId,
          personId: pessoa.id,
        });
      }

      await addThirdParty({
        personId: pessoa.id,
        personName: pessoa.name,
        type,
        direction,
        paymentMethod: finalPaymentMethod,
        creditCardId: isCartao ? creditCardId : null,
        purchaseGroupId,
        amount: valor,
        dueDate: dueDate || null,
        isInstallment,
        installmentsLeft: numInst,
        status: "pendente",
        notes: notes || null,
      });
      navigate({ to: "/terceiros" });
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar");
      setSaving(false);
    }
  };

  return (
    <AppShell title="Novo registro" subtitle="Terceiros" hidePeriodFilter>
      <button
        type="button"
        onClick={() => navigate({ to: "/terceiros" })}
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> voltar
      </button>

      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-5 shadow-card">
        <div>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase text-muted-foreground">
            Tipo
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {TIPOS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setType(t.key);
                  if (t.key === "usou_meu_cartao") setPaymentMethod("cartao_credito");
                }}
                className={`rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                  type === t.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-elevated text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Field label="Pessoa (do Hub de Contatos)">
          {pessoas.length > 0 ? (
            <select
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            >
              <option value="">— Selecione —</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <Link
              to="/contatos"
              className="flex items-center justify-center gap-2 rounded-xl bg-surface-elevated px-3 py-2.5 text-xs font-semibold text-primary"
            >
              <UserPlus className="h-3.5 w-3.5" /> Cadastre um contato para lançar
            </Link>
          )}
        </Field>

        <Field label="Forma de pagamento">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { key: "sem_transacao" as PaymentMethod, label: "Sem tx" },
              { key: "conta" as PaymentMethod, label: "Conta" },
              { key: "cartao_credito" as PaymentMethod, label: "Cartão" },
            ].map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setPaymentMethod(o.key)}
                disabled={type === "usou_meu_cartao" && o.key !== "cartao_credito"}
                className={`rounded-xl px-2 py-2 text-xs font-semibold ${
                  paymentMethod === o.key || (type === "usou_meu_cartao" && o.key === "cartao_credito")
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-elevated text-muted-foreground disabled:opacity-40"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Field>

        {isCartao && (
          <Field label="Cartão">
            {cardsAtivos.length > 0 ? (
              <select
                value={creditCardId}
                onChange={(e) => setCreditCardId(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
              >
                <option value="">— Selecione —</option>
                {cardsAtivos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <Link
                to="/cartoes"
                className="flex items-center justify-center gap-2 rounded-xl bg-surface-elevated px-3 py-2.5 text-xs font-semibold text-primary"
              >
                Cadastre um cartão de crédito
              </Link>
            )}
          </Field>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Field label="Valor total (R$)">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none"
            />
          </Field>
          <Field label={isCartao ? "1ª parcela em" : "Vencimento"}>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
        </div>

        <label className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5">
          <span className="text-sm">Parcelado?</span>
          <input
            type="checkbox"
            checked={isInstallment}
            onChange={(e) => setIsInstallment(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>

        {isInstallment && (
          <Field label="Nº de parcelas">
            <input
              inputMode="numeric"
              value={installmentsLeft}
              onChange={(e) => setInstallmentsLeft(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
        )}

        <Field label="Observação (opcional)">
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Spotify família"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          />
        </Field>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
