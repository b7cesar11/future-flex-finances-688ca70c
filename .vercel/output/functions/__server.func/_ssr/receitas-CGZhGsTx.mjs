import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-C9XWVt39.mjs";
import { F as CalendarClock, l as Trash2, p as Plus } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
import { t as PayCheckbox } from "./PayCheckbox-BiXeFJkl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receitas-CGZhGsTx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Receitas() {
	const { fontesRenda, contas, addIncomeSource, setIncomeStatus, deleteIncomeSource } = useFinance();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [day, setDay] = (0, import_react.useState)("5");
	const [accountId, setAccountId] = (0, import_react.useState)(contas[0]?.id ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(null);
	const total = fontesRenda.reduce((s, f) => s + f.amount, 0);
	const submit = async (e) => {
		e.preventDefault();
		if (!name || !amount || saving) return;
		setSaving(true);
		try {
			await addIncomeSource({
				name,
				amount: parseFloat(amount.replace(",", ".")),
				expectedDay: Number(day),
				accountId: accountId || null
			});
			setName("");
			setAmount("");
			setOpen(false);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Fontes de renda",
		subtitle: "Salários, VA e outros recebimentos",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl bg-card p-4 shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase text-muted-foreground",
						children: "Previsto/mês"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl font-bold tabular-nums text-primary",
						children: formatBRLFull(total)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpen(true),
						className: "flex items-center gap-1 rounded-full bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Nova"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 space-y-2",
				children: [fontesRenda.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
					children: "Nenhuma fonte cadastrada. Adicione seu Salário, VA, etc."
				}), fontesRenda.map((f) => {
					const recebido = f.status === "recebido";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card ${!recebido ? "ring-1 ring-warning/30" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayCheckbox, {
								paid: recebido,
								onToggle: () => setIncomeStatus(f.id, recebido ? "pendente" : "recebido"),
								ariaLabel: "Marcar como recebido"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-foreground",
									children: f.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: ["Dia ", f.expectedDay]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold tabular-nums text-primary",
								children: formatBRLFull(f.amount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Excluir",
								onClick: () => setConfirmDel(f.id),
								className: "text-muted-foreground hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					}, f.id);
				})]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Fechar",
					className: "absolute inset-0 bg-black/60",
					onClick: () => setOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "relative mx-auto w-full max-w-md space-y-3 rounded-t-3xl bg-card p-5 pb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Nova fonte de renda"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Nome (Salário, VA, etc.)",
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								inputMode: "decimal",
								placeholder: "Valor",
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: day,
								onChange: (e) => setDay(e.target.value.replace(/\D/g, "").slice(0, 2)),
								inputMode: "numeric",
								placeholder: "Dia",
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: accountId,
							onChange: (e) => setAccountId(e.target.value),
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Sem conta vinculada"
							}), contas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.nome
							}, c.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: saving,
							className: "w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50",
							children: saving ? "Salvando..." : "Salvar"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!confirmDel,
				title: "Excluir fonte de renda?",
				destructive: true,
				confirmLabel: "Excluir",
				onClose: () => setConfirmDel(null),
				onConfirm: async () => {
					if (confirmDel) await deleteIncomeSource(confirmDel);
				}
			})
		]
	});
}
//#endregion
export { Receitas as component };
