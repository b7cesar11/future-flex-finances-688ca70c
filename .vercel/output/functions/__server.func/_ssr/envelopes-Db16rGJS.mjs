import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-C9XWVt39.mjs";
import { V as TriangleAlert, _ as Pencil, l as Trash2, p as Plus, v as Package } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/envelopes-Db16rGJS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EnvelopesPage() {
	const { envelopes, envelopesCommitted, addEnvelope, updateEnvelope, deleteEnvelope } = useFinance();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [emoji, setEmoji] = (0, import_react.useState)("📦");
	const [limit, setLimit] = (0, import_react.useState)("");
	const totalLimit = envelopes.reduce((s, e) => s + e.monthlyLimit, 0);
	const totalSpent = envelopes.reduce((s, e) => s + e.currentSpent, 0);
	const resetForm = () => {
		setName("");
		setEmoji("📦");
		setLimit("");
	};
	const startEdit = (id) => {
		const env = envelopes.find((e) => e.id === id);
		if (!env) return;
		setEditing(id);
		setName(env.name);
		setEmoji(env.emoji);
		setLimit(String(env.monthlyLimit));
		setOpen(true);
	};
	const submit = async (e) => {
		e.preventDefault();
		const v = parseFloat(limit.replace(",", "."));
		if (!name.trim() || !v) return;
		if (editing) await updateEnvelope(editing, {
			name: name.trim(),
			emoji,
			monthlyLimit: v
		});
		else await addEnvelope({
			name: name.trim(),
			emoji,
			monthlyLimit: v
		});
		setOpen(false);
		setEditing(null);
		resetForm();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Envelopes",
		subtitle: "Reserve parte do salário para cada categoria",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wide opacity-80",
						children: "Comprometido em envelopes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-3xl font-bold tabular-nums",
						children: formatBRLFull(envelopesCommitted)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] opacity-80",
						children: [
							"Reservas ativas · Limite mensal total ",
							formatBRLFull(totalLimit),
							" · Já gasto",
							" ",
							formatBRLFull(totalSpent)
						]
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-5 space-y-3 rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: editing ? "Editar envelope" : "Novo envelope"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[64px_1fr] gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: emoji,
							onChange: (e) => setEmoji(e.target.value.slice(0, 2)),
							className: "rounded-xl bg-surface-elevated px-3 py-2.5 text-center text-lg outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Nome (ex: Comida)",
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: limit,
						onChange: (e) => setLimit(e.target.value),
						inputMode: "decimal",
						placeholder: "Limite mensal (ex: 120)",
						className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setOpen(false);
								setEditing(null);
								resetForm();
							},
							className: "flex-1 rounded-xl bg-secondary py-2 text-sm font-semibold text-muted-foreground",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "flex-1 rounded-xl bg-gradient-primary py-2 text-sm font-bold text-primary-foreground shadow-glow",
							children: "Salvar"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-5 space-y-3",
				children: [envelopes.length === 0 && !open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-3xl bg-card p-8 text-center shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-semibold text-foreground",
							children: "Nenhum envelope ainda"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Reserve parte do salário para \"Comida\", \"Combustível\" etc."
						})
					]
				}), envelopes.map((e) => {
					const pct = e.monthlyLimit ? Math.min(100, Math.round(e.currentSpent / e.monthlyLimit * 100)) : 0;
					const over = e.currentSpent > e.monthlyLimit;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-lg",
										children: e.emoji
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold text-foreground",
											children: e.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Restante ",
												formatBRLFull(Math.max(0, e.remaining)),
												" · Reservado",
												" ",
												formatBRLFull(e.committed)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Editar",
										onClick: () => startEdit(e.id),
										className: "text-muted-foreground hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Excluir",
										onClick: () => setConfirmDel(e.id),
										className: "text-muted-foreground hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center justify-between text-[11px] tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										formatBRLFull(e.currentSpent),
										" / ",
										formatBRLFull(e.monthlyLimit)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: over ? "font-bold text-destructive" : "text-muted-foreground",
									children: [pct, "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full ${over ? "bg-destructive" : "bg-primary"}`,
									style: { width: `${pct}%` }
								})
							}),
							over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 flex items-center gap-1.5 rounded-xl bg-destructive/10 px-2.5 py-1.5 text-[11px] font-semibold text-destructive",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }),
									" Limite de ",
									e.name,
									" excedido"
								]
							})
						]
					}, e.id);
				})]
			}),
			!open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen(true),
				className: "fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!confirmDel,
				title: "Excluir envelope?",
				description: "Transações associadas continuarão existindo, mas sem envelope.",
				destructive: true,
				confirmLabel: "Excluir",
				onClose: () => setConfirmDel(null),
				onConfirm: async () => {
					if (confirmDel) await deleteEnvelope(confirmDel);
				}
			})
		]
	});
}
//#endregion
export { EnvelopesPage as component };
