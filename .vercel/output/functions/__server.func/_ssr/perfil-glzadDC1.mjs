import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CvGyVUKL.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as useFinance } from "./finance-store-764EgLaW.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as TriangleAlert, q as CircleUserRound } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-glzadDC1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Perfil() {
	const { wipeAllData } = useFinance();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const { data: profile } = useQuery({
		queryKey: ["profile", "full"],
		queryFn: async () => {
			const { data } = await supabase.from("profiles").select("*").maybeSingle();
			const { data: u } = await supabase.auth.getUser();
			return {
				profile: data,
				email: u.user?.email ?? ""
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Perfil",
		subtitle: "Conta e ajustes",
		hidePeriodFilter: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-card p-5 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUserRound, { className: "h-7 w-7" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-base font-semibold text-foreground",
							children: profile?.profile?.full_name || "Sem nome"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: profile?.email
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-2 gap-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Renda mensal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "mt-1 font-bold tabular-nums text-foreground",
							children: ["R$ ", Number(profile?.profile?.monthly_income ?? 0).toFixed(0)]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Gastos essenciais"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "mt-1 font-bold tabular-nums text-foreground",
							children: ["R$ ", Number(profile?.profile?.essential_expenses ?? 0).toFixed(0)]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-3xl border border-destructive/30 bg-destructive/5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2 text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold uppercase tracking-wider",
							children: "Danger zone"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Apaga em cascata todos os seus lançamentos, dívidas, terceiros, fontes de renda, metas, investimentos e contas. Esta ação não pode ser desfeita."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setConfirm(true),
						className: "mt-4 w-full rounded-2xl bg-destructive py-3 text-sm font-bold text-destructive-foreground",
						children: "Limpar todos os dados"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirm,
				title: "Apagar TUDO?",
				description: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Esta ação apaga em cascata todas as suas informações financeiras do app. Para confirmar, digite a palavra exatamente como aparece abaixo." }),
				destructive: true,
				requireType: "DELETAR",
				confirmLabel: "Apagar tudo",
				onClose: () => setConfirm(false),
				onConfirm: async () => {
					await wipeAllData();
					await qc.invalidateQueries();
					navigate({ to: "/" });
				}
			})
		]
	});
}
//#endregion
export { Perfil as component };
