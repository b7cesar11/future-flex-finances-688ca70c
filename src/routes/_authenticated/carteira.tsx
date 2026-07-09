import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Plus, X, Pencil, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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
  const { contas, saldoReal, isLoading, addAccount, updateAccount, deleteAccount } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<AccountType>("Conta Corrente");
  const [saldo, setSaldo] = useState("");
  const [emoji, setEmoji] = useState("🏦");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setNome("");
    setTipo("Conta Corrente");
    setSaldo("");
    setEmoji("🏦");
    setEditing(null);
    setError(null);
  };

  const startEdit = (id: string) => {
    const c = contas.find((x) => x.id === id);
    if (!c) return;
    setEditing(id);
    setNome(c.nome);
    setTipo(c.tipo);
    setSaldo(String(c.saldoInicial));
    setEmoji(c.emoji);
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await updateAccount(editing, { nome: nome.trim(), tipo, emoji });
      } else {
        await addAccount({
          nome: nome.trim(),
          tipo,
          saldoInicial: Number(saldo.replace(",", ".")) || 0,
          emoji,
        });
      }
      setOpen(false);
      resetForm();
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
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Conta
          </button>
        </div>

        {isLoading ? (
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
                <div className="h-12 w-12 animate-pulse rounded-2xl bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
                </div>
                <div className="h-5 w-20 animate-pulse rounded bg-secondary" />
              </li>
            ))}
          </ul>
        ) : contas.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center shadow-card">
            <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">Nenhuma conta ainda</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Cadastre sua primeira conta para começar.
            </p>
          </div>
        ) : (
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
                <button
                  type="button"
                  aria-label="Editar"
                  onClick={() => startEdit(c.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Excluir"
                  onClick={() => setConfirmDel(c.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={() => {
            setOpen(false);
            resetForm();
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full max-w-md space-y-4 rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-card sm:rounded-3xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{editing ? "Editar conta" : "Nova conta"}</h3>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                aria-label="Fechar"
              >
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
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
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
                  className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
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
                  disabled={!!editing}
                  className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none ring-1 ring-border focus:ring-2 focus:ring-primary disabled:opacity-50"
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
                className="w-16 rounded-xl bg-surface-elevated px-3 py-2.5 text-center text-lg outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
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
              {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar conta"}
            </button>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir conta?"
        description="Transações associadas ficarão sem conta vinculada. Esta ação não pode ser desfeita."
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDel(null)}
        onConfirm={async () => {
          if (confirmDel) await deleteAccount(confirmDel);
        }}
      />
    </AppShell>
  );
}
