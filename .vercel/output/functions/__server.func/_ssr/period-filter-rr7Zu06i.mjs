import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/period-filter-rr7Zu06i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
function startOfWeek(d) {
	const x = new Date(d);
	const diff = (x.getDay() + 6) % 7;
	x.setDate(x.getDate() - diff);
	x.setHours(0, 0, 0, 0);
	return x;
}
function endOfWeek(d) {
	const x = startOfWeek(d);
	x.setDate(x.getDate() + 6);
	x.setHours(23, 59, 59, 999);
	return x;
}
function startOfMonth(d) {
	return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d) {
	return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function buildRange(kind, monthRef, custom) {
	const now = /* @__PURE__ */ new Date();
	if (kind === "semanal") return {
		kind,
		start: startOfWeek(now),
		end: endOfWeek(now),
		label: "Esta semana"
	};
	if (kind === "anual") return {
		kind,
		start: new Date(now.getFullYear(), 0, 1),
		end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
		label: `${now.getFullYear()}`
	};
	if (kind === "personalizado" && custom) return {
		kind,
		start: custom.start,
		end: custom.end,
		label: `${custom.start.toLocaleDateString("pt-BR")} → ${custom.end.toLocaleDateString("pt-BR")}`
	};
	return {
		kind: "mensal",
		start: startOfMonth(monthRef),
		end: endOfMonth(monthRef),
		label: monthRef.toLocaleDateString("pt-BR", {
			month: "long",
			year: "numeric"
		})
	};
}
function PeriodFilterProvider({ children }) {
	const [kind, setKindState] = (0, import_react.useState)("mensal");
	const [custom, setCustomState] = (0, import_react.useState)();
	const [monthRef, setMonthRef] = (0, import_react.useState)(() => startOfMonth(/* @__PURE__ */ new Date()));
	const range = (0, import_react.useMemo)(() => buildRange(kind, monthRef, custom), [
		kind,
		monthRef,
		custom
	]);
	const shiftMonth = (0, import_react.useCallback)((delta) => {
		setKindState("mensal");
		setMonthRef((prev) => {
			const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
			const now = /* @__PURE__ */ new Date();
			if (next > new Date(now.getFullYear(), now.getMonth() + 24, 1)) return prev;
			return next;
		});
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		range,
		monthRef,
		setKind: (k) => setKindState(k),
		setCustom: (s, e) => {
			setCustomState({
				start: s,
				end: e
			});
			setKindState("personalizado");
		},
		shiftMonth,
		isInRange: (iso) => {
			if (!iso) return false;
			const d = iso.length <= 10 ? /* @__PURE__ */ new Date(iso + "T00:00:00") : new Date(iso);
			if (Number.isNaN(d.getTime())) return false;
			return d >= range.start && d <= range.end;
		}
	}), [
		range,
		monthRef,
		shiftMonth
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function usePeriod() {
	const v = (0, import_react.useContext)(Ctx);
	if (!v) throw new Error("usePeriod must be inside PeriodFilterProvider");
	return v;
}
/**
* Fase 5 — Hook único de navegação de mês.
* Compartilha estado com PeriodFilter, evitando duplicação em Lançamentos e Cartão.
*/
function useMonthNavigator() {
	const { monthRef, shiftMonth, range } = usePeriod();
	const now = /* @__PURE__ */ new Date();
	const maxRef = new Date(now.getFullYear(), now.getMonth() + 24, 1);
	const canGoNext = new Date(monthRef.getFullYear(), monthRef.getMonth() + 1, 1) <= maxRef;
	return {
		currentReferenceMonth: monthRef,
		label: range.label,
		goToNextMonth: () => shiftMonth(1),
		goToPreviousMonth: () => shiftMonth(-1),
		canGoNext,
		canGoPrevious: true
	};
}
//#endregion
export { useMonthNavigator as n, usePeriod as r, PeriodFilterProvider as t };
