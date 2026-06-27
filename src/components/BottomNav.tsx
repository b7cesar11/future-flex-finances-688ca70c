import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, ListChecks, Wallet, ArrowLeftRight, Plus, TrendingDown, TrendingUp, CreditCard, X } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { to: "/minhas-dividas", label: "Dívidas", icon: ListChecks },
  { to: "/carteira", label: "Carteira", icon: Wallet },
] as const;

export function BottomNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path: string) => {
    setOpen(false);
    void navigate({ to: path });
  };

  // Render order: 2 left items, center button, 2 right items
  const left = items.slice(0, 2);
  const right = items.slice(2);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-lg">
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
          {left.map((it) => (
            <NavItem key={it.to} {...it} />
          ))}

          <li className="flex-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Registrar"
              className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow ring-4 ring-background transition-transform active:scale-95"
            >
              <Plus className="h-7 w-7" strokeWidth={2.5} />
            </button>
          </li>

          {right.map((it) => (
            <NavItem key={it.to} {...it} />
          ))}
        </ul>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          />
          <div className="relative mx-auto w-full max-w-md rounded-t-3xl border-t border-border bg-card p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-card animate-in slide-in-from-bottom duration-200">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">O que você quer registrar?</h3>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3">
              <QuickAction
                label="Nova Despesa"
                hint="Um gasto que saiu da sua conta"
                icon={<TrendingDown className="h-5 w-5" />}
                tone="bg-destructive/15 text-destructive"
                onClick={() => go("/nova-transacao?kind=despesa")}
              />
              <QuickAction
                label="Nova Receita"
                hint="Dinheiro que entrou"
                icon={<TrendingUp className="h-5 w-5" />}
                tone="bg-primary/15 text-primary"
                onClick={() => go("/nova-transacao?kind=receita")}
              />
              <QuickAction
                label="Nova Dívida"
                hint="Algo parcelado para projetar"
                icon={<CreditCard className="h-5 w-5" />}
                tone="bg-accent/15 text-accent"
                onClick={() => go("/nova-divida")}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  return (
    <li className="flex-1">
      <Link
        to={to}
        activeOptions={{ exact: true }}
        className="group flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-muted-foreground transition-colors"
        activeProps={{ className: "text-primary" }}
      >
        {({ isActive }) => (
          <>
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-2xl transition-all",
                isActive ? "bg-primary/15 shadow-glow" : "group-hover:bg-secondary",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="text-[10.5px] font-medium">{label}</span>
          </>
        )}
      </Link>
    </li>
  );
}

function QuickAction({
  label,
  hint,
  icon,
  tone,
  onClick,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  tone: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-surface-elevated p-4 text-left transition-colors hover:bg-secondary"
    >
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", tone)}>{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}
