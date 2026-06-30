import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Plus, Trash2, HandCoins, CreditCard, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PayCheckbox } from "@/components/PayCheckbox";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatBRLFull, useFinance, type ThirdPartyType } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/terceiros")({
  head: () => ({ meta: [{ title: "Terceiros" }] }),
  component: Terceiros,
});

const META: Record<ThirdPartyType, { label: string; icon: typeof Users; tone: string }> = {
  emprestei_dinheiro: { label: "Emprestei", icon: HandCoins, tone: "bg-primary/15 text-primary" },
  usou_meu_cartao: { label: "Usou meu cartão", icon: CreditCard, tone: "bg-accent/15 text-accent" },
  devo_a_terceiro: { label: "Devo a", icon: AlertCircle, tone: "bg-destructive/15 text-destructive" },
};

function Terceiros() {
  const { terceiros, setThirdPartyStatus, deleteThirdParty } = useFinance();
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const grouped = (["emprestei_dinheiro", "usou_meu_cartao", "devo_a_terceiro"] as ThirdPartyType[]).map(
    (t) => ({ type: t, items: terceiros.filter((x) => x.type === t) }),
  );

  return (
    <AppShell title="Terceiros" subtitle="Empréstimos, cartão usado e dívidas com pessoas">
      {terceiros.length === 0 && (
        <div className="rounded-3xl bg-card p-8 text-center shadow-card">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">Nenhum registro ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cadastre quem te deve ou para quem você deve.
          </p>
          <Link
            to="/nova-terceiros"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </Link>
        </div>
      )}

      {grouped.map(({ type, items }) =>
        items.length === 0 ? null : (
          <section key={type} className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${META[type].tone}`}>
                {(() => {
                  const I = META[type].icon;
                  return <I className="h-4 w-4" />;
                })()}
              </span>
              <h2 className="text-sm font-semibold text-foreground">{META[type].label}</h2>
              <span className="text-[11px] text-muted-foreground">
                {formatBRLFull(items.reduce((s, x) => s + x.amount, 0))}
              </span>
            </div>
            <ul className="overflow-hidden rounded-2xl bg-card shadow-card">
              {items.map((t, i) => {
                const pago = t.status === "pago";
                return (
                  <li
                    key={t.id}
                    className={`flex items-center gap-3 px-3 py-3 ${
                      i < items.length - 1 ? "border-b border-border/60" : ""
                    } ${!pago ? "bg-warning/5" : ""}`}
                  >
                    <PayCheckbox
                      paid={pago}
                      onToggle={() => setThirdPartyStatus(t.id, pago ? "pendente" : "pago")}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{t.personName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {t.dueDate
                          ? `Venc ${new Date(t.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}`
                          : "Sem vencimento"}
                        {t.isInstallment ? ` · ${t.installmentsLeft}x restantes` : ""}
                      </p>
                    </div>
                    <p className={`text-sm font-semibold tabular-nums ${!pago ? "opacity-70" : ""}`}>
                      {formatBRLFull(t.amount)}
                    </p>
                    <button
                      type="button"
                      aria-label="Excluir"
                      onClick={() => setConfirmDel(t.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ),
      )}

      <Link
        to="/nova-terceiros"
        className="fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Novo
      </Link>

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir registro?"
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDel(null)}
        onConfirm={async () => {
          if (confirmDel) await deleteThirdParty(confirmDel);
        }}
      />
    </AppShell>
  );
}
