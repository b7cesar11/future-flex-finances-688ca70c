import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col pb-28">
        <header className="px-5 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)]">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </header>
        <main className="flex-1 px-5 pt-4">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
