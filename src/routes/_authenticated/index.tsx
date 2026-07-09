import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from "recharts";
import { Sparkles, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Percent, PiggyBank, Target, CircleAlert as AlertCircle, Calendar, Activity, CalendarClock, CalendarCheck, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import {
  buildProjection,
  formatBRL,
  projectUntilNextIncome,
  useFinance,
} from "@/lib/finance-store";
import { usePeriod } from "@/lib/period-filter";

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
    transacoes,
    metas,
    investimentos,
    terceiros,
    fontesRenda,
    saldoReal,
    caixinhasTotal,
    pendentesMesTotal,
    livreParaGastar,
    envelopesCommitted,
    isLoading,
  } = useFinance();
  const { range, isInRange } = usePeriod();


  const { data: greetingName } = useQuery({
    queryKey: ["profile", "greeting"],
    queryFn: async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      const { data: profile } = await supabase.from("profiles").select("full_name").maybeSingle();
      const full = (profile?.full_name ?? "").trim();
      if (full) return full.split(" ")[0];
      const meta: any = user?.user_metadata ?? {};
      const metaName = (meta.full_name ?? meta.name ?? "").trim();
      if (metaName) return metaName.split(" ")[0];
      if (user?.email) return user.email.split("@")[0];
      return "";
    },
  });

  // ===== Período atual (filtro global) =====
  const periodTx = useMemo(() => transacoes.filter((t) => isInRange(t.data)), [transacoes, isInRange]);

  const receitas = periodTx.filter((t) => t.kind === "receita").reduce((s, t) => s + t.valor, 0);
  const despesas = periodTx.filter((t) => t.kind === "despesa").reduce((s, t) => s + t.valor, 0);
  const lucratividade = receitas > 0 ? Math.round(((receitas - despesas) / receitas) * 100) : 0;

  // ===== Contas a pagar / receber pendentes no período =====
  const aPagarTotal = periodTx
    .filter((t) => t.kind === "despesa" && t.status !== "pago")
    .reduce((s, t) => s + t.valor, 0);
  const aReceberTotal = periodTx
    .filter((t) => t.kind === "receita" && t.status !== "pago")
    .reduce((s, t) => s + t.valor, 0);

  const todayIso = new Date().toISOString().slice(0, 10);
  const aPagarHoje = transacoes.filter(
    (t) => t.kind === "despesa" && t.status !== "pago" && t.dueDate === todayIso,
  ).length;
  const aReceberHoje = transacoes.filter(
    (t) => t.kind === "receita" && t.status !== "pago" && t.dueDate === todayIso,
  ).length;

  // ===== Próxima entrada =====
  const next = useMemo(
    () => projectUntilNextIncome(saldoReal, fontesRenda, transacoes, dividas),
    [saldoReal, fontesRenda, transacoes, dividas],
  );

  // ===== Patrimônio =====
  const totalInvestido = investimentos.reduce((s, i) => s + i.valor, 0);
  const aporteSugerido =
    investimentos.reduce((s, i) => s + i.aporteSugerido, 0) ||
    Math.max(0, Math.round((receitas - despesas) * 0.2));

  // ===== Terceiros pendentes =====
  const terceirosPendentes = terceiros.filter((t) => t.status !== "pago");
  const terceirosTotal = terceirosPendentes.reduce((s, t) => s + t.amount, 0);

  // ===== Análise estratégica (ignora dívidas congeladas) =====
  const dividasAtivas = dividas.filter((d) => d.category !== "congelada");
  const totalParcelasMes = dividasAtivas.reduce((s, d) => s + d.valorParcela, 0);
  const comprometimentoPct =
    rendaMensal > 0 ? Math.round((totalParcelasMes / rendaMensal) * 100) : 0;
  const tone =
    comprometimentoPct >= 50 ? "destructive" : comprometimentoPct >= 30 ? "warning" : "primary";
  const projection = buildProjection(rendaMensal, gastosEssenciais, dividasAtivas, 12);
  const respiro = projection.slice(1).find((m) => m.ended.length > 0);
  const respiroDelta = respiro ? respiro.ended.reduce((s, d) => s + d.valorParcela, 0) : 0;

  return (
    <AppShell
      title={greetingName ? `Olá, ${greetingName}` : "Olá"}
      subtitle={`Visão ${range.kind === "mensal" ? "do mês" : range.kind === "semanal" ? "da semana" : range.kind === "anual" ? "do ano" : "do período"}`}
    >
      {isLoading && (
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-3xl bg-secondary" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-secondary" />
            ))}
          </div>
          <div className="h-40 animate-pulse rounded-3xl bg-secondary" />
        </div>
      )}
      {!isLoading && (
        <>
      {/* ============= LIVRE PARA GASTAR HOJE ============= */}
      <section
        className={`overflow-hidden rounded-3xl p-5 shadow-card ${
          livreParaGastar < 0
            ? "bg-destructive text-destructive-foreground"
            : "bg-gradient-primary text-primary-foreground shadow-glow"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-85">
            Livre para gastar hoje
          </p>
          <Wallet className="h-5 w-5 opacity-85" />
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums">{formatBRL(livreParaGastar)}</p>
        <p className="mt-2 text-[11px] opacity-85">
          Saldo <strong>{formatBRL(saldoReal)}</strong> − pendentes do mês{" "}
          <strong>{formatBRL(pendentesMesTotal)}</strong> − caixinhas{" "}
          <strong>{formatBRL(caixinhasTotal)}</strong> − envelopes{" "}
          <strong>{formatBRL(envelopesCommitted)}</strong>
        </p>
        <p className="mt-1 text-[11px] font-semibold opacity-90">
          Comprometido em envelopes: {formatBRL(envelopesCommitted)}
        </p>
        {livreParaGastar < 0 && (
          <p className="mt-2 rounded-xl bg-black/25 px-2.5 py-1.5 text-[11px] font-semibold">
            ⚠️ Você está comprometido além do saldo. Reveja pendências ou caixinhas.
          </p>
        )}
      </section>

      {/* ============= 1. PRIORIDADE MÁXIMA ============= */}
      <section className="mt-4 grid grid-cols-2 gap-3">
        <KpiCard
          icon={<ArrowUpRight className="h-4 w-4" />}
          label="Receitas"

          value={formatBRL(receitas)}
          tone="primary"
        />
        <KpiCard
          icon={<ArrowDownRight className="h-4 w-4" />}
          label="Despesas"
          value={formatBRL(despesas)}
          tone="destructive"
        />
        <KpiCard
          icon={<Wallet className="h-4 w-4" />}
          label="Saldo real"
          value={formatBRL(saldoReal)}
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
          total={aPagarTotal}
          dueToday={aPagarHoje}
          tone="destructive"
          to="/transacoes"
        />
        <BillBlock
          title="Contas a receber"
          total={aReceberTotal}
          dueToday={aReceberHoje}
          tone="primary"
          to="/transacoes"
        />
        {terceirosPendentes.length > 0 && (
          <Link
            to="/terceiros"
            className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
                <Users className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Terceiros</p>
                <p className="text-base font-bold tabular-nums text-warning">
                  {formatBRL(terceirosTotal)}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-warning/15 px-2 py-1 text-[10px] font-semibold text-warning">
              {terceirosPendentes.length} pend.
            </span>
          </Link>
        )}
      </section>

      {/* ============= RESUMO DO MÊS + GASTOS POR CATEGORIA ============= */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Gastos por categoria</h2>
          </div>
          <Link to="/compromissos-do-mes" className="text-[11px] font-semibold text-primary hover:underline">
            Ver compromissos →
          </Link>
        </div>
        {(() => {
          const byCat = new Map<string, number>();
          for (const t of periodTx) {
            if (t.kind !== "despesa") continue;
            byCat.set(t.categoria, (byCat.get(t.categoria) ?? 0) + t.valor);
          }
          const catData = Array.from(byCat.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
          if (catData.length === 0) {
            return (
              <div className="rounded-2xl border border-dashed border-border p-5 text-center">
                <p className="text-sm text-muted-foreground">Nenhuma despesa no período.</p>
              </div>
            );
          }
          const maxVal = Math.max(...catData.map((d) => d.value));
          const totalDespesas = catData.reduce((s, d) => s + d.value, 0);
          const pieColors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444"];
          return (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-shrink-0">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={catData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {catData.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        color: "var(--foreground)",
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [formatBRL(v), "Gasto"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-[11px] text-muted-foreground">
                  Total: <strong className="text-foreground">{formatBRL(totalDespesas)}</strong>
                </p>
              </div>
              <div className="flex-1 space-y-2.5">
                {catData.map((d, i) => {
                  const pct = maxVal > 0 ? Math.round((d.value / maxVal) * 100) : 0;
                  const sharePct = totalDespesas > 0 ? Math.round((d.value / totalDespesas) * 100) : 0;
                  return (
                    <div key={d.name} className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ background: pieColors[i % pieColors.length] }}
                      />
                      <span className="w-20 shrink-0 truncate text-xs text-muted-foreground">{d.name}</span>
                      <div className="relative h-5 flex-1 overflow-hidden rounded-lg bg-secondary">
                        <div
                          className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500"
                          style={{ width: `${pct}%`, background: pieColors[i % pieColors.length] }}
                        />
                      </div>
                      <span className="w-16 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
                        {sharePct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ============= PROJEÇÃO ATÉ A PRÓXIMA ENTRADA ============= */}
      {next.nextIncome && next.nextDate && (
        <section className="mt-5 rounded-3xl border border-primary/20 bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Até a próxima entrada</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Próxima:{" "}
            <strong className="text-foreground">{next.nextIncome.name}</strong> em{" "}
            <strong className="text-foreground">
              {next.nextDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
            </strong>{" "}
            ({formatBRL(next.nextIncome.amount)})
          </p>
          <div className="mt-3 space-y-2 text-xs">
            <Row label="Saldo hoje" value={formatBRL(saldoReal)} tone="text-foreground" />
            <Row label="Contas fixas + dívidas até lá" value={`− ${formatBRL(next.totalDue)}`} tone="text-destructive" />
            <div className="my-2 h-px bg-border" />
            <Row
              label="Sobra prevista"
              value={formatBRL(next.balanceAfter)}
              tone={next.balanceAfter >= 0 ? "text-primary font-bold" : "text-destructive font-bold"}
            />
          </div>
          {next.balanceAfter < 0 && (
            <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-2.5">
              <p className="text-[11px] text-destructive">
                ⚠️ Faltam <strong>{formatBRL(Math.abs(next.balanceAfter))}</strong> para cobrir o
                que vence antes do próximo recebimento.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ============= 2. VISÃO DE RIQUEZA ============= */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <PiggyBank className="h-4 w-4 text-accent" />
          <h2 className="text-base font-semibold text-foreground">Patrimônio</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-elevated p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total investido
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
              {formatBRL(totalInvestido)}
            </p>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-3">
            <p className="text-[10px] uppercase tracking-wider text-accent">Aporte sugerido</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-accent">
              {formatBRL(aporteSugerido)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">20% do seu balanço</p>
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

      {/* ============= 3. HORIZONTE ============= */}
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-1 flex items-center gap-2">
          <Activity className="h-4 w-4 text-warning" />
          <h2 className="text-base font-semibold text-foreground">
            Termômetro de comprometimento
          </h2>
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

        {respiro && (
          <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-3">
            <div className="mb-1 flex items-center gap-2 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Mês de respiro
              </span>
            </div>
            <p className="text-xs text-foreground">
              Em <strong className="text-primary">{respiro.mes}</strong> você libera{" "}
              <strong className="text-primary">+ {formatBRL(respiroDelta)}/mês</strong>.
            </p>
          </div>
        )}
      </section>
        </>
      )}
    </AppShell>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${tone}`}>{value}</span>
    </div>
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
    tone === "primary"
      ? "text-primary"
      : tone === "destructive"
        ? "text-destructive"
        : "text-accent";
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
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneBg}`}>
          {icon}
        </span>
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
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneBg} ${toneText}`}
        >
          {tone === "destructive" ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <Calendar className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className={`text-base font-bold tabular-nums ${toneText}`}>{formatBRL(total)}</p>
        </div>
      </div>
      {dueToday > 0 && (
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${toneBg} ${toneText}`}
        >
          {dueToday} {dueToday === 1 ? "item" : "itens"} hoje
        </span>
      )}
    </Link>
  );
}
