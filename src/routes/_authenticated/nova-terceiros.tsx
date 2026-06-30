import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useFinance, type ThirdPartyType } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/nova-terceiros")({
  head: () => ({ meta: [{ title: "Novo registro de terceiros" }] }),
  component: NovoTerceiros,
});

const TIPOS: { key: ThirdPartyType; label: string }[] = [
  { key: "emprestei_dinheiro", label: "Emprestei dinheiro" },
  { key: "usou_meu_cartao", label: "Usou meu cartão" },
  { key: "devo_a_terceiro", label: "Devo a alguém" },
];

function NovoTerceiros() {
  const { addThirdParty } = useFinance();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [type, setType] = useState<ThirdPartyType>("emprestei_dinheiro");
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsLeft, setInstallmentsLeft] = useState("1");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !amount || saving) return;
    setSaving(true);
    setError(null);
    try {
      await addThirdParty({
        personName,
        type,
        amount: parseFloat(amount.replace(",", ".")),
        dueDate: dueDate || null,
        isInstallment,
        installmentsLeft: isInstallment ? Number(installmentsLeft) : 1,
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
                onClick={() => setType(t.key)}
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

        <Field label="Nome da pessoa">
          <input
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Ex: Maria"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Valor (R$)">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none"
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
          <Field label="Parcelas restantes">
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
