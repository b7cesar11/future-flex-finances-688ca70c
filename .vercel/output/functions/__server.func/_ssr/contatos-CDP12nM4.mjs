import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-j9CZbuwX.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChevronRight, _ as Pencil, i as Users, l as Trash2, p as Plus } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DX7ldnxD.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-UpGu7Zfw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contatos-CDP12nM4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPE_LABEL = {
	contato: "Contato",
	empresa: "Empresa",
	familia: "Família"
};
function saldoDaPessoa(items) {
	return items.reduce((s, t) => {
		if (t.status === "pago") return s;
		return s + (t.type === "devo_a_terceiro" ? -1 : 1) * t.amount;
	}, 0);
}
function ContatosPage() {
	const { pessoas, terceiros, addPerson, updatePerson, deletePerson } = useFinance();
	const [openNew, setOpenNew] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("contato");
	const [notes, setNotes] = (0, import_react.useState)("");
	const resetForm = () => {
		setName("");
		setType("contato");
		setNotes("");
	};
	const totaisPorPessoa = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of terceiros) {
			const key = t.personId ?? `__name__${t.personName}`;
			if (!map.has(key)) map.set(key, []);
			map.get(key).push(t);
		}
		return map;
	}, [terceiros]);
	const startEdit = (id) => {
		const p = pessoas.find((x) => x.id === id);
		if (!p) return;
		setEditing(id);
		setName(p.name);
		setType(p.type);
		setNotes(p.notes ?? "");
		setOpenNew(true);
	};
	const submit = async (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		if (editing) await updatePerson(editing, {
			name: name.trim(),
			type,
			notes: notes || null
		});
		else await addPerson({
			name: name.trim(),
			type,
			notes: notes || null
		});
		setEditing(null);
		setOpenNew(false);
		resetForm();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Contatos",
		subtitle: "Hub de pessoas, empresas e família",
		children: [
			pessoas.length === 0 && !openNew && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-card p-8 text-center shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold text-foreground",
						children: "Nenhum contato ainda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Comece cadastrando quem envolve seu dinheiro."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpenNew(true),
						className: "mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo contato"]
					})
				]
			}),
			openNew && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mb-5 space-y-3 rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-foreground",
						children: editing ? "Editar contato" : "Novo contato"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Nome",
						className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1",
						children: [
							"contato",
							"empresa",
							"familia"
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setType(t),
							className: `rounded-lg py-1.5 text-[11px] font-semibold capitalize ${type === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
							children: TYPE_LABEL[t]
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Observação (opcional)",
						className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setOpenNew(false);
								setEditing(null);
								resetForm();
							},
							className: "flex-1 rounded-xl bg-secondary py-2 text-sm font-semibold text-muted-foreground",
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "flex-1 rounded-xl bg-gradient-primary py-2 text-sm font-bold text-primary-foreground shadow-glow",
							children: "Salvar"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: pessoas.map((p) => {
					const items = totaisPorPessoa.get(p.id) ?? [];
					const saldo = saldoDaPessoa(items);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-card ring-1 ring-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/contatos/$id",
								params: { id: p.id },
								className: "flex flex-1 items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary",
										children: p.name.slice(0, 2).toUpperCase()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold text-foreground",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: [
												TYPE_LABEL[p.type],
												" · ",
												items.length,
												" lançamento(s)"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `text-sm font-bold tabular-nums ${saldo === 0 ? "text-muted-foreground" : saldo > 0 ? "text-success" : "text-destructive"}`,
											children: saldo === 0 ? "—" : `${saldo > 0 ? "+" : "−"}${formatBRLFull(Math.abs(saldo))}`
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Editar",
								onClick: () => startEdit(p.id),
								className: "text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Excluir",
								onClick: () => setConfirmDel(p.id),
								className: "text-muted-foreground hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					}, p.id);
				})
			}),
			!openNew && pessoas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpenNew(true),
				className: "fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Novo"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!confirmDel,
				title: "Excluir contato?",
				description: "Os lançamentos de terceiros vinculados ficarão sem pessoa associada.",
				destructive: true,
				confirmLabel: "Excluir",
				onClose: () => setConfirmDel(null),
				onConfirm: async () => {
					if (confirmDel) await deletePerson(confirmDel);
				}
			})
		]
	});
}
//#endregion
export { ContatosPage as component };
