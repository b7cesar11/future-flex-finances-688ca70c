import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Pin, UserPlus, CreditCard as CardIcon, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  useFinance,
  formatBRLFull,
  type TxKind,
  type PaymentStatus,
  type ThirdPartyType,
  type ThirdPartyDirection,
  type PaymentMethod,
} from "@/lib/finance-store";

type Search = {
  kind?: TxKind;
  terceiro?: boolean;
  direction?: ThirdPartyDirection;
};

export const Route = createFileRoute("/_authenticated/nova-transacao")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    kind: s.kind === "receita" ? "receita" : "despesa",
    terceiro: s.terceiro === true || s.terceiro === "1" || s.terceiro === "true",
    direction: s.direction === "a_pagar" ? "a_pagar" : s.direction === "a_receber" ? "a_receber" : undefined,
  }),
  head: () => ({ meta: [{ title: "Novo lançamento" }] }),
  component: NovaTransacao,
});

type Metodo = "conta" | "dinheiro" | "cartao" | "cartao_terceiro";
type Relacao = "me_deve" | "eu_devo";

function NovaTransacao() {
  const { kind = "despesa", terceiro: terceiroInitial, direction: dirInitial } = useSearch({
    from: "/_authenticated/nova-transacao",
  });
  const {
    categorias, contas, envelopes, pessoas, cartoes, terceiros,
    addTransaction, criarCompraParcelada, addThirdParty,
    updateThirdParty, setThirdPartyStatus,
  } = useFinance();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [tipo, setTipo] = useState<TxKind>(kind);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? "");
  const [contaId, setContaId] = useState(contas[0]?.id ?? "");
  const [envelopeId, setEnvelopeId] = useState<string>("");
  const [data, setData] = useState(today);
  const [dueDate, setDueDate] = useState(today);
  const [status, setStatus] = useState<PaymentStatus>("pago");
  const [isFixed, setIsFixed] = useState(false);

  // Terceiros (vem antes do método de pagamento)
  const [terceiroOn, setTerceiroOn] = useState(!!terceiroInitial);
  const [relacao, setRelacao] = useState<Relacao>(
    dirInitial === "a_pagar" ? "eu_devo" : "me_deve",
  );
  const [personId, setPersonId] = useState<string>("");
  const [notas, setNotas] = useState("");

  // Método + cartão
  const [metodo, setMetodo] = useState<Metodo>("conta");
  const [creditCardId, setCreditCardId] = useState<string>("");
  const [nomeCartaoTerceiro, setNomeCartaoTerceiro] = useState("");

  // Parcelamento
  const [parcelado, setParcelado] = useState(false);
  const [nParcelas, setNParcelas] = useState("2");
  const [parcelasJaPagas, setParcelasJaPagas] = useState("0");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal de recebimento (Regra 5)
  const [recebendo, setRecebendo] = useState<null | {
    tpId: string;
    amount: number;
    personName: string;
  }>(null);
  const [recebendoConta, setRecebendoConta] = useState(contas[0]?.id ?? "");

  const cardsAtivos = cartoes.filter((c) => c.active);
  const isReceita = tipo === "receita";

  // ===== RECEITA + pessoa: modo "receber dívida" =====
  const modoReceberDivida = isReceita && terceiroOn && !!personId;
  const dividasAReceber = useMemo(() => {
    if (!modoReceberDivida) return [];
    return terceiros.filter(
      (t) => t.personId === personId && t.direction === "a_receber" && t.status !== "pago",
    );
  }, [modoReceberDivida, personId, terceiros]);

  // Se ligar "cartão" quando não pode, força reset
  const forcarCartaoMeu = terceiroOn && relacao === "me_deve";
  const forcarCartaoTerceiro = terceiroOn && relacao === "eu_devo";
  const mostraCartaoMeu = !isReceita && (metodo === "cartao") && !forcarCartaoTerceiro;
  const mostraCartaoTerceiro = !isReceita && metodo === "cartao_terceiro" && forcarCartaoTerceiro;

  // Restringe estado se o usuário alternar tipo/relação
  const trocarTipo = (t: TxKind) => {
    setTipo(t);
    if (t === "receita") {
      if (metodo === "cartao" || metodo === "cartao_terceiro") setMetodo("conta");
      setParcelado(false);
      setIsFixed(false);
    }
  };
  const trocarRelacao = (r: Relacao) => {
    setRelacao(r);
    if (r === "eu_devo" && metodo === "cartao") setMetodo("conta");
    if (r === "me_deve" && metodo === "cartao_terceiro") setMetodo("conta");
  };
  const trocarTerceiroOn = (v: boolean) => {
    setTerceiroOn(v);
    if (!v && metodo === "cartao_terceiro") setMetodo("conta");
  };

  const usaRPC = !isReceita && (metodo === "cartao" || parcelado);
  const showStatus = !usaRPC; // parcelas nascem "pendente/pago" pela RPC

  const thirdPartyType: ThirdPartyType = useMemo(() => {
    if (relacao === "eu_devo") return "devo_a_terceiro";
    if (metodo === "cartao") return "usou_meu_cartao";
    return "emprestei_dinheiro";
  }, [relacao, metodo]);
  const direction: ThirdPartyDirection = relacao === "eu_devo" ? "a_pagar" : "a_receber";

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
        personId,
      });
      const tp = terceiros.find((t) => t.id === recebendo.tpId);
      if (tp && tp.installmentsLeft > 1) {
        await updateThirdParty(recebendo.tpId, {
          installmentsLeft: tp.installmentsLeft - 1,
          amount: Math.max(0, tp.amount - recebendo.amount),
        });
      } else {
        await setThirdPartyStatus(recebendo.tpId, "pago");
      }
      setRecebendo(null);
      void navigate({ to: "/terceiros" });
    } catch (err: any) {
      setError(err?.message ?? "Erro ao registrar recebimento");
      setSaving(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (modoReceberDivida) {
      setError("Escolha qual dívida está sendo recebida na lista acima.");
      return;
    }
    const v = parseFloat(valor.replace(",", "."));
    if (!v || v <= 0 || saving) return;

    // Validações
    if (!isReceita && metodo === "cartao" && !creditCardId)
      return setError("Selecione o cartão.");
    if (!isReceita && metodo === "cartao_terceiro" && !nomeCartaoTerceiro.trim())
      return setError("Informe o nome do cartão da outra pessoa.");
    if ((metodo === "conta" || metodo === "dinheiro" || isReceita) && !contaId)
      return setError("Selecione uma conta.");
    if (terceiroOn && !personId) return setError("Selecione a pessoa vinculada.");

    const nInst = usaRPC ? (parcelado ? Math.max(1, Number(nParcelas) || 1) : 1) : 1;
    const jaPagas = parcelado ? Math.min(nInst - 1, Math.max(0, Number(parcelasJaPagas) || 0)) : 0;

    setSaving(true);
    try {
      let purchaseGroupId: string | null = null;

      if (usaRPC) {
        purchaseGroupId = await criarCompraParcelada({
          description:
            descricao ||
            (terceiroOn
              ? `Terceiro — ${pessoas.find((p) => p.id === personId)?.name ?? "pessoa"}`
              : categorias.find((c) => c.id === categoriaId)?.nome ?? "Lançamento"),
          amountTotal: v,
          installments: nInst,
          firstDueDate: dueDate || today,
          category: categoriaId || (terceiroOn ? "terceiros" : "outros"),
          // Só usa cartão próprio na RPC quando é "cartao" (não "cartao_terceiro")
          creditCardId: metodo === "cartao" ? creditCardId : null,
          accountId: metodo === "conta" ? contaId : null,
          personId: terceiroOn ? personId : null,
          envelopeId: !isReceita ? (envelopeId || null) : null,
          parcelasJaPagas: jaPagas,
        });
      } else {
        await addTransaction({
          kind: tipo,
          descricao: descricao || categorias.find((c) => c.id === categoriaId)?.nome || "Lançamento",
          valor: v,
          data,
          dueDate: dueDate || data,
          status,
          isFixed,
          categoriaId,
          contaId: metodo === "conta" || isReceita ? contaId : "",
          envelopeId: tipo === "despesa" ? (envelopeId || null) : null,
          personId: terceiroOn ? personId : null,
        });
      }

      // Espelho no Hub de Terceiros
      if (terceiroOn && personId) {
        const pessoa = pessoas.find((p) => p.id === personId)!;
        const paymentMethod: PaymentMethod =
          metodo === "cartao" ? "cartao_credito"
          : metodo === "cartao_terceiro" ? "cartao_terceiro"
          : metodo === "dinheiro" ? "dinheiro"
          : "conta";
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
          notes: notas || null,
        });
      }

      void navigate({ to: terceiroOn ? "/terceiros" : "/transacoes" });
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar");
      setSaving(false);
    }
  };

  return (
    <AppShell
      title={isReceita ? "Nova receita" : "Nova despesa"}
      subtitle="Formulário único de lançamento"
      hidePeriodFilter
    >
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> voltar
      </button>

      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-5 shadow-card">
        {/* 1. Tipo */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
          {(["despesa", "receita"] as TxKind[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => trocarTipo(t)}
              className={`rounded-xl py-2 text-sm font-semibold capitalize transition-colors ${
                tipo === t
                  ? t === "receita"
                    ? "bg-primary text-primary-foreground"
                    : "bg-destructive text-destructive-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 2. Descrição / Valor */}
        <Field label="Descrição">
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Mercado da semana"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          />
        </Field>
        <Field label="Valor (R$)">
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            inputMode="decimal"
            placeholder="0,00"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-base font-semibold tabular-nums outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Data">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
          <Field label={metodo === "cartao" || parcelado ? "1ª parcela em" : "Vencimento"}>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
        </div>

        {/* 3. Envolve outra pessoa? (ANTES do método) */}
        <div className="rounded-2xl bg-surface-elevated p-3">
          <label className="flex items-center justify-between">
            <span className="text-sm font-semibold">Envolve outra pessoa?</span>
            <input
              type="checkbox"
              checked={terceiroOn}
              onChange={(e) => trocarTerceiroOn(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
          {terceiroOn && !isReceita && (
            <div className="mt-3">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Qual a relação?
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => trocarRelacao("me_deve")}
                  className={`rounded-xl px-3 py-2 text-left text-xs font-semibold ${
                    relacao === "me_deve" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}
                >
                  Ela me deve / eu paguei algo por ela
                </button>
                <button
                  type="button"
                  onClick={() => trocarRelacao("eu_devo")}
                  className={`rounded-xl px-3 py-2 text-left text-xs font-semibold ${
                    relacao === "eu_devo" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}
                >
                  Eu devo a ela / ela pagou algo por mim
                </button>
              </div>
            </div>
          )}
          {terceiroOn && (
            <div className="mt-3 space-y-3">
              <Field label="Pessoa">
                {pessoas.length > 0 ? (
                  <select
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                    className="w-full rounded-xl bg-card px-3 py-2.5 text-sm outline-none"
                  >
                    <option value="">— Selecione —</option>
                    {pessoas.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <Link to="/contatos" className="flex items-center justify-center gap-2 rounded-xl bg-card px-3 py-2.5 text-xs font-semibold text-primary">
                    <UserPlus className="h-3.5 w-3.5" /> Cadastre um contato primeiro
                  </Link>
                )}
              </Field>
              {!modoReceberDivida && (
                <Field label="Observação (opcional)">
                  <input
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ex: Spotify família"
                    className="w-full rounded-xl bg-card px-3 py-2.5 text-sm outline-none"
                  />
                </Field>
              )}
            </div>
          )}
        </div>

        {/* MODO RECEBIMENTO DE DÍVIDA (Regra 5) */}
        {modoReceberDivida && (
          <div className="space-y-2 rounded-2xl bg-primary/10 p-3">
            <p className="text-xs font-semibold text-primary">
              Dívidas em aberto de {pessoas.find((p) => p.id === personId)?.name}:
            </p>
            {dividasAReceber.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhuma dívida a receber em aberto. Cadastre primeiro pelo fluxo de despesa + pessoa.
              </p>
            ) : (
              dividasAReceber.map((tp) => {
                const perParcela =
                  tp.isInstallment && tp.installmentsLeft > 0
                    ? tp.amount / tp.installmentsLeft
                    : tp.amount;
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => {
                      setRecebendo({ tpId: tp.id, amount: perParcela, personName: tp.personName });
                      setRecebendoConta(contas[0]?.id ?? "");
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-card px-3 py-2.5 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {tp.notes || (tp.type === "usou_meu_cartao" ? "Cartão" : "Empréstimo")}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {tp.isInstallment ? `${tp.installmentsLeft}× de ` : ""}
                        {formatBRLFull(perParcela)}
                        {tp.isInstallment ? ` · total ${formatBRLFull(tp.amount)}` : ""}
                      </p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* 4. Método de pagamento (só se NÃO for modo receber) */}
        {!modoReceberDivida && (
          <Field label="Método de pagamento">
            <div className="grid grid-cols-3 gap-1.5">
              <MetodoBtn active={metodo === "conta"} onClick={() => setMetodo("conta")} label="Conta" />
              <MetodoBtn active={metodo === "dinheiro"} onClick={() => setMetodo("dinheiro")} label="Dinheiro" />
              {!isReceita && !forcarCartaoTerceiro && (
                <MetodoBtn active={metodo === "cartao"} onClick={() => setMetodo("cartao")} label="Cartão" />
              )}
              {!isReceita && forcarCartaoTerceiro && (
                <MetodoBtn
                  active={metodo === "cartao_terceiro"}
                  onClick={() => setMetodo("cartao_terceiro")}
                  label="Cartão dela"
                />
              )}
            </div>
          </Field>
        )}

        {!modoReceberDivida && mostraCartaoMeu && (
          <Field label="Cartão">
            {cardsAtivos.length > 0 ? (
              <select
                value={creditCardId}
                onChange={(e) => setCreditCardId(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
              >
                <option value="">— Selecione —</option>
                {cardsAtivos.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <Link to="/cartoes" className="flex items-center justify-center gap-2 rounded-xl bg-surface-elevated px-3 py-2.5 text-xs font-semibold text-primary">
                <CardIcon className="h-3.5 w-3.5" /> Cadastre um cartão primeiro
              </Link>
            )}
          </Field>
        )}

        {!modoReceberDivida && mostraCartaoTerceiro && (
          <Field label="Nome do cartão (livre, ex: “Nubank da Anna”)">
            <input
              value={nomeCartaoTerceiro}
              onChange={(e) => setNomeCartaoTerceiro(e.target.value)}
              placeholder="Cartão da Anna"
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
        )}

        {!modoReceberDivida && (metodo === "conta" || metodo === "dinheiro" || isReceita) && (
          <Field label={isReceita ? "Conta de destino" : "Conta"}>
            <select
              value={contaId}
              onChange={(e) => setContaId(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            >
              {contas.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </Field>
        )}

        {/* Parcelado + Fixa (mutex) — só despesa */}
        {!modoReceberDivida && !isReceita && (
          <div className="grid grid-cols-2 gap-2">
            <label className={`flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5 ${isFixed ? "opacity-40" : ""}`}
                   title={isFixed ? "não aplicável a despesas fixas" : undefined}>
              <span className="text-sm">Parcelado?</span>
              <input
                type="checkbox"
                checked={parcelado}
                disabled={isFixed}
                onChange={(e) => setParcelado(e.target.checked)}
                className="h-5 w-5 accent-primary"
              />
            </label>
            <label className={`flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5 ${parcelado ? "opacity-40" : ""}`}
                   title={parcelado ? "não aplicável a despesas parceladas" : undefined}>
              <span className="flex items-center gap-1 text-sm"><Pin className="h-3.5 w-3.5 text-accent" /> Fixa</span>
              <input
                type="checkbox"
                checked={isFixed}
                disabled={parcelado}
                onChange={(e) => setIsFixed(e.target.checked)}
                className="h-5 w-5 accent-primary"
              />
            </label>
          </div>
        )}

        {!modoReceberDivida && !isReceita && parcelado && (
          <div className="grid grid-cols-2 gap-2">
            <Field label="Nº de parcelas">
              <input
                inputMode="numeric"
                value={nParcelas}
                onChange={(e) => setNParcelas(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
              />
            </Field>
            <Field label="Quantas já foram pagas?">
              <input
                inputMode="numeric"
                value={parcelasJaPagas}
                onChange={(e) => setParcelasJaPagas(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
              />
            </Field>
          </div>
        )}

        {/* Receita fixa */}
        {!modoReceberDivida && isReceita && (
          <label className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm">
              <Pin className="h-4 w-4 text-accent" /> Receita fixa (ex: salário)
            </span>
            <input
              type="checkbox"
              checked={isFixed}
              onChange={(e) => setIsFixed(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
        )}

        {!modoReceberDivida && showStatus && !parcelado && (
          <Field label="Status">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
              {(["pago", "pendente", "atrasado"] as PaymentStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-lg py-1.5 text-[11px] font-semibold capitalize ${
                    status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
        )}

        {!modoReceberDivida && (
          <Field label="Categoria">
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.nome}</option>
              ))}
            </select>
          </Field>
        )}

        {!modoReceberDivida && !isReceita && envelopes.length > 0 && (
          <Field label="Envelope (opcional)">
            <select
              value={envelopeId}
              onChange={(e) => setEnvelopeId(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            >
              <option value="">— Sem envelope —</option>
              {envelopes.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.emoji} {env.name} · resta {formatBRLFull(Math.max(0, env.remaining))}
                </option>
              ))}
            </select>
          </Field>
        )}

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}

        {!modoReceberDivida && (
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {saving ? "Salvando..." : usaRPC && parcelado ? `Salvar ${nParcelas || 1} parcelas` : "Salvar"}
          </button>
        )}
      </form>

      {/* Modal recebimento */}
      {recebendo && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="w-full max-w-sm space-y-3 rounded-3xl bg-card p-5 shadow-card">
            <p className="text-sm font-semibold">
              Receber {formatBRLFull(recebendo.amount)} de {recebendo.personName}
            </p>
            <Field label="Conta de destino">
              <select
                value={recebendoConta}
                onChange={(e) => setRecebendoConta(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
              >
                {contas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRecebendo(null)}
                className="rounded-xl bg-secondary py-2.5 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarRecebimento}
                disabled={saving || !recebendoConta}
                className="rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function MetodoBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-2 py-2 text-xs font-semibold ${
        active ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
