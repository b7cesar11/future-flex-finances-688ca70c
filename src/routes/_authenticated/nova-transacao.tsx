import { useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Pin, UserPlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useFinance, formatBRLFull, type TxKind, type PaymentStatus } from "@/lib/finance-store";

type Search = { kind?: TxKind };

export const Route = createFileRoute("/_authenticated/nova-transacao")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    kind: s.kind === "receita" ? "receita" : "despesa",
  }),
  head: () => ({ meta: [{ title: "Nova transação" }] }),
  component: NovaTransacao,
});

function NovaTransacao() {
  const { kind = "despesa" } = useSearch({ from: "/_authenticated/nova-transacao" });
  const { categorias, contas, envelopes, pessoas, addTransaction } = useFinance();
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);

  const [tipo, setTipo] = useState<TxKind>(kind);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? "");
  const [contaId, setContaId] = useState(contas[0]?.id ?? "");
  const [envelopeId, setEnvelopeId] = useState<string>("");
  const [personId, setPersonId] = useState<string>("");
  const [data, setData] = useState(today);
  const [dueDate, setDueDate] = useState(today);
  const [status, setStatus] = useState<PaymentStatus>("pago");
  const [isFixed, setIsFixed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(valor.replace(",", "."));
    if (!v || saving) return;
    setSaving(true);
    setError(null);
    try {
      await addTransaction({
        kind: tipo,
        descricao: descricao || categorias.find((c) => c.id === categoriaId)?.nome || "Lançamento",
        valor: v,
        data,
        dueDate,
        status,
        isFixed,
        categoriaId,
        contaId,
        envelopeId: tipo === "despesa" ? envelopeId || null : null,
      });
      void navigate({ to: "/transacoes" });
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar");
      setSaving(false);
    }
  };

  return (
    <AppShell
      title={tipo === "receita" ? "Nova receita" : "Nova despesa"}
      subtitle="Lance com data, vencimento e status"
      hidePeriodFilter
    >
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> voltar
      </button>

      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-5 shadow-card">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
          {(["despesa", "receita"] as TxKind[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`rounded-xl py-2 text-sm font-semibold capitalize transition-colors ${
                tipo === t
                  ? t === "receita"
                    ? "bg-primary text-primary-foreground"
                    : "bg-destructive text-destructive-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Field label="Descrição">
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Mercado da semana"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          />
        </Field>

        <Field label="Valor (R$)">
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            inputMode="decimal"
            placeholder="0,00"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-base font-semibold tabular-nums outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Data">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
          <Field label="Vencimento">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
        </div>

        <Field label="Status">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
            {(["pago", "pendente", "atrasado"] as PaymentStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-lg py-1.5 text-[11px] font-semibold capitalize ${
                  status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Categoria">
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.nome}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Conta">
          <select
            value={contaId}
            onChange={(e) => setContaId(e.target.value)}
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          >
            {contas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Field>

        {tipo === "despesa" && envelopes.length > 0 && (
          <Field label="Envelope (opcional)">
            <select
              value={envelopeId}
              onChange={(e) => setEnvelopeId(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            >
              <option value="">— Sem envelope —</option>
              {envelopes.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.emoji} {env.name} · resta {formatBRLFull(Math.max(0, env.remaining))}
                </option>
              ))}
            </select>
            {envelopeId &&
              (() => {
                const env = envelopes.find((e) => e.id === envelopeId);
                const v = parseFloat(valor.replace(",", ".")) || 0;
                if (!env) return null;
                const excede = env.currentSpent + v > env.monthlyLimit;
                if (!excede) return null;
                return (
                  <p className="mt-1.5 rounded-xl bg-destructive/10 px-2.5 py-1.5 text-[11px] font-semibold text-destructive">
                    ⚠️ Limite de {env.name} excedido
                  </p>
                );
              })()}
          </Field>
        )}

        <label className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5">
          <span className="flex items-center gap-2 text-sm">
            <Pin className="h-4 w-4 text-accent" /> Despesa fixa (água, luz, internet…)
          </span>
          <input
            type="checkbox"
            checked={isFixed}
            onChange={(e) => setIsFixed(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>

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
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
