import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Sparkles, TrendingUp, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { buildProjection, formatBRL, useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Projeção Financeira" },
      { name: "description", content: "Veja quanto da sua renda estará livre nos próximos meses." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { rendaMensal, gastosEssenciais, dividas } = useFinance();

  const totalParcelasMes = dividas.reduce((s, d) => s + d.valorParcela, 0);
  const comprometimentoPct = Math.round((totalParcelasMes / rendaMensal) * 100);
  const saldoLivreAtual = rendaMensal - gastosEssenciais - totalParcelasMes;

  const projection = buildProjection(rendaMensal, gastosEssenciais, dividas, 12);

  // First future month where a debt ends → "Mês de Respiro"
  const respiro = projection.slice(1).find((m) => m.ended.length > 0);
  const respiroDelta = respiro
    ? respiro.ended.reduce((s, d) => s + d.valorParcela, 0)
    : 0;

  const tone =
    comprometimentoPct >= 50 ? "destructive" : comprometimentoPct >= 30 ? "warning" : "primary";

  return (
    <AppShell title="Olá, Alex" subtitle="Sua projeção dos próximos 12 meses">
      {/* Termômetro */}
      <section className="rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Renda mensal</p>
            <p className="text-2xl font-bold text-foreground">{formatBRL(rendaMensal)}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <ProgressBar
          value={comprometimentoPct}
          tone={tone}
          label="Comprometido com dívidas"
          rightLabel={`${comprometimentoPct}%`}
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat label="Parcelas/mês" value={formatBRL(totalParcelasMes)} tone="debt" />
          <Stat label="Saldo livre" value={formatBRL(Math.max(0, saldoLivreAtual))} tone="free" />
        </div>
      </section>

      {/* Linha do Tempo de Alívio */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Linha do tempo de alívio</h2>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Seu saldo livre projetado conforme as dívidas terminam.
        </p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projection} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--foreground)",
                  fontSize: 12,
                }}
                formatter={(v: number) => [formatBRL(v), "Saldo livre"]}
                labelFormatter={(l) => `Mês: ${l}`}
              />
              <Bar dataKey="saldoLivre" radius={[6, 6, 0, 0]}>
                {projection.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.ended.length > 0 ? "var(--primary)" : "var(--accent)"}
                    fillOpacity={entry.ended.length > 0 ? 1 : 0.55}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
          <LegendDot className="bg-accent/60" /> Saldo projetado
          <LegendDot className="bg-primary" /> Mês com dívida quitada
        </div>
      </section>

      {/* Mês de Respiro */}
      {respiro && (
        <section className="mt-5 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-5 shadow-glow">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Mês de respiro</h2>
          </div>
          <p className="text-foreground">
            Em <strong className="text-primary">{respiro.mes}</strong> você quita{" "}
            <strong>{respiro.ended.map((d) => d.nome).join(", ")}</strong> e libera
          </p>
          <p className="mt-2 text-3xl font-bold text-primary">+ {formatBRL(respiroDelta)}/mês</p>
          <p className="mt-1 text-xs text-muted-foreground">no seu orçamento, todo mês a partir daí.</p>
        </section>
      )}
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "debt" | "free" }) {
  return (
    <div className="rounded-2xl bg-surface-elevated p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-lg font-bold tabular-nums ${
          tone === "free" ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function LegendDot({ className }: { className: string }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${className}`} />;
}
