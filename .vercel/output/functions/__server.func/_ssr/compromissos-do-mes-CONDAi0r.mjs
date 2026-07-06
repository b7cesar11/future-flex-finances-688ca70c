import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-C9XWVt39.mjs";
import { n as useMonthNavigator } from "./period-filter-rr7Zu06i.mjs";
import { A as ChevronRight, D as CreditCard, T as Landmark, c as TrendingDown, i as Users, j as ChevronLeft, k as Clock, q as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as PayCheckbox } from "./PayCheckbox-BiXeFJkl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compromissos-do-mes-CONDAi0r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmtDate(iso) {
	if (!iso) return "—";
	return (iso.length <= 10 ? /* @__PURE__ */ new Date(iso + "T00:00:00") : new Date(iso)).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "2-digit"
	});
}
function originIcon(tipo) {
	switch (tipo) {
		case "cartao": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" });
		case "terceiro": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" });
		case "emprestimo": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "h-4 w-4" });
		case "financiamento": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "h-4 w-4" });
		case "parcelamento": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4" });
	}
}
function originColor(tipo) {
	switch (tipo) {
		case "cartao": return "bg-violet-500/15 text-violet-400";
		case "terceiro": return "bg-amber-500/15 text-amber-400";
		case "emprestimo": return "bg-blue-500/15 text-blue-400";
		case "financiamento": return "bg-cyan-500/15 text-cyan-400";
		case "parcelamento": return "bg-rose-500/15 text-rose-400";
	}
}
function originBorder(tipo) {
	switch (tipo) {
		case "cartao": return "border-violet-500/30";
		case "terceiro": return "border-amber-500/30";
		case "emprestimo": return "border-blue-500/30";
		case "financiamento": return "border-cyan-500/30";
		case "parcelamento": return "border-rose-500/30";
	}
}
function CompromissosDoMes() {
	const { transacoes, dividas, faturas, cartoes, pessoas } = useFinance();
	const { label, goToNextMonth, goToPreviousMonth, canGoNext, currentReferenceMonth } = useMonthNavigator();
	const year = currentReferenceMonth.getFullYear();
	const month = currentReferenceMonth.getMonth();
	function inMonth(iso) {
		if (!iso) return false;
		const d = iso.length <= 10 ? /* @__PURE__ */ new Date(iso + "T00:00:00") : new Date(iso);
		return d.getFullYear() === year && d.getMonth() === month;
	}
	const pessoaMap = (0, import_react.useMemo)(() => new Map(pessoas.map((p) => [p.id, p.name])), [pessoas]);
	const cartaoMap = (0, import_react.useMemo)(() => new Map(cartoes.map((c) => [c.id, c.name])), [cartoes]);
	const debtTypeByGroup = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const d of dividas) if (d.commitmentGroupId && (d.tipo === "emprestimo" || d.tipo === "financiamento")) m.set(d.commitmentGroupId, d.tipo);
		return m;
	}, [dividas]);
	const gruposCartao = (0, import_react.useMemo)(() => {
		const grupos = [];
		for (const fatura of faturas) {
			if (!inMonth(fatura.dueDate)) continue;
			const nomeCartao = cartaoMap.get(fatura.creditCardId) ?? "Cartão";
			const txsFatura = transacoes.filter((t) => t.invoiceId === fatura.id && t.kind === "despesa");
			if (txsFatura.length === 0 && fatura.total === 0) continue;
			const pago = fatura.status === "paga";
			const itens = txsFatura.map((t) => ({
				id: t.id,
				transactionId: t.id,
				descricao: t.descricao,
				valor: t.valor,
				pago,
				dueDate: fatura.dueDate,
				parcela: t.installmentNumber && t.installmentTotal ? `${t.installmentNumber}/${t.installmentTotal}` : void 0
			}));
			grupos.push({
				key: `cartao-${fatura.id}`,
				tipo: "cartao",
				titulo: nomeCartao,
				subtitulo: `Fatura vence ${fmtDate(fatura.dueDate)}`,
				total: fatura.total,
				totalPago: pago ? fatura.total : 0,
				itens
			});
		}
		return grupos;
	}, [
		faturas,
		transacoes,
		cartaoMap,
		year,
		month
	]);
	const gruposParcelados = (0, import_react.useMemo)(() => {
		const byPessoa = /* @__PURE__ */ new Map();
		const byGroup = /* @__PURE__ */ new Map();
		for (const t of transacoes) {
			if (!t.purchaseGroupId) continue;
			if (t.invoiceId) continue;
			if (t.kind !== "despesa") continue;
			if (!inMonth(t.dueDate ?? t.data)) continue;
			const pago = !!t.paidAt;
			const item = {
				id: t.id,
				transactionId: t.id,
				descricao: t.descricao,
				valor: t.valor,
				pago,
				dueDate: t.dueDate,
				parcela: t.installmentNumber && t.installmentTotal ? `${t.installmentNumber}/${t.installmentTotal}` : void 0,
				pessoa: t.personId ? pessoaMap.get(t.personId) : void 0
			};
			if (t.personId) {
				const pid = t.personId;
				if (!byPessoa.has(pid)) byPessoa.set(pid, {
					titulo: pessoaMap.get(pid) ?? "Terceiro",
					itens: [],
					total: 0,
					totalPago: 0
				});
				const g = byPessoa.get(pid);
				g.itens.push(item);
				g.total += t.valor;
				if (pago) g.totalPago += t.valor;
			} else {
				const gid = t.purchaseGroupId;
				if (!byGroup.has(gid)) {
					const tipo = debtTypeByGroup.get(gid) ?? "parcelamento";
					const baseDesc = t.descricao.replace(/\s*\(\d+\/\d+\)$/, "").trim();
					byGroup.set(gid, {
						tipo,
						titulo: baseDesc,
						itens: [],
						total: 0,
						totalPago: 0
					});
				}
				const g = byGroup.get(gid);
				g.itens.push(item);
				g.total += t.valor;
				if (pago) g.totalPago += t.valor;
			}
		}
		const result = [];
		for (const [pid, g] of byPessoa.entries()) result.push({
			key: `terceiro-${pid}`,
			tipo: "terceiro",
			titulo: g.titulo,
			subtitulo: `${g.itens.length} lançamento${g.itens.length !== 1 ? "s" : ""}`,
			total: g.total,
			totalPago: g.totalPago,
			itens: g.itens
		});
		for (const [gid, g] of byGroup.entries()) result.push({
			key: `group-${gid}`,
			tipo: g.tipo,
			titulo: g.titulo,
			subtitulo: `${g.itens.length} parcela${g.itens.length !== 1 ? "s" : ""} no mês`,
			total: g.total,
			totalPago: g.totalPago,
			itens: g.itens
		});
		return result;
	}, [
		transacoes,
		debtTypeByGroup,
		pessoaMap,
		year,
		month
	]);
	const todosGrupos = (0, import_react.useMemo)(() => [...gruposCartao, ...gruposParcelados], [gruposCartao, gruposParcelados]);
	const totalMes = (0, import_react.useMemo)(() => todosGrupos.reduce((s, g) => s + g.total, 0), [todosGrupos]);
	const totalPagoMes = (0, import_react.useMemo)(() => todosGrupos.reduce((s, g) => s + g.totalPago, 0), [todosGrupos]);
	const totalPendente = totalMes - totalPagoMes;
	const pctPago = totalMes > 0 ? Math.round(totalPagoMes / totalMes * 100) : 0;
	const gruposOrdenados = (0, import_react.useMemo)(() => {
		const order = {
			cartao: 0,
			terceiro: 1,
			emprestimo: 2,
			financiamento: 3,
			parcelamento: 4
		};
		return [...todosGrupos].sort((a, b) => {
			const diff = order[a.tipo] - order[b.tipo];
			if (diff !== 0) return diff;
			return b.total - a.total;
		});
	}, [todosGrupos]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Compromissos do Mês",
		subtitle: "Extrato consolidado",
		hidePeriodFilter: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: goToPreviousMonth,
						className: "flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold capitalize text-foreground",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: goToNextMonth,
						disabled: !canGoNext,
						className: "flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-card ring-1 ring-primary/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 pt-5 pb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
								children: "Total do mês"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-4xl font-extrabold tracking-tight text-foreground",
								children: formatBRLFull(totalMes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-emerald-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
										formatBRLFull(totalPagoMes),
										" pago"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-amber-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
										formatBRLFull(totalPendente),
										" pendente"
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 w-full bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500",
							style: { width: `${pctPago}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [pctPago, "% quitado"]
						})
					})
				]
			}),
			gruposOrdenados.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-3 rounded-3xl bg-card py-16 text-center shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-12 w-12 text-muted-foreground/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted-foreground",
						children: "Nenhum compromisso neste mês"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground/60",
						children: "Parcelamentos, empréstimos, financiamentos e terceiros aparecerão aqui"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: gruposOrdenados.map((grupo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrupoCard, { grupo }, grupo.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6" })
		]
	});
}
function GrupoCard({ grupo }) {
	const pct = grupo.total > 0 ? Math.round(grupo.totalPago / grupo.total * 100) : 0;
	const pendente = grupo.total - grupo.totalPago;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `overflow-hidden rounded-3xl bg-card shadow-card ring-1 ${originBorder(grupo.tipo)}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${originColor(grupo.tipo)}`,
						children: originIcon(grupo.tipo)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold text-foreground",
							children: grupo.titulo
						}), grupo.subtitulo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: grupo.subtitulo
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-foreground",
							children: formatBRLFull(grupo.total)
						}), pendente > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-amber-400",
							children: [formatBRLFull(pendente), " pendente"]
						}) : grupo.total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-emerald-400",
							children: "Quitado"
						}) : null]
					})
				]
			}),
			grupo.total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-0.5 w-full bg-border/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-emerald-500/70 transition-all duration-500",
					style: { width: `${pct}%` }
				})
			}),
			grupo.itens.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border/30",
				children: grupo.itens.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `shrink-0 ${item.pago ? "text-emerald-400" : "text-muted-foreground/40"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayCheckbox, {
								paid: item.pago,
								onToggle: async () => {
									await finance.alternarStatusTransacao(item.transactionId, item.pago ? "pendente" : "pago");
								},
								size: "sm"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `truncate text-xs font-medium ${item.pago ? "text-muted-foreground line-through" : "text-foreground"}`,
								children: item.descricao
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground",
								children: [
									item.parcela && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Parcela ", item.parcela] }),
									item.dueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Venc ", fmtDate(item.dueDate)] }),
									item.pessoa && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", item.pessoa] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `shrink-0 text-xs font-semibold ${item.pago ? "text-muted-foreground" : "text-foreground"}`,
							children: formatBRLFull(item.valor)
						})
					]
				}, item.id))
			})
		]
	});
}
//#endregion
export { CompromissosDoMes as component };
