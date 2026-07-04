import { useState, type ReactNode } from "react";
import { LogOut, Menu, X, Users, CalendarClock, UserCircle2, PiggyBank, Package, Contact, CreditCard } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "./BottomNav";
import { PeriodFilter } from "./PeriodFilter";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  hidePeriodFilter?: boolean;
}

export function AppShell({ title, subtitle, children, hidePeriodFilter }: AppShellProps) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [menu, setMenu] = useState(false);

  const signOut = async () => {
    setMenu(false);
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col pb-28">
        <header className="px-5 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)]">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
          {!hidePeriodFilter && (
            <div className="mt-3">
              <PeriodFilter />
            </div>
          )}
        </header>
        <main className="flex-1 px-5 pt-4">{children}</main>
      </div>
      <BottomNav />

      {menu && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setMenu(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-card p-5 pt-[max(env(safe-area-inset-top),1.5rem)] shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">Menu</h3>
              <button
                type="button"
                onClick={() => setMenu(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="space-y-1.5">
              <MenuLink to="/envelopes" icon={<Package className="h-4 w-4" />} label="Envelopes" onClick={() => setMenu(false)} />
              <MenuLink to="/metas" icon={<PiggyBank className="h-4 w-4" />} label="Caixinhas / Metas" onClick={() => setMenu(false)} />
              <MenuLink to="/contatos" icon={<Contact className="h-4 w-4" />} label="Contatos" onClick={() => setMenu(false)} />
              <MenuLink to="/terceiros" icon={<Users className="h-4 w-4" />} label="Terceiros" onClick={() => setMenu(false)} />
              <MenuLink to="/cartoes" icon={<CreditCard className="h-4 w-4" />} label="Cartões de crédito" onClick={() => setMenu(false)} />
              <MenuLink to="/receitas" icon={<CalendarClock className="h-4 w-4" />} label="Fontes de renda" onClick={() => setMenu(false)} />
              <MenuLink to="/perfil" icon={<UserCircle2 className="h-4 w-4" />} label="Perfil" onClick={() => setMenu(false)} />

            </nav>
            <button
              type="button"
              onClick={signOut}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-3 py-3 text-sm font-semibold text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ to, icon, label, onClick }: { to: string; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-surface-elevated px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">{icon}</span>
      {label}
    </Link>
  );
}
