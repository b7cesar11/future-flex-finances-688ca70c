import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { W as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OverdueBadge-DxIA_cEE.js
var import_jsx_runtime = require_jsx_runtime();
function isOverdue(dueDate, status) {
	if (!dueDate || status === "pago") return false;
	const d = dueDate.length <= 10 ? /* @__PURE__ */ new Date(dueDate + "T23:59:59") : new Date(dueDate);
	if (Number.isNaN(d.getTime())) return false;
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	return d < today;
}
function OverdueBadge({ dueDate, status }) {
	if (!isOverdue(dueDate, status)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
			className: "h-2.5 w-2.5",
			strokeWidth: 3
		}), "Vencida"]
	});
}
//#endregion
export { OverdueBadge as t };
