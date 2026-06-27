import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type DebtType = "Cartão de Crédito" | "Empréstimo" | "Financiamento";

export interface Debt {
  id: string;
  nome: string;
  valorParcela: number;
  parcelasRestantes: number;
  parcelasTotais: number;
  tipo: DebtType;
}

export type AccountType = "Conta Corrente" | "Poupança" | "Dinheiro" | "Cartão de Crédito";

export interface Account {
  id: string;
  nome: string;
  tipo: AccountType;
  saldo: number;
  cor: string; // tailwind bg class for icon chip
  emoji: string;
}

export type TxKind = "despesa" | "receita";

export interface Category {
  id: string;
  nome: string;
  emoji: string;
  cor: string; // hex for chart
}

export interface Transaction {
  id: string;
  kind: TxKind;
  descricao: string;
  valor: number;
  data: string; // ISO yyyy-mm-dd
  categoriaId: string;
  contaId: string;
}

interface FinanceState {
  rendaMensal: number;
  gastosEssenciais: number;
  dividas: Debt[];
  contas: Account[];
  categorias: Category[];
  transacoes: Transaction[];
  addDebt: (debt: Omit<Debt, "id" | "parcelasTotais"> & { parcelasTotais?: number }) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
}

const FinanceContext = createContext<FinanceState | null>(null);

const initialDebts: Debt[] = [
  { id: "1", nome: "Financiamento do Carro", valorParcela: 980, parcelasRestantes: 4, parcelasTotais: 48, tipo: "Financiamento" },
  { id: "2", nome: "Fatura Nubank", valorParcela: 450, parcelasRestantes: 2, parcelasTotais: 6, tipo: "Cartão de Crédito" },
  { id: "3", nome: "Empréstimo Pessoal", valorParcela: 320, parcelasRestantes: 9, parcelasTotais: 24, tipo: "Empréstimo" },
  { id: "4", nome: "iPhone Parcelado", valorParcela: 280, parcelasRestantes: 7, parcelasTotais: 12, tipo: "Cartão de Crédito" },
];

const initialContas: Account[] = [
  { id: "c1", nome: "Nubank", tipo: "Conta Corrente", saldo: 3420.55, cor: "bg-violet-500/20 text-violet-300", emoji: "🟣" },
  { id: "c2", nome: "Itaú", tipo: "Conta Corrente", saldo: 1280.0, cor: "bg-orange-500/20 text-orange-300", emoji: "🟠" },
  { id: "c3", nome: "Poupança CEF", tipo: "Poupança", saldo: 8750.0, cor: "bg-sky-500/20 text-sky-300", emoji: "🔵" },
  { id: "c4", nome: "Dinheiro", tipo: "Dinheiro", saldo: 210.0, cor: "bg-emerald-500/20 text-emerald-300", emoji: "💵" },
];

export const initialCategorias: Category[] = [
  { id: "moradia", nome: "Moradia", emoji: "🏠", cor: "#60a5fa" },
  { id: "mercado", nome: "Mercado", emoji: "🛒", cor: "#34d399" },
  { id: "alimentacao", nome: "Alimentação", emoji: "🍔", cor: "#fbbf24" },
  { id: "transporte", nome: "Transporte", emoji: "🚗", cor: "#f472b6" },
  { id: "lazer", nome: "Lazer", emoji: "🎮", cor: "#a78bfa" },
  { id: "saude", nome: "Saúde", emoji: "💊", cor: "#f87171" },
  { id: "salario", nome: "Salário", emoji: "💼", cor: "#22d3ee" },
  { id: "outros", nome: "Outros", emoji: "✨", cor: "#94a3b8" },
];

function isoDay(year: number, month: number, day: number) {
  const d = new Date(year, month, day);
  return d.toISOString().slice(0, 10);
}

function buildMockTransactions(): Transaction[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const mk = (
    day: number,
    kind: TxKind,
    descricao: string,
    valor: number,
    categoriaId: string,
    contaId: string,
  ): Transaction => ({
    id: `${day}-${descricao}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    descricao,
    valor,
    data: isoDay(y, m, day),
    categoriaId,
    contaId,
  });
  return [
    mk(1, "receita", "Salário Empresa X", 5000, "salario", "c1"),
    mk(2, "despesa", "Aluguel", 1500, "moradia", "c1"),
    mk(3, "despesa", "Supermercado Extra", 480, "mercado", "c1"),
    mk(5, "despesa", "iFood — Almoço", 38.9, "alimentacao", "c2"),
    mk(7, "despesa", "Uber", 22.5, "transporte", "c2"),
    mk(10, "despesa", "Netflix", 55.9, "lazer", "c1"),
    mk(12, "despesa", "Farmácia", 87.3, "saude", "c4"),
    mk(14, "despesa", "Padaria", 18.4, "alimentacao", "c4"),
    mk(15, "receita", "Freela design", 800, "salario", "c1"),
    mk(17, "despesa", "Posto Shell", 220, "transporte", "c2"),
    mk(20, "despesa", "Cinema", 64, "lazer", "c1"),
    mk(22, "despesa", "Hortifruti", 110.2, "mercado", "c4"),
    mk(24, "despesa", "Conta de luz", 180, "moradia", "c1"),
  ];
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [dividas, setDividas] = useState<Debt[]>(initialDebts);
  const [contas] = useState<Account[]>(initialContas);
  const [categorias] = useState<Category[]>(initialCategorias);
  const [transacoes, setTransacoes] = useState<Transaction[]>(() => buildMockTransactions());

  const value = useMemo<FinanceState>(
    () => ({
      rendaMensal: 5000,
      gastosEssenciais: 2000,
      dividas,
      contas,
      categorias,
      transacoes,
      addDebt: (d) =>
        setDividas((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            nome: d.nome,
            valorParcela: d.valorParcela,
            parcelasRestantes: d.parcelasRestantes,
            parcelasTotais: d.parcelasTotais ?? d.parcelasRestantes,
            tipo: d.tipo,
          },
        ]),
      addTransaction: (t) =>
        setTransacoes((prev) => [...prev, { ...t, id: crypto.randomUUID() }]),
    }),
    [dividas, contas, categorias, transacoes],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function formatBRLFull(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function buildProjection(
  rendaMensal: number,
  gastosEssenciais: number,
  dividas: Debt[],
  months = 12,
) {
  const now = new Date();
  const result: { mes: string; dividas: number; saldoLivre: number; ended: Debt[] }[] = [];
  for (let i = 0; i < months; i++) {
    const ended: Debt[] = [];
    const totalDividas = dividas.reduce((sum, d) => {
      const stillPaying = d.parcelasRestantes - i > 0;
      if (d.parcelasRestantes - i === 0) ended.push(d);
      return stillPaying ? sum + d.valorParcela : sum;
    }, 0);
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    result.push({
      mes: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      dividas: totalDividas,
      saldoLivre: Math.max(0, rendaMensal - gastosEssenciais - totalDividas),
      ended,
    });
  }
  return result;
}
