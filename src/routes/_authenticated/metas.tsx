import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PiggyBank, Plus, Target, Trash2, Pencil } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatBRL, formatBRLFull, useFinance, type SavingsGoal } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/metas")({
  head: () => ({
    meta: [
      { title: "Caixinhas — Metas de vida" },
      { name: "description", content: "Reserve dinheiro em caixinhas para cada objetivo." },
    ],
  }),
  component: MetasPage,
});

function MetasPage() {
  const {
    metas,
    saldoReal,
    caixinhasTotal,
    contas,
    isLoading,
    addGoal,
    updateGoal,
    contributeToGoal,
    deleteGoal,
  } = useFinance();

  const [showNew, setShowNew] = useState(false);
  const [editTarget, setEditTarget] = useState<SavingsGoal | null>(null);
  const [depositTarget, setDepositTarget] = useState<{ id: string; nome: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; nome: string } | null>(null);

  return (
    <AppShell title="Caixinhas" subtitle="Reserve por objetivo — deduz do saldo real" hidePeriodFilter>
      <section className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
            Guardado nas caixinhas
          </p>
          <PiggyBank className="h-5 w-5 opacity-80" />
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums">{formatBRLFull(caixinhasTotal)}</p>
        <p className="mt-1 text-xs opacity-80">
          Saldo real disponível: <strong>{formatBRLFull(saldoReal)}</strong>
        </p>
      </section>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Minhas metas</h2>
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Nova meta
        </button>
      </div>

      {isLoading ? (
        <ul className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <li key={i} className="rounded-3xl bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 animate-pulse rounded-2xl bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
                </div>
              </div>
              <div className="mt-3 h-2 animate-pulse rounded-full bg-secondary" />
            </li>
          ))}
        </ul>
      ) : metas.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-border p-6 text-center">
          <Target className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-foreground">Nenhuma caixinha ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Crie uma para viagem, reserva ou entrada do imóvel.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {metas.map((m) => {
            const pct = m.valorTotal > 0 ? Math.round((m.valorAtual / m.valorTotal) * 100) : 0;
            const restante = Math.max(0, m.valorTotal - m.valorAtual);
            return (
              <li key={m.id} className="rounded-3xl bg-card p-4 shadow-card">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-2xl">
                      {m.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{m.nome}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Faltam <strong className="text-foreground">{formatBRL(restante)}</strong>
                        {m.aporteMensal > 0 && (
                          <>
                            {" "}
                            · aporte {formatBRL(m.aporteMensal)}/mês
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setEditTarget(m)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                      aria-label="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: m.id, nome: m.nome })}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Regra: rótulo SEMPRE FORA da barra */}
                <ProgressBar
                  value={pct}
                  size="sm"
                  label={`${formatBRL(m.valorAtual)} / ${formatBRL(m.valorTotal)}`}
                  rightLabel={`${pct}%`}
                />

                <button
                  type="button"
                  onClick={() => setDepositTarget({ id: m.id, nome: m.nome })}
                  className="mt-3 w-full rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground active:scale-[.98]"
                >
                  Guardar dinheiro
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showNew && (
        <NewGoalModal
          onClose={() => setShowNew(false)}
          onCreate={async (payload) => {
            await addGoal(payload);
            setShowNew(false);
          }}
        />
      )}

      {editTarget && (
        <EditGoalModal
          goal={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={async (payload) => {
            await updateGoal(editTarget.id, payload);
            setEditTarget(null);
          }}
        />
      )}

      {depositTarget && (
        <DepositModal
          nome={depositTarget.nome}
          contas={contas}
          onClose={() => setDepositTarget(null)}
          onConfirm={async (amount, accountId) => {
            await contributeToGoal(depositTarget.id, amount, accountId);
            setDepositTarget(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir caixinha"
        description={
          <>
            Isso remove a meta <strong>{deleteTarget?.nome}</strong>. Os lançamentos de "Guardar"
            permanecem no histórico.
          </>
        }
        destructive
        confirmLabel="Excluir"
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteGoal(deleteTarget.id);
        }}
      />
    </AppShell>
  );
}

function NewGoalModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (p: {
    nome: string;
    emoji?: string;
    valorTotal: number;
    aporteMensal?: number;
  }) => Promise<void>;
}) {
  const [nome, setNome] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [valorTotal, setValorTotal] = useState("");
  const [aporte, setAporte] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!nome.trim() || !valorTotal) return;
    setBusy(true);
    try {
      await onCreate({
        nome: nome.trim(),
        emoji: emoji || "🎯",
        valorTotal: Number(valorTotal),
        aporteMensal: aporte ? Number(aporte) : 0,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0">
      <button aria-label="Fechar" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-card">
        <h3 className="mb-4 text-base font-semibold">Nova caixinha</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase text-muted-foreground">Nome</span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Viagem, reserva, entrada..."
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
            />
          </label>
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase text-muted-foreground">Emoji</span>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-center text-lg outline-none ring-1 ring-border focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase text-muted-foreground">Objetivo (R$)</span>
              <input
                inputMode="decimal"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
                placeholder="5000"
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase text-muted-foreground">
              Aporte mensal sugerido (opcional)
            </span>
            <input
              inputMode="decimal"
              value={aporte}
              onChange={(e) => setAporte(e.target.value)}
              placeholder="500"
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
            />
          </label>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy || !nome.trim() || !valorTotal}
            onClick={submit}
            className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            {busy ? "..." : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DepositModal({
  nome,
  contas,
  onClose,
  onConfirm,
}: {
  nome: string;
  contas: { id: string; nome: string }[];
  onClose: () => void;
  onConfirm: (amount: number, accountId?: string | null) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<string>(contas[0]?.id ?? "");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const v = Number(amount);
    if (!v || v <= 0) return;
    setBusy(true);
    try {
      await onConfirm(v, accountId || null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0">
      <button aria-label="Fechar" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-card">
        <h3 className="mb-1 text-base font-semibold">Guardar em "{nome}"</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Cria uma saída no caixa e credita na caixinha.
        </p>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase text-muted-foreground">Valor (R$)</span>
            <input
              autoFocus
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="200"
              className="w-full rounded-xl bg-surface-elevated px-3 py-3 text-lg font-semibold outline-none ring-1 ring-border focus:ring-primary"
            />
          </label>
          {contas.length > 0 && (
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase text-muted-foreground">De qual conta</span>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
              >
                {contas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy || !amount}
            onClick={submit}
            className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            {busy ? "..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditGoalModal({
  goal,
  onClose,
  onSave,
}: {
  goal: SavingsGoal;
  onClose: () => void;
  onSave: (p: {
    nome: string;
    emoji?: string;
    valorTotal: number;
    aporteMensal?: number;
  }) => Promise<void>;
}) {
  const [nome, setNome] = useState(goal.nome);
  const [emoji, setEmoji] = useState(goal.emoji);
  const [valorTotal, setValorTotal] = useState(String(goal.valorTotal));
  const [aporte, setAporte] = useState(String(goal.aporteMensal || ""));
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!nome.trim() || !valorTotal) return;
    setBusy(true);
    try {
      await onSave({
        nome: nome.trim(),
        emoji: emoji || "🎯",
        valorTotal: Number(valorTotal),
        aporteMensal: aporte ? Number(aporte) : 0,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0">
      <button aria-label="Fechar" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-card">
        <h3 className="mb-4 text-base font-semibold">Editar caixinha</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase text-muted-foreground">Nome</span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
            />
          </label>
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase text-muted-foreground">Emoji</span>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-center text-lg outline-none ring-1 ring-border focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] uppercase text-muted-foreground">Objetivo (R$)</span>
              <input
                inputMode="decimal"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase text-muted-foreground">
              Aporte mensal sugerido (opcional)
            </span>
            <input
              inputMode="decimal"
              value={aporte}
              onChange={(e) => setAporte(e.target.value)}
              placeholder="500"
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
            />
          </label>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy || !nome.trim() || !valorTotal}
            onClick={submit}
            className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            {busy ? "..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
