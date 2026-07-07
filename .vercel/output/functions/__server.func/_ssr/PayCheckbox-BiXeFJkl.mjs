import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { G as LoaderCircle, P as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayCheckbox-BiXeFJkl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PayCheckbox({ paid, onToggle, size = "md", ariaLabel = "Alternar pago" }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": ariaLabel,
		"aria-pressed": paid,
		disabled: busy,
		onClick: async (e) => {
			e.stopPropagation();
			e.preventDefault();
			if (busy) return;
			setBusy(true);
			try {
				await onToggle();
			} finally {
				setBusy(false);
			}
		},
		className: `flex ${size === "sm" ? "h-6 w-6" : "h-7 w-7"} shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90 ${paid ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent text-transparent hover:border-primary/60"}`,
		children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "h-3.5 w-3.5",
			strokeWidth: 3
		})
	});
}
//#endregion
export { PayCheckbox as t };
