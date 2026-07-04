import type { QueryClient } from "@tanstack/react-query";

/**
 * MAPA_DE_IMPACTO
 * Centraliza toda a lógica de invalidação de cache do React Query.
 * Cada chave representa uma "ação de domínio" e lista as queries que precisam
 * ser recalculadas quando ela acontece. Nenhuma tela deve chamar
 * queryClient.invalidateQueries diretamente fora deste mapa — sempre passar
 * pelo helper `invalidate(qc, "acao")`.
 */
export const MAPA_DE_IMPACTO = {
  // ---- Transações / lançamentos ----
  transacao_criada: ["transactions", "accounts", "budget_envelopes", "credit_card_invoices"],
  transacao_editada: ["transactions", "accounts", "budget_envelopes", "credit_card_invoices"],
  transacao_removida: ["transactions", "accounts", "budget_envelopes", "credit_card_invoices"],
  transacao_status_alterado: ["transactions", "accounts", "budget_envelopes", "credit_card_invoices"],

  // ---- Parcelas de cartão / compras parceladas ----
  parcela_paga: ["transactions", "accounts", "credit_card_invoices"],
  parcela_estornada: ["transactions", "accounts", "credit_card_invoices"],
  parcelas_adiantadas: ["transactions", "accounts", "credit_card_invoices"],
  parcelamento_encerrado: ["transactions", "accounts", "credit_card_invoices"],
  compra_parcelada_criada: ["transactions", "credit_card_invoices", "third_party_financials"],

  // ---- Faturas de cartão ----
  fatura_paga: ["credit_card_invoices", "transactions", "accounts"],
  fatura_estornada: ["credit_card_invoices", "transactions", "accounts"],
  cartao_criado: ["credit_cards"],
  cartao_editado: ["credit_cards", "transactions"],

  // ---- Contas / carteira ----
  conta_criada: ["accounts"],
  conta_desativada: ["accounts", "transactions"],

  // ---- Terceiros / pessoas ----
  terceiro_criado: ["third_party_financials", "transactions", "credit_card_invoices"],
  terceiro_editado: ["third_party_financials", "transactions"],
  terceiro_removido: ["third_party_financials", "transactions"],
  terceiro_status_alterado: ["third_party_financials"],
  pessoa_criada: ["people"],
  pessoa_editada: ["people", "third_party_financials", "transactions"],
  pessoa_desativada: ["people", "third_party_financials", "transactions"],

  // ---- Dívidas fixas ----
  divida_criada: ["debts"],
  divida_editada: ["debts"],
  divida_removida: ["debts", "transactions"],
  divida_paga: ["debts", "accounts", "transactions"],
  divida_estornada: ["debts", "accounts", "transactions"],

  // ---- Metas / Caixinhas ----
  meta_criada: ["savings_goals"],
  meta_editada: ["savings_goals"],
  meta_removida: ["savings_goals"],
  meta_aportada: ["savings_goals", "accounts", "transactions"],

  // ---- Envelopes orçamentários ----
  envelope_criado: ["budget_envelopes"],
  envelope_editado: ["budget_envelopes"],
  envelope_removido: ["budget_envelopes", "transactions"],

  // ---- Fontes de renda ----
  renda_criada: ["income_sources"],
  renda_editada: ["income_sources"],
  renda_removida: ["income_sources"],
  renda_status_alterado: ["income_sources", "accounts"],

  // ---- Perfil / wipe ----
  perfil_editado: ["profile"],
  dados_zerados: [
    "transactions",
    "accounts",
    "debts",
    "third_party_financials",
    "income_sources",
    "people",
    "budget_envelopes",
    "savings_goals",
    "investments",
    "credit_cards",
    "credit_card_invoices",
    "profile",
  ],
} as const;

export type AcaoImpacto = keyof typeof MAPA_DE_IMPACTO;

export function invalidate(qc: QueryClient, acao: AcaoImpacto) {
  const keys = MAPA_DE_IMPACTO[acao];
  keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}
