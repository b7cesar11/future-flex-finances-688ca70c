import { useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Pin, UserPlus, CreditCard as CardIcon } from "lucide-react";
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

type Metodo = "conta" | "dinheiro" | "cartao";

const TERCEIRO_TIPOS: { key: ThirdPartyType; label: string; direction: ThirdPartyDirection }[] = [
  { key: "emprestei_dinheiro", label: "Emprestei dinheiro", direction: "a_receber" },
  { key: "usou_meu_cartao", label: "Usou meu cartão", direction: "a_receber" },
  { key: "devo_a_terceiro", label: "Devo a alguém", direction: "a_pagar" },
];

function NovaTransacao() {
  const { kind = "despesa", terceiro: terceiroInitial, direction: dirInitial } = useSearch({
    from: "/_authenticated/nova-transacao",
  });
  const {
    categorias, contas, envelopes, pessoas, cartoes,
    addTransaction, criarCompraParcelada, addThirdParty,
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

  // Método + cartão
  const [metodo, setMetodo] = useState<Metodo>("conta");
  const [creditCardId, setCreditCardId] = useState<string>("");

  // Parcelamento
  const [parcelado, setParcelado] = useState(false);
  const [nParcelas, setNParcelas] = useState("2");

  // Terceiros (seção opcional)
  const [terceiroOn, setTerceiroOn] = useState(!!terceiroInitial);
  const [personId, setPersonId] = useState<string>("");
  const [terceiroTipo, setTerceiroTipo] = useState<ThirdPartyType>(
    dirInitial === "a_pagar" ? "devo_a_terceiro" : "emprestei_dinheiro",
  );
  const [notas, setNotas] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardsAtivos = cartoes.filter((c) => c.active);
  const isCartao = metodo === "cartao";
  const isReceita = tipo === "receita";
  const disableCartaoEParcelado = isReceita; // RPC atende só despesas
  const usaRPC = !isReceita && (isCartao || parcelado);
  const showStatus = !usaRPC; // parcelas nascem "pendente" pela RPC

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = parseFloat(valor.replace(",", "."));
    if (!v || v <= 0 || saving) return;

    // Validações condicionais
    if (isCartao && !creditCardId) return setError("Selecione o cartão.");
    if (!isCartao && metodo === "conta" && !contaId) return setError("Selecione uma conta.");
    if (terceiroOn && !personId) return setError("Selecione a pessoa vinculada.");
    const nInst = usaRPC ? (parcelado ? Math.max(1, Number(nParcelas) || 1) : 1) : 1;

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
          creditCardId: isCartao ? creditCardId : null,
          accountId: !isCartao && metodo === "conta" ? contaId : null,
          personId: terceiroOn ? personId : null,
          envelopeId: !isReceita ? (envelopeId || null) : null,
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
          contaId: metodo === "conta" ? contaId : "",
          envelopeId: tipo === "despesa" ? (envelopeId || null) : null,
          personId: terceiroOn ? personId : null,
        });
      }

      // Espelho no Hub de Terceiros (para aparecer em /terceiros)
      if (terceiroOn && personId) {
        const pessoa = pessoas.find((p) => p.id === personId)!;
        const tipoT = TERCEIRO_TIPOS.find((t) => t.key === terceiroTipo)!;
        const paymentMethod: PaymentMethod =
          isCartao ? "cartao_credito" : metodo === "conta" ? "conta" : "sem_transacao";
        await addThirdParty({
          personId: pessoa.id,
          personName: pessoa.name,
          type: terceiroTipo,
          direction: tipoT.direction,
          paymentMethod,
          creditCardId: isCartao ? creditCardId : null,
          purchaseGroupId,
          amount: v,
          dueDate: dueDate || null,
          isInstallment: parcelado,
          installmentsLeft: nInst,
          status: "pendente",
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
        {/* Kind */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
          {(["despesa", "receita"] as TxKind[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipo(t);
                if (t === "receita") { setMetodo("conta"); setParcelado(false); }
              }}
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

        {/* Método de pagamento */}
        {!isReceita && (
          <Field label="Método de pagamento">
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: "conta" as Metodo, label: "Conta" },
                { key: "dinheiro" as Metodo, label: "Dinheiro" },
                { key: "cartao" as Metodo, label: "Cartão" },
              ].map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setMetodo(o.key)}
                  disabled={disableCartaoEParcelado && o.key === "cartao"}
                  className={`rounded-xl px-2 py-2 text-xs font-semibold ${
                    metodo === o.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-elevated text-muted-foreground disabled:opacity-40"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Field>
        )}

        {isCartao && (
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
              <Link
                to="/cartoes"
                className="flex items-center justify-center gap-2 rounded-xl bg-surface-elevated px-3 py-2.5 text-xs font-semibold text-primary"
              >
                <CardIcon className="h-3.5 w-3.5" /> Cadastre um cartão primeiro
              </Link>
            )}
          </Field>
        )}

        {(isReceita || metodo === "conta") && (
          <Field label="Conta">
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

        <div className="grid grid-cols-2 gap-2">
          <Field label="Data">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
          <Field label={isCartao || parcelado ? "1ª parcela em" : "Vencimento"}>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
            />
          </Field>
        </div>

        {/* Parcelado (despesa) */}
        {!isReceita && (
          <>
            <label className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5">
              <span className="text-sm">Parcelado?</span>
              <input
                type="checkbox"
                checked={parcelado}
                onChange={(e) => setParcelado(e.target.checked)}
                className="h-5 w-5 accent-primary"
              />
            </label>
            {parcelado && (
              <Field label="Nº de parcelas">
                <input
                  inputMode="numeric"
                  value={nParcelas}
                  onChange={(e) => setNParcelas(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
                />
              </Field>
            )}
          </>
        )}

        {showStatus && (
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

        {!isReceita && envelopes.length > 0 && (
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

        {/* Seção terceiros */}
        <div className="rounded-2xl bg-surface-elevated p-3">
          <label className="flex items-center justify-between">
            <span className="text-sm font-semibold">Vincular a alguém (terceiros)</span>
            <input
              type="checkbox"
              checked={terceiroOn}
              onChange={(e) => setTerceiroOn(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
          {terceiroOn && (
            <div className="mt-3 space-y-3">
              <Field label="Tipo">
                <div className="grid grid-cols-1 gap-1.5">
                  {TERCEIRO_TIPOS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => {
                        setTerceiroTipo(t.key);
                        if (t.key === "usou_meu_cartao") setMetodo("cartao");
                      }}
                      className={`rounded-xl px-3 py-2 text-left text-xs font-semibold ${
                        terceiroTipo === t.key
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </Field>
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
                  <Link
                    to="/contatos"
                    className="flex items-center justify-center gap-2 rounded-xl bg-card px-3 py-2.5 text-xs font-semibold text-primary"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Cadastre um contato primeiro
                  </Link>
                )}
              </Field>
              <Field label="Observação (opcional)">
                <input
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ex: Spotify família"
                  className="w-full rounded-xl bg-card px-3 py-2.5 text-sm outline-none"
                />
              </Field>
            </div>
          )}
        </div>

        {!isReceita && !usaRPC && (
          <label className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm">
              <Pin className="h-4 w-4 text-accent" /> Despesa fixa (água, luz, internet…)
            </span>
            <input
              type="checkbox"
              checked={isFixed}
              onChange={(e) => setIsFixed(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
        )}

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
        >
          {saving ? "Salvando..." : usaRPC && parcelado ? `Salvar ${nParcelas || 1} parcelas` : "Salvar"}
        </button>
      </form>
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
