import { i as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/client-CvGyVUKL.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { a as projectUntilNextIncome, n as buildProjection, o as useFinance, r as formatBRL } from "./_ssr/finance-store-764EgLaW.mjs";
import { r as usePeriod } from "./_ssr/period-filter-rr7Zu06i.mjs";
import { h as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { F as Calendar, H as Activity, L as CalendarClock, R as ArrowUpRight, V as ArrowDownRight, W as Sparkles, Y as CircleAlert, g as Percent, h as PiggyBank, i as Users, r as Wallet, s as TrendingUp, u as Target } from "./_libs/lucide-react.mjs";
import { t as AppShell } from "./_ssr/AppShell-DX7ldnxD.mjs";
import { t as ProgressBar } from "./_ssr/ProgressBar-BHoOan-c.mjs";
import { a as Bar, c as Tooltip, i as CartesianGrid, n as YAxis, o as Cell, r as XAxis, s as ResponsiveContainer, t as BarChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-DB5DQFCY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { rendaMensal, gastosEssenciais, dividas, transacoes, metas, investimentos, terceiros, fontesRenda, saldoReal, caixinhasTotal, pendentesMesTotal, livreParaGastar, envelopesCommitted } = useFinance();
	const { range, isInRange } = usePeriod();
	const { data: greetingName } = useQuery({
		queryKey: ["profile", "greeting"],
		queryFn: async () => {
			const { data: userRes } = await supabase.auth.getUser();
			const user = userRes.user;
			const { data: profile } = await supabase.from("profiles").select("full_name").maybeSingle();
			const full = (profile?.full_name ?? "").trim();
			if (full) return full.split(" ")[0];
			const meta = user?.user_metadata ?? {};
			const metaName = (meta.full_name ?? meta.name ?? "").trim();
			if (metaName) return metaName.split(" ")[0];
			if (user?.email) return user.email.split("@")[0];
			return "";
		}
	});
	const periodTx = (0, import_react.useMemo)(() => transacoes.filter((t) => isInRange(t.data)), [transacoes, isInRange]);
	const receitas = periodTx.filter((t) => t.kind === "receita").reduce((s, t) => s + t.valor, 0);
	const despesas = periodTx.filter((t) => t.kind === "despesa").reduce((s, t) => s + t.valor, 0);
	const lucratividade = receitas > 0 ? Math.round((receitas - despesas) / receitas * 100) : 0;
	const aPagarTotal = periodTx.filter((t) => t.kind === "despesa" && t.status !== "pago").reduce((s, t) => s + t.valor, 0);
	const aReceberTotal = periodTx.filter((t) => t.kind === "receita" && t.status !== "pago").reduce((s, t) => s + t.valor, 0);
	const todayIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const aPagarHoje = transacoes.filter((t) => t.kind === "despesa" && t.status !== "pago" && t.dueDate === todayIso).length;
	const aReceberHoje = transacoes.filter((t) => t.kind === "receita" && t.status !== "pago" && t.dueDate === todayIso).length;
	const next = (0, import_react.useMemo)(() => projectUntilNextIncome(saldoReal, fontesRenda, transacoes, dividas), [
		saldoReal,
		fontesRenda,
		transacoes,
		dividas
	]);
	const totalInvestido = investimentos.reduce((s, i) => s + i.valor, 0);
	const aporteSugerido = investimentos.reduce((s, i) => s + i.aporteSugerido, 0) || Math.max(0, Math.round((receitas - despesas) * .2));
	const terceirosPendentes = terceiros.filter((t) => t.status !== "pago");
	const terceirosTotal = terceirosPendentes.reduce((s, t) => s + t.amount, 0);
	const dividasAtivas = dividas.filter((d) => d.category !== "congelada");
	const totalParcelasMes = dividasAtivas.reduce((s, d) => s + d.valorParcela, 0);
	const comprometimentoPct = rendaMensal > 0 ? Math.round(totalParcelasMes / rendaMensal * 100) : 0;
	const tone = comprometimentoPct >= 50 ? "destructive" : comprometimentoPct >= 30 ? "warning" : "primary";
	const projection = buildProjection(rendaMensal, gastosEssenciais, dividasAtivas, 12);
	const respiro = projection.slice(1).find((m) => m.ended.length > 0);
	const respiroDelta = respiro ? respiro.ended.reduce((s, d) => s + d.valorParcela, 0) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: greetingName ? `Olá, ${greetingName}` : "Olá",
		subtitle: `Visão ${range.kind === "mensal" ? "do mês" : range.kind === "semanal" ? "da semana" : range.kind === "anual" ? "do ano" : "do período"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `overflow-hidden rounded-3xl p-5 shadow-card ${livreParaGastar < 0 ? "bg-destructive text-destructive-foreground" : "bg-gradient-primary text-primary-foreground shadow-glow"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider opacity-85",
							children: "Livre para gastar hoje"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 opacity-85" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-3xl font-bold tabular-nums",
						children: formatBRL(livreParaGastar)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-[11px] opacity-85",
						children: [
							"Saldo ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatBRL(saldoReal) }),
							" − pendentes do mês",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatBRL(pendentesMesTotal) }),
							" − caixinhas",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatBRL(caixinhasTotal) }),
							" − envelopes",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatBRL(envelopesCommitted) })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] font-semibold opacity-90",
						children: ["Comprometido em envelopes: ", formatBRL(envelopesCommitted)]
					}),
					livreParaGastar < 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 rounded-xl bg-black/25 px-2.5 py-1.5 text-[11px] font-semibold",
						children: "⚠️ Você está comprometido além do saldo. Reveja pendências ou caixinhas."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" }),
						label: "Receitas",
						value: formatBRL(receitas),
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-4 w-4" }),
						label: "Despesas",
						value: formatBRL(despesas),
						tone: "destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
						label: "Saldo real",
						value: formatBRL(saldoReal),
						tone: "accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-4 w-4" }),
						label: "Lucratividade",
						value: `${lucratividade}%`,
						tone: lucratividade >= 0 ? "primary" : "destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-3 grid grid-cols-1 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillBlock, {
						title: "Contas a pagar",
						total: aPagarTotal,
						dueToday: aPagarHoje,
						tone: "destructive",
						to: "/transacoes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillBlock, {
						title: "Contas a receber",
						total: aReceberTotal,
						dueToday: aReceberHoje,
						tone: "primary",
						to: "/transacoes"
					}),
					terceirosPendentes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/terceiros",
						className: "flex items-center justify-between rounded-2xl bg-card p-4 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Terceiros"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-bold tabular-nums text-warning",
									children: formatBRL(terceirosTotal)
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 rounded-full bg-warning/15 px-2 py-1 text-[10px] font-semibold text-warning",
							children: [terceirosPendentes.length, " pend."]
						})]
					})
				]
			}),
			next.nextIncome && next.nextDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl border border-primary/20 bg-card p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-foreground",
							children: "Até a próxima entrada"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Próxima:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: next.nextIncome.name
							}),
							" em",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: next.nextDate.toLocaleDateString("pt-BR", {
									day: "2-digit",
									month: "short"
								})
							}),
							" ",
							"(",
							formatBRL(next.nextIncome.amount),
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Saldo hoje",
								value: formatBRL(saldoReal),
								tone: "text-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Contas fixas + dívidas até lá",
								value: `− ${formatBRL(next.totalDue)}`,
								tone: "text-destructive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 h-px bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Sobra prevista",
								value: formatBRL(next.balanceAfter),
								tone: next.balanceAfter >= 0 ? "text-primary font-bold" : "text-destructive font-bold"
							})
						]
					}),
					next.balanceAfter < 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-destructive",
							children: [
								"⚠️ Faltam ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatBRL(Math.abs(next.balanceAfter)) }),
								" para cobrir o que vence antes do próximo recebimento."
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl bg-card p-5 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold text-foreground",
						children: "Patrimônio"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-surface-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Total investido"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-lg font-bold tabular-nums text-foreground",
							children: formatBRL(totalInvestido)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-accent/30 bg-accent/10 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wider text-accent",
								children: "Aporte sugerido"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-lg font-bold tabular-nums text-accent",
								children: formatBRL(aporteSugerido)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[10px] text-muted-foreground",
								children: "20% do seu balanço"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl bg-card p-5 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-foreground",
							children: "Metas e objetivos"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-muted-foreground",
						children: [metas.length, " ativas"]
					})]
				}), metas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border p-5 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground",
						children: "Defina sua primeira meta de vida"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Viagem, reserva de emergência, entrada do imóvel — comece pequeno."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-4",
					children: metas.map((m) => {
						const pct = m.valorTotal > 0 ? Math.round(m.valorAtual / m.valorTotal * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl bg-surface-elevated p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg",
										children: m.emoji
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium text-foreground",
										children: m.nome
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 text-xs font-semibold tabular-nums text-muted-foreground",
									children: [
										formatBRL(m.valorAtual),
										" / ",
										formatBRL(m.valorTotal)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
								value: pct,
								size: "sm",
								rightLabel: `${pct}% concluída`
							})]
						}, m.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl bg-card p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-foreground",
							children: "Termômetro de comprometimento"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 text-xs text-muted-foreground",
						children: "Quanto da sua renda já está comprometido com dívidas."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, {
						value: comprometimentoPct,
						tone,
						label: `${formatBRL(totalParcelasMes)} / ${formatBRL(rendaMensal)}`,
						rightLabel: `${comprometimentoPct}%`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl bg-card p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-foreground",
							children: "Linha do tempo de alívio"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 text-xs text-muted-foreground",
						children: "Saldo livre projetado conforme as dívidas terminam."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-48 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: projection,
								margin: {
									top: 8,
									right: 4,
									left: -16,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "mes",
										tick: {
											fill: "var(--muted-foreground)",
											fontSize: 11
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fill: "var(--muted-foreground)",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false,
										tickFormatter: (v) => `${Math.round(v / 1e3)}k`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: {
											fill: "var(--muted)",
											opacity: .4
										},
										contentStyle: {
											background: "var(--popover)",
											border: "1px solid var(--border)",
											borderRadius: 12,
											color: "var(--foreground)",
											fontSize: 12
										},
										formatter: (v) => [formatBRL(v), "Saldo livre"],
										labelFormatter: (l) => `Mês: ${l}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "saldoLivre",
										radius: [
											6,
											6,
											0,
											0
										],
										children: projection.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											fill: entry.ended.length > 0 ? "var(--primary)" : "var(--accent)",
											fillOpacity: entry.ended.length > 0 ? 1 : .55
										}, i))
									})
								]
							})
						})
					}),
					respiro && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center gap-2 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold uppercase tracking-wider",
								children: "Mês de respiro"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-foreground",
							children: [
								"Em ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-primary",
									children: respiro.mes
								}),
								" você libera",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-primary",
									children: [
										"+ ",
										formatBRL(respiroDelta),
										"/mês"
									]
								}),
								"."
							]
						})]
					})
				]
			})
		]
	});
}
function Row({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `tabular-nums ${tone}`,
			children: value
		})]
	});
}
function KpiCard({ icon, label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card p-3 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `flex h-7 w-7 items-center justify-center rounded-lg ${tone === "primary" ? "bg-primary/15 text-primary" : tone === "destructive" ? "bg-destructive/15 text-destructive" : "bg-accent/15 text-accent"}`,
				children: icon
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-2 text-base font-bold tabular-nums ${tone === "primary" ? "text-primary" : tone === "destructive" ? "text-destructive" : "text-accent"}`,
			children: value
		})]
	});
}
function BillBlock({ title, total, dueToday, tone, to }) {
	const toneText = tone === "primary" ? "text-primary" : "text-destructive";
	const toneBg = tone === "primary" ? "bg-primary/15" : "bg-destructive/15";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex items-center justify-between rounded-2xl bg-card p-4 shadow-card transition active:scale-[.98]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `flex h-10 w-10 items-center justify-center rounded-xl ${toneBg} ${toneText}`,
				children: tone === "destructive" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `text-base font-bold tabular-nums ${toneText}`,
					children: formatBRL(total)
				})]
			})]
		}), dueToday > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${toneBg} ${toneText}`,
			children: [
				dueToday,
				" ",
				dueToday === 1 ? "item" : "itens",
				" hoje"
			]
		})]
	});
}
//#endregion
export { Dashboard as component };
