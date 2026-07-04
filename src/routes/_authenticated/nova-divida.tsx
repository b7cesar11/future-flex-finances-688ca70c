import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreditCard, Landmark, HandCoins, Check } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { useFinance, type DebtType, type DebtCategory } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/nova-divida")({
  head: () => ({ meta: [{ title: "Nova Dívida" }] }),
  component: NovaDivida,
});

const tipos: { label: DebtType; icon: typeof CreditCard }[] = [
  { label: "Cartão de Crédito", icon: CreditCard },
  { label: "Empréstimo", icon: HandCoins },
  { label: "Financiamento", icon: Landmark },
];

function NovaDivida() {
  const { criarDividaCompromisso } = useFinance();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState("");
  const [tipo, setTipo] = useState<DebtType>("Cartão de Crédito");
  const [category, setCategory] = useState<DebtCategory>("parcelada");
  const [dueDay, setDueDay] = useState("10");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFixed = category === "fixa";
  const canSubmit =
    nome.trim() && Number(valor) > 0 && (isFixed || Number(parcelas) > 0);

  // Calcula a primeira data de vencimento com base no dia escolhido
  function calcFirstDueDate(): string {
    const today = new Date();
    const day = dueDay ? Number(dueDay) : 10;
    const year = today.getFullYear();
    const month = today.getMonth();
    // Se o dia já passou neste mês, usa o próximo mês
    const candidate = new Date(year, month, day);
    if (candidate < today) {
      candidate.setMonth(candidate.getMonth() + 1);
    }
    return candidate.toISOString().slice(0, 10);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || saving) return;
    setSaving(true);
    setError(null);
    try {
      await criarDividaCompromisso({
        nome: nome.trim(),
        tipo,
        valorParcela: Number(valor.replace(",", ".")),
        parcelas: isFixed ? 1 : Number(parcelas),
        firstDueDate: calcFirstDueDate(),
        category,
      });
      navigate({ to: "/minhas-dividas" });
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar");
      setSaving(false);
    }
  }

  return (
    <AppShell title="Nova dívida" subtitle="Adicione em poucos toques." hidePeriodFilter>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="O que é?">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Fatura Nubank"
            className="w-full rounded-2xl bg-surface px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor da parcela">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                R$
              </span>
              <input
                inputMode="decimal"
                value={valor}
                onChange={(e) => setValor(e.target.value.replace(/[^\d.,]/g, ""))}
                placeholder="0"
                className="w-full rounded-2xl bg-surface py-3.5 pl-10 pr-3 text-base text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
              />
            </div>
          </Field>
          <Field label={isFixed ? "Parcelas (n/a)" : "Parcelas restantes"}>
            <input
              inputMode="numeric"
              value={isFixed ? "" : parcelas}
              disabled={isFixed}
              onChange={(e) => setParcelas(e.target.value.replace(/\D/g, ""))}
              placeholder={isFixed ? "—" : "12"}
              className="w-full rounded-2xl bg-surface px-4 py-3.5 text-base text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </Field>
        </div>

        <Field label="Categoria">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { key: "parcelada", label: "Parcelada" },
                { key: "variavel", label: "Variável" },
                { key: "fixa", label: "Fixa" },
                { key: "congelada", label: "Congelada" },
              ] as { key: DebtCategory; label: string }[]
            ).map((c) => {
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={cn(
                    "rounded-2xl px-3 py-2.5 text-sm font-semibold ring-1 transition-all",
                    active
                      ? "bg-primary/15 text-primary ring-primary/40"
                      : "bg-surface text-muted-foreground ring-border",
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Dia do vencimento">
          <input
            inputMode="numeric"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value.replace(/\D/g, "").slice(0, 2))}
            placeholder="10"
            className="w-full rounded-2xl bg-surface px-4 py-3.5 text-base text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
          />
        </Field>


        <Field label="Tipo">
          <div className="flex flex-wrap gap-2">
            {tipos.map(({ label, icon: Icon }) => {
              const active = tipo === label;
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => setTipo(label)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-surface text-muted-foreground ring-1 ring-border hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {active && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </Field>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}
        <button
          type="submit"
          disabled={!canSubmit || saving}
          className="mt-4 w-full rounded-2xl bg-gradient-primary px-5 py-4 text-base font-semibold text-primary-foreground shadow-glow disabled:opacity-40"
        >
          {saving ? "Salvando..." : "Salvar projeção"}
        </button>
      </form>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
