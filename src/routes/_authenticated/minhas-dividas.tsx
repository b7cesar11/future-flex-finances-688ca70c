import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CreditCard,
  Landmark,
  HandCoins,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Zap,
  Snowflake,
  Repeat,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { OverdueBadge } from "@/components/OverdueBadge";
import { ParcelasList } from "@/components/ParcelasList";
import { PayCheckbox } from "@/components/PayCheckbox";
import {
  formatBRL,
  formatBRLFull,
  useFinance,
  type Debt,
  type DebtCategory,
  type DebtType,
} from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/minhas-dividas")({
  head: () => ({ meta: [{ title: "Minhas Dívidas" }] }),
  component: MinhasDividas,
});

const iconFor: Record<DebtType, typeof CreditCard> = {
  "Cartão de Crédito": CreditCard,
  Empréstimo: HandCoins,
  Financiamento: Landmark,
};

const TABS: { key: "fixa" | "parcelamentos" | "congelada"; label: string; icon: typeof Zap }[] = [
  { key: "fixa", label: "Fixas", icon: Zap },
  { key: "parcelamentos", label: "Parcelas / Variáveis", icon: Repeat },
  { key: "congelada", label: "Congeladas", icon: Snowflake },
];

function catMatches(d: Debt, tab: "fixa" | "parcelamentos" | "congelada") {
  if (tab === "fixa") return d.category === "fixa";
  if (tab === "congelada") return d.category === "congelada";
  return d.category === "parcelada" || d.category === "variavel";
}

function dueDateOfMonth(dueDay: number | null): string | null {
  if (!dueDay) return null;
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), dueDay);
  return d.toISOString().slice(0, 10);
}

function MinhasDividas() {
  const {
    dividas,
    contas,
    pagarParcela,
    estornarParcela,
    updateDebtInstallment,
    deleteDebt,
  } = useFinance();

  const [tab, setTab] = useState<"fixa" | "parcelamentos" | "congelada">("parcelamentos");
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [variableModal, setVariableModal] = useState<Debt | null>(null);
  const [variableAmount, setVariableAmount] = useState("");
  const [variableAccount, setVariableAccount] = useState<string>("");
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const filtered = useMemo(() => dividas.filter((d) => catMatches(d, tab)), [dividas, tab]);
  const activeTotal = filtered
    .filter((d) => d.category !== "congelada")
    .reduce((s, d) => s + d.valorParcela, 0);

  const openVariable = (d: Debt) => {
    setVariableModal(d);
    setVariableAmount(String(d.valorParcela));
    setVariableAccount(contas[0]?.id ?? "");
  };

  const confirmVariable = async () => {
    if (!variableModal?.currentInstallmentTxId) return;
    const amount = parseFloat(variableAmount.replace(",", "."));
    if (!(amount > 0)) return;
    await pagarParcela(variableModal.currentInstallmentTxId);
    setVariableModal(null);
  };

  return (
    <AppShell title="Minhas dívidas" subtitle={`${filtered.length} nesta aba · ${formatBRL(activeTotal)}/mês`}>
      <div className="mb-4 flex gap-1 rounded-2xl bg-card p-1 shadow-card">
        {TABS.map((t) => {
          const active = tab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors ${
                active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "congelada" && (
        <p className="mb-3 rounded-2xl bg-accent/10 px-3 py-2 text-[11px] text-accent">
          Dívidas em negociação — não afetam o fluxo de caixa nem o dashboard executivo.
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {filtered.map((d) => {
            const pagas = d.parcelasTotais - d.parcelasRestantes;
            const pct = d.parcelasTotais > 0 ? (pagas / d.parcelasTotais) * 100 : 0;
            const Icon = iconFor[d.tipo];
            const pago = d.statusThisMonth === "pago";
            const isEditing = editing === d.id;
            const canPay = d.category !== "congelada";
            const dueISO = dueDateOfMonth(d.dueDay);
            return (
              <li key={d.id} className="rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50">
                <div className="flex items-start gap-3">
                  {canPay && d.commitmentGroupId ? (
                    <button
                      type="button"
                      onClick={() => setOpenGroup(d.commitmentGroupId!)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground transition-transform active:scale-95"
                      aria-label="Ver parcelas"
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ) : canPay ? (
                    <PayCheckbox
                      paid={pago}
                      onToggle={async () => {
                        if (!d.currentInstallmentTxId) return;
                        if (pago) {
                          await estornarParcela(d.currentInstallmentTxId);
                        } else if (d.category === "variavel") {
                          openVariable(d);
                        } else {
                          await pagarParcela(d.currentInstallmentTxId);
                        }
                      }}
                      ariaLabel="Alternar parcela paga"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <div
                    className={`min-w-0 flex-1${d.commitmentGroupId ? " cursor-pointer" : ""}`}
                    onClick={d.commitmentGroupId ? () => setOpenGroup(d.commitmentGroupId) : undefined}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-base font-semibold text-foreground">{d.nome}</p>
                          <OverdueBadge dueDate={dueISO} status={d.statusThisMonth} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {d.tipo} · {labelForCategory(d.category)}
                          {d.dueDay ? ` · venc dia ${d.dueDay}` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              autoFocus
                              inputMode="decimal"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value.replace(/[^\d.,]/g, ""))}
                              className="w-20 rounded-lg bg-surface-elevated px-2 py-1 text-sm tabular-nums outline-none ring-1 ring-primary"
                            />
                            <button
                              type="button"
                              aria-label="Salvar"
                              onClick={async () => {
                                const v = parseFloat(editValue.replace(",", "."));
                                if (v > 0) await updateDebtInstallment(d.id, v);
                                setEditing(null);
                              }}
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
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <p className="text-base font-bold tabular-nums text-foreground">
                              {formatBRL(d.valorParcela)}
                              <span className="text-xs font-normal text-muted-foreground">/mês</span>
                            </p>
                            <button
                              type="button"
                              aria-label="Editar parcela"
                              onClick={() => {
                                setEditing(d.id);
                                setEditValue(String(d.valorParcela));
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label="Excluir"
                              onClick={() => setConfirmDelete(d.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {d.category === "parcelada" && (
                      <div className="mt-3">
                        <ProgressBar
                          value={pct}
                          size="sm"
                          label={`${pagas} de ${d.parcelasTotais} parcelas pagas`}
                          rightLabel={`Faltam ${d.parcelasRestantes}`}
                        />
                      </div>
                    )}
                  </div>
                  {d.commitmentGroupId && (
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        to="/nova-divida"
        className="fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Nova
      </Link>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir dívida?"
        description="Esta dívida será removida permanentemente."
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await deleteDebt(confirmDelete);
        }}
      />

      {variableModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setVariableModal(null)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="relative mx-auto w-full max-w-md rounded-t-3xl border-t border-border bg-card p-5 pb-8">
            <h3 className="text-base font-semibold text-foreground">
              Qual o valor cobrado neste mês?
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {variableModal.nome} · valor variável — não altera o contrato original.
            </p>
            <label className="mt-4 block">
              <span className="mb-1 block text-[11px] uppercase text-muted-foreground">Valor</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  R$
                </span>
                <input
                  autoFocus
                  inputMode="decimal"
                  value={variableAmount}
                  onChange={(e) => setVariableAmount(e.target.value.replace(/[^\d.,]/g, ""))}
                  className="w-full rounded-2xl bg-surface-elevated py-3 pl-9 pr-3 text-base outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                />
              </div>
            </label>
            {contas.length > 0 && (
              <label className="mt-3 block">
                <span className="mb-1 block text-[11px] uppercase text-muted-foreground">
                  Conta debitada
                </span>
                <select
                  value={variableAccount}
                  onChange={(e) => setVariableAccount(e.target.value)}
                  className="w-full rounded-2xl bg-surface-elevated px-3 py-3 text-sm outline-none"
                >
                  {contas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.nome} · {formatBRLFull(c.saldo)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setVariableModal(null)}
                className="flex-1 rounded-2xl bg-secondary py-3 text-sm font-semibold text-foreground"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmVariable}
                className="flex-1 rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {openGroup && (
        <ParcelasList
          groupId={openGroup}
          groupType="commitment"
          onClose={() => setOpenGroup(null)}
        />
      )}
    </AppShell>
  );
}

function labelForCategory(c: DebtCategory) {
  return c === "fixa"
    ? "Fixa"
    : c === "variavel"
      ? "Variável"
      : c === "congelada"
        ? "Congelada"
        : "Parcelada";
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-3xl bg-card p-8 text-center shadow-card">
      <p className="text-base font-semibold text-foreground">Nada por aqui</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Cadastre uma dívida ou mova outra para esta categoria.
      </p>
      <Link
        to="/nova-divida"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Cadastrar dívida
      </Link>
    </div>
  );
}
