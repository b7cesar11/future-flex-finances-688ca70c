import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { V as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ConfirmDialog-UpGu7Zfw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConfirmDialog({ open, title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", requireType, destructive = false, onClose, onConfirm }) {
	const [typed, setTyped] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!open) return null;
	const canConfirm = !requireType || typed === requireType;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Fechar",
			className: "absolute inset-0 bg-black/70",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-sm rounded-3xl bg-card p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2",
					children: [destructive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15 text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold text-foreground",
						children: title
					})]
				}),
				description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 text-sm text-muted-foreground",
					children: description
				}),
				requireType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mb-3 block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mb-1 block text-[11px] uppercase text-muted-foreground",
						children: [
							"Digite ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-destructive",
								children: requireType
							}),
							" para confirmar"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: typed,
						onChange: (e) => setTyped(e.target.value),
						className: "w-full rounded-xl bg-surface-elevated px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-destructive"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-semibold text-foreground",
						children: cancelLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !canConfirm || busy,
						onClick: async () => {
							if (!canConfirm || busy) return;
							setBusy(true);
							try {
								await onConfirm();
								setTyped("");
								onClose();
							} finally {
								setBusy(false);
							}
						},
						className: `flex-1 rounded-2xl py-2.5 text-sm font-semibold disabled:opacity-40 ${destructive ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`,
						children: busy ? "..." : confirmLabel
					})]
				})
			]
		})]
	});
}
//#endregion
export { ConfirmDialog as t };
