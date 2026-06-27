import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Sparkles, TrendingUp, Wallet, PieChart as PieIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { buildProjection, formatBRL, formatBRLFull, useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Controle Financeiro" },
      { name: "description", content: "Visão geral das suas finanças e projeção futura." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { rendaMensal, gastosEssenciais, dividas, transacoes, categorias } = useFinance();

  const totalParcelasMes = dividas.reduce((s, d) => s + d.valorParcela, 0);
  const comprometimentoPct = Math.round((totalParcelasMes / rendaMensal) * 100);
  const saldoLivreAtual = rendaMensal - gastosEssenciais - totalParcelasMes;

  const projection = buildProjection(rendaMensal, gastosEssenciais, dividas, 12);

  const respiro = projection.slice(1).find((m) => m.ended.length > 0);
  const respiroDelta = respiro ? respiro.ended.reduce((s, d) => s + d.valorParcela, 0) : 0;

  const tone =
    comprometimentoPct >= 50 ? "destructive" : comprometimentoPct >= 30 ? "warning" : "primary";

  // === Visão do mês atual ===
  const now = new Date();
  const monthTx = useMemo(
    () =>
      transacoes.filter((t) => {
        const d = new Date(t.data + "T00:00:00");
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transacoes],
  );

  const monthTotals = useMemo(() => {
    let receitas = 0;
    let despesas = 0;
    for (const t of monthTx) {
      if (t.kind === "receita") receitas += t.valor;
      else despesas += t.valor;
    }
    return { receitas, despesas, balanco: receitas - despesas };
  }, [monthTx]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of monthTx) {
      if (t.kind !== "despesa") continue;
      map.set(t.categoriaId, (map.get(t.categoriaId) ?? 0) + t.valor);
    }
    const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
    return categorias
      .map((c) => ({
        name: c.nome,
        emoji: c.emoji,
        value: map.get(c.id) ?? 0,
        cor: c.cor,
        pct: Math.round(((map.get(c.id) ?? 0) / total) * 100),
      }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [monthTx, categorias]);

  return (
    <AppShell title="Olá, Alex" subtitle="Sua visão financeira completa">
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

      {/* Linha do Tempo */}
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
              <XAxis dataKey="mes" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)", fontSize: 12 }}
                formatter={(v: number) => [formatBRL(v), "Saldo livre"]}
                labelFormatter={(l) => `Mês: ${l}`}
              />
              <Bar dataKey="saldoLivre" radius={[6, 6, 0, 0]}>
                {projection.map((entry, i) => (
                  <Cell key={i} fill={entry.ended.length > 0 ? "var(--primary)" : "var(--accent)"} fillOpacity={entry.ended.length > 0 ? 1 : 0.55} />
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

      {/* Visão do mês atual */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <h2 className="mb-1 text-base font-semibold text-foreground">Visão do mês atual</h2>
        <p className="mb-4 text-xs text-muted-foreground capitalize">
          {now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <MiniCard label="Receitas" value={monthTotals.receitas} tone="primary" />
          <MiniCard label="Despesas" value={monthTotals.despesas} tone="destructive" />
          <MiniCard
            label="Balanço"
            value={monthTotals.balanco}
            tone={monthTotals.balanco >= 0 ? "primary" : "destructive"}
          />
        </div>

        <div className="mt-5 flex items-center gap-2">
          <PieIcon className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold">Gastos por categoria</h3>
        </div>

        {categoryData.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Sem despesas neste mês ainda.
          </p>
        ) : (
          <div className="mt-3 flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {categoryData.map((c, i) => (
                      <Cell key={i} fill={c.cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)", fontSize: 12 }}
                    formatter={(v: number, n) => [formatBRLFull(v), n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-2">
              {categoryData.slice(0, 5).map((c) => (
                <li key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.cor }} />
                  <span className="flex-1 truncate text-foreground">
                    {c.emoji} {c.name}
                  </span>
                  <span className="font-semibold tabular-nums text-muted-foreground">{c.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "debt" | "free" }) {
  return (
    <div className="rounded-2xl bg-surface-elevated p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold tabular-nums ${tone === "free" ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function MiniCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "destructive";
}) {
  return (
    <div className="rounded-2xl bg-surface-elevated p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-sm font-bold tabular-nums ${
          tone === "primary" ? "text-primary" : "text-destructive"
        }`}
      >
        {formatBRL(value)}
      </p>
    </div>
  );
}

function LegendDot({ className }: { className: string }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${className}`} />;
}
