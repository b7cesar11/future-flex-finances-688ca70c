import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CvGyVUKL.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as FinanceProvider } from "./finance-store-DtGAnrm7.mjs";
import { t as PeriodFilterProvider } from "./period-filter-rr7Zu06i.mjs";
import { A as redirect, I as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BlFjPVAQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BkD5odvO.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Future Finances projects your future disposable income by forecasting debt payoff timelines."
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Future Finances projects your future disposable income by forecasting debt payoff timelines."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "Lovable App"
			},
			{
				name: "twitter:description",
				content: "Future Finances projects your future disposable income by forecasting debt payoff timelines."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6828a0fd-556e-416f-b7b5-326bd85f0086/id-preview-d32d1eb7--10f77983-8093-4086-b995-8cde33c79990.lovable.app-1782522512486.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6828a0fd-556e-416f-b7b5-326bd85f0086/id-preview-d32d1eb7--10f77983-8093-4086-b995-8cde33c79990.lovable.app-1782522512486.png"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilterProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinanceProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) })
	});
}
var $$splitComponentImporter$16 = () => import("./auth-B1MPaFvk.mjs");
var Route$16 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Entrar — Controle Financeiro" }, {
		name: "description",
		content: "Acesse sua conta e gerencie suas finanças."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./route-DBAKy2ej.mjs");
var Route$15 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("../_authenticated-DS49EvpW.mjs");
var Route$14 = createFileRoute("/_authenticated/")({
	head: () => ({ meta: [{ title: "Início — Controle Financeiro" }, {
		name: "description",
		content: "Visão geral das suas finanças e projeção futura."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./transacoes-DMm3JVxi.mjs");
var Route$13 = createFileRoute("/_authenticated/transacoes")({
	head: () => ({ meta: [{ title: "Transações — Extrato" }, {
		name: "description",
		content: "Despesas e receitas do mês."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./terceiros-CGd2HZbF.mjs");
var Route$12 = createFileRoute("/_authenticated/terceiros")({
	head: () => ({ meta: [{ title: "Terceiros" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
/**
* Calcula o valor pendente real de um ThirdParty.
* - Se tiver purchaseGroupId: soma apenas as parcelas não pagas (paid_at IS NULL)
* - Se não tiver (lançamento avulso): usa t.amount quando status !== "pago"
*/
/** Sinal: +1 = terceiro me deve; -1 = eu devo ao terceiro */
/** Informações de progresso para lançamentos parcelados */
var $$splitComponentImporter$11 = () => import("./receitas-DqJ2oI9k.mjs");
var Route$11 = createFileRoute("/_authenticated/receitas")({
	head: () => ({ meta: [{ title: "Fontes de renda" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./perfil-D5jSsaUl.mjs");
var Route$10 = createFileRoute("/_authenticated/perfil")({
	head: () => ({ meta: [{ title: "Perfil" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./nova-transacao-13mPR-h_.mjs");
var Route$9 = createFileRoute("/_authenticated/nova-transacao")({
	validateSearch: (s) => ({
		kind: s.kind === "receita" ? "receita" : s.kind === "despesa" ? "despesa" : void 0,
		terceiro: s.terceiro === true || s.terceiro === "1" || s.terceiro === "true",
		direction: s.direction === "a_pagar" ? "a_pagar" : s.direction === "a_receber" ? "a_receber" : void 0
	}),
	head: () => ({ meta: [{ title: "Novo lançamento" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./nova-divida-BmF66nsY.mjs");
var Route$8 = createFileRoute("/_authenticated/nova-divida")({
	head: () => ({ meta: [{ title: "Nova Dívida" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./minhas-dividas-JbYrJwbU.mjs");
var Route$7 = createFileRoute("/_authenticated/minhas-dividas")({
	head: () => ({ meta: [{ title: "Minhas Dívidas" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./metas-Dn2a5tn5.mjs");
var Route$6 = createFileRoute("/_authenticated/metas")({
	head: () => ({ meta: [{ title: "Caixinhas — Metas de vida" }, {
		name: "description",
		content: "Reserve dinheiro em caixinhas para cada objetivo."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./envelopes-T8AAjj-C.mjs");
var Route$5 = createFileRoute("/_authenticated/envelopes")({
	head: () => ({ meta: [{ title: "Envelopes de Orçamento" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./contatos-04dUNiCw.mjs");
var Route$4 = createFileRoute("/_authenticated/contatos")({
	head: () => ({ meta: [{ title: "Contatos — Hub de Pessoas" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./compromissos-do-mes-C138733v.mjs");
var Route$3 = createFileRoute("/_authenticated/compromissos-do-mes")({
	head: () => ({ meta: [{ title: "Compromissos do Mês" }, {
		name: "description",
		content: "Extrato consolidado de compromissos do mês."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./cartoes-DyAH59Xm.mjs");
var Route$2 = createFileRoute("/_authenticated/cartoes")({
	head: () => ({ meta: [{ title: "Cartões de crédito" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./carteira-BkTe-4FZ.mjs");
var Route$1 = createFileRoute("/_authenticated/carteira")({
	head: () => ({ meta: [{ title: "Carteira — Saldo atual" }, {
		name: "description",
		content: "Saldo consolidado e contas."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./contatos._id-DRRl_5Ij.mjs");
var Route = createFileRoute("/_authenticated/contatos/$id")({
	head: () => ({ meta: [{ title: "Perfil do contato" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var AuthRoute = Route$16.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$17
});
var AuthenticatedRouteRoute = Route$15.update({
	id: "/_authenticated",
	getParentRoute: () => Route$17
});
var AuthenticatedIndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTransacoesRoute = Route$13.update({
	id: "/transacoes",
	path: "/transacoes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTerceirosRoute = Route$12.update({
	id: "/terceiros",
	path: "/terceiros",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReceitasRoute = Route$11.update({
	id: "/receitas",
	path: "/receitas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPerfilRoute = Route$10.update({
	id: "/perfil",
	path: "/perfil",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNovaTransacaoRoute = Route$9.update({
	id: "/nova-transacao",
	path: "/nova-transacao",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNovaDividaRoute = Route$8.update({
	id: "/nova-divida",
	path: "/nova-divida",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMinhasDividasRoute = Route$7.update({
	id: "/minhas-dividas",
	path: "/minhas-dividas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMetasRoute = Route$6.update({
	id: "/metas",
	path: "/metas",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedEnvelopesRoute = Route$5.update({
	id: "/envelopes",
	path: "/envelopes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedContatosRoute = Route$4.update({
	id: "/contatos",
	path: "/contatos",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCompromissosDoMesRoute = Route$3.update({
	id: "/compromissos-do-mes",
	path: "/compromissos-do-mes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCartoesRoute = Route$2.update({
	id: "/cartoes",
	path: "/cartoes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCarteiraRoute = Route$1.update({
	id: "/carteira",
	path: "/carteira",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedContatosRouteChildren = { AuthenticatedContatosIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedContatosRoute
}) };
var AuthenticatedRouteRouteChildren = {
	AuthenticatedCarteiraRoute,
	AuthenticatedCartoesRoute,
	AuthenticatedCompromissosDoMesRoute,
	AuthenticatedContatosRoute: AuthenticatedContatosRoute._addFileChildren(AuthenticatedContatosRouteChildren),
	AuthenticatedEnvelopesRoute,
	AuthenticatedMetasRoute,
	AuthenticatedMinhasDividasRoute,
	AuthenticatedNovaDividaRoute,
	AuthenticatedNovaTransacaoRoute,
	AuthenticatedPerfilRoute,
	AuthenticatedReceitasRoute,
	AuthenticatedTerceirosRoute,
	AuthenticatedTransacoesRoute,
	AuthenticatedIndexRoute
};
var rootRouteChildren = {
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
