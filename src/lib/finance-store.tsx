import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DebtType = "Cartão de Crédito" | "Empréstimo" | "Financiamento";
export type DebtCategory = "parcelada" | "variavel" | "fixa" | "congelada";
export type PaymentStatus = "pago" | "pendente" | "atrasado";
export type ThirdPartyType = "emprestei_dinheiro" | "usou_meu_cartao" | "devo_a_terceiro";
export type IncomeStatus = "recebido" | "pendente";
export type AccountType = "Conta Corrente" | "Poupança" | "Dinheiro" | "Cartão de Crédito";
export type TxKind = "despesa" | "receita";

export interface Debt {
  id: string;
  nome: string;
  valorParcela: number;
  parcelasRestantes: number;
  parcelasTotais: number;
  tipo: DebtType;
  category: DebtCategory;
  dueDay: number | null;
  isVariable: boolean;
  statusThisMonth: PaymentStatus;
}

export interface Account {
  id: string;
  nome: string;
  tipo: AccountType;
  saldoInicial: number;
  saldo: number; // dynamic
  cor: string;
  emoji: string;
}

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
  dueDate: string | null;
  status: PaymentStatus;
  isFixed: boolean;
  categoriaId: string;
  contaId: string;
}

export interface SavingsGoal {
  id: string;
  nome: string;
  emoji: string;
  cor: string;
  valorAtual: number;
  valorTotal: number;
  aporteMensal: number;
  dataAlvo: string | null;
}


export interface Investment {
  id: string;
  nome: string;
  tipo: string;
  valor: number;
  aporteSugerido: number;
}

export interface ThirdParty {
  id: string;
  personName: string;
  type: ThirdPartyType;
  amount: number;
  dueDate: string | null;
  isInstallment: boolean;
  installmentsLeft: number;
  status: PaymentStatus;
  notes: string | null;
}

export interface IncomeSource {
  id: string;
  name: string;
  expectedDay: number;
  amount: number;
  status: IncomeStatus;
  accountId: string | null;
  lastReceivedMonth: string | null;
}

export const initialCategorias: Category[] = [
  { id: "moradia", nome: "Moradia", emoji: "🏠", cor: "#60a5fa" },
  { id: "mercado", nome: "Mercado", emoji: "🛒", cor: "#34d399" },
  { id: "alimentacao", nome: "Alimentação", emoji: "🍔", cor: "#fbbf24" },
  { id: "transporte", nome: "Transporte", emoji: "🚗", cor: "#f472b6" },
  { id: "lazer", nome: "Lazer", emoji: "🎮", cor: "#a78bfa" },
  { id: "saude", nome: "Saúde", emoji: "💊", cor: "#f87171" },
  { id: "salario", nome: "Salário", emoji: "💼", cor: "#22d3ee" },
  { id: "contas", nome: "Contas fixas", emoji: "⚡", cor: "#facc15" },
  { id: "outros", nome: "Outros", emoji: "✨", cor: "#94a3b8" },
];

interface FinanceState {
  rendaMensal: number;
  gastosEssenciais: number;
  dividas: Debt[];
  contas: Account[];
  categorias: Category[];
  transacoes: Transaction[];
  metas: SavingsGoal[];
  investimentos: Investment[];
  terceiros: ThirdParty[];
  fontesRenda: IncomeSource[];
  saldoReal: number; // global wallet
  caixinhasTotal: number; // soma dos current_amount das metas
  pendentesMesTotal: number; // despesas pendentes com dueDate no mês atual
  livreParaGastar: number; // saldoReal - pendentesMesTotal - caixinhasTotal
  isLoading: boolean;

  // mutations
  addDebt: (debt: {
    nome: string;
    valorParcela: number;
    parcelasRestantes: number;
    tipo: DebtType;
    category?: DebtCategory;
    dueDay?: number | null;
    isVariable?: boolean;
  }) => Promise<void>;
  updateDebtInstallment: (id: string, valorParcela: number) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  payDebtInstallment: (id: string) => Promise<void>;
  payDebtWithAmount: (id: string, amount: number, accountId?: string | null) => Promise<void>;
  revertDebtPayment: (id: string) => Promise<void>;
  addTransaction: (tx: {
    kind: TxKind;
    descricao: string;
    valor: number;
    data: string;
    dueDate?: string | null;
    status?: PaymentStatus;
    isFixed?: boolean;
    categoriaId: string;
    contaId: string;
  }) => Promise<void>;
  setTransactionStatus: (id: string, status: PaymentStatus) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addThirdParty: (tp: Omit<ThirdParty, "id">) => Promise<void>;
  setThirdPartyStatus: (id: string, status: PaymentStatus) => Promise<void>;
  updateThirdParty: (id: string, patch: Partial<ThirdParty>) => Promise<void>;
  deleteThirdParty: (id: string) => Promise<void>;
  addIncomeSource: (i: Omit<IncomeSource, "id" | "status" | "lastReceivedMonth"> & {
    status?: IncomeStatus;
  }) => Promise<void>;
  setIncomeStatus: (id: string, status: IncomeStatus) => Promise<void>;
  deleteIncomeSource: (id: string) => Promise<void>;
  addGoal: (g: {
    nome: string;
    emoji?: string;
    cor?: string;
    valorTotal: number;
    aporteMensal?: number;
    dataAlvo?: string | null;
  }) => Promise<void>;
  updateGoal: (id: string, patch: Partial<SavingsGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  contributeToGoal: (id: string, amount: number, accountId?: string | null) => Promise<void>;
  wipeAllData: () => Promise<void>;
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

  const goalsQ = useQuery({
    queryKey: ["savings_goals"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("savings_goals")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const investmentsQ = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("investments")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const thirdPartyQ = useQuery({
    queryKey: ["third_party_financials"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("third_party_financials")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const incomeQ = useQuery({
    queryKey: ["income_sources"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("income_sources")
        .select("*")
        .order("expected_day", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["transactions"] });
    qc.invalidateQueries({ queryKey: ["debts"] });
    qc.invalidateQueries({ queryKey: ["accounts"] });
    qc.invalidateQueries({ queryKey: ["third_party_financials"] });
    qc.invalidateQueries({ queryKey: ["income_sources"] });
  };

  const addDebtM = useMutation({
    mutationFn: async (d: {
      nome: string;
      valorParcela: number;
      parcelasRestantes: number;
      tipo: DebtType;
      category?: DebtCategory;
      dueDay?: number | null;
      isVariable?: boolean;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Não autenticado");
      const total = d.parcelasRestantes;
      const cat: DebtCategory = d.category ?? (d.isVariable ? "variavel" : "parcelada");
      const { error } = await supabase.from("debts").insert({
        user_id: user.user.id,
        name: d.nome,
        type: d.tipo,
        monthly_installment: d.valorParcela,
        remaining_installments: d.parcelasRestantes,
        total_installments: total,
        total_amount: d.valorParcela * total,
        due_day: d.dueDay ?? null,
        is_variable: cat === "variavel",
        category: cat,
        status_this_month: "pendente",
      } as any);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const updateDebtInstallmentM = useMutation({
    mutationFn: async ({ id, valorParcela }: { id: string; valorParcela: number }) => {
      const { error } = await supabase
        .from("debts")
        .update({ monthly_installment: valorParcela } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const deleteDebtM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("debts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const payDebtM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).rpc("pay_debt_installment", { _debt_id: id });
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const revertDebtM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).rpc("revert_debt_payment", { _debt_id: id });
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const payDebtWithAmountM = useMutation({
    mutationFn: async ({
      id,
      amount,
      accountId,
    }: {
      id: string;
      amount: number;
      accountId?: string | null;
    }) => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) throw new Error("Não autenticado");
      const { data: debtRow, error: dErr } = await supabase
        .from("debts")
        .select("name")
        .eq("id", id)
        .maybeSingle();
      if (dErr) throw dErr;
      const { error: rpcErr } = await (supabase as any).rpc("pay_debt_with_amount", {
        _debt_id: id,
        _amount: amount,
      });
      if (rpcErr) throw rpcErr;
      const today = new Date().toISOString().slice(0, 10);
      const { error: txErr } = await supabase.from("transactions").insert({
        user_id: userRes.user.id,
        account_id: accountId ?? null,
        amount,
        type: "despesa",
        category: "contas",
        description: `Pagamento — ${debtRow?.name ?? "dívida"}`,
        date: today,
        due_date: today,
        status: "pago",
        is_fixed: false,
      } as any);
      if (txErr) throw txErr;
    },
    onSuccess: invalidateAll,
  });

  const addTxM = useMutation({
    mutationFn: async (t: {
      kind: TxKind;
      descricao: string;
      valor: number;
      data: string;
      dueDate?: string | null;
      status?: PaymentStatus;
      isFixed?: boolean;
      categoriaId: string;
      contaId: string;
    }) => {
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
        due_date: t.dueDate ?? t.data,
        status: t.status ?? "pago",
        is_fixed: t.isFixed ?? false,
      } as any);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const setTxStatusM = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      const { error } = await supabase
        .from("transactions")
        .update({ status } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const deleteTxM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const addThirdPartyM = useMutation({
    mutationFn: async (t: Omit<ThirdParty, "id">) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Não autenticado");
      const { error } = await (supabase as any).from("third_party_financials").insert({
        user_id: user.user.id,
        person_name: t.personName,
        type: t.type,
        amount: t.amount,
        due_date: t.dueDate,
        is_installment: t.isInstallment,
        installments_left: t.installmentsLeft,
        status: t.status,
        notes: t.notes,
      });
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const setThirdPartyStatusM = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      const { error } = await (supabase as any)
        .from("third_party_financials")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const updateThirdPartyM = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<ThirdParty> }) => {
      const row: any = {};
      if (patch.amount !== undefined) row.amount = patch.amount;
      if (patch.dueDate !== undefined) row.due_date = patch.dueDate;
      if (patch.personName !== undefined) row.person_name = patch.personName;
      if (patch.notes !== undefined) row.notes = patch.notes;
      if (patch.installmentsLeft !== undefined) row.installments_left = patch.installmentsLeft;
      const { error } = await (supabase as any)
        .from("third_party_financials")
        .update(row)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const deleteThirdPartyM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("third_party_financials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const addIncomeM = useMutation({
    mutationFn: async (i: Omit<IncomeSource, "id" | "status" | "lastReceivedMonth"> & {
      status?: IncomeStatus;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Não autenticado");
      const { error } = await (supabase as any).from("income_sources").insert({
        user_id: user.user.id,
        name: i.name,
        expected_day: i.expectedDay,
        amount: i.amount,
        account_id: i.accountId,
        status: i.status ?? "pendente",
      });
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const setIncomeStatusM = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: IncomeStatus }) => {
      const { error } = await (supabase as any)
        .from("income_sources")
        .update({
          status,
          last_received_month:
            status === "recebido" ? new Date().toISOString().slice(0, 10) : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const deleteIncomeM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("income_sources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  // ============ Metas / Caixinhas ============
  const invalidateGoals = () => {
    qc.invalidateQueries({ queryKey: ["savings_goals"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    qc.invalidateQueries({ queryKey: ["accounts"] });
  };

  const addGoalM = useMutation({
    mutationFn: async (g: {
      nome: string;
      emoji?: string;
      cor?: string;
      valorTotal: number;
      aporteMensal?: number;
      dataAlvo?: string | null;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Não autenticado");
      const { error } = await (supabase as any).from("savings_goals").insert({
        user_id: user.user.id,
        name: g.nome,
        emoji: g.emoji ?? "🎯",
        color: g.cor ?? "bg-primary/20 text-primary",
        target_amount: g.valorTotal,
        current_amount: 0,
        monthly_contribution: g.aporteMensal ?? 0,
        target_date: g.dataAlvo ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidateGoals,
  });

  const updateGoalM = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<SavingsGoal> }) => {
      const row: any = {};
      if (patch.nome !== undefined) row.name = patch.nome;
      if (patch.emoji !== undefined) row.emoji = patch.emoji;
      if (patch.cor !== undefined) row.color = patch.cor;
      if (patch.valorTotal !== undefined) row.target_amount = patch.valorTotal;
      if (patch.valorAtual !== undefined) row.current_amount = patch.valorAtual;
      if (patch.aporteMensal !== undefined) row.monthly_contribution = patch.aporteMensal;
      if (patch.dataAlvo !== undefined) row.target_date = patch.dataAlvo;
      const { error } = await (supabase as any)
        .from("savings_goals")
        .update(row)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateGoals,
  });

  const deleteGoalM = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("savings_goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidateGoals,
  });

  const contributeGoalM = useMutation({
    mutationFn: async ({
      id,
      amount,
      accountId,
    }: {
      id: string;
      amount: number;
      accountId?: string | null;
    }) => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) throw new Error("Não autenticado");
      const { data: goal, error: gErr } = await (supabase as any)
        .from("savings_goals")
        .select("current_amount, name")
        .eq("id", id)
        .maybeSingle();
      if (gErr) throw gErr;
      const novo = Number(goal?.current_amount ?? 0) + amount;
      const { error: upErr } = await (supabase as any)
        .from("savings_goals")
        .update({ current_amount: novo })
        .eq("id", id);
      if (upErr) throw upErr;
      const today = new Date().toISOString().slice(0, 10);
      const { error: txErr } = await supabase.from("transactions").insert({
        user_id: userRes.user.id,
        account_id: accountId ?? null,
        amount,
        type: "despesa",
        category: "caixinha",
        description: `Caixinha — ${goal?.name ?? "meta"}`,
        date: today,
        due_date: today,
        status: "pago",
        is_fixed: false,
      } as any);
      if (txErr) throw txErr;
    },
    onSuccess: invalidateGoals,
  });

  const wipeM = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).rpc("wipe_user_data");
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });


  const value = useMemo<FinanceState>(() => {
    const dividas: Debt[] = (debtsQ.data ?? []).map((r: any) => ({
      id: r.id,
      nome: r.name,
      valorParcela: Number(r.monthly_installment),
      parcelasRestantes: r.remaining_installments,
      parcelasTotais: r.total_installments,
      tipo: r.type as DebtType,
      category: (r.category ?? (r.is_variable ? "variavel" : "parcelada")) as DebtCategory,
      dueDay: r.due_day ?? null,
      isVariable: r.is_variable ?? false,
      statusThisMonth: (r.status_this_month ?? "pendente") as PaymentStatus,
    }));
    const transacoes: Transaction[] = (transactionsQ.data ?? []).map((r: any) => ({
      id: r.id,
      kind: r.type as TxKind,
      descricao: r.description,
      valor: Number(r.amount),
      data: r.date,
      dueDate: r.due_date ?? null,
      status: (r.status ?? "pago") as PaymentStatus,
      isFixed: r.is_fixed ?? false,
      categoriaId: r.category,
      contaId: r.account_id ?? "",
    }));
    const fontesRenda: IncomeSource[] = (incomeQ.data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      expectedDay: r.expected_day,
      amount: Number(r.amount),
      status: r.status as IncomeStatus,
      accountId: r.account_id,
      lastReceivedMonth: r.last_received_month,
    }));

    // ===== Dynamic wallet balance per account =====
    // Saldo conta = saldo_inicial + receitas pagas (não vindas de income source) + income sources recebidas + ajustes - despesas pagas
    // Para manter simples: saldo = initial_balance + Σ(income_sources recebidas com account_id) + Σ(transações receita pagas) - Σ(transações despesa pagas)
    const contas: Account[] = (accountsQ.data ?? []).map((r: any) => {
      const ini = Number(r.initial_balance ?? 0);
      const txIn = transacoes
        .filter((t) => t.contaId === r.id && t.kind === "receita" && t.status === "pago")
        .reduce((s, t) => s + t.valor, 0);
      const txOut = transacoes
        .filter((t) => t.contaId === r.id && t.kind === "despesa" && t.status === "pago")
        .reduce((s, t) => s + t.valor, 0);
      const incomeIn = fontesRenda
        .filter((i) => i.accountId === r.id && i.status === "recebido")
        .reduce((s, i) => s + i.amount, 0);
      return {
        id: r.id,
        nome: r.name,
        tipo: r.type as AccountType,
        saldoInicial: ini,
        saldo: ini + txIn + incomeIn - txOut,
        cor: r.color,
        emoji: r.emoji,
      };
    });

    const saldoReal = contas.reduce((s, c) => s + c.saldo, 0);

    const metas: SavingsGoal[] = (goalsQ.data ?? []).map((r: any) => ({
      id: r.id,
      nome: r.name,
      emoji: r.emoji,
      cor: r.color,
      valorAtual: Number(r.current_amount),
      valorTotal: Number(r.target_amount),
      aporteMensal: Number(r.monthly_contribution ?? 0),
      dataAlvo: r.target_date,
    }));

    const caixinhasTotal = metas.reduce((s, m) => s + m.valorAtual, 0);

    // Despesas pendentes com dueDate dentro do mês corrente
    const now = new Date();
    const mesInicio = new Date(now.getFullYear(), now.getMonth(), 1);
    const mesFim = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const pendentesMesTotal = transacoes
      .filter((t) => {
        if (t.kind !== "despesa" || t.status === "pago") return false;
        const ref = t.dueDate ?? t.data;
        if (!ref) return false;
        const d = new Date(ref + "T00:00:00");
        return d >= mesInicio && d <= mesFim;
      })
      .reduce((s, t) => s + t.valor, 0);

    const livreParaGastar = saldoReal - pendentesMesTotal - caixinhasTotal;

    const investimentos: Investment[] = (investmentsQ.data ?? []).map((r: any) => ({
      id: r.id,
      nome: r.name,
      tipo: r.type,
      valor: Number(r.amount),
      aporteSugerido: Number(r.suggested_contribution),
    }));
    const terceiros: ThirdParty[] = (thirdPartyQ.data ?? []).map((r: any) => ({
      id: r.id,
      personName: r.person_name,
      type: r.type as ThirdPartyType,
      amount: Number(r.amount),
      dueDate: r.due_date,
      isInstallment: r.is_installment,
      installmentsLeft: r.installments_left,
      status: r.status as PaymentStatus,
      notes: r.notes,
    }));

    return {
      rendaMensal: Number(profileQ.data?.monthly_income ?? 0),
      gastosEssenciais: Number(profileQ.data?.essential_expenses ?? 0),
      dividas,
      contas,
      categorias: initialCategorias,
      transacoes,
      metas,
      investimentos,
      terceiros,
      fontesRenda,
      saldoReal,
      caixinhasTotal,
      pendentesMesTotal,
      livreParaGastar,
      isLoading:

        profileQ.isLoading ||
        accountsQ.isLoading ||
        debtsQ.isLoading ||
        transactionsQ.isLoading ||
        incomeQ.isLoading,
      addDebt: async (d) => {
        await addDebtM.mutateAsync(d);
      },
      updateDebtInstallment: async (id, v) => {
        await updateDebtInstallmentM.mutateAsync({ id, valorParcela: v });
      },
      deleteDebt: async (id) => {
        await deleteDebtM.mutateAsync(id);
      },
      payDebtInstallment: async (id) => {
        await payDebtM.mutateAsync(id);
      },
      payDebtWithAmount: async (id, amount, accountId) => {
        await payDebtWithAmountM.mutateAsync({ id, amount, accountId });
      },
      revertDebtPayment: async (id) => {
        await revertDebtM.mutateAsync(id);
      },
      addTransaction: async (t) => {
        await addTxM.mutateAsync(t);
      },
      setTransactionStatus: async (id, status) => {
        await setTxStatusM.mutateAsync({ id, status });
      },
      deleteTransaction: async (id) => {
        await deleteTxM.mutateAsync(id);
      },
      addThirdParty: async (t) => {
        await addThirdPartyM.mutateAsync(t);
      },
      setThirdPartyStatus: async (id, status) => {
        await setThirdPartyStatusM.mutateAsync({ id, status });
      },
      updateThirdParty: async (id, patch) => {
        await updateThirdPartyM.mutateAsync({ id, patch });
      },
      deleteThirdParty: async (id) => {
        await deleteThirdPartyM.mutateAsync(id);
      },
      addIncomeSource: async (i) => {
        await addIncomeM.mutateAsync(i);
      },
      setIncomeStatus: async (id, status) => {
        await setIncomeStatusM.mutateAsync({ id, status });
      },
      deleteIncomeSource: async (id) => {
        await deleteIncomeM.mutateAsync(id);
      },
      wipeAllData: async () => {
        await wipeM.mutateAsync();
      },
    };
  }, [
    profileQ.data,
    accountsQ.data,
    debtsQ.data,
    transactionsQ.data,
    goalsQ.data,
    investmentsQ.data,
    thirdPartyQ.data,
    incomeQ.data,
    profileQ.isLoading,
    accountsQ.isLoading,
    debtsQ.isLoading,
    transactionsQ.isLoading,
    incomeQ.isLoading,
    addDebtM,
    updateDebtInstallmentM,
    deleteDebtM,
    payDebtM,
    payDebtWithAmountM,
    revertDebtM,
    addTxM,
    setTxStatusM,
    deleteTxM,
    addThirdPartyM,
    setThirdPartyStatusM,
    updateThirdPartyM,
    deleteThirdPartyM,
    addIncomeM,
    setIncomeStatusM,
    deleteIncomeM,
    wipeM,
  ]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
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

/**
 * Projeção até a próxima entrada de salário.
 * Retorna {nextIncome, fixedDue, balanceAfter}.
 */
export function projectUntilNextIncome(
  saldoAtual: number,
  fontes: IncomeSource[],
  transacoes: Transaction[],
  dividas: Debt[],
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Próxima data de qualquer fonte de renda
  const upcoming = fontes
    .filter((f) => f.status === "pendente" || f.lastReceivedMonth !== today.toISOString().slice(0, 10))
    .map((f) => {
      const candidate = new Date(today.getFullYear(), today.getMonth(), f.expectedDay);
      if (candidate < today) candidate.setMonth(candidate.getMonth() + 1);
      return { source: f, date: candidate };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const next = upcoming[0];
  if (!next) {
    return {
      nextIncome: null as IncomeSource | null,
      nextDate: null as Date | null,
      fixedDue: 0,
      debtsDue: 0,
      totalDue: 0,
      balanceAfter: saldoAtual,
    };
  }

  // Despesas com due_date entre hoje e próxima entrada, pendentes
  const fixedDue = transacoes
    .filter(
      (t) =>
        t.kind === "despesa" &&
        t.status !== "pago" &&
        t.dueDate &&
        new Date(t.dueDate + "T00:00:00") >= today &&
        new Date(t.dueDate + "T00:00:00") <= next.date,
    )
    .reduce((s, t) => s + t.valor, 0);

  const debtsDue = dividas
    .filter((d) => {
      if (d.statusThisMonth === "pago") return false;
      if (!d.dueDay) return false;
      const dueThis = new Date(today.getFullYear(), today.getMonth(), d.dueDay);
      if (dueThis < today) dueThis.setMonth(dueThis.getMonth() + 1);
      return dueThis <= next.date;
    })
    .reduce((s, d) => s + d.valorParcela, 0);

  const totalDue = fixedDue + debtsDue;
  return {
    nextIncome: next.source,
    nextDate: next.date,
    fixedDue,
    debtsDue,
    totalDue,
    balanceAfter: saldoAtual - totalDue,
  };
}
