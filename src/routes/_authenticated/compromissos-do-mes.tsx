import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Users,
  Landmark,
  TrendingDown,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PayCheckbox } from "@/components/PayCheckbox";
import { formatBRLFull, useFinance } from "@/lib/finance-store";
import { useMonthNavigator } from "@/lib/period-filter";

export const Route = createFileRoute("/_authenticated/compromissos-do-mes")({
  head: () => ({
    meta: [
      { title: "Compromissos do Mês" },
      { name: "description", content: "Extrato consolidado de compromissos do mês." },
    ],
  }),
  component: CompromissosDoMes,
});

// ──────────────────────────────────────────────
// Tipos internos
// ──────────────────────────────────────────────
type OrigemTipo = "cartao" | "terceiro" | "emprestimo" | "financiamento" | "parcelamento";

interface ItemCompromisso {
  id: string;
  descricao: string;
  valor: number;
  pago: boolean;
  dueDate: string | null;
  parcela?: string;
  pessoa?: string;
  transactionId: string; // Adicionado para a RPC
}

interface GrupoOrigem {
  key: string;
  tipo: OrigemTipo;
  titulo: string;
  subtitulo?: string;
  total: number;
  totalPago: number;
  itens: ItemCompromisso[];
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = iso.length <= 10 ? new Date(iso + "T00:00:00") : new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function originIcon(tipo: OrigemTipo) {
  switch (tipo) {
    case "cartao":        return <CreditCard className="h-4 w-4" />;
    case "terceiro":      return <Users className="h-4 w-4" />;
    case "emprestimo":    return <Landmark className="h-4 w-4" />;
    case "financiamento": return <Landmark className="h-4 w-4" />;
    case "parcelamento":  return <TrendingDown className="h-4 w-4" />;
  }
}

function originColor(tipo: OrigemTipo) {
  switch (tipo) {
    case "cartao":        return "bg-violet-500/15 text-violet-400";
    case "terceiro":      return "bg-amber-500/15 text-amber-400";
    case "emprestimo":    return "bg-blue-500/15 text-blue-400";
    case "financiamento": return "bg-cyan-500/15 text-cyan-400";
    case "parcelamento":  return "bg-rose-500/15 text-rose-400";
  }
}

function originBorder(tipo: OrigemTipo) {
  switch (tipo) {
    case "cartao":        return "border-violet-500/30";
    case "terceiro":      return "border-amber-500/30";
    case "emprestimo":    return "border-blue-500/30";
    case "financiamento": return "border-cyan-500/30";
    case "parcelamento":  return "border-rose-500/30";
  }
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
function CompromissosDoMes() {
  const finance = useFinance();
  const { transacoes, dividas, faturas, cartoes, pessoas } = finance;
  const { label, goToNextMonth, goToPreviousMonth, canGoNext, currentReferenceMonth } =
    useMonthNavigator();

  const year  = currentReferenceMonth.getFullYear();
  const month = currentReferenceMonth.getMonth(); // 0-indexed

  function inMonth(iso: string | null) {
    if (!iso) return false;
    const d = iso.length <= 10 ? new Date(iso + "T00:00:00") : new Date(iso);
    return d.getFullYear() === year && d.getMonth() === month;
  }

  // Mapas auxiliares
  const pessoaMap  = useMemo(() => new Map(pessoas.map((p) => [p.id, p.name])),  [pessoas]);
  const cartaoMap  = useMemo(() => new Map(cartoes.map((c) => [c.id, c.name])),  [cartoes]);

  // Mapa: purchase_group_id → tipo da dívida (emprestimo | financiamento)
  const debtTypeByGroup = useMemo(() => {
    const m = new Map<string, "emprestimo" | "financiamento">();
    for (const d of dividas) {
      if (d.commitmentGroupId && (d.tipo === "emprestimo" || d.tipo === "financiamento")) {
        m.set(d.commitmentGroupId, d.tipo);
      }
    }
    return m;
  }, [dividas]);

  // ── 1. Faturas de cartão ──
  const gruposCartao = useMemo<GrupoOrigem[]>(() => {
    const grupos: GrupoOrigem[] = [];
    for (const fatura of faturas) {
      if (!inMonth(fatura.dueDate)) continue;
      const nomeCartao = cartaoMap.get(fatura.creditCardId) ?? "Cartão";
          const txsFatura = transacoes.filter(
            (t) => t.invoiceId === fatura.id && t.kind === "despesa",
          );
          if (txsFatura.length === 0 && fatura.total === 0) continue;
          const pago = fatura.status === "paga";
          const itens: ItemCompromisso[] = txsFatura.map((t) => ({
            id: t.id,
            transactionId: t.id,
        descricao: t.descricao,
        valor: t.valor,
        pago,
        dueDate: fatura.dueDate,
        parcela:
          t.installmentNumber && t.installmentTotal
            ? `${t.installmentNumber}/${t.installmentTotal}`
            : undefined,
      }));
      grupos.push({
        key: `cartao-${fatura.id}`,
        tipo: "cartao",
        titulo: nomeCartao,
        subtitulo: `Fatura vence ${fmtDate(fatura.dueDate)}`,
        total: fatura.total,
        totalPago: pago ? fatura.total : 0,
        itens,
      });
    }
    return grupos;
  }, [faturas, transacoes, cartaoMap, year, month]);

  // ── 2-4. Transações parceladas (terceiros, empréstimos, parcelamentos) ──
  // Fonte única: transactions com purchase_group_id no mês.
  // Classificação:
  //   - personId → terceiro (agrupado por personId, não por purchaseGroupId)
  //   - purchase_group_id em debtTypeByGroup → emprestimo | financiamento (por purchaseGroupId)
  //   - demais → parcelamento (por purchaseGroupId)
  // Faturas de cartão já foram tratadas acima (invoiceId != null), excluir aqui.
  const gruposParcelados = useMemo<GrupoOrigem[]>(() => {
    // Dois mapas: um para terceiros (por personId), outro para demais (por purchaseGroupId)
    const byPessoa = new Map<
      string,
      { titulo: string; itens: ItemCompromisso[]; total: number; totalPago: number }
    >();
    const byGroup = new Map<
      string,
      {
        tipo: "emprestimo" | "financiamento" | "parcelamento";
        titulo: string;
        itens: ItemCompromisso[];
        total: number;
        totalPago: number;
      }
    >();

    for (const t of transacoes) {
      if (!t.purchaseGroupId) continue;
      if (t.invoiceId) continue; // cartão já tratado
      if (t.kind !== "despesa") continue;
      if (!inMonth(t.dueDate ?? t.data)) continue;

      const pago = !!t.paidAt;
      const item: ItemCompromisso = {
        id: t.id,
        transactionId: t.id,
        descricao: t.descricao,
        valor: t.valor,
        pago,
        dueDate: t.dueDate,
        parcela:
          t.installmentNumber && t.installmentTotal
            ? `${t.installmentNumber}/${t.installmentTotal}`
            : undefined,
        pessoa: t.personId ? pessoaMap.get(t.personId) : undefined,
      };

      if (t.personId) {
        // Agrupar por pessoa
        const pid = t.personId;
        if (!byPessoa.has(pid)) {
          byPessoa.set(pid, {
            titulo: pessoaMap.get(pid) ?? "Terceiro",
            itens: [],
            total: 0,
            totalPago: 0,
          });
        }
        const g = byPessoa.get(pid)!;
        g.itens.push(item);
        g.total += t.valor;
        if (pago) g.totalPago += t.valor;
      } else {
        // Agrupar por purchaseGroupId
        const gid = t.purchaseGroupId;
        if (!byGroup.has(gid)) {
          const tipo: "emprestimo" | "financiamento" | "parcelamento" =
            debtTypeByGroup.get(gid) ?? "parcelamento";
          const baseDesc = t.descricao
            .replace(/\s*\(\d+\/\d+\)$/, "")
            .trim();
          byGroup.set(gid, { tipo, titulo: baseDesc, itens: [], total: 0, totalPago: 0 });
        }
        const g = byGroup.get(gid)!;
        g.itens.push(item);
        g.total += t.valor;
        if (pago) g.totalPago += t.valor;
      }
    }

    const result: GrupoOrigem[] = [];

    // Terceiros
    for (const [pid, g] of byPessoa.entries()) {
      result.push({
        key: `terceiro-${pid}`,
        tipo: "terceiro",
        titulo: g.titulo,
        subtitulo: `${g.itens.length} lançamento${g.itens.length !== 1 ? "s" : ""}`,
        total: g.total,
        totalPago: g.totalPago,
        itens: g.itens,
      });
    }

    // Empréstimos, financiamentos, parcelamentos
    for (const [gid, g] of byGroup.entries()) {
      result.push({
        key: `group-${gid}`,
        tipo: g.tipo,
        titulo: g.titulo,
        subtitulo: `${g.itens.length} parcela${g.itens.length !== 1 ? "s" : ""} no mês`,
        total: g.total,
        totalPago: g.totalPago,
        itens: g.itens,
      });
    }

    return result;
  }, [transacoes, debtTypeByGroup, pessoaMap, year, month]);

  // ── Consolidado final ──
  const todosGrupos = useMemo(
    () => [...gruposCartao, ...gruposParcelados],
    [gruposCartao, gruposParcelados],
  );

  const totalMes     = useMemo(() => todosGrupos.reduce((s, g) => s + g.total, 0), [todosGrupos]);
  const totalPagoMes = useMemo(() => todosGrupos.reduce((s, g) => s + g.totalPago, 0), [todosGrupos]);
  const totalPendente = totalMes - totalPagoMes;
  const pctPago = totalMes > 0 ? Math.round((totalPagoMes / totalMes) * 100) : 0;

  // Ordenação: terceiros primeiro, depois por tipo, depois por total desc
  const gruposOrdenados = useMemo(() => {
    const order: Record<OrigemTipo, number> = {
      cartao: 0,
      terceiro: 1,
      emprestimo: 2,
      financiamento: 3,
      parcelamento: 4,
    };
    return [...todosGrupos].sort((a, b) => {
      const diff = order[a.tipo] - order[b.tipo];
      if (diff !== 0) return diff;
      return b.total - a.total;
    });
  }, [todosGrupos]);

  return (
    <AppShell title="Compromissos do Mês" subtitle="Extrato consolidado" hidePeriodFilter>
      {/* Navegação de mês */}
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-card">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold capitalize text-foreground">{label}</span>
        <button
          type="button"
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Card total do mês — destaque estilo fatura */}
      <div className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-card ring-1 ring-primary/20">
        <div className="px-5 pt-5 pb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Total do mês
          </p>
          <p className="text-4xl font-extrabold tracking-tight text-foreground">
            {formatBRLFull(totalMes)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {formatBRLFull(totalPagoMes)} pago
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Clock className="h-4 w-4" />
              {formatBRLFull(totalPendente)} pendente
            </span>
          </div>
        </div>
        {/* Barra de progresso */}
        <div className="h-1.5 w-full bg-primary/10">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${pctPago}%` }}
          />
        </div>
        <div className="px-5 py-2">
          <p className="text-[11px] text-muted-foreground">{pctPago}% quitado</p>
        </div>
      </div>

      {/* Grupos por origem */}
      {gruposOrdenados.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-card py-16 text-center shadow-card">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">
            Nenhum compromisso neste mês
          </p>
          <p className="text-xs text-muted-foreground/60">
            Parcelamentos, empréstimos, financiamentos e terceiros aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {gruposOrdenados.map((grupo) => (
            <GrupoCard key={grupo.key} grupo={grupo} />
          ))}
        </div>
      )}

      <div className="h-6" />
    </AppShell>
  );
}

// ──────────────────────────────────────────────
// Card de grupo de origem
// ──────────────────────────────────────────────
function GrupoCard({ grupo }: { grupo: GrupoOrigem }) {
  const pct = grupo.total > 0 ? Math.round((grupo.totalPago / grupo.total) * 100) : 0;
  const pendente = grupo.total - grupo.totalPago;

  return (
    <div
      className={`overflow-hidden rounded-3xl bg-card shadow-card ring-1 ${originBorder(grupo.tipo)}`}
    >
      {/* Cabeçalho do grupo */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${originColor(grupo.tipo)}`}
        >
          {originIcon(grupo.tipo)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{grupo.titulo}</p>
          {grupo.subtitulo && (
            <p className="text-[11px] text-muted-foreground">{grupo.subtitulo}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">{formatBRLFull(grupo.total)}</p>
          {pendente > 0 ? (
            <p className="text-[11px] text-amber-400">{formatBRLFull(pendente)} pendente</p>
          ) : grupo.total > 0 ? (
            <p className="text-[11px] text-emerald-400">Quitado</p>
          ) : null}
        </div>
      </div>

      {/* Barra de progresso do grupo */}
      {grupo.total > 0 && (
        <div className="h-0.5 w-full bg-border/50">
          <div
            className="h-full bg-emerald-500/70 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Lista de itens */}
      {grupo.itens.length > 0 && (
        <div className="divide-y divide-border/30">
          {grupo.itens.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
              <span
                className={`shrink-0 ${item.pago ? "text-emerald-400" : "text-muted-foreground/40"}`}
              >
                <PayCheckbox
                  paid={item.pago}
                  onToggle={async () => {
                    await finance.alternarStatusTransacao(item.transactionId, item.pago ? "pendente" : "pago");
                  }}
                  size="sm"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-xs font-medium ${
                    item.pago ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {item.descricao}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                  {item.parcela && <span>Parcela {item.parcela}</span>}
                  {item.dueDate && <span>Venc {fmtDate(item.dueDate)}</span>}
                  {item.pessoa && <span>· {item.pessoa}</span>}
                </div>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold ${
                  item.pago ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {formatBRLFull(item.valor)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
