import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance, r as formatBRL } from "./finance-store-j9CZbuwX.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChevronRight, D as CreditCard, E as HandCoins, M as Check, T as Landmark, _ as Pencil, d as Snowflake, f as Repeat, l as Trash2, n as X, p as Plus, t as Zap } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ProgressBar } from "./ProgressBar-BHoOan-c.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
import { r as ParcelasList } from "./ParcelasList-4fro1req.mjs";
import { t as PayCheckbox } from "./PayCheckbox-BiXeFJkl.mjs";
import { t as OverdueBadge } from "./OverdueBadge-DxIA_cEE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/minhas-dividas-CPBZejSm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var iconFor = {
	"Cartão de Crédito": CreditCard,
	Empréstimo: HandCoins,
	Financiamento: Landmark
};
var TABS = [
	{
		key: "fixa",
		label: "Fixas",
		icon: Zap
	},
	{
		key: "parcelamentos",
		label: "Parcelas / Variáveis",
		icon: Repeat
	},
	{
		key: "congelada",
		label: "Congeladas",
		icon: Snowflake
	}
];
function catMatches(d, tab) {
	if (tab === "fixa") return d.category === "fixa";
	if (tab === "congelada") return d.category === "congelada";
	return d.category === "parcelada" || d.category === "variavel";
}
function dueDateOfMonth(dueDay) {
	if (!dueDay) return null;
	const now = /* @__PURE__ */ new Date();
	return new Date(now.getFullYear(), now.getMonth(), dueDay).toISOString().slice(0, 10);
}
function MinhasDividas() {
	const { dividas, contas, pagarParcela, estornarParcela, updateDebtInstallment, deleteDebt } = useFinance();
	const [tab, setTab] = (0, import_react.useState)("parcelamentos");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [editValue, setEditValue] = (0, import_react.useState)("");
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(null);
	const [variableModal, setVariableModal] = (0, import_react.useState)(null);
	const [variableAmount, setVariableAmount] = (0, import_react.useState)("");
	const [variableAccount, setVariableAccount] = (0, import_react.useState)("");
	const [openGroup, setOpenGroup] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => dividas.filter((d) => catMatches(d, tab)), [dividas, tab]);
	const activeTotal = filtered.filter((d) => d.category !== "congelada").reduce((s, d) => s + d.valorParcela, 0);
	const openVariable = (d) => {
		setVariableModal(d);
		setVariableAmount(String(d.valorParcela));
		setVariableAccount(contas[0]?.id ?? "");
	};
	const confirmVariable = async () => {
		if (!variableModal?.currentInstallmentTxId) return;
		if (!(parseFloat(variableAmount.replace(",", ".")) > 0)) return;
		await pagarParcela(variableModal.currentInstallmentTxId);
		setVariableModal(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Minhas dívidas",
		subtitle: `${filtered.length} nesta aba · ${formatBRL(activeTotal)}/mês`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-1 rounded-2xl bg-card p-1 shadow-card",
				children: TABS.map((t) => {
					const active = tab === t.key;
					const Icon = t.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab(t.key),
						className: `flex flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors ${active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), t.label]
					}, t.key);
				})
			}),
			tab === "congelada" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 rounded-2xl bg-accent/10 px-3 py-2 text-[11px] text-accent",
				children: "Dívidas em negociação — não afetam o fluxo de caixa nem o dashboard executivo."
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: filtered.map((d) => {
					const pagas = d.parcelasTotais - d.parcelasRestantes;
					const pct = d.parcelasTotais > 0 ? pagas / d.parcelasTotais * 100 : 0;
					const Icon = iconFor[d.tipo];
					const pago = d.statusThisMonth === "pago";
					const isEditing = editing === d.id;
					const canPay = d.category !== "congelada";
					const dueISO = dueDateOfMonth(d.dueDay);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [
								canPay && d.commitmentGroupId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setOpenGroup(d.commitmentGroupId),
									className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground transition-transform active:scale-95",
									"aria-label": "Ver parcelas",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}) : canPay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayCheckbox, {
									paid: pago,
									onToggle: async () => {
										if (!d.currentInstallmentTxId) return;
										if (pago) await estornarParcela(d.currentInstallmentTxId);
										else if (d.category === "variavel") openVariable(d);
										else await pagarParcela(d.currentInstallmentTxId);
									},
									ariaLabel: "Alternar parcela paga"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `min-w-0 flex-1${d.commitmentGroupId ? " cursor-pointer" : ""}`,
									onClick: d.commitmentGroupId ? () => setOpenGroup(d.commitmentGroupId) : void 0,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-base font-semibold text-foreground",
													children: d.nome
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverdueBadge, {
													dueDate: dueISO,
													status: d.statusThisMonth
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													d.tipo,
													" · ",
													labelForCategory(d.category),
													d.dueDay ? ` · venc dia ${d.dueDay}` : ""
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 text-right",
											children: isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														autoFocus: true,
														inputMode: "decimal",
														value: editValue,
														onChange: (e) => setEditValue(e.target.value.replace(/[^\d.,]/g, "")),
														className: "w-20 rounded-lg bg-surface-elevated px-2 py-1 text-sm tabular-nums outline-none ring-1 ring-primary"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Salvar",
														onClick: async () => {
															const v = parseFloat(editValue.replace(",", "."));
															if (v > 0) await updateDebtInstallment(d.id, v);
															setEditing(null);
														},
														className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Cancelar",
														onClick: () => setEditing(null),
														className: "flex h-7 w-7 items-center justify-center rounded-lg bg-secondary",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
													})
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-base font-bold tabular-nums text-foreground",
														children: [formatBRL(d.valorParcela), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-normal text-muted-foreground",
															children: "/mês"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Editar parcela",
														onClick: () => {
															setEditing(d.id);
															setEditValue(String(d.valorParcela));
														},
														className: "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Excluir",
														onClick: () => setConfirmDelete(d.id),
														className: "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											})
										})]
									}), d.category === "parcelada" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
											value: pct,
											size: "sm",
											label: `${pagas} de ${d.parcelasTotais} parcelas pagas`,
											rightLabel: `Faltam ${d.parcelasRestantes}`
										})
									})]
								}),
								d.commitmentGroupId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 shrink-0 text-muted-foreground" })
							]
						})
					}, d.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/nova-divida",
				className: "fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nova"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!confirmDelete,
				title: "Excluir dívida?",
				description: "Esta dívida será removida permanentemente.",
				destructive: true,
				confirmLabel: "Excluir",
				onClose: () => setConfirmDelete(null),
				onConfirm: async () => {
					if (confirmDelete) await deleteDebt(confirmDelete);
				}
			}),
			variableModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Fechar",
					onClick: () => setVariableModal(null),
					className: "absolute inset-0 bg-black/60"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto w-full max-w-md rounded-t-3xl border-t border-border bg-card p-5 pb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold text-foreground",
							children: "Qual o valor cobrado neste mês?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [variableModal.nome, " · valor variável — não altera o contrato original."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-[11px] uppercase text-muted-foreground",
								children: "Valor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
									children: "R$"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									inputMode: "decimal",
									value: variableAmount,
									onChange: (e) => setVariableAmount(e.target.value.replace(/[^\d.,]/g, "")),
									className: "w-full rounded-2xl bg-surface-elevated py-3 pl-9 pr-3 text-base outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
								})]
							})]
						}),
						contas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-[11px] uppercase text-muted-foreground",
								children: "Conta debitada"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: variableAccount,
								onChange: (e) => setVariableAccount(e.target.value),
								className: "w-full rounded-2xl bg-surface-elevated px-3 py-3 text-sm outline-none",
								children: contas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [
										c.emoji,
										" ",
										c.nome,
										" · ",
										formatBRLFull(c.saldo)
									]
								}, c.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setVariableModal(null),
								className: "flex-1 rounded-2xl bg-secondary py-3 text-sm font-semibold text-foreground",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: confirmVariable,
								className: "flex-1 rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground",
								children: "Confirmar"
							})]
						})
					]
				})]
			}),
			openGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParcelasList, {
				groupId: openGroup,
				groupType: "commitment",
				onClose: () => setOpenGroup(null)
			})
		]
	});
}
function labelForCategory(c) {
	return c === "fixa" ? "Fixa" : c === "variavel" ? "Variável" : c === "congelada" ? "Congelada" : "Parcelada";
}
function EmptyState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 rounded-3xl bg-card p-8 text-center shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base font-semibold text-foreground",
				children: "Nada por aqui"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Cadastre uma dívida ou mova outra para esta categoria."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/nova-divida",
				className: "mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Cadastrar dívida"]
			})
		]
	});
}
//#endregion
export { MinhasDividas as component };
