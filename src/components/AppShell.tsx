import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col pb-28">
        <header className="flex items-start justify-between px-5 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sair"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </header>
        <main className="flex-1 px-5 pt-4">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
