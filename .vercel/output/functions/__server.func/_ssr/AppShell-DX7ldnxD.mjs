import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CvGyVUKL.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as usePeriod } from "./period-filter-rr7Zu06i.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as ArrowLeftRight, I as CalendarRange, K as House, L as CalendarClock, O as CreditCard, P as Check, T as LayoutList, b as LogOut, c as TrendingDown, h as PiggyBank, i as Users, k as Contact, n as X, p as Plus, q as CircleUserRound, r as Wallet, s as TrendingUp, v as Package, w as ListChecks, y as Menu } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-DX7ldnxD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var items = [
	{
		to: "/",
		label: "Início",
		icon: House
	},
	{
		to: "/transacoes",
		label: "Transações",
		icon: ArrowLeftRight
	},
	{
		to: "/minhas-dividas",
		label: "Dívidas",
		icon: ListChecks
	},
	{
		to: "/carteira",
		label: "Carteira",
		icon: Wallet
	}
];
function BottomNav() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const go = (path) => {
		setOpen(false);
		navigate({ to: path });
	};
	const left = items.slice(0, 2);
	const right = items.slice(2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mx-auto flex max-w-md items-stretch justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2",
			children: [
				left.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { ...it }, it.to)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "flex-1 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setOpen(true),
						"aria-label": "Registrar",
						className: "-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow ring-4 ring-background transition-transform active:scale-95",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							className: "h-7 w-7",
							strokeWidth: 2.5
						})
					})
				}),
				right.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { ...it }, it.to))
			]
		})
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Fechar",
			onClick: () => setOpen(false),
			className: "absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto w-full max-w-md rounded-t-3xl border-t border-border bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-card animate-in slide-in-from-bottom duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: "O que você quer registrar?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Fechar",
						onClick: () => setOpen(false),
						className: "flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							label: "Nova Despesa",
							hint: "Um gasto que saiu (ou vai sair) da conta",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-5 w-5" }),
							tone: "bg-destructive/15 text-destructive",
							onClick: () => go("/nova-transacao?kind=despesa")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							label: "Nova Receita",
							hint: "Dinheiro que entrou agora",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }),
							tone: "bg-primary/15 text-primary",
							onClick: () => go("/nova-transacao?kind=receita")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							label: "Nova Dívida",
							hint: "Algo parcelado para projetar",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" }),
							tone: "bg-accent/15 text-accent",
							onClick: () => go("/nova-divida")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
							label: "Terceiros",
							hint: "Emprestou, deve ou usaram seu cartão",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" }),
							tone: "bg-warning/15 text-warning",
							onClick: () => go("/nova-transacao?kind=despesa&terceiro=1")
						})
					]
				})
			]
		})]
	})] });
}
function NavItem({ to, label, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "flex-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to,
			activeOptions: { exact: true },
			className: "group flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-muted-foreground transition-colors",
			activeProps: { className: "text-primary" },
			children: ({ isActive }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex h-9 w-9 items-center justify-center rounded-2xl transition-all", isActive ? "bg-primary/15 shadow-glow" : "group-hover:bg-secondary"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "h-5 w-5",
					strokeWidth: 2.2
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10.5px] font-medium",
				children: label
			})] })
		})
	});
}
function QuickAction({ label, hint, icon, tone, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex items-center gap-3 rounded-2xl bg-surface-elevated p-4 text-left transition-colors hover:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("flex h-11 w-11 items-center justify-center rounded-2xl", tone),
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm font-semibold text-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs text-muted-foreground",
				children: hint
			})]
		})]
	});
}
var OPTIONS = [
	{
		key: "semanal",
		label: "1 Sem"
	},
	{
		key: "mensal",
		label: "1 Mês"
	},
	{
		key: "anual",
		label: "1 Ano"
	},
	{
		key: "personalizado",
		label: "Custom"
	}
];
function PeriodFilter() {
	const { range, setKind, setCustom } = usePeriod();
	const [openCustom, setOpenCustom] = (0, import_react.useState)(false);
	const [s, setS] = (0, import_react.useState)("");
	const [e, setE] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card/80 p-1.5 shadow-card ring-1 ring-border/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1",
				children: OPTIONS.map((o) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (o.key === "personalizado") setOpenCustom(true);
							else setKind(o.key);
						},
						className: `flex-1 rounded-xl px-2 py-1.5 text-[11px] font-semibold transition-colors ${range.kind === o.key ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`,
						children: o.label
					}, o.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 flex items-center justify-center gap-1.5 text-[10px] capitalize text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "h-3 w-3" }), range.label]
			}),
			openCustom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Fechar",
					className: "absolute inset-0 bg-black/60",
					onClick: () => setOpenCustom(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto w-full max-w-md rounded-t-3xl border-t border-border bg-card p-5 pb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-base font-semibold",
							children: "Período personalizado"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-2 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] uppercase text-muted-foreground",
								children: "De"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: s,
								onChange: (ev) => setS(ev.target.value),
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-3 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[11px] uppercase text-muted-foreground",
								children: "Até"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: e,
								onChange: (ev) => setE(ev.target.value),
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !s || !e,
							onClick: () => {
								setCustom(/* @__PURE__ */ new Date(s + "T00:00:00"), /* @__PURE__ */ new Date(e + "T23:59:59"));
								setOpenCustom(false);
							},
							className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Aplicar"]
						})
					]
				})]
			})
		]
	});
}
function AppShell({ title, subtitle, children, hidePeriodFilter }) {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [menu, setMenu] = (0, import_react.useState)(false);
	const signOut = async () => {
		setMenu(false);
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex min-h-screen max-w-md flex-col pb-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "px-5 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold tracking-tight text-foreground",
							children: title
						}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: subtitle
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMenu(true),
							"aria-label": "Menu",
							className: "flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						})]
					}), !hidePeriodFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilter, {})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-5 pt-4",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {}),
			menu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Fechar",
					onClick: () => setMenu(false),
					className: "absolute inset-0 bg-black/60 backdrop-blur-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-card p-5 pt-[max(env(safe-area-inset-top),1.5rem)] shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: "Menu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMenu(false),
								className: "flex h-8 w-8 items-center justify-center rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
									to: "/envelopes",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }),
									label: "Envelopes",
									onClick: () => setMenu(false)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
									to: "/metas",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "h-4 w-4" }),
									label: "Caixinhas / Metas",
									onClick: () => setMenu(false)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
									to: "/contatos",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, { className: "h-4 w-4" }),
									label: "Contatos",
									onClick: () => setMenu(false)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
									to: "/terceiros",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
									label: "Terceiros",
									onClick: () => setMenu(false)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
									to: "/cartoes",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }),
									label: "Cartões de crédito",
									onClick: () => setMenu(false)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
									to: "/compromissos-do-mes",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutList, { className: "h-4 w-4" }),
									label: "Compromissos do Mês",
									onClick: () => setMenu(false)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
									to: "/receitas",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4" }),
									label: "Fontes de renda",
									onClick: () => setMenu(false)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuLink, {
									to: "/perfil",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUserRound, { className: "h-4 w-4" }),
									label: "Perfil",
									onClick: () => setMenu(false)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: signOut,
							className: "mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-3 py-3 text-sm font-semibold text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sair"]
						})
					]
				})]
			})
		]
	});
}
function MenuLink({ to, icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		onClick,
		className: "flex items-center gap-3 rounded-2xl bg-surface-elevated px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary",
			children: icon
		}), label]
	});
}
//#endregion
export { cn as n, AppShell as t };
