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

interface FinanceState {
  rendaMensal: number;
  gastosEssenciais: number;
  dividas: Debt[];
  addDebt: (debt: Omit<Debt, "id" | "parcelasTotais"> & { parcelasTotais?: number }) => void;
}

const FinanceContext = createContext<FinanceState | null>(null);

const initialDebts: Debt[] = [
  {
    id: "1",
    nome: "Financiamento do Carro",
    valorParcela: 980,
    parcelasRestantes: 4,
    parcelasTotais: 48,
    tipo: "Financiamento",
  },
  {
    id: "2",
    nome: "Fatura Nubank",
    valorParcela: 450,
    parcelasRestantes: 2,
    parcelasTotais: 6,
    tipo: "Cartão de Crédito",
  },
  {
    id: "3",
    nome: "Empréstimo Pessoal",
    valorParcela: 320,
    parcelasRestantes: 9,
    parcelasTotais: 24,
    tipo: "Empréstimo",
  },
  {
    id: "4",
    nome: "iPhone Parcelado",
    valorParcela: 280,
    parcelasRestantes: 7,
    parcelasTotais: 12,
    tipo: "Cartão de Crédito",
  },
];

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [dividas, setDividas] = useState<Debt[]>(initialDebts);

  const value = useMemo<FinanceState>(
    () => ({
      rendaMensal: 5000,
      gastosEssenciais: 2000,
      dividas,
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
    }),
    [dividas],
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

/** Builds N-month projection: each month the total debt payment shrinks as installments end. */
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
