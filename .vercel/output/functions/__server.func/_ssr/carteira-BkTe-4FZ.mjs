import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-DtGAnrm7.mjs";
import { n as X, p as Plus, r as Wallet } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-C8xxjcGv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/carteira-BkTe-4FZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIPOS = [
	"Conta Corrente",
	"Poupança",
	"Dinheiro",
	"Cartão de Crédito"
];
function Carteira() {
	const { contas, saldoReal, addAccount } = useFinance();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [nome, setNome] = (0, import_react.useState)("");
	const [tipo, setTipo] = (0, import_react.useState)("Conta Corrente");
	const [saldo, setSaldo] = (0, import_react.useState)("");
	const [emoji, setEmoji] = (0, import_react.useState)("🏦");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const submit = async (e) => {
		e.preventDefault();
		if (!nome.trim() || saving) return;
		setSaving(true);
		setError(null);
		try {
			await addAccount({
				nome: nome.trim(),
				tipo,
				saldoInicial: Number(saldo.replace(",", ".")) || 0,
				emoji
			});
			setOpen(false);
			setNome("");
			setSaldo("");
			setEmoji("🏦");
			setTipo("Conta Corrente");
		} catch (err) {
			setError(err?.message ?? "Erro ao salvar");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Carteira",
		subtitle: "Saldo real, calculado dos lançamentos pagos",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider opacity-80",
							children: "Saldo geral"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 opacity-80" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-3xl font-bold tabular-nums",
						children: formatBRLFull(saldoReal)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs opacity-80",
						children: [contas.length, " contas · atualiza a cada pagamento marcado"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Minhas contas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpen(true),
						className: "flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Conta"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: contas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${c.cor}`,
								children: c.emoji
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold text-foreground",
									children: c.nome
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										c.tipo,
										" · inicial ",
										formatBRLFull(c.saldoInicial)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-base font-bold tabular-nums ${c.saldo < 0 ? "text-destructive" : "text-foreground"}`,
								children: formatBRLFull(c.saldo)
							})
						]
					}, c.id))
				})]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4",
				onClick: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onClick: (e) => e.stopPropagation(),
					onSubmit: submit,
					className: "w-full max-w-md space-y-4 rounded-t-3xl bg-card p-5 shadow-card sm:rounded-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: "Nova conta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setOpen(false),
								"aria-label": "Fechar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-muted-foreground" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: nome,
								onChange: (e) => setNome(e.target.value),
								placeholder: "Ex: Nubank",
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Tipo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: tipo,
									onChange: (e) => setTipo(e.target.value),
									className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
									children: TIPOS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t,
										children: t
									}, t))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Saldo inicial"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "decimal",
									value: saldo,
									onChange: (e) => setSaldo(e.target.value.replace(/[^\d.,]/g, "")),
									placeholder: "0,00",
									className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm tabular-nums outline-none"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Emoji"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: emoji,
								onChange: (e) => setEmoji(e.target.value),
								maxLength: 2,
								className: "w-16 rounded-xl bg-surface-elevated px-3 py-2.5 text-center text-lg outline-none"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: saving || !nome.trim(),
							className: "w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50",
							children: saving ? "Salvando..." : "Criar conta"
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Carteira as component };
