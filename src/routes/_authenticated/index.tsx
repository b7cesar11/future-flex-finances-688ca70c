import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  PiggyBank,
  Target,
  AlertCircle,
  Calendar,
  Activity,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { buildProjection, formatBRL, useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Início — Controle Financeiro" },
      { name: "description", content: "Visão geral das suas finanças e projeção futura." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const {
    rendaMensal,
    gastosEssenciais,
    dividas,
    contas,
    transacoes,
    metas,
    investimentos,
  } = useFinance();

  // ===== Mês atual =====
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

  const receitasMes = monthTx.filter((t) => t.kind === "receita").reduce((s, t) => s + t.valor, 0);
  const despesasMes = monthTx.filter((t) => t.kind === "despesa").reduce((s, t) => s + t.valor, 0);
  const saldoGeral = contas.reduce((s, c) => s + c.saldo, 0);
  const lucratividade = receitasMes > 0 ? Math.round(((receitasMes - despesasMes) / receitasMes) * 100) : 0;

  // ===== Contas a pagar / receber (placeholders consistentes baseados em dívidas) =====
  const totalParcelasMes = dividas.reduce((s, d) => s + d.valorParcela, 0);
  const hoje = now.getDate();
  const aPagarHoje = dividas.filter((d) => {
    // placeholder: assume vencimento dia 10 para dívidas ímpares, 20 para pares
    const dia = d.id.charCodeAt(0) % 28 || 10;
    return dia === hoje;
  }).length;
  const aReceberHoje = 0;
  const totalAReceber = receitasMes; // placeholder

  // ===== Patrimônio =====
  const totalInvestido = investimentos.reduce((s, i) => s + i.valor, 0);
  const aporteSugerido =
    investimentos.reduce((s, i) => s + i.aporteSugerido, 0) ||
    Math.max(0, Math.round((receitasMes - despesasMes) * 0.2));

  // ===== Análise estratégica =====
  const comprometimentoPct = rendaMensal > 0 ? Math.round((totalParcelasMes / rendaMensal) * 100) : 0;
  const tone =
    comprometimentoPct >= 50 ? "destructive" : comprometimentoPct >= 30 ? "warning" : "primary";
  const projection = buildProjection(rendaMensal, gastosEssenciais, dividas, 12);
  const respiro = projection.slice(1).find((m) => m.ended.length > 0);
  const respiroDelta = respiro ? respiro.ended.reduce((s, d) => s + d.valorParcela, 0) : 0;

  return (
    <AppShell title="Olá, Alex" subtitle="Onde você está, agora.">
      {/* ============= 1. PRIORIDADE MÁXIMA ============= */}
      <section className="grid grid-cols-2 gap-3">
        <KpiCard
          icon={<ArrowUpRight className="h-4 w-4" />}
          label="Receitas"
          value={formatBRL(receitasMes)}
          tone="primary"
        />
        <KpiCard
          icon={<ArrowDownRight className="h-4 w-4" />}
          label="Despesas"
          value={formatBRL(despesasMes)}
          tone="destructive"
        />
        <KpiCard
          icon={<Wallet className="h-4 w-4" />}
          label="Saldo geral"
          value={formatBRL(saldoGeral)}
          tone="accent"
        />
        <KpiCard
          icon={<Percent className="h-4 w-4" />}
          label="Lucratividade"
          value={`${lucratividade}%`}
          tone={lucratividade >= 0 ? "primary" : "destructive"}
        />
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3">
        <BillBlock
          title="Contas a pagar"
          total={totalParcelasMes}
          dueToday={aPagarHoje}
          tone="destructive"
          to="/minhas-dividas"
        />
        <BillBlock
          title="Contas a receber"
          total={totalAReceber}
          dueToday={aReceberHoje}
          tone="primary"
          to="/transacoes"
        />
      </section>

      {/* ============= 2. VISÃO DE RIQUEZA E METAS ============= */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <PiggyBank className="h-4 w-4 text-accent" />
          <h2 className="text-base font-semibold text-foreground">Patrimônio</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-elevated p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total investido</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
              {formatBRL(totalInvestido)}
            </p>
            {investimentos.length === 0 && (
              <p className="mt-1 text-[10px] text-muted-foreground">Sem investimentos cadastrados</p>
            )}
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-3">
            <p className="text-[10px] uppercase tracking-wider text-accent">Aporte sugerido</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-accent">
              {formatBRL(aporteSugerido)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">20% do seu balanço mensal</p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Metas e objetivos</h2>
          </div>
          <span className="text-[11px] text-muted-foreground">{metas.length} ativas</span>
        </div>

        {metas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-5 text-center">
            <p className="text-sm text-foreground">Defina sua primeira meta de vida</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Viagem, reserva de emergência, entrada do imóvel — comece pequeno.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {metas.map((m) => {
              const pct = m.valorTotal > 0 ? Math.round((m.valorAtual / m.valorTotal) * 100) : 0;
              return (
                <li key={m.id} className="rounded-2xl bg-surface-elevated p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{m.emoji}</span>
                      <span className="truncate text-sm font-medium text-foreground">{m.nome}</span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                      {formatBRL(m.valorAtual)} / {formatBRL(m.valorTotal)}
                    </span>
                  </div>
                  <ProgressBar value={pct} size="sm" rightLabel={`${pct}% concluída`} />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ============= 3. VISÃO DE HORIZONTE ============= */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-1 flex items-center gap-2">
          <Activity className="h-4 w-4 text-warning" />
          <h2 className="text-base font-semibold text-foreground">Termômetro de comprometimento</h2>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Quanto da sua renda já está comprometido com dívidas.
        </p>
        <ProgressBar
          value={comprometimentoPct}
          tone={tone}
          label={`${formatBRL(totalParcelasMes)} / ${formatBRL(rendaMensal)}`}
          rightLabel={`${comprometimentoPct}%`}
        />
      </section>

      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Linha do tempo de alívio</h2>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Saldo livre projetado conforme as dívidas terminam.
        </p>
        <div className="h-48 w-full">
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

        {respiro && (
          <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-3">
            <div className="mb-1 flex items-center gap-2 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Mês de respiro</span>
            </div>
            <p className="text-xs text-foreground">
              Em <strong className="text-primary">{respiro.mes}</strong> você libera{" "}
              <strong className="text-primary">+ {formatBRL(respiroDelta)}/mês</strong>.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function KpiCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "destructive" | "accent";
}) {
  const toneText =
    tone === "primary" ? "text-primary" : tone === "destructive" ? "text-destructive" : "text-accent";
  const toneBg =
    tone === "primary"
      ? "bg-primary/15 text-primary"
      : tone === "destructive"
        ? "bg-destructive/15 text-destructive"
        : "bg-accent/15 text-accent";
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneBg}`}>{icon}</span>
      </div>
      <p className={`mt-2 text-base font-bold tabular-nums ${toneText}`}>{value}</p>
    </div>
  );
}

function BillBlock({
  title,
  total,
  dueToday,
  tone,
  to,
}: {
  title: string;
  total: number;
  dueToday: number;
  tone: "primary" | "destructive";
  to: string;
}) {
  const toneText = tone === "primary" ? "text-primary" : "text-destructive";
  const toneBg = tone === "primary" ? "bg-primary/15" : "bg-destructive/15";
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card transition active:scale-[.98]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneBg} ${toneText}`}>
          {tone === "destructive" ? <AlertCircle className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className={`text-base font-bold tabular-nums ${toneText}`}>{formatBRL(total)}</p>
        </div>
      </div>
      {dueToday > 0 && (
        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${toneBg} ${toneText}`}>
          {dueToday} {dueToday === 1 ? "item" : "itens"} hoje
        </span>
      )}
    </Link>
  );
}
