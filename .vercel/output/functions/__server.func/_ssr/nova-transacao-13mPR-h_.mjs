import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatBRLFull, o as useFinance } from "./finance-store-DtGAnrm7.mjs";
import { _ as useSearch, g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as ArrowLeft, O as CreditCard, Y as CircleCheck, c as TrendingDown, m as Pin, o as UserPlus, s as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-C8xxjcGv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nova-transacao-13mPR-h_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NovaTransacao() {
	const { kind, terceiro: terceiroInitial, direction: dirInitial } = useSearch({ from: "/_authenticated/nova-transacao" });
	const navigate = useNavigate();
	if (!kind) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-5 pt-8 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold text-foreground",
				children: "O que você quer registrar?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Escolha o tipo para continuar."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void navigate({
						to: "/nova-transacao",
						search: { kind: "despesa" }
					}),
					className: "flex items-center gap-4 rounded-2xl bg-card p-5 text-left shadow-card transition-transform active:scale-[0.98] hover:ring-2 hover:ring-destructive/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-base font-semibold text-foreground",
							children: "Despesa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted-foreground",
							children: "Um gasto que saiu ou vai sair"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void navigate({
						to: "/nova-transacao",
						search: { kind: "receita" }
					}),
					className: "flex items-center gap-4 rounded-2xl bg-card p-5 text-left shadow-card transition-transform active:scale-[0.98] hover:ring-2 hover:ring-primary/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-base font-semibold text-foreground",
							children: "Receita"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted-foreground",
							children: "Dinheiro que entrou"
						})]
					})]
				})]
			})
		]
	});
	const { categorias, contas, envelopes, pessoas, cartoes, terceiros, addTransaction, criarCompraParcelada, addThirdParty, updateThirdParty, setThirdPartyStatus } = useFinance();
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const [tipo, setTipo] = (0, import_react.useState)(kind);
	const [descricao, setDescricao] = (0, import_react.useState)("");
	const [valor, setValor] = (0, import_react.useState)("");
	const [categoriaId, setCategoriaId] = (0, import_react.useState)(categorias[0]?.id ?? "");
	const [contaId, setContaId] = (0, import_react.useState)(contas[0]?.id ?? "");
	const [envelopeId, setEnvelopeId] = (0, import_react.useState)("");
	const [data, setData] = (0, import_react.useState)(today);
	const [dueDate, setDueDate] = (0, import_react.useState)(today);
	const [status, setStatus] = (0, import_react.useState)("pago");
	const [isFixed, setIsFixed] = (0, import_react.useState)(false);
	const [terceiroOn, setTerceiroOn] = (0, import_react.useState)(!!terceiroInitial);
	const [relacao, setRelacao] = (0, import_react.useState)(dirInitial === "a_pagar" ? "eu_devo" : "me_deve");
	const [personId, setPersonId] = (0, import_react.useState)("");
	const [notas, setNotas] = (0, import_react.useState)("");
	const [metodo, setMetodo] = (0, import_react.useState)("conta");
	const [creditCardId, setCreditCardId] = (0, import_react.useState)("");
	const [nomeCartaoTerceiro, setNomeCartaoTerceiro] = (0, import_react.useState)("");
	const [parcelado, setParcelado] = (0, import_react.useState)(false);
	const [nParcelas, setNParcelas] = (0, import_react.useState)("2");
	const [parcelasJaPagas, setParcelasJaPagas] = (0, import_react.useState)("0");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [recebendo, setRecebendo] = (0, import_react.useState)(null);
	const [recebendoConta, setRecebendoConta] = (0, import_react.useState)(contas[0]?.id ?? "");
	const cardsAtivos = cartoes.filter((c) => c.active);
	const isReceita = tipo === "receita";
	const modoReceberDivida = isReceita && terceiroOn && !!personId;
	const dividasAReceber = (0, import_react.useMemo)(() => {
		if (!modoReceberDivida) return [];
		return terceiros.filter((t) => t.personId === personId && t.direction === "a_receber" && t.status !== "pago");
	}, [
		modoReceberDivida,
		personId,
		terceiros
	]);
	const forcarCartaoTerceiro = terceiroOn && relacao === "eu_devo";
	const mostraCartaoMeu = !isReceita && metodo === "cartao" && !forcarCartaoTerceiro;
	const mostraCartaoTerceiro = !isReceita && metodo === "cartao_terceiro" && forcarCartaoTerceiro;
	const trocarTipo = (t) => {
		setTipo(t);
		if (t === "receita") {
			if (metodo === "cartao" || metodo === "cartao_terceiro") setMetodo("conta");
			setParcelado(false);
			setIsFixed(false);
		}
	};
	const trocarRelacao = (r) => {
		setRelacao(r);
		if (r === "eu_devo" && metodo === "cartao") setMetodo("conta");
		if (r === "me_deve" && metodo === "cartao_terceiro") setMetodo("conta");
	};
	const trocarTerceiroOn = (v) => {
		setTerceiroOn(v);
		if (!v && metodo === "cartao_terceiro") setMetodo("conta");
	};
	const usaRPC = !isReceita && (metodo === "cartao" || parcelado);
	const showStatus = !usaRPC;
	const thirdPartyType = (0, import_react.useMemo)(() => {
		if (relacao === "eu_devo") return "devo_a_terceiro";
		if (metodo === "cartao") return "usou_meu_cartao";
		return "emprestei_dinheiro";
	}, [relacao, metodo]);
	const direction = relacao === "eu_devo" ? "a_pagar" : "a_receber";
	const confirmarRecebimento = async () => {
		if (!recebendo || !recebendoConta) return;
		setSaving(true);
		try {
			await addTransaction({
				kind: "receita",
				descricao: `Recebimento de ${recebendo.personName}`,
				valor: recebendo.amount,
				data: today,
				dueDate: today,
				status: "pago",
				isFixed: false,
				categoriaId: "salario",
				contaId: recebendoConta,
				envelopeId: null,
				personId
			});
			const tp = terceiros.find((t) => t.id === recebendo.tpId);
			if (tp && tp.installmentsLeft > 1) await updateThirdParty(recebendo.tpId, {
				installmentsLeft: tp.installmentsLeft - 1,
				amount: Math.max(0, tp.amount - recebendo.amount)
			});
			else await setThirdPartyStatus(recebendo.tpId, "pago");
			setRecebendo(null);
			navigate({ to: "/terceiros" });
		} catch (err) {
			setError(err?.message ?? "Erro ao registrar recebimento");
			setSaving(false);
		}
	};
	const submit = async (e) => {
		e.preventDefault();
		setError(null);
		if (modoReceberDivida) {
			setError("Escolha qual dívida está sendo recebida na lista acima.");
			return;
		}
		const v = parseFloat(valor.replace(",", "."));
		if (!v || v <= 0 || saving) return;
		if (!isReceita && metodo === "cartao" && !creditCardId) return setError("Selecione o cartão.");
		if (!isReceita && metodo === "cartao_terceiro" && !nomeCartaoTerceiro.trim()) return setError("Informe o nome do cartão da outra pessoa.");
		if ((metodo === "conta" || metodo === "dinheiro" || isReceita) && !contaId) return setError("Selecione uma conta.");
		if (terceiroOn && !personId) return setError("Selecione a pessoa vinculada.");
		const nInst = usaRPC ? parcelado ? Math.max(1, Number(nParcelas) || 1) : 1 : 1;
		const jaPagas = parcelado ? Math.min(nInst - 1, Math.max(0, Number(parcelasJaPagas) || 0)) : 0;
		setSaving(true);
		try {
			let purchaseGroupId = null;
			if (usaRPC) purchaseGroupId = await criarCompraParcelada({
				description: descricao || (terceiroOn ? `Terceiro — ${pessoas.find((p) => p.id === personId)?.name ?? "pessoa"}` : categorias.find((c) => c.id === categoriaId)?.nome ?? "Lançamento"),
				amountTotal: v,
				installments: nInst,
				firstDueDate: dueDate || today,
				category: categoriaId || (terceiroOn ? "terceiros" : "outros"),
				creditCardId: metodo === "cartao" ? creditCardId : null,
				accountId: metodo === "conta" ? contaId : null,
				personId: terceiroOn ? personId : null,
				envelopeId: !isReceita ? envelopeId || null : null,
				parcelasJaPagas: jaPagas
			});
			else await addTransaction({
				kind: tipo,
				descricao: descricao || categorias.find((c) => c.id === categoriaId)?.nome || "Lançamento",
				valor: v,
				data,
				dueDate: dueDate || data,
				status,
				isFixed,
				categoriaId,
				contaId: metodo === "conta" || isReceita ? contaId : "",
				envelopeId: tipo === "despesa" ? envelopeId || null : null,
				personId: terceiroOn ? personId : null
			});
			if (terceiroOn && personId) {
				const pessoa = pessoas.find((p) => p.id === personId);
				const paymentMethod = metodo === "cartao" ? "cartao_credito" : metodo === "cartao_terceiro" ? "cartao_terceiro" : metodo === "dinheiro" ? "dinheiro" : "conta";
				await addThirdParty({
					personId: pessoa.id,
					personName: pessoa.name,
					type: thirdPartyType,
					direction,
					paymentMethod,
					creditCardId: metodo === "cartao" ? creditCardId : null,
					nomeCartaoTerceiro: metodo === "cartao_terceiro" ? nomeCartaoTerceiro.trim() : null,
					purchaseGroupId,
					amount: v,
					dueDate: dueDate || null,
					isInstallment: parcelado,
					installmentsLeft: nInst - jaPagas,
					status: jaPagas === nInst ? "pago" : "pendente",
					notes: notas || null
				});
			}
			navigate({ to: terceiroOn ? "/terceiros" : "/transacoes" });
		} catch (err) {
			setError(err?.message ?? "Erro ao salvar");
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: isReceita ? "Nova receita" : "Nova despesa",
		subtitle: "Formulário único de lançamento",
		hidePeriodFilter: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => navigate({ to: "/" }),
				className: "mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " voltar"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-4 rounded-3xl bg-card p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1",
						children: ["despesa", "receita"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => trocarTipo(t),
							className: `rounded-xl py-2 text-sm font-semibold capitalize transition-colors ${tipo === t ? t === "receita" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground" : "text-muted-foreground"}`,
							children: t
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Descrição",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: descricao,
							onChange: (e) => setDescricao(e.target.value),
							placeholder: "Ex: Mercado da semana",
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Valor (R$)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: valor,
							onChange: (e) => setValor(e.target.value),
							inputMode: "decimal",
							placeholder: "0,00",
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-base font-semibold tabular-nums outline-none"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Data",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: data,
								onChange: (e) => setData(e.target.value),
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: metodo === "cartao" || parcelado ? "1ª parcela em" : "Vencimento",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: dueDate,
								onChange: (e) => setDueDate(e.target.value),
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-surface-elevated p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: "Envolve outra pessoa?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: terceiroOn,
									onChange: (e) => trocarTerceiroOn(e.target.checked),
									className: "h-5 w-5 accent-primary"
								})]
							}),
							terceiroOn && !isReceita && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Qual a relação?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => trocarRelacao("me_deve"),
										className: `rounded-xl px-3 py-2 text-left text-xs font-semibold ${relacao === "me_deve" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`,
										children: "Ela me deve / eu paguei algo por ela"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => trocarRelacao("eu_devo"),
										className: `rounded-xl px-3 py-2 text-left text-xs font-semibold ${relacao === "eu_devo" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`,
										children: "Eu devo a ela / ela pagou algo por mim"
									})]
								})]
							}),
							terceiroOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Pessoa",
									children: pessoas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: personId,
										onChange: (e) => setPersonId(e.target.value),
										className: "w-full rounded-xl bg-card px-3 py-2.5 text-sm outline-none",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "— Selecione —"
										}), pessoas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: p.id,
											children: p.name
										}, p.id))]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/contatos",
										className: "flex items-center justify-center gap-2 rounded-xl bg-card px-3 py-2.5 text-xs font-semibold text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), " Cadastre um contato primeiro"]
									})
								}), !modoReceberDivida && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Observação (opcional)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: notas,
										onChange: (e) => setNotas(e.target.value),
										placeholder: "Ex: Spotify família",
										className: "w-full rounded-xl bg-card px-3 py-2.5 text-sm outline-none"
									})
								})]
							})
						]
					}),
					modoReceberDivida && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded-2xl bg-primary/10 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold text-primary",
							children: [
								"Dívidas em aberto de ",
								pessoas.find((p) => p.id === personId)?.name,
								":"
							]
						}), dividasAReceber.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Nenhuma dívida a receber em aberto. Cadastre primeiro pelo fluxo de despesa + pessoa."
						}) : dividasAReceber.map((tp) => {
							const perParcela = tp.isInstallment && tp.installmentsLeft > 0 ? tp.amount / tp.installmentsLeft : tp.amount;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setRecebendo({
										tpId: tp.id,
										amount: perParcela,
										personName: tp.personName
									});
									setRecebendoConta(contas[0]?.id ?? "");
								},
								className: "flex w-full items-center justify-between rounded-xl bg-card px-3 py-2.5 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: tp.notes || (tp.type === "usou_meu_cartao" ? "Cartão" : "Empréstimo")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										tp.isInstallment ? `${tp.installmentsLeft}× de ` : "",
										formatBRLFull(perParcela),
										tp.isInstallment ? ` · total ${formatBRLFull(tp.amount)}` : ""
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" })]
							}, tp.id);
						})]
					}),
					!modoReceberDivida && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Método de pagamento",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetodoBtn, {
									active: metodo === "conta",
									onClick: () => setMetodo("conta"),
									label: "Conta"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetodoBtn, {
									active: metodo === "dinheiro",
									onClick: () => setMetodo("dinheiro"),
									label: "Dinheiro"
								}),
								!isReceita && !forcarCartaoTerceiro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetodoBtn, {
									active: metodo === "cartao",
									onClick: () => setMetodo("cartao"),
									label: "Cartão"
								}),
								!isReceita && forcarCartaoTerceiro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetodoBtn, {
									active: metodo === "cartao_terceiro",
									onClick: () => setMetodo("cartao_terceiro"),
									label: "Cartão dela"
								})
							]
						})
					}),
					!modoReceberDivida && mostraCartaoMeu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Cartão",
						children: cardsAtivos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: creditCardId,
							onChange: (e) => setCreditCardId(e.target.value),
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— Selecione —"
							}), cardsAtivos.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cartoes",
							className: "flex items-center justify-center gap-2 rounded-xl bg-surface-elevated px-3 py-2.5 text-xs font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" }), " Cadastre um cartão primeiro"]
						})
					}),
					!modoReceberDivida && mostraCartaoTerceiro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nome do cartão (livre, ex: “Nubank da Anna”)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: nomeCartaoTerceiro,
							onChange: (e) => setNomeCartaoTerceiro(e.target.value),
							placeholder: "Cartão da Anna",
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
						})
					}),
					!modoReceberDivida && (metodo === "conta" || metodo === "dinheiro" || isReceita) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: isReceita ? "Conta de destino" : "Conta",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: contaId,
							onChange: (e) => setContaId(e.target.value),
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
							children: contas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.nome
							}, c.id))
						})
					}),
					!modoReceberDivida && !isReceita && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: `flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5 ${isFixed ? "opacity-40" : ""}`,
							title: isFixed ? "não aplicável a despesas fixas" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Parcelado?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: parcelado,
								disabled: isFixed,
								onChange: (e) => setParcelado(e.target.checked),
								className: "h-5 w-5 accent-primary"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: `flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5 ${parcelado ? "opacity-40" : ""}`,
							title: parcelado ? "não aplicável a despesas parceladas" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-3.5 w-3.5 text-accent" }), " Fixa"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: isFixed,
								disabled: parcelado,
								onChange: (e) => setIsFixed(e.target.checked),
								className: "h-5 w-5 accent-primary"
							})]
						})]
					}),
					!modoReceberDivida && !isReceita && parcelado && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nº de parcelas",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "numeric",
								value: nParcelas,
								onChange: (e) => setNParcelas(e.target.value.replace(/\D/g, "")),
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Quantas já foram pagas?",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								inputMode: "numeric",
								value: parcelasJaPagas,
								onChange: (e) => setParcelasJaPagas(e.target.value.replace(/\D/g, "")),
								placeholder: "0",
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
							})
						})]
					}),
					!modoReceberDivida && isReceita && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "h-4 w-4 text-accent" }), " Receita fixa (ex: salário)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: isFixed,
							onChange: (e) => setIsFixed(e.target.checked),
							className: "h-5 w-5 accent-primary"
						})]
					}),
					!modoReceberDivida && showStatus && !parcelado && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1",
							children: [
								"pago",
								"pendente",
								"atrasado"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setStatus(s),
								className: `rounded-lg py-1.5 text-[11px] font-semibold capitalize ${status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
								children: s
							}, s))
						})
					}),
					!modoReceberDivida && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Categoria",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: categoriaId,
							onChange: (e) => setCategoriaId(e.target.value),
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
							children: categorias.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: c.id,
								children: [
									c.emoji,
									" ",
									c.nome
								]
							}, c.id))
						})
					}),
					!modoReceberDivida && !isReceita && envelopes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Envelope (opcional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: envelopeId,
							onChange: (e) => setEnvelopeId(e.target.value),
							className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— Sem envelope —"
							}), envelopes.map((env) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: env.id,
								children: [
									env.emoji,
									" ",
									env.name,
									" · resta ",
									formatBRLFull(Math.max(0, env.remaining))
								]
							}, env.id))]
						})
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive",
						children: error
					}),
					!modoReceberDivida && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: saving,
						className: "w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50",
						children: saving ? "Salvando..." : usaRPC && parcelado ? `Salvar ${nParcelas || 1} parcelas` : "Salvar"
					})
				]
			}),
			recebendo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm space-y-3 rounded-3xl bg-card p-5 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-semibold",
							children: [
								"Receber ",
								formatBRLFull(recebendo.amount),
								" de ",
								recebendo.personName
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Conta de destino",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: recebendoConta,
								onChange: (e) => setRecebendoConta(e.target.value),
								className: "w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none",
								children: contas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.nome
								}, c.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setRecebendo(null),
								className: "rounded-xl bg-secondary py-2.5 text-xs font-semibold",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: confirmarRecebimento,
								disabled: saving || !recebendoConta,
								className: "rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground disabled:opacity-50",
								children: saving ? "Salvando..." : "Confirmar"
							})]
						})
					]
				})
			})
		]
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
function MetodoBtn({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `rounded-xl px-2 py-2 text-xs font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground"}`,
		children: label
	});
}
//#endregion
export { NovaTransacao as component };
