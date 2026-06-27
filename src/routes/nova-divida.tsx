import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreditCard, Landmark, HandCoins, Check } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { useFinance, type DebtType } from "@/lib/finance-store";

export const Route = createFileRoute("/nova-divida")({
  head: () => ({
    meta: [
      { title: "Nova Dívida" },
      { name: "description", content: "Cadastre uma nova dívida em segundos." },
    ],
  }),
  component: NovaDivida,
});

const tipos: { label: DebtType; icon: typeof CreditCard }[] = [
  { label: "Cartão de Crédito", icon: CreditCard },
  { label: "Empréstimo", icon: HandCoins },
  { label: "Financiamento", icon: Landmark },
];

function NovaDivida() {
  const { addDebt } = useFinance();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState("");
  const [tipo, setTipo] = useState<DebtType>("Cartão de Crédito");

  const canSubmit = nome.trim() && Number(valor) > 0 && Number(parcelas) > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    addDebt({
      nome: nome.trim(),
      valorParcela: Number(valor),
      parcelasRestantes: Number(parcelas),
      tipo,
    });
    navigate({ to: "/minhas-dividas" });
  }

  return (
    <AppShell title="Nova dívida" subtitle="Adicione em poucos toques.">
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
                onChange={(e) => setValor(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="0"
                className="w-full rounded-2xl bg-surface py-3.5 pl-10 pr-3 text-base text-foreground placeholder:text-muted-foreground/60 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
              />
            </div>
          </Field>
          <Field label="Parcelas restantes">
            <input
              inputMode="numeric"
              value={parcelas}
              onChange={(e) => setParcelas(e.target.value.replace(/\D/g, ""))}
              placeholder="12"
              className="w-full rounded-2xl bg-surface px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/60 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
            />
          </Field>
        </div>

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

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-4 w-full rounded-2xl bg-gradient-primary px-5 py-4 text-base font-semibold text-primary-foreground shadow-glow transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Salvar projeção
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
