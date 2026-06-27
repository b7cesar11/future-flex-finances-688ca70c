import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  cor: string;
  emoji: string;
}

export type TxKind = "despesa" | "receita";

export interface Category {
  id: string;
  nome: string;
  emoji: string;
  cor: string;
}

export interface Transaction {
  id: string;
  kind: TxKind;
  descricao: string;
  valor: number;
  data: string;
  categoriaId: string;
  contaId: string;
}

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

export interface SavingsGoal {
  id: string;
  nome: string;
  emoji: string;
  cor: string;
  valorAtual: number;
  valorTotal: number;
  dataAlvo: string | null;
}

export interface Investment {
  id: string;
  nome: string;
  tipo: string;
  valor: number;
  aporteSugerido: number;
}

interface FinanceState {
  rendaMensal: number;
  gastosEssenciais: number;
  dividas: Debt[];
  contas: Account[];
  categorias: Category[];
  transacoes: Transaction[];
  metas: SavingsGoal[];
  investimentos: Investment[];
  isLoading: boolean;
  addDebt: (debt: Omit<Debt, "id" | "parcelasTotais"> & { parcelasTotais?: number }) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, "id">) => Promise<void>;
}

const FinanceContext = createContext<FinanceState | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  const profileQ = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("monthly_income, essential_expenses")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const accountsQ = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const debtsQ = useQuery({
    queryKey: ["debts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const transactionsQ = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const addDebtM = useMutation({
    mutationFn: async (d: Omit<Debt, "id" | "parcelasTotais"> & { parcelasTotais?: number }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Não autenticado");
      const total = d.parcelasTotais ?? d.parcelasRestantes;
      const { error } = await supabase.from("debts").insert({
        user_id: user.user.id,
        name: d.nome,
        type: d.tipo,
        monthly_installment: d.valorParcela,
        remaining_installments: d.parcelasRestantes,
        total_installments: total,
        total_amount: d.valorParcela * total,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["debts"] }),
  });

  const addTxM = useMutation({
    mutationFn: async (t: Omit<Transaction, "id">) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Não autenticado");
      const { error } = await supabase.from("transactions").insert({
        user_id: user.user.id,
        account_id: t.contaId || null,
        amount: t.valor,
        type: t.kind,
        category: t.categoriaId,
        description: t.descricao,
        date: t.data,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const value = useMemo<FinanceState>(() => {
    const dividas: Debt[] = (debtsQ.data ?? []).map((r: any) => ({
      id: r.id,
      nome: r.name,
      valorParcela: Number(r.monthly_installment),
      parcelasRestantes: r.remaining_installments,
      parcelasTotais: r.total_installments,
      tipo: r.type as DebtType,
    }));
    const contas: Account[] = (accountsQ.data ?? []).map((r: any) => ({
      id: r.id,
      nome: r.name,
      tipo: r.type as AccountType,
      saldo: Number(r.balance),
      cor: r.color,
      emoji: r.emoji,
    }));
    const transacoes: Transaction[] = (transactionsQ.data ?? []).map((r: any) => ({
      id: r.id,
      kind: r.type as TxKind,
      descricao: r.description,
      valor: Number(r.amount),
      data: r.date,
      categoriaId: r.category,
      contaId: r.account_id ?? "",
    }));
    return {
      rendaMensal: Number(profileQ.data?.monthly_income ?? 0),
      gastosEssenciais: Number(profileQ.data?.essential_expenses ?? 0),
      dividas,
      contas,
      categorias: initialCategorias,
      transacoes,
      isLoading:
        profileQ.isLoading || accountsQ.isLoading || debtsQ.isLoading || transactionsQ.isLoading,
      addDebt: async (d) => {
        await addDebtM.mutateAsync(d);
      },
      addTransaction: async (t) => {
        await addTxM.mutateAsync(t);
      },
    };
  }, [profileQ.data, accountsQ.data, debtsQ.data, transactionsQ.data, profileQ.isLoading, accountsQ.isLoading, debtsQ.isLoading, transactionsQ.isLoading, addDebtM, addTxM]);

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
