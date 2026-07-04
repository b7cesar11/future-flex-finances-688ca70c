import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Plus, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { formatBRLFull, useFinance, type AccountType } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/carteira")({
  head: () => ({
    meta: [
      { title: "Carteira — Saldo atual" },
      { name: "description", content: "Saldo consolidado e contas." },
    ],
  }),
  component: Carteira,
});

const TIPOS: AccountType[] = ["Conta Corrente", "Poupança", "Dinheiro", "Cartão de Crédito"];

function Carteira() {
  const { contas, saldoReal, addAccount } = useFinance();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<AccountType>("Conta Corrente");
  const [saldo, setSaldo] = useState("");
  const [emoji, setEmoji] = useState("🏦");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await addAccount({
        nome: nome.trim(),
        tipo,
        saldoInicial: Number(saldo.replace(",", ".")) || 0,
        emoji,
      });
      setOpen(false);
      setNome("");
      setSaldo("");
      setEmoji("🏦");
      setTipo("Conta Corrente");
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Carteira" subtitle="Saldo real, calculado dos lançamentos pagos">
      <section className="overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Saldo geral</p>
          <Wallet className="h-5 w-5 opacity-80" />
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums">{formatBRLFull(saldoReal)}</p>
        <p className="mt-1 text-xs opacity-80">
          {contas.length} contas · atualiza a cada pagamento marcado
        </p>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Minhas contas</h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Conta
          </button>
        </div>

        <ul className="space-y-3">
          {contas.map((c) => (
            <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${c.cor}`}
              >
                {c.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{c.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {c.tipo} · inicial {formatBRLFull(c.saldoInicial)}
                </p>
              </div>
              <p
                className={`text-base font-bold tabular-nums ${
                  c.saldo < 0 ? "text-destructive" : "text-foreground"
                }`}
              >
                {formatBRLFull(c.saldo)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full max-w-md space-y-4 rounded-t-3xl bg-card p-5 shadow-card sm:rounded-3xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Nova conta</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Nome
              </span>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Nubank"
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
                autoFocus
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Tipo
                </span>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as AccountType)}
                  className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
                >
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Saldo inicial
                </span>
                <input
                  inputMode="decimal"
                  value={saldo}
                  onChange={(e) => setSaldo(e.target.value.replace(/[^\d.,]/g, ""))}
                  placeholder="0,00"
                  className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Emoji
              </span>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                className="w-16 rounded-xl bg-surface-elevated px-3 py-2.5 text-center text-lg outline-none"
              />
            </label>
            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={saving || !nome.trim()}
              className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Criar conta"}
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
