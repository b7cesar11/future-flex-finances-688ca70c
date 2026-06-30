import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Landmark, HandCoins, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { PayCheckbox } from "@/components/PayCheckbox";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatBRL, useFinance, type DebtType } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/minhas-dividas")({
  head: () => ({
    meta: [
      { title: "Minhas Dívidas" },
      { name: "description", content: "Suas dívidas ativas e o progresso de cada uma." },
    ],
  }),
  component: MinhasDividas,
});

const iconFor: Record<DebtType, typeof CreditCard> = {
  "Cartão de Crédito": CreditCard,
  Empréstimo: HandCoins,
  Financiamento: Landmark,
};

function MinhasDividas() {
  const { dividas, payDebtInstallment, updateDebtInstallment, deleteDebt, setTransactionStatus } =
    useFinance();
  const total = dividas.reduce((s, d) => s + d.valorParcela * d.parcelasRestantes, 0);

  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <AppShell
      title="Minhas dívidas"
      subtitle={`${dividas.length} ativas · ${formatBRL(total)} a quitar`}
    >
      {dividas.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {dividas.map((d) => {
            const pagas = d.parcelasTotais - d.parcelasRestantes;
            const pct = d.parcelasTotais > 0 ? (pagas / d.parcelasTotais) * 100 : 0;
            const Icon = iconFor[d.tipo];
            const pago = d.statusThisMonth === "pago";
            const isEditing = editing === d.id;
            return (
              <li
                key={d.id}
                className="rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50"
              >
                <div className="flex items-start gap-3">
                  <PayCheckbox
                    paid={pago}
                    onToggle={async () => {
                      if (!pago) await payDebtInstallment(d.id);
                    }}
                    ariaLabel="Marcar parcela como paga"
                  />
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">
                          {d.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {d.tipo}
                          {d.dueDay ? ` · venc dia ${d.dueDay}` : ""}
                          {d.isVariable ? " · variável" : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              autoFocus
                              inputMode="decimal"
                              value={editValue}
                              onChange={(e) =>
                                setEditValue(e.target.value.replace(/[^\d.,]/g, ""))
                              }
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
                              <span className="text-xs font-normal text-muted-foreground">
                                /mês
                              </span>
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
                              aria-label="Excluir dívida"
                              onClick={() => setConfirmDelete(d.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar
                        value={pct}
                        size="sm"
                        label={`${pagas} de ${d.parcelasTotais} parcelas pagas`}
                        rightLabel={`Faltam ${d.parcelasRestantes}`}
                      />
                    </div>
                  </div>
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
        <Plus className="h-4 w-4" />
        Nova
      </Link>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir dívida?"
        description="Esta dívida será removida permanentemente da projeção."
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await deleteDebt(confirmDelete);
        }}
      />
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-3xl bg-card p-8 text-center shadow-card">
      <p className="text-base font-semibold text-foreground">Nenhuma dívida cadastrada</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Adicione sua primeira dívida e veja a projeção do seu saldo livre.
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
