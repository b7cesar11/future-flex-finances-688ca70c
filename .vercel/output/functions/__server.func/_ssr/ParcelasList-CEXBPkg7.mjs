import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-C9XWVt39.mjs";
import { G as CircleX, U as LoaderCircle, V as TriangleAlert, n as X, q as CircleCheck, x as Lock } from "../_libs/lucide-react.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ParcelasList-CEXBPkg7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toDate(iso) {
	if (!iso) return null;
	return new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
}
function sameMonth(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function installmentStatus(paidAt, dueDate, refMonth = /* @__PURE__ */ new Date()) {
	if (paidAt) return "paga";
	const due = toDate(dueDate);
	if (!due) return "futura";
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	if (due < today) return "atrasada";
	if (sameMonth(due, refMonth)) return "a_vencer";
	return "futura";
}
var INSTALLMENT_STATUS_LABEL = {
	paga: "Paga",
	atrasada: "Atrasada",
	a_vencer: "A vencer",
	futura: "Futura"
};
var INSTALLMENT_STATUS_CLASS = {
	paga: "bg-success/15 text-success",
	atrasada: "bg-destructive/15 text-destructive",
	a_vencer: "bg-warning/15 text-warning",
	futura: "bg-muted text-muted-foreground"
};
/**
* Drawer único de parcelas — reutilizado em /transacoes, /terceiros e /cartoes.
* Recebe purchase_group_id, lista todas as parcelas do grupo, permite marcar
* cada uma como paga (RPC pagar_parcela) e agrega as ações de quitar/cancelar
* o parcelamento inteiro no rodapé. Toda invalidação passa pelo MAPA_DE_IMPACTO
* central do finance-store — este componente não invalida cache manualmente.
*/
function ParcelasList({ groupId, onClose }) {
	const { transacoes, pessoas, pagarParcela, encerrarParcelamento } = useFinance();
	const parcelas = (0, import_react.useMemo)(() => transacoes.filter((t) => t.purchaseGroupId === groupId).sort((a, b) => (a.installmentNumber ?? 0) - (b.installmentNumber ?? 0)), [transacoes, groupId]);
	const [quitarOpen, setQuitarOpen] = (0, import_react.useState)(false);
	const [quitarValor, setQuitarValor] = (0, import_react.useState)("");
	const [cancelarOpen, setCancelarOpen] = (0, import_react.useState)(false);
	const [busyTxId, setBusyTxId] = (0, import_react.useState)(null);
	const [actionError, setActionError] = (0, import_react.useState)(null);
	if (parcelas.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-5 text-sm text-muted-foreground",
			children: "Parcelamento não encontrado."
		})
	});
	const first = parcelas[0];
	const total = parcelas.reduce((s, t) => s + t.valor, 0);
	const restante = parcelas.filter((t) => t.status !== "pago").reduce((s, t) => s + t.valor, 0);
	const pagas = parcelas.filter((t) => t.status === "pago").length;
	const totalParcelas = first.installmentTotal ?? parcelas.length;
	const valorParcela = total / totalParcelas;
	const restantesQtd = totalParcelas - pagas;
	const descricao = (first.descricao || "").replace(/\s*\(\d+\/\d+\)\s*$/, "");
	const pessoaNome = first.personId ? pessoas.find((p) => p.id === first.personId)?.name : null;
	const podeAgir = restante > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-3 border-b border-border/60 px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-base font-semibold text-foreground",
							children: descricao
						}),
						pessoaNome && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: ["👤 ", pessoaNome]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Saldo restante"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold tabular-nums text-destructive",
									children: formatBRLFull(restante)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-[11px] text-muted-foreground",
									children: [
										pagas,
										"/",
										totalParcelas,
										" pagas · Parcela ",
										formatBRLFull(valorParcela)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: ["de um total de ", formatBRLFull(total)]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Fechar",
					onClick: onClose,
					className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "max-h-[55vh] divide-y divide-border/60 overflow-y-auto",
				children: [actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "mx-4 mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive",
					children: actionError
				}), parcelas.map((t) => {
					const st = installmentStatus(t.paidAt, t.dueDate ?? t.data);
					const pago = t.status === "pago";
					const busy = busyTxId === t.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold text-foreground",
										children: [
											t.installmentNumber ?? "?",
											"/",
											totalParcelas
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${INSTALLMENT_STATUS_CLASS[st]}`,
										children: INSTALLMENT_STATUS_LABEL[st]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"Venc",
										" ",
										(/* @__PURE__ */ new Date((t.dueDate ?? t.data) + "T00:00:00")).toLocaleDateString("pt-BR", {
											day: "2-digit",
											month: "2-digit",
											year: "2-digit"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold tabular-nums text-foreground",
								children: formatBRLFull(t.valor)
							}),
							pago ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-label": "Parcela paga — bloqueada",
								title: "Parcela paga",
								className: "flex h-8 w-8 items-center justify-center text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: async (e) => {
									e.stopPropagation();
									e.preventDefault();
									if (busyTxId) return;
									setActionError(null);
									setBusyTxId(t.id);
									try {
										await pagarParcela(t.id);
									} catch (err) {
										console.error("[ParcelasList] pagarParcela falhou", err);
										setActionError(err instanceof Error && /authenticated|jwt|unauthorized|not authorized/i.test(err.message) ? "Sua sessão expirou. Entre novamente e tente marcar a parcela como paga." : "Não foi possível marcar a parcela como paga. Tente novamente.");
									} finally {
										setBusyTxId(null);
									}
								},
								disabled: !!busyTxId,
								className: "inline-flex min-w-20 items-center justify-center gap-1 rounded-lg bg-primary/15 px-2 py-1.5 text-[11px] font-semibold text-primary disabled:opacity-50",
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : null, busy ? "Marcando" : "Marcar paga"]
							})
						]
					}, t.id);
				})]
			}),
			podeAgir && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "grid grid-cols-2 gap-2 border-t border-border/60 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setQuitarValor(restante.toFixed(2).replace(".", ","));
						setQuitarOpen(true);
					},
					className: "flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), "Quitar restante"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setCancelarOpen(true),
					className: "flex items-center justify-center gap-1.5 rounded-2xl bg-destructive/10 py-2.5 text-xs font-semibold text-destructive ring-1 ring-destructive/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), "Cancelar sem pagamento"]
				})]
			}),
			quitarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-[80] flex items-center justify-center p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Fechar",
					className: "absolute inset-0 bg-black/70",
					onClick: () => setQuitarOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm rounded-3xl bg-card p-5 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: "Quitar restante"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm text-muted-foreground",
							children: "Encerra o parcelamento gerando UMA saída no valor abaixo. Ajuste se houve desconto."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-3 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mb-1 block text-[11px] uppercase text-muted-foreground",
								children: [
									"Valor final (sugerido ",
									formatBRLFull(restante),
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "decimal",
								value: quitarValor,
								onChange: (e) => setQuitarValor(e.target.value),
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-primary"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQuitarOpen(false),
								className: "flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: async () => {
									const parsed = Number(quitarValor.replace(/\./g, "").replace(",", "."));
									if (!isFinite(parsed) || parsed < 0) return;
									setQuitarOpen(false);
									await encerrarParcelamento(groupId, "quitar", parsed);
									onClose();
								},
								className: "flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground",
								children: "Confirmar"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: cancelarOpen,
				title: "Cancelar parcelamento sem pagamento?",
				destructive: true,
				confirmLabel: "Cancelar parcelamento",
				cancelLabel: "Voltar",
				requireType: "CANCELAR",
				description: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg bg-destructive/10 px-2 py-1.5 text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold",
							children: [
								restantesQtd,
								" parcela",
								restantesQtd === 1 ? "" : "s",
								" futura",
								restantesQtd === 1 ? "" : "s",
								" ",
								restantesQtd === 1 ? "será removida" : "serão removidas",
								"."
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Parcelas já pagas ficam no histórico. Digite ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "CANCELAR" }),
							" para confirmar."
						]
					})]
				}),
				onClose: () => setCancelarOpen(false),
				onConfirm: async () => {
					await encerrarParcelamento(groupId, "cancelar");
					onClose();
				}
			})
		]
	});
}
function Sheet({ children, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[70] flex items-end justify-center bg-black/60 sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Fechar",
			className: "absolute inset-0",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative w-full max-w-md overflow-hidden rounded-t-3xl bg-card shadow-card sm:rounded-3xl",
			children
		})]
	});
}
//#endregion
export { installmentStatus as i, INSTALLMENT_STATUS_LABEL as n, ParcelasList as r, INSTALLMENT_STATUS_CLASS as t };
