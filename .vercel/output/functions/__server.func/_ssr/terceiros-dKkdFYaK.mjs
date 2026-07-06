import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-C9XWVt39.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Check, S as ListOrdered, _ as Pencil, i as Users, l as Trash2, n as X, p as Plus } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
import { r as ParcelasList } from "./ParcelasList-CEXBPkg7.mjs";
import { t as PayCheckbox } from "./PayCheckbox-BiXeFJkl.mjs";
import { t as OverdueBadge } from "./OverdueBadge-DxIA_cEE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terceiros-dKkdFYaK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPE_LABEL = {
	emprestei_dinheiro: "Emprestei",
	usou_meu_cartao: "Usou meu cartão",
	devo_a_terceiro: "Devo"
};
/**
* Calcula o valor pendente real de um ThirdParty.
* - Se tiver purchaseGroupId: soma apenas as parcelas não pagas (paid_at IS NULL)
* - Se não tiver (lançamento avulso): usa t.amount quando status !== "pago"
*/
function pendingAmount(t, transacoes) {
	if (t.status === "pago") return 0;
	if (t.purchaseGroupId) return transacoes.filter((tx) => tx.purchaseGroupId === t.purchaseGroupId && tx.paidAt === null).reduce((s, tx) => s + tx.valor, 0);
	return t.amount;
}
/** Sinal: +1 = terceiro me deve; -1 = eu devo ao terceiro */
function signedPending(t, transacoes) {
	return (t.type === "devo_a_terceiro" ? -1 : 1) * pendingAmount(t, transacoes);
}
/** Informações de progresso para lançamentos parcelados */
function installmentProgress(t, transacoes) {
	if (!t.purchaseGroupId) return null;
	const parcelas = transacoes.filter((tx) => tx.purchaseGroupId === t.purchaseGroupId);
	if (parcelas.length === 0) return null;
	const paid = parcelas.filter((tx) => tx.paidAt !== null).length;
	return {
		total: parcelas.length,
		paid
	};
}
function Terceiros() {
	const { terceiros, cartoes, transacoes, setThirdPartyStatus, updateThirdParty, deleteThirdParty } = useFinance();
	const cartaoNome = (id) => id ? cartoes.find((c) => c.id === id)?.name : null;
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [editAmount, setEditAmount] = (0, import_react.useState)("");
	const [editDue, setEditDue] = (0, import_react.useState)("");
	const [openGroup, setOpenGroup] = (0, import_react.useState)(null);
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of terceiros) {
			const key = t.personId ?? `__name__${(t.personName || "—").trim()}`;
			if (!map.has(key)) map.set(key, {
				items: [],
				personId: t.personId
			});
			map.get(key).items.push(t);
		}
		return Array.from(map.entries()).map(([, v]) => ({
			name: (v.items[0].personName || "—").trim(),
			personId: v.personId,
			items: v.items.sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? "")),
			subtotal: v.items.reduce((s, t) => s + signedPending(t, transacoes), 0)
		})).sort((a, b) => a.name.localeCompare(b.name));
	}, [terceiros, transacoes]);
	const totalGeral = groups.reduce((s, g) => s + g.subtotal, 0);
	const startEdit = (t) => {
		setEditing(t.id);
		setEditAmount(String(t.amount));
		setEditDue(t.dueDate ?? "");
	};
	const saveEdit = async (id) => {
		const v = parseFloat(editAmount.replace(",", "."));
		await updateThirdParty(id, {
			amount: v > 0 ? v : void 0,
			dueDate: editDue || null
		});
		setEditing(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Terceiros",
		subtitle: "Empréstimos, cartão emprestado e dívidas com pessoas",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wide opacity-80",
						children: "Saldo consolidado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-3xl font-bold tabular-nums",
						children: [totalGeral >= 0 ? "+" : "−", formatBRLFull(Math.abs(totalGeral))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] opacity-80",
						children: totalGeral >= 0 ? "A receber de terceiros (líquido)" : "A pagar a terceiros (líquido)"
					})
				]
			}),
			terceiros.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-3xl bg-card p-8 text-center shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold text-foreground",
						children: "Nenhum registro ainda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Cadastre quem te deve ou para quem você deve."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/nova-transacao",
						search: {
							kind: "despesa",
							terceiro: true
						},
						className: "mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-4",
				children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [g.personId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contatos/$id",
								params: { id: g.personId },
								className: "truncate text-base font-semibold text-foreground underline-offset-2 hover:underline",
								children: g.name
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-base font-semibold text-foreground",
								children: g.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [g.items.length, " lançamento(s)"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wide text-muted-foreground",
								children: "Saldo devedor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `text-base font-bold tabular-nums ${g.subtotal >= 0 ? "text-success" : "text-destructive"}`,
								children: [g.subtotal >= 0 ? "+" : "−", formatBRLFull(Math.abs(g.subtotal))]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: g.items.map((t) => {
							const pago = t.status === "pago";
							const isEdit = editing === t.id;
							const progress = installmentProgress(t, transacoes);
							const pendente = pendingAmount(t, transacoes);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: `rounded-2xl bg-surface-elevated px-3 py-2.5 ${!pago ? "ring-1 ring-warning/25" : ""}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayCheckbox, {
											paid: pago,
											onToggle: () => setThirdPartyStatus(t.id, pago ? "pendente" : "pago"),
											ariaLabel: "Alternar pagamento"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate text-sm font-medium text-foreground",
														children: TYPE_LABEL[t.type]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverdueBadge, {
														dueDate: t.dueDate,
														status: t.status
													})]
												}),
												!isEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-muted-foreground",
													children: [
														t.dueDate ? `Venc ${(/* @__PURE__ */ new Date(t.dueDate + "T00:00:00")).toLocaleDateString("pt-BR")}` : "Sem vencimento",
														progress ? ` · ${progress.paid}/${progress.total} parcelas pagas` : t.isInstallment ? ` · ${t.installmentsLeft}x restantes` : "",
														cartaoNome(t.creditCardId) ? ` · 💳 ${cartaoNome(t.creditCardId)}` : ""
													]
												}), progress && progress.total > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1.5 h-1 w-full overflow-hidden rounded-full bg-border/40",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-full rounded-full bg-primary transition-all",
														style: { width: `${progress.paid / progress.total * 100}%` }
													})
												})] }),
												isEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 grid grid-cols-2 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														inputMode: "decimal",
														value: editAmount,
														onChange: (e) => setEditAmount(e.target.value.replace(/[^\d.,]/g, "")),
														placeholder: "Valor",
														className: "rounded-lg bg-card px-2 py-1 text-xs outline-none ring-1 ring-primary"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "date",
														value: editDue,
														onChange: (e) => setEditDue(e.target.value),
														className: "rounded-lg bg-card px-2 py-1 text-xs outline-none ring-1 ring-border"
													})]
												})
											]
										}),
										!isEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: `text-sm font-semibold tabular-nums ${!pago ? "" : "opacity-60"} ${t.type === "devo_a_terceiro" ? "text-destructive" : "text-success"}`,
													children: formatBRLFull(pago ? t.amount : pendente)
												}), progress && !pago && pendente !== t.amount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground",
													children: ["de ", formatBRLFull(t.amount)]
												})]
											}),
											t.purchaseGroupId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "Ver parcelas",
												title: "Ver parcelas",
												onClick: () => setOpenGroup(t.purchaseGroupId),
												className: "text-primary hover:text-primary/80",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListOrdered, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "Editar",
												onClick: () => startEdit(t),
												className: "text-muted-foreground hover:text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-label": "Excluir",
												onClick: () => setConfirmDel(t.id),
												className: "text-muted-foreground hover:text-destructive",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Salvar",
											onClick: () => saveEdit(t.id),
											className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Cancelar",
											onClick: () => setEditing(null),
											className: "flex h-7 w-7 items-center justify-center rounded-lg bg-secondary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
										})] })
									]
								})
							}, t.id);
						})
					})]
				}, `${g.personId ?? g.name}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/nova-transacao",
				search: {
					kind: "despesa",
					terceiro: true
				},
				className: "fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!confirmDel,
				title: "Excluir registro?",
				destructive: true,
				confirmLabel: "Excluir",
				onClose: () => setConfirmDel(null),
				onConfirm: async () => {
					if (confirmDel) await deleteThirdParty(confirmDel);
				}
			}),
			openGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParcelasList, {
				groupId: openGroup,
				onClose: () => setOpenGroup(null)
			})
		]
	});
}
//#endregion
export { Terceiros as component };
