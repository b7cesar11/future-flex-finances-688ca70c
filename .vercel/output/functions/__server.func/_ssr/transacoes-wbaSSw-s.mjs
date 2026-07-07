import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-j9CZbuwX.mjs";
import { n as useMonthNavigator, r as usePeriod } from "./period-filter-rr7Zu06i.mjs";
import { A as ChevronRight, a as User, j as ChevronLeft, l as Trash2, m as Pin, x as Lock } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
import { i as installmentStatus, n as INSTALLMENT_STATUS_LABEL, r as ParcelasList, t as INSTALLMENT_STATUS_CLASS } from "./ParcelasList-4fro1req.mjs";
import { t as PayCheckbox } from "./PayCheckbox-BiXeFJkl.mjs";
import { t as OverdueBadge } from "./OverdueBadge-DxIA_cEE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transacoes-wbaSSw-s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Transacoes() {
	const { transacoes, categorias, contas, pessoas, setTransactionStatus, deleteTransaction } = useFinance();
	const { range, isInRange } = usePeriod();
	const { label, goToNextMonth, goToPreviousMonth, canGoNext } = useMonthNavigator();
	const catMap = (0, import_react.useMemo)(() => new Map(categorias.map((c) => [c.id, c])), [categorias]);
	const contaMap = (0, import_react.useMemo)(() => new Map(contas.map((c) => [c.id, c])), [contas]);
	const pessoaMap = (0, import_react.useMemo)(() => new Map(pessoas.map((p) => [p.id, p])), [pessoas]);
	const filtered = (0, import_react.useMemo)(() => transacoes.filter((t) => isInRange(t.data)).sort((a, b) => a.data < b.data ? 1 : -1), [transacoes, isInRange]);
	const totals = (0, import_react.useMemo)(() => {
		let receitas = 0;
		let despesas = 0;
		let pendDespesa = 0;
		let pendReceita = 0;
		for (const t of filtered) if (t.kind === "receita") {
			receitas += t.valor;
			if (t.status !== "pago") pendReceita += t.valor;
		} else {
			despesas += t.valor;
			if (t.status !== "pago") pendDespesa += t.valor;
		}
		return {
			receitas,
			despesas,
			balanco: receitas - despesas,
			pendDespesa,
			pendReceita
		};
	}, [filtered]);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of filtered) {
			const arr = map.get(t.data) ?? [];
			arr.push(t);
			map.set(t.data, arr);
		}
		return Array.from(map.entries());
	}, [filtered]);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(null);
	const parcelamentos = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of transacoes) {
			if (!t.purchaseGroupId) continue;
			const cur = map.get(t.purchaseGroupId) ?? {
				groupId: t.purchaseGroupId,
				descricao: t.descricao || "Compra parcelada",
				personId: t.personId ?? null,
				totalParcelas: t.installmentTotal ?? 0,
				pagas: 0,
				restanteValor: 0,
				totalOriginal: 0,
				proximaData: null
			};
			cur.descricao = t.descricao || cur.descricao;
			if (t.personId && !cur.personId) cur.personId = t.personId;
			if (t.installmentTotal && t.installmentTotal > cur.totalParcelas) cur.totalParcelas = t.installmentTotal;
			cur.totalOriginal += t.valor;
			if (t.status === "pago") cur.pagas += 1;
			else {
				cur.restanteValor += t.valor;
				const d = t.dueDate ?? t.data;
				if (!cur.proximaData || d < cur.proximaData) cur.proximaData = d;
			}
			map.set(t.purchaseGroupId, cur);
		}
		return Array.from(map.values()).filter((g) => g.restanteValor > 0);
	}, [transacoes]);
	const parcelamentosPorPessoa = (0, import_react.useMemo)(() => {
		const pessoaGrupos = /* @__PURE__ */ new Map();
		for (const g of parcelamentos) {
			const key = g.personId ?? "__sem_pessoa__";
			if (!pessoaGrupos.has(key)) {
				const pessoa = g.personId ? pessoaMap.get(g.personId) : null;
				pessoaGrupos.set(key, {
					personId: g.personId,
					personName: pessoa?.name ?? (g.personId ? `Pessoa ${g.personId.slice(0, 6)}` : ""),
					grupos: [],
					totalRestante: 0
				});
			}
			const pg = pessoaGrupos.get(key);
			pg.grupos.push(g);
			pg.totalRestante += g.restanteValor;
		}
		return Array.from(pessoaGrupos.values()).sort((a, b) => {
			if (!a.personId && b.personId) return -1;
			if (a.personId && !b.personId) return 1;
			return a.personName.localeCompare(b.personName);
		});
	}, [parcelamentos, pessoaMap]);
	const [openGroup, setOpenGroup] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Transações",
		subtitle: "Lançamentos com vencimento e status",
		children: [
			range.kind === "mensal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-2xl bg-card p-2 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: goToPreviousMonth,
						className: "flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground",
						"aria-label": "Mês anterior",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold capitalize text-foreground",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: goToNextMonth,
						disabled: !canGoNext,
						className: "flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground disabled:opacity-30",
						"aria-label": "Próximo mês",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Receitas",
						value: totals.receitas,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Despesas",
						value: totals.despesas,
						tone: "destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Balanço",
						value: totals.balanco,
						tone: totals.balanco >= 0 ? "primary" : "destructive"
					})
				]
			}),
			(totals.pendDespesa > 0 || totals.pendReceita > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-1.5 text-[10px]",
				children: [totals.pendDespesa > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-destructive/10 px-2 py-0.5 text-destructive",
					children: [formatBRLFull(totals.pendDespesa), " a pagar"]
				}), totals.pendReceita > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-primary/10 px-2 py-0.5 text-primary",
					children: [formatBRLFull(totals.pendReceita), " a receber"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 space-y-5",
				children: [grouped.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
					children: "Nenhuma transação no período."
				}), grouped.map(([day, list]) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: (/* @__PURE__ */ new Date(day + "T00:00:00")).toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "short",
							weekday: "short"
						}).replace(".", "")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "overflow-hidden rounded-2xl bg-card shadow-card",
						children: list.map((t, i) => {
							const cat = catMap.get(t.categoriaId);
							const conta = contaMap.get(t.contaId);
							const positivo = t.kind === "receita";
							const pago = t.status === "pago";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: `flex items-center gap-3 px-3 py-3 ${i < list.length - 1 ? "border-b border-border/60" : ""} ${!pago ? "bg-warning/5" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayCheckbox, {
										paid: pago,
										onToggle: () => setTransactionStatus(t.id, pago ? "pendente" : "pago")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl text-base",
										style: {
											background: `${cat?.cor ?? "#94a3b8"}22`,
											color: cat?.cor
										},
										children: cat?.emoji ?? "✨"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-medium text-foreground",
													children: t.descricao || cat?.nome
												}),
												t.isFixed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3 w-3 shrink-0 text-accent" }),
												(() => {
													const st = installmentStatus(t.paidAt, t.dueDate ?? t.data);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${INSTALLMENT_STATUS_CLASS[st]}`,
														children: INSTALLMENT_STATUS_LABEL[st]
													});
												})(),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverdueBadge, {
													dueDate: t.dueDate ?? t.data,
													status: t.status
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate text-[11px] text-muted-foreground",
											children: [
												cat?.nome,
												" · ",
												conta?.nome ?? "—",
												t.installmentNumber && t.installmentTotal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													" · ",
													t.installmentNumber,
													"/",
													t.installmentTotal
												] }),
												t.dueDate && t.dueDate !== t.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													" ",
													"· venc",
													" ",
													(/* @__PURE__ */ new Date(t.dueDate + "T00:00:00")).toLocaleDateString("pt-BR", {
														day: "2-digit",
														month: "2-digit"
													})
												] })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-end gap-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `text-sm font-semibold tabular-nums ${positivo ? "text-primary" : "text-destructive"} ${!pago ? "opacity-60" : ""}`,
											children: [
												positivo ? "+" : "−",
												" ",
												formatBRLFull(t.valor)
											]
										}), t.paidAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-label": "Editar bloqueado — parcela paga",
											title: "Editar valor/data bloqueado após pagamento",
											className: "text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" })
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Excluir",
											onClick: () => setConfirmDelete(t.id),
											className: "text-muted-foreground hover:text-destructive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
										})]
									})
								]
							}, t.id);
						})
					})] }, day);
				})]
			}),
			parcelamentos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Parcelamentos ativos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: parcelamentosPorPessoa.map((pg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [pg.personId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-primary",
								children: pg.personName
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-semibold tabular-nums text-destructive",
							children: [formatBRLFull(pg.totalRestante), " restante"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: `space-y-2 ${pg.personId ? "pl-2 border-l-2 border-primary/20" : ""}`,
						children: pg.grupos.map((g) => {
							const restantesQtd = g.totalParcelas - g.pagas;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpenGroup(g.groupId),
								className: "w-full rounded-2xl bg-card p-3 text-left shadow-card hover:ring-1 hover:ring-primary/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm font-medium text-foreground",
												children: g.descricao
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													g.pagas,
													"/",
													g.totalParcelas,
													" pagas · ",
													restantesQtd,
													" parcela",
													restantesQtd === 1 ? "" : "s",
													" restante",
													restantesQtd === 1 ? "" : "s"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "shrink-0 text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base font-bold tabular-nums text-destructive",
												children: formatBRLFull(g.restanteValor)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-muted-foreground",
												children: ["de ", formatBRLFull(g.totalOriginal)]
											})]
										})]
									}),
									g.totalParcelas > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 h-1 w-full overflow-hidden rounded-full bg-border/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-primary transition-all",
											style: { width: `${g.pagas / g.totalParcelas * 100}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary",
										children: "Ver parcelas →"
									})
								]
							}) }, g.groupId);
						})
					})] }, pg.personId ?? "__sem_pessoa__"))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!confirmDelete,
				title: "Excluir transação?",
				description: "Isso remove permanentemente o lançamento e recalcula o saldo da carteira.",
				destructive: true,
				confirmLabel: "Excluir",
				onClose: () => setConfirmDelete(null),
				onConfirm: async () => {
					if (confirmDelete) await deleteTransaction(confirmDelete);
				}
			}),
			openGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParcelasList, {
				groupId: openGroup,
				onClose: () => setOpenGroup(null)
			})
		]
	});
}
function SummaryCard({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card p-3 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 text-sm font-bold tabular-nums ${tone === "primary" ? "text-primary" : "text-destructive"}`,
			children: formatBRLFull(value)
		})]
	});
}
//#endregion
export { Transacoes as component };
