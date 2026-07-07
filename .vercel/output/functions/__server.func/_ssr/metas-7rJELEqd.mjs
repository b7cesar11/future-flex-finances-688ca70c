import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance, r as formatBRL } from "./finance-store-764EgLaW.mjs";
import { h as PiggyBank, l as Trash2, p as Plus, u as Target } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ProgressBar } from "./ProgressBar-BHoOan-c.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metas-7rJELEqd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MetasPage() {
	const { metas, saldoReal, caixinhasTotal, contas, addGoal, contributeToGoal, deleteGoal } = useFinance();
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	const [depositTarget, setDepositTarget] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Caixinhas",
		subtitle: "Reserve por objetivo — deduz do saldo real",
		hidePeriodFilter: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider opacity-80",
							children: "Guardado nas caixinhas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "h-5 w-5 opacity-80" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-3xl font-bold tabular-nums",
						children: formatBRLFull(caixinhasTotal)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs opacity-80",
						children: ["Saldo real disponível: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatBRLFull(saldoReal) })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold text-foreground",
					children: "Minhas metas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowNew(true),
					className: "flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Nova meta"]
				})]
			}),
			metas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-3xl border border-dashed border-border p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "mx-auto mb-2 h-6 w-6 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground",
						children: "Nenhuma caixinha ainda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Crie uma para viagem, reserva ou entrada do imóvel."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: metas.map((m) => {
					const pct = m.valorTotal > 0 ? Math.round(m.valorAtual / m.valorTotal * 100) : 0;
					const restante = Math.max(0, m.valorTotal - m.valorAtual);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-3xl bg-card p-4 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-2xl",
										children: m.emoji
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold text-foreground",
											children: m.nome
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Faltam ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: formatBRL(restante)
												}),
												m.aporteMensal > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													" ",
													"· aporte ",
													formatBRL(m.aporteMensal),
													"/mês"
												] })
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDeleteTarget({
										id: m.id,
										nome: m.nome
									}),
									className: "flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive",
									"aria-label": "Excluir",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
								value: pct,
								size: "sm",
								label: `${formatBRL(m.valorAtual)} / ${formatBRL(m.valorTotal)}`,
								rightLabel: `${pct}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDepositTarget({
									id: m.id,
									nome: m.nome
								}),
								className: "mt-3 w-full rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground active:scale-[.98]",
								children: "Guardar dinheiro"
							})
						]
					}, m.id);
				})
			}),
			showNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewGoalModal, {
				onClose: () => setShowNew(false),
				onCreate: async (payload) => {
					await addGoal(payload);
					setShowNew(false);
				}
			}),
			depositTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositModal, {
				nome: depositTarget.nome,
				contas,
				onClose: () => setDepositTarget(null),
				onConfirm: async (amount, accountId) => {
					await contributeToGoal(depositTarget.id, amount, accountId);
					setDepositTarget(null);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!deleteTarget,
				title: "Excluir caixinha",
				description: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Isso remove a meta ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deleteTarget?.nome }),
					". Os lançamentos de \"Guardar\" permanecem no histórico."
				] }),
				destructive: true,
				confirmLabel: "Excluir",
				onClose: () => setDeleteTarget(null),
				onConfirm: async () => {
					if (deleteTarget) await deleteGoal(deleteTarget.id);
				}
			})
		]
	});
}
function NewGoalModal({ onClose, onCreate }) {
	const [nome, setNome] = (0, import_react.useState)("");
	const [emoji, setEmoji] = (0, import_react.useState)("🎯");
	const [valorTotal, setValorTotal] = (0, import_react.useState)("");
	const [aporte, setAporte] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async () => {
		if (!nome.trim() || !valorTotal) return;
		setBusy(true);
		try {
			await onCreate({
				nome: nome.trim(),
				emoji: emoji || "🎯",
				valorTotal: Number(valorTotal),
				aporteMensal: aporte ? Number(aporte) : 0
			});
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] flex items-end justify-center p-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Fechar",
			className: "absolute inset-0 bg-black/70",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-base font-semibold",
					children: "Nova caixinha"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-[11px] uppercase text-muted-foreground",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: nome,
								onChange: (e) => setNome(e.target.value),
								placeholder: "Viagem, reserva, entrada...",
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[80px_1fr] gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-[11px] uppercase text-muted-foreground",
									children: "Emoji"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: emoji,
									onChange: (e) => setEmoji(e.target.value),
									className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-center text-lg outline-none ring-1 ring-border focus:ring-primary"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-[11px] uppercase text-muted-foreground",
									children: "Objetivo (R$)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "decimal",
									value: valorTotal,
									onChange: (e) => setValorTotal(e.target.value),
									placeholder: "5000",
									className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-[11px] uppercase text-muted-foreground",
								children: "Aporte mensal sugerido (opcional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: aporte,
								onChange: (e) => setAporte(e.target.value),
								placeholder: "500",
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy || !nome.trim() || !valorTotal,
						onClick: submit,
						className: "flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40",
						children: busy ? "..." : "Criar"
					})]
				})
			]
		})]
	});
}
function DepositModal({ nome, contas, onClose, onConfirm }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [accountId, setAccountId] = (0, import_react.useState)(contas[0]?.id ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async () => {
		const v = Number(amount);
		if (!v || v <= 0) return;
		setBusy(true);
		try {
			await onConfirm(v, accountId || null);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] flex items-end justify-center p-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Fechar",
			className: "absolute inset-0 bg-black/70",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "mb-1 text-base font-semibold",
					children: [
						"Guardar em \"",
						nome,
						"\""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-xs text-muted-foreground",
					children: "Cria uma saída no caixa e credita na caixinha."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-[11px] uppercase text-muted-foreground",
							children: "Valor (R$)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							inputMode: "decimal",
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							placeholder: "200",
							className: "w-full rounded-xl bg-surface-elevated px-3 py-3 text-lg font-semibold outline-none ring-1 ring-border focus:ring-primary"
						})]
					}), contas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-[11px] uppercase text-muted-foreground",
							children: "De qual conta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: accountId,
							onChange: (e) => setAccountId(e.target.value),
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-primary",
							children: contas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.nome
							}, c.id))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy || !amount,
						onClick: submit,
						className: "flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40",
						children: busy ? "..." : "Guardar"
					})]
				})
			]
		})]
	});
}
//#endregion
export { MetasPage as component };
