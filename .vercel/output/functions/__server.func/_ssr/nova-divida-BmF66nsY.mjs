import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as useFinance } from "./finance-store-DtGAnrm7.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as HandCoins, E as Landmark, O as CreditCard, P as Check } from "../_libs/lucide-react.mjs";
import { n as cn, t as AppShell } from "./AppShell-C8xxjcGv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nova-divida-BmF66nsY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tipos = [
	{
		label: "Cartão de Crédito",
		icon: CreditCard
	},
	{
		label: "Empréstimo",
		icon: HandCoins
	},
	{
		label: "Financiamento",
		icon: Landmark
	}
];
function NovaDivida() {
	const { criarDividaCompromisso } = useFinance();
	const navigate = useNavigate();
	const [nome, setNome] = (0, import_react.useState)("");
	const [valor, setValor] = (0, import_react.useState)("");
	const [parcelas, setParcelas] = (0, import_react.useState)("");
	const [tipo, setTipo] = (0, import_react.useState)("Cartão de Crédito");
	const [category, setCategory] = (0, import_react.useState)("parcelada");
	const [dueDay, setDueDay] = (0, import_react.useState)("10");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const isFixed = category === "fixa";
	const canSubmit = nome.trim() && Number(valor) > 0 && (isFixed || Number(parcelas) > 0);
	function calcFirstDueDate() {
		const today = /* @__PURE__ */ new Date();
		const day = dueDay ? Number(dueDay) : 10;
		const year = today.getFullYear();
		const month = today.getMonth();
		const candidate = new Date(year, month, day);
		if (candidate < today) candidate.setMonth(candidate.getMonth() + 1);
		return candidate.toISOString().slice(0, 10);
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (!canSubmit || saving) return;
		setSaving(true);
		setError(null);
		try {
			await criarDividaCompromisso({
				nome: nome.trim(),
				tipo,
				valorParcela: Number(valor.replace(",", ".")),
				parcelas: isFixed ? 1 : Number(parcelas),
				firstDueDate: calcFirstDueDate(),
				category
			});
			navigate({ to: "/minhas-dividas" });
		} catch (err) {
			setError(err?.message ?? "Erro ao salvar");
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Nova dívida",
		subtitle: "Adicione em poucos toques.",
		hidePeriodFilter: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "O que é?",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: nome,
						onChange: (e) => setNome(e.target.value),
						placeholder: "Ex: Fatura Nubank",
						className: "w-full rounded-2xl bg-surface px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Valor da parcela",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
								children: "R$"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: valor,
								onChange: (e) => setValor(e.target.value.replace(/[^\d.,]/g, "")),
								placeholder: "0",
								className: "w-full rounded-2xl bg-surface py-3.5 pl-10 pr-3 text-base text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: isFixed ? "Parcelas (n/a)" : "Parcelas restantes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "numeric",
							value: isFixed ? "" : parcelas,
							disabled: isFixed,
							onChange: (e) => setParcelas(e.target.value.replace(/\D/g, "")),
							placeholder: isFixed ? "—" : "12",
							className: "w-full rounded-2xl bg-surface px-4 py-3.5 text-base text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-primary disabled:opacity-50"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Categoria",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							{
								key: "parcelada",
								label: "Parcelada"
							},
							{
								key: "variavel",
								label: "Variável"
							},
							{
								key: "fixa",
								label: "Fixa"
							},
							{
								key: "congelada",
								label: "Congelada"
							}
						].map((c) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCategory(c.key),
								className: cn("rounded-2xl px-3 py-2.5 text-sm font-semibold ring-1 transition-all", category === c.key ? "bg-primary/15 text-primary ring-primary/40" : "bg-surface text-muted-foreground ring-border"),
								children: c.label
							}, c.key);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Dia do vencimento",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						inputMode: "numeric",
						value: dueDay,
						onChange: (e) => setDueDay(e.target.value.replace(/\D/g, "").slice(0, 2)),
						placeholder: "10",
						className: "w-full rounded-2xl bg-surface px-4 py-3.5 text-base text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tipo",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: tipos.map(({ label, icon: Icon }) => {
							const active = tipo === label;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTipo(label),
								className: cn("inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all", active ? "bg-primary text-primary-foreground shadow-glow" : "bg-surface text-muted-foreground ring-1 ring-border hover:text-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
									label,
									active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
								]
							}, label);
						})
					})
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: !canSubmit || saving,
					className: "mt-4 w-full rounded-2xl bg-gradient-primary px-5 py-4 text-base font-semibold text-primary-foreground shadow-glow disabled:opacity-40",
					children: saving ? "Salvando..." : "Salvar projeção"
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { NovaDivida as component };
