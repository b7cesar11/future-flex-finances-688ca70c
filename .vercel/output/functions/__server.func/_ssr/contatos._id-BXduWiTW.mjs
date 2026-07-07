import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-764EgLaW.mjs";
import { h as Link, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { z as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as PayCheckbox } from "./PayCheckbox-BiXeFJkl.mjs";
import { t as OverdueBadge } from "./OverdueBadge-DxIA_cEE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contatos._id-BXduWiTW.js
var import_jsx_runtime = require_jsx_runtime();
var TYPE_LABEL = {
	emprestei_dinheiro: "Emprestei",
	usou_meu_cartao: "Usou meu cartão",
	devo_a_terceiro: "Devo"
};
function PerfilPessoa() {
	const { id } = useParams({ from: "/_authenticated/contatos/$id" });
	const { pessoas, terceiros, setThirdPartyStatus } = useFinance();
	const pessoa = pessoas.find((p) => p.id === id);
	const items = terceiros.filter((t) => t.personId === id);
	const pendentes = items.filter((t) => t.status !== "pago");
	const historicoPago = items.filter((t) => t.status === "pago");
	const saldo = pendentes.reduce((s, t) => {
		return s + (t.type === "devo_a_terceiro" ? -1 : 1) * t.amount;
	}, 0);
	const totalHistorico = items.reduce((s, t) => s + t.amount, 0);
	if (!pessoa) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Contato",
		hidePeriodFilter: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Contato não encontrado."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/contatos",
			className: "mt-3 inline-block text-xs text-primary",
			children: "Voltar"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: pessoa.name,
		subtitle: `Perfil consolidado`,
		hidePeriodFilter: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/contatos",
				className: "mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " voltar"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wide opacity-80",
						children: "Saldo em aberto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-3xl font-bold tabular-nums",
						children: saldo === 0 ? "R$ 0,00" : `${saldo > 0 ? "+" : "−"}${formatBRLFull(Math.abs(saldo))}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] opacity-80",
						children: [
							saldo >= 0 ? "A receber" : "A pagar",
							" · Histórico total ",
							formatBRLFull(totalHistorico)
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Em aberto"
					}),
					pendentes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-2xl bg-card p-4 text-center text-xs text-muted-foreground shadow-card",
						children: "Nada pendente"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: pendentes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-2xl bg-card px-3 py-2.5 shadow-card ring-1 ring-warning/25",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayCheckbox, {
										paid: false,
										onToggle: () => setThirdPartyStatus(t.id, "pago"),
										ariaLabel: "Marcar como pago"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1.5 text-sm font-medium text-foreground",
											children: [TYPE_LABEL[t.type], /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverdueBadge, {
												dueDate: t.dueDate,
												status: t.status
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: t.dueDate ? `Venc ${(/* @__PURE__ */ new Date(t.dueDate + "T00:00:00")).toLocaleDateString("pt-BR")}` : "Sem vencimento"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `text-sm font-semibold tabular-nums ${t.type === "devo_a_terceiro" ? "text-destructive" : "text-success"}`,
										children: formatBRLFull(t.amount)
									})
								]
							})
						}, t.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Histórico pago"
					}),
					historicoPago.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-2xl bg-card p-4 text-center text-xs text-muted-foreground shadow-card",
						children: "Ainda sem histórico"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: historicoPago.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-2xl bg-card px-3 py-2.5 shadow-card opacity-70",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground",
									children: TYPE_LABEL[t.type]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold tabular-nums text-muted-foreground",
									children: formatBRLFull(t.amount)
								})]
							})
						}, t.id))
					})
				]
			})
		]
	});
}
//#endregion
export { PerfilPessoa as component };
