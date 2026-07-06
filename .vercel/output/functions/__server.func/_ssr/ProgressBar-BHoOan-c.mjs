import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn } from "./AppShell-DX7ldnxD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProgressBar-BHoOan-c.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Progress bar with label ALWAYS outside the fill area (above).
* Guarantees legibility on small screens.
*/
function ProgressBar({ value, label, rightLabel, tone = "primary", size = "md" }) {
	const pct = Math.max(0, Math.min(100, value));
	const fillClass = tone === "destructive" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-gradient-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [(label || rightLabel) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-baseline justify-between gap-2",
			children: [label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium text-foreground",
				children: label
			}), rightLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold text-muted-foreground tabular-nums",
				children: rightLabel
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("w-full overflow-hidden rounded-full bg-secondary", size === "sm" ? "h-1.5" : "h-2.5"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-full rounded-full transition-all duration-500", fillClass),
				style: { width: `${pct}%` }
			})
		})]
	});
}
//#endregion
export { ProgressBar as t };
