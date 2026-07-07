import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CvGyVUKL.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-store-764EgLaW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* MAPA_DE_IMPACTO
* Centraliza toda a lógica de invalidação de cache do React Query.
* Cada chave representa uma "ação de domínio" e lista as queries que precisam
* ser recalculadas quando ela acontece. Nenhuma tela deve chamar
* queryClient.invalidateQueries diretamente fora deste mapa — sempre passar
* pelo helper `invalidate(qc, "acao")`.
*/
var MAPA_DE_IMPACTO = {
	transacao_criada: [
		"transactions",
		"accounts",
		"budget_envelopes",
		"credit_card_invoices"
	],
	transacao_editada: [
		"transactions",
		"accounts",
		"budget_envelopes",
		"credit_card_invoices"
	],
	transacao_removida: [
		"transactions",
		"accounts",
		"budget_envelopes",
		"credit_card_invoices"
	],
	transacao_status_alterado: [
		"transactions",
		"accounts",
		"budget_envelopes",
		"credit_card_invoices"
	],
	parcela_paga: [
		"transactions",
		"accounts",
		"credit_card_invoices",
		"debts"
	],
	parcela_estornada: [
		"transactions",
		"accounts",
		"credit_card_invoices",
		"debts"
	],
	parcelas_adiantadas: [
		"transactions",
		"accounts",
		"credit_card_invoices",
		"debts"
	],
	parcelamento_encerrado: [
		"transactions",
		"accounts",
		"credit_card_invoices",
		"debts"
	],
	compra_parcelada_criada: [
		"transactions",
		"credit_card_invoices",
		"third_party_financials"
	],
	fatura_paga: [
		"credit_card_invoices",
		"transactions",
		"accounts"
	],
	fatura_estornada: [
		"credit_card_invoices",
		"transactions",
		"accounts"
	],
	cartao_criado: ["credit_cards"],
	cartao_editado: ["credit_cards", "transactions"],
	conta_criada: ["accounts"],
	conta_desativada: ["accounts", "transactions"],
	terceiro_criado: [
		"third_party_financials",
		"transactions",
		"credit_card_invoices"
	],
	terceiro_editado: ["third_party_financials", "transactions"],
	terceiro_removido: ["third_party_financials", "transactions"],
	terceiro_status_alterado: ["third_party_financials"],
	pessoa_criada: ["people"],
	pessoa_editada: [
		"people",
		"third_party_financials",
		"transactions"
	],
	pessoa_desativada: [
		"people",
		"third_party_financials",
		"transactions"
	],
	divida_criada: ["debts"],
	divida_editada: ["debts"],
	divida_removida: ["debts", "transactions"],
	divida_paga: [
		"debts",
		"accounts",
		"transactions"
	],
	divida_estornada: [
		"debts",
		"accounts",
		"transactions"
	],
	meta_criada: ["savings_goals"],
	meta_editada: ["savings_goals"],
	meta_removida: ["savings_goals"],
	meta_aportada: [
		"savings_goals",
		"accounts",
		"transactions"
	],
	envelope_criado: ["budget_envelopes"],
	envelope_editado: ["budget_envelopes"],
	envelope_removido: ["budget_envelopes", "transactions"],
	renda_criada: ["income_sources"],
	renda_editada: ["income_sources"],
	renda_removida: ["income_sources"],
	renda_status_alterado: ["income_sources", "accounts"],
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
		"profile"
	]
};
function invalidate(qc, acao) {
	MAPA_DE_IMPACTO[acao].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}
var initialCategorias = [
	{
		id: "moradia",
		nome: "Moradia",
		emoji: "🏠",
		cor: "#60a5fa"
	},
	{
		id: "mercado",
		nome: "Mercado",
		emoji: "🛒",
		cor: "#34d399"
	},
	{
		id: "alimentacao",
		nome: "Alimentação",
		emoji: "🍔",
		cor: "#fbbf24"
	},
	{
		id: "transporte",
		nome: "Transporte",
		emoji: "🚗",
		cor: "#f472b6"
	},
	{
		id: "lazer",
		nome: "Lazer",
		emoji: "🎮",
		cor: "#a78bfa"
	},
	{
		id: "saude",
		nome: "Saúde",
		emoji: "💊",
		cor: "#f87171"
	},
	{
		id: "salario",
		nome: "Salário",
		emoji: "💼",
		cor: "#22d3ee"
	},
	{
		id: "contas",
		nome: "Contas fixas",
		emoji: "⚡",
		cor: "#facc15"
	},
	{
		id: "outros",
		nome: "Outros",
		emoji: "✨",
		cor: "#94a3b8"
	}
];
var FinanceContext = (0, import_react.createContext)(null);
function FinanceProvider({ children }) {
	const qc = useQueryClient();
	const profileQ = useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("monthly_income, essential_expenses").maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const accountsQ = useQuery({
		queryKey: ["accounts"],
		queryFn: async () => {
			const { data, error } = await supabase.from("accounts").select("*").order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const debtsQ = useQuery({
		queryKey: ["debts"],
		queryFn: async () => {
			const { data, error } = await supabase.from("debts").select("*, commitment_groups(frozen_at)").order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const transactionsQ = useQuery({
		queryKey: ["transactions"],
		queryFn: async () => {
			const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const goalsQ = useQuery({
		queryKey: ["savings_goals"],
		queryFn: async () => {
			const { data, error } = await supabase.from("savings_goals").select("*").order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const investmentsQ = useQuery({
		queryKey: ["investments"],
		queryFn: async () => {
			const { data, error } = await supabase.from("investments").select("*").order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const thirdPartyQ = useQuery({
		queryKey: ["third_party_financials"],
		queryFn: async () => {
			const { data, error } = await supabase.from("third_party_financials").select("*").order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const incomeQ = useQuery({
		queryKey: ["income_sources"],
		queryFn: async () => {
			const { data, error } = await supabase.from("income_sources").select("*").order("expected_day", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const peopleQ = useQuery({
		queryKey: ["people"],
		queryFn: async () => {
			const { data, error } = await supabase.from("people").select("*").order("name", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const envelopesQ = useQuery({
		queryKey: ["budget_envelopes"],
		queryFn: async () => {
			const { data, error } = await supabase.from("budget_envelopes").select("*").order("name", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const creditCardsQ = useQuery({
		queryKey: ["credit_cards"],
		queryFn: async () => {
			const { data, error } = await supabase.from("credit_cards").select("*").order("name", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const invoicesQ = useQuery({
		queryKey: ["credit_card_invoices"],
		queryFn: async () => {
			const { data, error } = await supabase.from("credit_card_invoices").select("*").order("reference_month", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const bust = (acao) => invalidate(qc, acao);
	const invalidateAll = () => {
		bust("transacao_editada");
		bust("divida_editada");
		bust("terceiro_editado");
		bust("renda_editada");
		bust("pessoa_editada");
		bust("envelope_editado");
	};
	const addDebtM = useMutation({
		mutationFn: async (d) => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Não autenticado");
			const total = d.parcelasRestantes;
			const cat = d.category ?? (d.isVariable ? "variavel" : "parcelada");
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
				status_this_month: "pendente"
			});
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const updateDebtInstallmentM = useMutation({
		mutationFn: async ({ id, valorParcela }) => {
			const { error } = await supabase.from("debts").update({ monthly_installment: valorParcela }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const deleteDebtM = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("debts").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const congelarM = useMutation({
		mutationFn: async (groupId) => {
			const { error } = await supabase.rpc("congelar_compromisso", { _group_id: groupId });
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const descongelarM = useMutation({
		mutationFn: async (groupId) => {
			const { error } = await supabase.rpc("descongelar_compromisso", { _group_id: groupId });
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const addTxM = useMutation({
		mutationFn: async (t) => {
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
				envelope_id: t.envelopeId ?? null,
				person_id: t.personId ?? null
			});
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const setTxStatusM = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("transactions").update({ status }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const deleteTxM = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("transactions").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const addThirdPartyM = useMutation({
		mutationFn: async (t) => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Não autenticado");
			const { error } = await supabase.from("third_party_financials").insert({
				user_id: user.user.id,
				person_id: t.personId ?? null,
				person_name: t.personName,
				type: t.type,
				direction: t.direction,
				payment_method: t.paymentMethod,
				credit_card_id: t.creditCardId ?? null,
				nome_cartao_terceiro: t.nomeCartaoTerceiro ?? null,
				purchase_group_id: t.purchaseGroupId ?? null,
				amount: t.amount,
				due_date: t.dueDate,
				is_installment: t.isInstallment,
				installments_left: t.installmentsLeft,
				status: t.status,
				notes: t.notes
			});
			if (error) throw error;
		},
		onSuccess: () => bust("terceiro_criado")
	});
	const setThirdPartyStatusM = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("third_party_financials").update({ status }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const updateThirdPartyM = useMutation({
		mutationFn: async ({ id, patch }) => {
			const row = {};
			if (patch.amount !== void 0) row.amount = patch.amount;
			if (patch.dueDate !== void 0) row.due_date = patch.dueDate;
			if (patch.personName !== void 0) row.person_name = patch.personName;
			if (patch.personId !== void 0) row.person_id = patch.personId;
			if (patch.notes !== void 0) row.notes = patch.notes;
			if (patch.installmentsLeft !== void 0) row.installments_left = patch.installmentsLeft;
			const { error } = await supabase.from("third_party_financials").update(row).eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const deleteThirdPartyM = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("third_party_financials").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const addIncomeM = useMutation({
		mutationFn: async (i) => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Não autenticado");
			const { error } = await supabase.from("income_sources").insert({
				user_id: user.user.id,
				name: i.name,
				expected_day: i.expectedDay,
				amount: i.amount,
				account_id: i.accountId,
				status: i.status ?? "pendente"
			});
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const setIncomeStatusM = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("income_sources").update({
				status,
				last_received_month: status === "recebido" ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : null
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const deleteIncomeM = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("income_sources").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateAll
	});
	const invalidateGoals = () => {
		qc.invalidateQueries({ queryKey: ["savings_goals"] });
		qc.invalidateQueries({ queryKey: ["transactions"] });
		qc.invalidateQueries({ queryKey: ["accounts"] });
	};
	const addGoalM = useMutation({
		mutationFn: async (g) => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Não autenticado");
			const { error } = await supabase.from("savings_goals").insert({
				user_id: user.user.id,
				name: g.nome,
				emoji: g.emoji ?? "🎯",
				color: g.cor ?? "bg-primary/20 text-primary",
				target_amount: g.valorTotal,
				current_amount: 0,
				monthly_contribution: g.aporteMensal ?? 0,
				target_date: g.dataAlvo ?? null
			});
			if (error) throw error;
		},
		onSuccess: invalidateGoals
	});
	const updateGoalM = useMutation({
		mutationFn: async ({ id, patch }) => {
			const row = {};
			if (patch.nome !== void 0) row.name = patch.nome;
			if (patch.emoji !== void 0) row.emoji = patch.emoji;
			if (patch.cor !== void 0) row.color = patch.cor;
			if (patch.valorTotal !== void 0) row.target_amount = patch.valorTotal;
			if (patch.valorAtual !== void 0) row.current_amount = patch.valorAtual;
			if (patch.aporteMensal !== void 0) row.monthly_contribution = patch.aporteMensal;
			if (patch.dataAlvo !== void 0) row.target_date = patch.dataAlvo;
			const { error } = await supabase.from("savings_goals").update(row).eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateGoals
	});
	const deleteGoalM = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("savings_goals").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateGoals
	});
	const contributeGoalM = useMutation({
		mutationFn: async ({ id, amount, accountId }) => {
			const { data: userRes } = await supabase.auth.getUser();
			if (!userRes.user) throw new Error("Não autenticado");
			const { data: goal, error: gErr } = await supabase.from("savings_goals").select("current_amount, name").eq("id", id).maybeSingle();
			if (gErr) throw gErr;
			const novo = Number(goal?.current_amount ?? 0) + amount;
			const { error: upErr } = await supabase.from("savings_goals").update({ current_amount: novo }).eq("id", id);
			if (upErr) throw upErr;
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
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
				is_fixed: false
			});
			if (txErr) throw txErr;
		},
		onSuccess: invalidateGoals
	});
	const invalidatePeople = () => {
		qc.invalidateQueries({ queryKey: ["people"] });
		qc.invalidateQueries({ queryKey: ["third_party_financials"] });
	};
	const addPersonM = useMutation({
		mutationFn: async (p) => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Não autenticado");
			const { error } = await supabase.from("people").insert({
				user_id: user.user.id,
				name: p.name,
				type: p.type ?? "contato",
				avatar_url: p.avatarUrl ?? null,
				notes: p.notes ?? null
			});
			if (error) throw error;
		},
		onSuccess: invalidatePeople
	});
	const updatePersonM = useMutation({
		mutationFn: async ({ id, patch }) => {
			const row = {};
			if (patch.name !== void 0) row.name = patch.name;
			if (patch.type !== void 0) row.type = patch.type;
			if (patch.avatarUrl !== void 0) row.avatar_url = patch.avatarUrl;
			if (patch.notes !== void 0) row.notes = patch.notes;
			const { error } = await supabase.from("people").update(row).eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidatePeople
	});
	const deletePersonM = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("people").update({ active: false }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => bust("pessoa_desativada")
	});
	const invalidateEnvelopes = () => {
		qc.invalidateQueries({ queryKey: ["budget_envelopes"] });
		qc.invalidateQueries({ queryKey: ["transactions"] });
	};
	const addEnvelopeM = useMutation({
		mutationFn: async (e) => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Não autenticado");
			const { error } = await supabase.from("budget_envelopes").insert({
				user_id: user.user.id,
				name: e.name,
				monthly_limit: e.monthlyLimit,
				emoji: e.emoji ?? "📦",
				color: e.cor ?? "bg-primary/20 text-primary"
			});
			if (error) throw error;
		},
		onSuccess: invalidateEnvelopes
	});
	const updateEnvelopeM = useMutation({
		mutationFn: async ({ id, patch }) => {
			const row = {};
			if (patch.name !== void 0) row.name = patch.name;
			if (patch.monthlyLimit !== void 0) row.monthly_limit = patch.monthlyLimit;
			if (patch.emoji !== void 0) row.emoji = patch.emoji;
			if (patch.cor !== void 0) row.color = patch.cor;
			const { error } = await supabase.from("budget_envelopes").update(row).eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateEnvelopes
	});
	const deleteEnvelopeM = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("budget_envelopes").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: invalidateEnvelopes
	});
	const wipeM = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.rpc("wipe_user_data");
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries();
		}
	});
	const addAccountM = useMutation({
		mutationFn: async (a) => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Não autenticado");
			const { error } = await supabase.from("accounts").insert({
				user_id: user.user.id,
				name: a.nome,
				type: a.tipo,
				balance: a.saldoInicial,
				initial_balance: a.saldoInicial,
				emoji: a.emoji ?? "🏦",
				color: a.cor ?? "bg-sky-500/20 text-sky-300"
			});
			if (error) throw error;
		},
		onSuccess: () => bust("conta_criada")
	});
	const addCreditCardM = useMutation({
		mutationFn: async (c) => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Não autenticado");
			const { error } = await supabase.from("credit_cards").insert({
				user_id: user.user.id,
				name: c.name,
				closing_day: c.closingDay,
				due_day: c.dueDay,
				payment_account_id: c.paymentAccountId ?? null,
				credit_limit: c.creditLimit ?? null
			});
			if (error) throw error;
		},
		onSuccess: () => bust("cartao_criado")
	});
	const criarCompraParceladaM = useMutation({
		mutationFn: async (input) => {
			const { data, error } = await supabase.rpc("criar_compra_parcelada", {
				_description: input.description,
				_amount_total: input.amountTotal,
				_installments: input.installments,
				_first_due_date: input.firstDueDate,
				_category: input.category,
				_credit_card_id: input.creditCardId ?? null,
				_account_id: input.accountId ?? null,
				_person_id: input.personId ?? null,
				_envelope_id: input.envelopeId ?? null,
				_parcelas_ja_pagas: input.parcelasJaPagas ?? 0
			});
			if (error) throw error;
			return data ?? null;
		},
		onSuccess: () => bust("compra_parcelada_criada")
	});
	const criarDividaCompromissoM = useMutation({
		mutationFn: async (input) => {
			const cat = input.category ?? "parcelada";
			const { data, error } = await supabase.rpc("criar_divida_compromisso", {
				_name: input.nome,
				_debt_type: input.tipo,
				_monthly_installment: input.valorParcela,
				_installments: input.parcelas,
				_first_due_date: input.firstDueDate,
				_category: cat
			});
			if (error) throw error;
			return data ?? null;
		},
		onSuccess: invalidateAll
	});
	const pagarParcelaM = useMutation({
		mutationFn: async (txId) => {
			const { error } = await supabase.rpc("pagar_parcela", { _tx_id: txId });
			if (error) throw error;
		},
		onSuccess: () => bust("parcela_paga")
	});
	const estornarParcelaM = useMutation({
		mutationFn: async (txId) => {
			const { error } = await supabase.rpc("estornar_parcela", { _tx_id: txId });
			if (error) throw error;
		},
		onSuccess: () => bust("parcela_estornada")
	});
	const adiantarParcelasM = useMutation({
		mutationFn: async (txIds) => {
			const { error } = await supabase.rpc("adiantar_parcelas", { _tx_ids: txIds });
			if (error) throw error;
		},
		onSuccess: () => bust("parcelas_adiantadas")
	});
	const encerrarParcelamentoM = useMutation({
		mutationFn: async ({ groupId, modo, customAmount }) => {
			const { error } = await supabase.rpc("encerrar_parcelamento", {
				_group_id: groupId,
				_modo: modo,
				_custom_amount: customAmount ?? null
			});
			if (error) throw error;
		},
		onSuccess: () => bust("parcelamento_encerrado")
	});
	const pagarFaturaM = useMutation({
		mutationFn: async (invoiceId) => {
			const { error } = await supabase.rpc("pagar_fatura", { _invoice_id: invoiceId });
			if (error) throw error;
		},
		onSuccess: () => bust("fatura_paga")
	});
	const alternarStatusTransacaoM = useMutation({
		mutationFn: async ({ transactionId, newStatus }) => {
			const { error } = await supabase.rpc("alternar_status_transacao", {
				_transaction_id: transactionId,
				_new_status: newStatus
			});
			if (error) throw error;
		},
		onSuccess: () => bust("transacao_editada")
	});
	const estornarFaturaM = useMutation({
		mutationFn: async (invoiceId) => {
			const { error } = await supabase.rpc("estornar_fatura", { _invoice_id: invoiceId });
			if (error) throw error;
		},
		onSuccess: () => bust("fatura_estornada")
	});
	const value = (0, import_react.useMemo)(() => {
		console.log("[Finance Diagnostic] Re-calculating state...");
		console.log("[Finance Diagnostic] Queries status:", {
			profile: profileQ.status,
			accounts: accountsQ.status,
			debts: debtsQ.status,
			transactions: transactionsQ.status
		});
		const txs = transactionsQ.data ?? [];
		const dividas = (debtsQ.data ?? []).map((r) => {
			const groupId = r.commitment_group_id ?? null;
			const installments = groupId ? txs.filter((t) => t.commitment_group_id === groupId) : [];
			const parcelasTotais = installments.length || r.total_installments;
			const parcelasRestantes = installments.length ? installments.filter((t) => !t.paid_at).length : r.remaining_installments;
			const valorParcela = installments.length ? Number(installments[0]?.amount ?? r.monthly_installment) : Number(r.monthly_installment);
			const now = /* @__PURE__ */ new Date();
			const year = now.getFullYear();
			const month = now.getMonth();
			const currentMonthTx = installments.find((t) => {
				if (!t.due_date) return false;
				const d = new Date(t.due_date);
				return d.getFullYear() === year && d.getMonth() === month;
			});
			const currentInstallmentTxId = currentMonthTx?.id ?? null;
			const statusThisMonth = currentMonthTx ? currentMonthTx.paid_at ? "pago" : "pendente" : r.status_this_month ?? "pendente";
			return {
				id: r.id,
				nome: r.name,
				valorParcela,
				parcelasRestantes,
				parcelasTotais,
				tipo: r.type,
				category: r.commitment_groups?.frozen_at ? "congelada" : r.category ?? (r.is_variable ? "variavel" : "parcelada"),
				dueDay: r.due_day ?? null,
				isVariable: r.is_variable ?? false,
				statusThisMonth,
				commitmentGroupId: groupId,
				frozenAt: r.commitment_groups?.frozen_at ?? null,
				currentInstallmentTxId
			};
		});
		const transacoes = (transactionsQ.data ?? []).map((r) => ({
			id: r.id,
			kind: r.type,
			descricao: r.description,
			valor: Number(r.amount),
			data: r.date,
			dueDate: r.due_date ?? null,
			status: r.status ?? "pago",
			isFixed: r.is_fixed ?? false,
			categoriaId: r.category,
			contaId: r.account_id ?? "",
			envelopeId: r.envelope_id ?? null,
			personId: r.person_id ?? null,
			creditCardId: r.credit_card_id ?? null,
			invoiceId: r.invoice_id ?? null,
			purchaseGroupId: r.purchase_group_id ?? null,
			commitmentGroupId: r.commitment_group_id ?? null,
			installmentNumber: r.installment_number ?? null,
			installmentTotal: r.installment_total ?? null,
			paidAt: r.paid_at ?? null,
			originInvoiceId: r.origin_invoice_id ?? null,
			originTransactionId: r.origin_transaction_id ?? null
		}));
		const fontesRenda = (incomeQ.data ?? []).map((r) => ({
			id: r.id,
			name: r.name,
			expectedDay: r.expected_day,
			amount: Number(r.amount),
			status: r.status,
			accountId: r.account_id,
			lastReceivedMonth: r.last_received_month
		}));
		const contas = (accountsQ.data ?? []).map((r) => {
			const ini = Number(r.initial_balance ?? 0);
			const txIn = transacoes.filter((t) => t.contaId === r.id && t.kind === "receita" && t.status === "pago").reduce((s, t) => s + t.valor, 0);
			const txOut = transacoes.filter((t) => t.contaId === r.id && t.kind === "despesa" && t.status === "pago").reduce((s, t) => s + t.valor, 0);
			const incomeIn = fontesRenda.filter((i) => i.accountId === r.id && i.status === "recebido").reduce((s, i) => s + i.amount, 0);
			return {
				id: r.id,
				nome: r.name,
				tipo: r.type,
				saldoInicial: ini,
				saldo: ini + txIn + incomeIn - txOut,
				cor: r.color,
				emoji: r.emoji
			};
		});
		const saldoReal = contas.reduce((s, c) => s + c.saldo, 0);
		const metas = (goalsQ.data ?? []).map((r) => ({
			id: r.id,
			nome: r.name,
			emoji: r.emoji,
			cor: r.color,
			valorAtual: Number(r.current_amount),
			valorTotal: Number(r.target_amount),
			aporteMensal: Number(r.monthly_contribution ?? 0),
			dataAlvo: r.target_date
		}));
		const caixinhasTotal = metas.reduce((s, m) => s + m.valorAtual, 0);
		const cartoes = (creditCardsQ.data ?? []).map((r) => ({
			id: r.id,
			name: r.name,
			closingDay: r.closing_day,
			dueDay: r.due_day,
			paymentAccountId: r.payment_account_id ?? null,
			creditLimit: r.credit_limit != null ? Number(r.credit_limit) : null,
			active: r.active ?? true
		}));
		const faturas = (invoicesQ.data ?? []).map((r) => {
			const total = transacoes.filter((t) => t.invoiceId === r.id).reduce((s, t) => s + t.valor, 0);
			return {
				id: r.id,
				creditCardId: r.credit_card_id,
				referenceMonth: r.reference_month,
				closingDate: r.closing_date,
				dueDate: r.due_date,
				status: r.status,
				paidAt: r.paid_at ?? null,
				total
			};
		});
		const now = /* @__PURE__ */ new Date();
		const mesInicio = new Date(now.getFullYear(), now.getMonth(), 1);
		const mesFim = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
		const pendentesMesTotal = transacoes.filter((t) => {
			if (t.kind !== "despesa" || t.status === "pago") return false;
			if (t.invoiceId || t.creditCardId) return false;
			const ref = t.dueDate ?? t.data;
			if (!ref) return false;
			const d = /* @__PURE__ */ new Date(ref + "T00:00:00");
			return d >= mesInicio && d <= mesFim;
		}).reduce((s, t) => s + t.valor, 0);
		const faturasAbertasTotal = faturas.filter((f) => f.status === "aberta" || f.status === "fechada").filter((f) => {
			const d = /* @__PURE__ */ new Date(f.dueDate + "T00:00:00");
			return d >= mesInicio && d <= mesFim;
		}).reduce((sum, f) => {
			return sum + transacoes.filter((t) => t.invoiceId === f.id && !t.personId).reduce((s, t) => s + t.valor, 0);
		}, 0);
		const investimentos = (investmentsQ.data ?? []).map((r) => ({
			id: r.id,
			nome: r.name,
			tipo: r.type,
			valor: Number(r.amount),
			aporteSugerido: Number(r.suggested_contribution)
		}));
		const pessoasById = /* @__PURE__ */ new Map();
		const pessoas = (peopleQ.data ?? []).filter((r) => r.active !== false).map((r) => {
			pessoasById.set(r.id, r.name);
			return {
				id: r.id,
				name: r.name,
				type: r.type,
				avatarUrl: r.avatar_url ?? null,
				notes: r.notes ?? null
			};
		});
		(peopleQ.data ?? []).filter((r) => r.active === false).forEach((r) => pessoasById.set(r.id, r.name));
		const terceiros = (thirdPartyQ.data ?? []).map((r) => ({
			id: r.id,
			personId: r.person_id ?? null,
			personName: r.person_id ? pessoasById.get(r.person_id) ?? r.person_name : r.person_name,
			type: r.type,
			direction: r.direction ?? "a_receber",
			paymentMethod: r.payment_method ?? "conta",
			creditCardId: r.credit_card_id ?? null,
			nomeCartaoTerceiro: r.nome_cartao_terceiro ?? null,
			purchaseGroupId: r.purchase_group_id ?? null,
			amount: Number(r.amount),
			dueDate: r.due_date,
			isInstallment: r.is_installment,
			installmentsLeft: r.installments_left,
			status: r.status,
			notes: r.notes
		}));
		const envelopes = (envelopesQ.data ?? []).map((r) => {
			const monthlyLimit = Number(r.monthly_limit ?? 0);
			const currentSpent = transacoes.filter((t) => {
				if (t.envelopeId !== r.id) return false;
				if (t.kind !== "despesa" || t.status !== "pago") return false;
				const ref = t.data ?? t.dueDate;
				if (!ref) return false;
				const d = /* @__PURE__ */ new Date(ref + "T00:00:00");
				return d >= mesInicio && d <= mesFim;
			}).reduce((s, t) => s + t.valor, 0);
			const remaining = monthlyLimit - currentSpent;
			return {
				id: r.id,
				name: r.name,
				monthlyLimit,
				emoji: r.emoji ?? "📦",
				cor: r.color ?? "bg-primary/20 text-primary",
				currentSpent,
				remaining,
				committed: Math.max(0, remaining)
			};
		});
		const envelopesCommitted = envelopes.reduce((s, e) => s + e.committed, 0);
		const livreParaGastarAdj = saldoReal - pendentesMesTotal - faturasAbertasTotal - caixinhasTotal - envelopesCommitted;
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
			pessoas,
			envelopes,
			envelopesCommitted,
			cartoes,
			faturas,
			faturasAbertasTotal,
			saldoReal,
			caixinhasTotal,
			pendentesMesTotal,
			livreParaGastar: livreParaGastarAdj,
			isLoading: profileQ.isLoading || accountsQ.isLoading || debtsQ.isLoading || transactionsQ.isLoading || incomeQ.isLoading,
			addDebt: async (d) => {
				await addDebtM.mutateAsync(d);
			},
			updateDebtInstallment: async (id, v) => {
				await updateDebtInstallmentM.mutateAsync({
					id,
					valorParcela: v
				});
			},
			deleteDebt: async (id) => {
				await deleteDebtM.mutateAsync(id);
			},
			congelarCompromisso: async (groupId) => {
				await congelarM.mutateAsync(groupId);
			},
			descongelarCompromisso: async (groupId) => {
				await descongelarM.mutateAsync(groupId);
			},
			addTransaction: async (t) => {
				await addTxM.mutateAsync(t);
			},
			setTransactionStatus: async (id, status) => {
				await setTxStatusM.mutateAsync({
					id,
					status
				});
			},
			deleteTransaction: async (id) => {
				await deleteTxM.mutateAsync(id);
			},
			addThirdParty: async (t) => {
				await addThirdPartyM.mutateAsync(t);
			},
			setThirdPartyStatus: async (id, status) => {
				await setThirdPartyStatusM.mutateAsync({
					id,
					status
				});
			},
			updateThirdParty: async (id, patch) => {
				await updateThirdPartyM.mutateAsync({
					id,
					patch
				});
			},
			deleteThirdParty: async (id) => {
				await deleteThirdPartyM.mutateAsync(id);
			},
			addIncomeSource: async (i) => {
				await addIncomeM.mutateAsync(i);
			},
			setIncomeStatus: async (id, status) => {
				await setIncomeStatusM.mutateAsync({
					id,
					status
				});
			},
			deleteIncomeSource: async (id) => {
				await deleteIncomeM.mutateAsync(id);
			},
			addGoal: async (g) => {
				await addGoalM.mutateAsync(g);
			},
			updateGoal: async (id, patch) => {
				await updateGoalM.mutateAsync({
					id,
					patch
				});
			},
			deleteGoal: async (id) => {
				await deleteGoalM.mutateAsync(id);
			},
			contributeToGoal: async (id, amount, accountId) => {
				await contributeGoalM.mutateAsync({
					id,
					amount,
					accountId
				});
			},
			addPerson: async (p) => {
				await addPersonM.mutateAsync(p);
			},
			updatePerson: async (id, patch) => {
				await updatePersonM.mutateAsync({
					id,
					patch
				});
			},
			deletePerson: async (id) => {
				await deletePersonM.mutateAsync(id);
			},
			addEnvelope: async (e) => {
				await addEnvelopeM.mutateAsync(e);
			},
			updateEnvelope: async (id, patch) => {
				await updateEnvelopeM.mutateAsync({
					id,
					patch
				});
			},
			deleteEnvelope: async (id) => {
				await deleteEnvelopeM.mutateAsync(id);
			},
			wipeAllData: async () => {
				await wipeM.mutateAsync();
			},
			addAccount: async (a) => {
				await addAccountM.mutateAsync(a);
			},
			addCreditCard: async (c) => {
				await addCreditCardM.mutateAsync(c);
			},
			criarCompraParcelada: async (input) => {
				return await criarCompraParceladaM.mutateAsync(input);
			},
			criarDividaCompromisso: async (input) => {
				return await criarDividaCompromissoM.mutateAsync(input);
			},
			pagarParcela: async (id) => {
				await pagarParcelaM.mutateAsync(id);
			},
			estornarParcela: async (id) => {
				await estornarParcelaM.mutateAsync(id);
			},
			adiantarParcelas: async (ids) => {
				await adiantarParcelasM.mutateAsync(ids);
			},
			encerrarParcelamento: async (groupId, modo, customAmount) => {
				await encerrarParcelamentoM.mutateAsync({
					groupId,
					modo,
					customAmount
				});
			},
			pagarFatura: async (id) => {
				await pagarFaturaM.mutateAsync(id);
			},
			estornarFatura: async (id) => {
				await estornarFaturaM.mutateAsync(id);
			},
			alternarStatusTransacao: async (transactionId, newStatus) => {
				await alternarStatusTransacaoM.mutateAsync({
					transactionId,
					newStatus
				});
			}
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
		criarDividaCompromissoM,
		updateDebtInstallmentM,
		deleteDebtM,
		congelarM,
		descongelarM,
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
		alternarStatusTransacaoM
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceContext.Provider, {
		value,
		children
	});
}
function useFinance() {
	const ctx = (0, import_react.useContext)(FinanceContext);
	if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
	return ctx;
}
function formatBRL(value) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
		maximumFractionDigits: 0
	});
}
function formatBRLFull(value) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	});
}
function buildProjection(rendaMensal, gastosEssenciais, dividas, months = 12) {
	const now = /* @__PURE__ */ new Date();
	const result = [];
	for (let i = 0; i < months; i++) {
		const ended = [];
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
			ended
		});
	}
	return result;
}
/**
* Projeção até a próxima entrada de salário.
* Retorna {nextIncome, fixedDue, balanceAfter}.
*/
function projectUntilNextIncome(saldoAtual, fontes, transacoes, dividas) {
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const next = fontes.filter((f) => f.status === "pendente" || f.lastReceivedMonth !== today.toISOString().slice(0, 10)).map((f) => {
		const candidate = new Date(today.getFullYear(), today.getMonth(), f.expectedDay);
		if (candidate < today) candidate.setMonth(candidate.getMonth() + 1);
		return {
			source: f,
			date: candidate
		};
	}).sort((a, b) => a.date.getTime() - b.date.getTime())[0];
	if (!next) return {
		nextIncome: null,
		nextDate: null,
		fixedDue: 0,
		debtsDue: 0,
		totalDue: 0,
		balanceAfter: saldoAtual
	};
	const fixedDue = transacoes.filter((t) => t.kind === "despesa" && t.status !== "pago" && t.dueDate && /* @__PURE__ */ new Date(t.dueDate + "T00:00:00") >= today && /* @__PURE__ */ new Date(t.dueDate + "T00:00:00") <= next.date).reduce((s, t) => s + t.valor, 0);
	const debtsDue = dividas.filter((d) => {
		if (d.statusThisMonth === "pago") return false;
		if (!d.dueDay) return false;
		const dueThis = new Date(today.getFullYear(), today.getMonth(), d.dueDay);
		if (dueThis < today) dueThis.setMonth(dueThis.getMonth() + 1);
		return dueThis <= next.date;
	}).reduce((s, d) => s + d.valorParcela, 0);
	const totalDue = fixedDue + debtsDue;
	return {
		nextIncome: next.source,
		nextDate: next.date,
		fixedDue,
		debtsDue,
		totalDue,
		balanceAfter: saldoAtual - totalDue
	};
}
//#endregion
export { projectUntilNextIncome as a, formatBRLFull as i, buildProjection as n, useFinance as o, formatBRL as r, FinanceProvider as t };
