import { useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useFinance, type TxKind } from "@/lib/finance-store";

type Search = { kind?: TxKind };

export const Route = createFileRoute("/_authenticated/nova-transacao")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    kind: s.kind === "receita" ? "receita" : "despesa",
  }),
  head: () => ({ meta: [{ title: "Nova transação" }] }),
  component: NovaTransacao,
});

function NovaTransacao() {
  const { kind = "despesa" } = useSearch({ from: "/_authenticated/nova-transacao" });
  const { categorias, contas, addTransaction } = useFinance();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<TxKind>(kind);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? "");
  const [contaId, setContaId] = useState(contas[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(valor.replace(",", "."));
    if (!descricao || !v || saving) return;
    setSaving(true);
    setError(null);
    try {
      await addTransaction({
        kind: tipo,
        descricao,
        valor: v,
        data: new Date().toISOString().slice(0, 10),
        categoriaId,
        contaId,
      });
      void navigate({ to: "/transacoes" });
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar");
      setSaving(false);
    }
  };

  return (
    <AppShell title={tipo === "receita" ? "Nova receita" : "Nova despesa"} subtitle="Registre agora">
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> voltar
      </button>

      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-5 shadow-card">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
          {(["despesa", "receita"] as TxKind[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
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
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </Field>

        <Field label="Valor (R$)">
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            inputMode="decimal"
            placeholder="0,00"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-base font-semibold tabular-nums outline-none placeholder:text-muted-foreground"
          />
        </Field>

        <Field label="Categoria">
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.nome}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Conta">
          <select
            value={contaId}
            onChange={(e) => setContaId(e.target.value)}
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          >
            {contas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Field>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
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
