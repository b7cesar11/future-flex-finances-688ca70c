import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PayCheckbox } from "@/components/PayCheckbox";
import { OverdueBadge } from "@/components/OverdueBadge";
import { formatBRLFull, useFinance, type ThirdPartyType } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/contatos/$id")({
  head: () => ({ meta: [{ title: "Perfil do contato" }] }),
  component: PerfilPessoa,
});

const TYPE_LABEL: Record<ThirdPartyType, string> = {
  emprestei_dinheiro: "Emprestei",
  usou_meu_cartao: "Usou meu cartão",
  devo_a_terceiro: "Devo",
};

function PerfilPessoa() {
  const { id } = useParams({ from: "/_authenticated/contatos/$id" });
  const { pessoas, terceiros, setThirdPartyStatus } = useFinance();
  const pessoa = pessoas.find((p) => p.id === id);
  const items = terceiros.filter((t) => t.personId === id);

  const pendentes = items.filter((t) => t.status !== "pago");
  const historicoPago = items.filter((t) => t.status === "pago");

  const saldo = pendentes.reduce((s, t) => {
    const sign = t.type === "devo_a_terceiro" ? -1 : 1;
    return s + sign * t.amount;
  }, 0);
  const totalHistorico = items.reduce((s, t) => s + t.amount, 0);

  if (!pessoa) {
    return (
      <AppShell title="Contato" hidePeriodFilter>
        <p className="text-sm text-muted-foreground">Contato não encontrado.</p>
        <Link to="/contatos" className="mt-3 inline-block text-xs text-primary">
          Voltar
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell title={pessoa.name} subtitle={`Perfil consolidado`} hidePeriodFilter>
      <Link
        to="/contatos"
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> voltar
      </Link>

      <div className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <p className="text-[11px] uppercase tracking-wide opacity-80">Saldo em aberto</p>
        <p className="mt-1 text-3xl font-bold tabular-nums">
          {saldo === 0 ? "R$ 0,00" : `${saldo > 0 ? "+" : "−"}${formatBRLFull(Math.abs(saldo))}`}
        </p>
        <p className="mt-1 text-[11px] opacity-80">
          {saldo >= 0 ? "A receber" : "A pagar"} · Histórico total {formatBRLFull(totalHistorico)}
        </p>
      </div>

      <section className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Em aberto
        </p>
        {pendentes.length === 0 && (
          <p className="rounded-2xl bg-card p-4 text-center text-xs text-muted-foreground shadow-card">
            Nada pendente
          </p>
        )}
        <ul className="space-y-2">
          {pendentes.map((t) => (
            <li key={t.id} className="rounded-2xl bg-card px-3 py-2.5 shadow-card ring-1 ring-warning/25">
              <div className="flex items-center gap-3">
                <PayCheckbox
                  paid={false}
                  onToggle={() => setThirdPartyStatus(t.id, "pago")}
                  ariaLabel="Marcar como pago"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {TYPE_LABEL[t.type]}
                    <OverdueBadge dueDate={t.dueDate} status={t.status} />
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.dueDate
                      ? `Venc ${new Date(t.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}`
                      : "Sem vencimento"}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    t.type === "devo_a_terceiro" ? "text-destructive" : "text-success"
                  }`}
                >
                  {formatBRLFull(t.amount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Histórico pago
        </p>
        {historicoPago.length === 0 && (
          <p className="rounded-2xl bg-card p-4 text-center text-xs text-muted-foreground shadow-card">
            Ainda sem histórico
          </p>
        )}
        <ul className="space-y-2">
          {historicoPago.map((t) => (
            <li key={t.id} className="rounded-2xl bg-card px-3 py-2.5 shadow-card opacity-70">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">{TYPE_LABEL[t.type]}</p>
                <p className="text-sm font-semibold tabular-nums text-muted-foreground">
                  {formatBRLFull(t.amount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
