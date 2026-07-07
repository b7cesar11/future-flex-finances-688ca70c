import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CvGyVUKL.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { K as LoaderCircle, r as Wallet } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-B1MPaFvk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/" });
		});
	}, [navigate]);
	const submit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: fullName }
					}
				});
				if (error) throw error;
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			navigate({ to: "/" });
		} catch (err) {
			setError(err?.message ?? "Falha na autenticação");
		} finally {
			setLoading(false);
		}
	};
	const signInGoogle = async () => {
		setError(null);
		setLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: "https://future-flex-finances-688ca70c.vercel.app/auth" }
			});
			if (error) throw error;
		} catch (err) {
			setError(err?.message ?? "Erro ao entrar com Google");
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-screen max-w-md flex-col px-5 pt-[max(env(safe-area-inset-top),3rem)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground",
						children: "Bem-vindo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: mode === "signin" ? "Entre na sua conta" : "Crie sua conta gratuita"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: signInGoogle,
					className: "mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-card px-4 py-3 text-sm font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, {}), " Continuar com Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
						" ou ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-4",
					children: [
						mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nome",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								placeholder: "Seu nome",
								className: "w-full rounded-xl bg-card px-3 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "E-mail",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "voce@email.com",
								className: "w-full rounded-xl bg-card px-3 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Senha",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								minLength: 6,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "••••••••",
								className: "w-full rounded-xl bg-card px-3 py-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
							})
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50",
							children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), mode === "signin" ? "Entrar" : "Criar conta"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode((m) => m === "signin" ? "signup" : "signin"),
					className: "mt-5 text-center text-xs text-muted-foreground hover:text-foreground",
					children: mode === "signin" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), children]
	});
}
function GoogleIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 18 18",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.86 2.69-6.62z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33C2.44 15.98 5.48 18 9 18z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"
			})
		]
	});
}
//#endregion
export { AuthPage as component };
