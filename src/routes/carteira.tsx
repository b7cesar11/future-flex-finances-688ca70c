import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { formatBRLFull, useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/carteira")({
  head: () => ({
    meta: [
      { title: "Carteira — Saldo atual" },
      { name: "description", content: "Saldo consolidado e contas." },
    ],
  }),
  component: Carteira,
});

function Carteira() {
  const { contas } = useFinance();
  const total = contas.reduce((s, c) => s + c.saldo, 0);

  return (
    <AppShell title="Carteira" subtitle="Seu dinheiro em todas as contas">
      <section className="overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Saldo geral</p>
          <Wallet className="h-5 w-5 opacity-80" />
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums">{formatBRLFull(total)}</p>
        <p className="mt-1 text-xs opacity-80">{contas.length} contas conectadas</p>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Minhas contas</h2>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Conta
          </button>
        </div>

        <ul className="space-y-3">
          {contas.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${c.cor}`}>
                {c.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{c.nome}</p>
                <p className="text-xs text-muted-foreground">{c.tipo}</p>
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
    </AppShell>
  );
}
