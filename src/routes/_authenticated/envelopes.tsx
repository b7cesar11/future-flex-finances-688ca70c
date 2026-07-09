import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Pencil, TriangleAlert as AlertTriangle, Package } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatBRLFull, useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/envelopes")({
  head: () => ({ meta: [{ title: "Envelopes de Orçamento" }] }),
  component: EnvelopesPage,
});

function EnvelopesPage() {
  const { envelopes, envelopesCommitted, isLoading, addEnvelope, updateEnvelope, deleteEnvelope } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [limit, setLimit] = useState("");

  const totalLimit = envelopes.reduce((s, e) => s + e.monthlyLimit, 0);
  const totalSpent = envelopes.reduce((s, e) => s + e.currentSpent, 0);

  const resetForm = () => {
    setName("");
    setEmoji("📦");
    setLimit("");
  };

  const startEdit = (id: string) => {
    const env = envelopes.find((e) => e.id === id);
    if (!env) return;
    setEditing(id);
    setName(env.name);
    setEmoji(env.emoji);
    setLimit(String(env.monthlyLimit));
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(limit.replace(",", "."));
    if (!name.trim() || !v) return;
    if (editing) {
      await updateEnvelope(editing, { name: name.trim(), emoji, monthlyLimit: v });
    } else {
      await addEnvelope({ name: name.trim(), emoji, monthlyLimit: v });
    }
    setOpen(false);
    setEditing(null);
    resetForm();
  };

  return (
    <AppShell title="Envelopes" subtitle="Reserve parte do salário para cada categoria">
      <div className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <p className="text-[11px] uppercase tracking-wide opacity-80">
          Comprometido em envelopes
        </p>
        <p className="mt-1 text-3xl font-bold tabular-nums">{formatBRLFull(envelopesCommitted)}</p>
        <p className="mt-1 text-[11px] opacity-80">
          Reservas ativas · Limite mensal total {formatBRLFull(totalLimit)} · Já gasto{" "}
          {formatBRLFull(totalSpent)}
        </p>
      </div>

      {open && (
        <form
          onSubmit={submit}
          className="mt-5 space-y-3 rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50"
        >
          <p className="text-sm font-semibold">
            {editing ? "Editar envelope" : "Novo envelope"}
          </p>
          <div className="grid grid-cols-[64px_1fr] gap-2">
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              className="rounded-xl bg-surface-elevated px-3 py-2.5 text-center text-lg outline-none"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome (ex: Comida)"
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <input
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            inputMode="decimal"
            placeholder="Limite mensal (ex: 120)"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEditing(null);
                resetForm();
              }}
              className="flex-1 rounded-xl bg-secondary py-2 text-sm font-semibold text-muted-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-primary py-2 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <ul className="mt-5 space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <li key={i} className="rounded-3xl bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-2xl bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
                </div>
              </div>
              <div className="mt-3 h-2 animate-pulse rounded-full bg-secondary" />
            </li>
          ))
        ) : envelopes.length === 0 && !open ? (
          <li className="rounded-3xl bg-card p-8 text-center shadow-card">
            <Package className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold text-foreground">Nenhum envelope ainda</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Reserve parte do salário para "Comida", "Combustível" etc.
            </p>
          </li>
        ) : (
          <>
            {envelopes.map((e) => {
          const pct = e.monthlyLimit
            ? Math.min(100, Math.round((e.currentSpent / e.monthlyLimit) * 100))
            : 0;
          const over = e.currentSpent > e.monthlyLimit;
          return (
            <li key={e.id} className="rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-lg">
                  {e.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{e.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Restante {formatBRLFull(Math.max(0, e.remaining))} · Reservado{" "}
                    {formatBRLFull(e.committed)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Editar"
                  onClick={() => startEdit(e.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Excluir"
                  onClick={() => setConfirmDel(e.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Labels FORA da barra */}
              <div className="mb-1 flex items-center justify-between text-[11px] tabular-nums">
                <span className="text-muted-foreground">
                  {formatBRLFull(e.currentSpent)} / {formatBRLFull(e.monthlyLimit)}
                </span>
                <span className={over ? "font-bold text-destructive" : "text-muted-foreground"}>
                  {pct}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full ${over ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {over && (
                <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-destructive/10 px-2.5 py-1.5 text-[11px] font-semibold text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" /> Limite de {e.name} excedido
                </p>
              )}
            </li>
          );
        })}
          </>
        )}
      </ul>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> Novo
        </button>
      )}

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir envelope?"
        description="Transações associadas continuarão existindo, mas sem envelope."
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDel(null)}
        onConfirm={async () => {
          if (confirmDel) await deleteEnvelope(confirmDel);
        }}
      />
    </AppShell>
  );
}
