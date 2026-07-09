import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, CalendarClock, Pencil } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PayCheckbox } from "@/components/PayCheckbox";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatBRLFull, useFinance, type IncomeSource } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/receitas")({
  head: () => ({ meta: [{ title: "Fontes de renda" }] }),
  component: Receitas,
});

function Receitas() {
  const {
    fontesRenda,
    contas,
    isLoading,
    addIncomeSource,
    updateIncomeSource,
    setIncomeStatus,
    deleteIncomeSource,
  } = useFinance();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [day, setDay] = useState("5");
  const [accountId, setAccountId] = useState(contas[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const total = fontesRenda.reduce((s, f) => s + f.amount, 0);

  const resetForm = () => {
    setName("");
    setAmount("");
    setDay("5");
    setAccountId(contas[0]?.id ?? "");
    setEditing(null);
  };

  const startEdit = (f: IncomeSource) => {
    setEditing(f.id);
    setName(f.name);
    setAmount(String(f.amount));
    setDay(String(f.expectedDay));
    setAccountId(f.accountId ?? contas[0]?.id ?? "");
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || saving) return;
    setSaving(true);
    try {
      const payload = {
        name,
        amount: parseFloat(amount.replace(",", ".")),
        expectedDay: Number(day),
        accountId: accountId || null,
      };
      if (editing) {
        await updateIncomeSource(editing, payload);
      } else {
        await addIncomeSource(payload);
      }
      resetForm();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Fontes de renda" subtitle="Salários, VA e outros recebimentos">
      <div className="rounded-3xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Previsto/mês</p>
            <p className="text-xl font-bold tabular-nums text-primary">{formatBRLFull(total)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="flex items-center gap-1 rounded-full bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="h-3.5 w-3.5" /> Nova
          </button>
        </div>
      </div>

      {isLoading ? (
        <ul className="mt-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card">
              <div className="h-6 w-6 animate-pulse rounded bg-secondary" />
              <div className="h-9 w-9 animate-pulse rounded-xl bg-secondary" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded bg-secondary" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-4 space-y-2">
          {fontesRenda.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Nenhuma fonte cadastrada. Adicione seu Salário, VA, etc.
            </li>
          )}
          {fontesRenda.map((f) => {
            const recebido = f.status === "recebido";
            return (
              <li
                key={f.id}
                className={`flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card ${
                  !recebido ? "ring-1 ring-warning/30" : ""
                }`}
              >
                <PayCheckbox
                  paid={recebido}
                  onToggle={() => setIncomeStatus(f.id, recebido ? "pendente" : "recebido")}
                  ariaLabel="Marcar como recebido"
                />
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <CalendarClock className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">Dia {f.expectedDay}</p>
                </div>
                <p className="text-sm font-bold tabular-nums text-primary">
                  {formatBRLFull(f.amount)}
                </p>
                <button
                  type="button"
                  aria-label="Editar"
                  onClick={() => startEdit(f)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Excluir"
                  onClick={() => setConfirmDel(f.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button aria-label="Fechar" className="absolute inset-0 bg-black/60" onClick={() => { setOpen(false); resetForm(); }} />
          <form
            onSubmit={submit}
            className="relative mx-auto w-full max-w-md space-y-3 rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]"
          >
            <h3 className="text-base font-semibold">{editing ? "Editar fonte de renda" : "Nova fonte de renda"}</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome (Salário, VA, etc.)"
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="Valor"
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
              />
              <input
                value={day}
                onChange={(e) => setDay(e.target.value.replace(/\D/g, "").slice(0, 2))}
                inputMode="numeric"
                placeholder="Dia"
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
            >
              <option value="">Sem conta vinculada</option>
              {contas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              {saving ? "Salvando..." : editing ? "Salvar alterações" : "Salvar"}
            </button>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir fonte de renda?"
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDel(null)}
        onConfirm={async () => {
          if (confirmDel) await deleteIncomeSource(confirmDel);
        }}
      />
    </AppShell>
  );
}
