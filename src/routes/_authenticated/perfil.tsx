import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCircle2, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useFinance } from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Perfil" }] }),
  component: Perfil,
});

function Perfil() {
  const { wipeAllData } = useFinance();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", "full"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      const { data: u } = await supabase.auth.getUser();
      return { profile: data, email: u.user?.email ?? "" };
    },
  });

  return (
    <AppShell title="Perfil" subtitle="Conta e ajustes" hidePeriodFilter>
      <section className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <UserCircle2 className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {profile?.profile?.full_name || "Sem nome"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-surface-elevated p-3">
            <dt className="text-muted-foreground">Renda mensal</dt>
            <dd className="mt-1 font-bold tabular-nums text-foreground">
              R$ {Number(profile?.profile?.monthly_income ?? 0).toFixed(0)}
            </dd>
          </div>
          <div className="rounded-xl bg-surface-elevated p-3">
            <dt className="text-muted-foreground">Gastos essenciais</dt>
            <dd className="mt-1 font-bold tabular-nums text-foreground">
              R$ {Number(profile?.profile?.essential_expenses ?? 0).toFixed(0)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-3xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="mb-2 flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Danger zone</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Apaga em cascata todos os seus lançamentos, dívidas, terceiros, fontes de renda, metas,
          investimentos e contas. Esta ação não pode ser desfeita.
        </p>
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="mt-4 w-full rounded-2xl bg-destructive py-3 text-sm font-bold text-destructive-foreground"
        >
          Limpar todos os dados
        </button>
      </section>

      <ConfirmDialog
        open={confirm}
        title="Apagar TUDO?"
        description={
          <span>
            Esta ação apaga em cascata todas as suas informações financeiras do app. Para confirmar,
            digite a palavra exatamente como aparece abaixo.
          </span>
        }
        destructive
        requireType="DELETAR"
        confirmLabel="Apagar tudo"
        onClose={() => setConfirm(false)}
        onConfirm={async () => {
          await wipeAllData();
          await qc.invalidateQueries();
          navigate({ to: "/" });
        }}
      />
    </AppShell>
  );
}
