import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Landmark, HandCoins, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBRL, useFinance, type DebtType } from "@/lib/finance-store";

export const Route = createFileRoute("/minhas-dividas")({
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
  const { dividas } = useFinance();
  const total = dividas.reduce((s, d) => s + d.valorParcela * d.parcelasRestantes, 0);

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
            const pct = (pagas / d.parcelasTotais) * 100;
            const Icon = iconFor[d.tipo];
            return (
              <li
                key={d.id}
                className="rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">{d.nome}</p>
                        <p className="text-xs text-muted-foreground">{d.tipo}</p>
                      </div>
                      <p className="shrink-0 text-base font-bold tabular-nums text-foreground">
                        {formatBRL(d.valorParcela)}
                        <span className="text-xs font-normal text-muted-foreground">/mês</span>
                      </p>
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
