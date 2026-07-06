import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-C9XWVt39.mjs";
import { D as CreditCard, a as User, p as Plus } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
import { i as installmentStatus, n as INSTALLMENT_STATUS_LABEL, r as ParcelasList, t as INSTALLMENT_STATUS_CLASS } from "./ParcelasList-CEXBPkg7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cartoes-D791RPty.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartoesPage() {
	const { cartoes, faturas, transacoes, pessoas, contas, addCreditCard, pagarFatura, estornarFatura } = useFinance();
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	const [confirmPay, setConfirmPay] = (0, import_react.useState)(null);
	const [openGroup, setOpenGroup] = (0, import_react.useState)(null);
	const pessoasById = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		pessoas.forEach((p) => m.set(p.id, p.name));
		return m;
	}, [pessoas]);
	const faturasPorCartao = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		faturas.forEach((f) => {
			const arr = m.get(f.creditCardId) ?? [];
			arr.push(f);
			m.set(f.creditCardId, arr);
		});
		return m;
	}, [faturas]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Cartões",
		subtitle: "Faturas, parcelas e pagamentos",
		hidePeriodFilter: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setShowNew(true),
				className: "mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo cartão"]
			}),
			cartoes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-card p-8 text-center shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold",
						children: "Nenhum cartão ainda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Cadastre para começar a lançar compras parceladas."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: cartoes.filter((c) => c.active).map((cc) => {
					const cardInvoices = (faturasPorCartao.get(cc.id) ?? []).slice(0, 6);
					const conta = contas.find((c) => c.id === cc.paymentAccountId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
								className: "mb-3 flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-semibold text-foreground",
									children: cc.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"Fecha dia ",
										cc.closingDay,
										" · Vence dia ",
										cc.dueDay,
										conta ? ` · Pgto: ${conta.nome}` : ""
									]
								})] })
							}),
							cardInvoices.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-xl bg-surface-elevated px-3 py-2 text-xs text-muted-foreground",
								children: "Nenhuma fatura registrada ainda."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: cardInvoices.map((inv) => {
									const items = transacoes.filter((t) => t.invoiceId === inv.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
										className: "rounded-2xl bg-surface-elevated open:ring-1 open:ring-primary/30",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
												className: "flex cursor-pointer items-center justify-between px-3 py-2.5 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: (/* @__PURE__ */ new Date(inv.referenceMonth + "T00:00:00")).toLocaleDateString("pt-BR", {
														month: "long",
														year: "numeric"
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusFaturaClass(inv.status)}`,
														children: inv.status
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "tabular-nums font-semibold",
														children: formatBRLFull(inv.total)
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
												className: "space-y-1 px-3 pb-3",
												children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
													className: "rounded-lg bg-card px-2 py-1.5 text-xs text-muted-foreground",
													children: "Sem lançamentos."
												}), items.map((t) => {
													const st = installmentStatus(t.paidAt, t.dueDate);
													const nomePessoa = t.personId ? pessoasById.get(t.personId) : null;
													const clickable = !!t.purchaseGroupId;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
														className: `rounded-lg bg-card px-2 py-2 text-xs ${clickable ? "cursor-pointer hover:ring-1 hover:ring-primary/30" : ""}`,
														onClick: clickable ? () => setOpenGroup(t.purchaseGroupId) : void 0,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "min-w-0 flex-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "truncate font-medium text-foreground",
																	children: t.descricao
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: `rounded px-1.5 py-0.5 ${INSTALLMENT_STATUS_CLASS[st]}`,
																			children: INSTALLMENT_STATUS_LABEL[st]
																		}),
																		nomePessoa && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-primary",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-2.5 w-2.5" }),
																				" ",
																				nomePessoa
																			]
																		}),
																		t.installmentTotal && t.installmentNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
																			t.installmentNumber,
																			"/",
																			t.installmentTotal
																		] }),
																		clickable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "text-primary",
																			children: "· ver parcelas"
																		})
																	]
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums font-semibold",
																children: formatBRLFull(t.valor)
															})]
														})
													}, t.id);
												})]
											}),
											(inv.status === "aberta" || inv.status === "fechada") && inv.total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "border-t border-border/60 px-3 py-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setConfirmPay(inv.id),
													className: "w-full rounded-lg bg-gradient-primary py-2 text-xs font-bold text-primary-foreground",
													children: [
														"Pagar fatura (",
														formatBRLFull(inv.total),
														")"
													]
												})
											}),
											inv.status === "paga" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "border-t border-border/60 px-3 py-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => estornarFatura(inv.id),
													className: "w-full rounded-lg bg-secondary py-2 text-xs font-semibold text-foreground",
													children: "Estornar fatura"
												})
											})
										]
									}, inv.id);
								})
							})
						]
					}, cc.id);
				})
			}),
			showNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCardDialog, {
				contas: contas.map((c) => ({
					id: c.id,
					nome: c.nome
				})),
				onClose: () => setShowNew(false),
				onSave: async (v) => {
					await addCreditCard(v);
					setShowNew(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!confirmPay,
				title: "Pagar fatura?",
				confirmLabel: "Pagar",
				onClose: () => setConfirmPay(null),
				onConfirm: async () => {
					if (confirmPay) await pagarFatura(confirmPay);
				}
			}),
			openGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParcelasList, {
				groupId: openGroup,
				onClose: () => setOpenGroup(null)
			})
		]
	});
}
function statusFaturaClass(s) {
	if (s === "paga") return "bg-success/15 text-success";
	if (s === "fechada") return "bg-warning/15 text-warning";
	if (s === "aberta") return "bg-primary/15 text-primary";
	return "bg-muted text-muted-foreground";
}
function NewCardDialog({ contas, onClose, onSave }) {
	const [name, setName] = (0, import_react.useState)("");
	const [closingDay, setClosingDay] = (0, import_react.useState)("1");
	const [dueDay, setDueDay] = (0, import_react.useState)("10");
	const [paymentAccountId, setPaymentAccountId] = (0, import_react.useState)("");
	const [creditLimit, setCreditLimit] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!name || saving) return;
		setSaving(true);
		try {
			await onSave({
				name,
				closingDay: Number(closingDay),
				dueDay: Number(dueDay),
				paymentAccountId: paymentAccountId || null,
				creditLimit: creditLimit ? parseFloat(creditLimit.replace(",", ".")) : null
			});
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "w-full max-w-md space-y-3 rounded-3xl bg-card p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Novo cartão"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Nome (ex: Nubank)",
					className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: closingDay,
						onChange: (e) => setClosingDay(e.target.value.replace(/\D/g, "")),
						placeholder: "Dia de fechamento",
						inputMode: "numeric",
						className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: dueDay,
						onChange: (e) => setDueDay(e.target.value.replace(/\D/g, "")),
						placeholder: "Dia de vencimento",
						inputMode: "numeric",
						className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: paymentAccountId,
					onChange: (e) => setPaymentAccountId(e.target.value),
					className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Conta de pagamento (opcional)"
					}), contas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.nome
					}, c.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: creditLimit,
					onChange: (e) => setCreditLimit(e.target.value),
					placeholder: "Limite (opcional)",
					inputMode: "decimal",
					className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex-1 rounded-xl bg-secondary py-2.5 text-sm font-semibold",
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: saving,
						className: "flex-1 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50",
						children: "Salvar"
					})]
				})
			]
		})
	});
}
//#endregion
export { CartoesPage as component };
