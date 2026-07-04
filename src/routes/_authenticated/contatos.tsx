import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Plus, Trash2, Pencil, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  formatBRLFull,
  useFinance,
  type PersonType,
  type ThirdParty,
} from "@/lib/finance-store";

export const Route = createFileRoute("/_authenticated/contatos")({
  head: () => ({ meta: [{ title: "Contatos — Hub de Pessoas" }] }),
  component: ContatosPage,
});

const TYPE_LABEL: Record<PersonType, string> = {
  contato: "Contato",
  empresa: "Empresa",
  familia: "Família",
};

function saldoDaPessoa(items: ThirdParty[]) {
  return items.reduce((s, t) => {
    if (t.status === "pago") return s;
    const sign = t.type === "devo_a_terceiro" ? -1 : 1;
    return s + sign * t.amount;
  }, 0);
}

function ContatosPage() {
  const { pessoas, terceiros, addPerson, updatePerson, deletePerson } = useFinance();
  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<PersonType>("contato");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setName("");
    setType("contato");
    setNotes("");
  };

  const totaisPorPessoa = useMemo(() => {
    const map = new Map<string, ThirdParty[]>();
    for (const t of terceiros) {
      const key = t.personId ?? `__name__${t.personName}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return map;
  }, [terceiros]);

  const startEdit = (id: string) => {
    const p = pessoas.find((x) => x.id === id);
    if (!p) return;
    setEditing(id);
    setName(p.name);
    setType(p.type);
    setNotes(p.notes ?? "");
    setOpenNew(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editing) {
      await updatePerson(editing, { name: name.trim(), type, notes: notes || null });
    } else {
      await addPerson({ name: name.trim(), type, notes: notes || null });
    }
    setEditing(null);
    setOpenNew(false);
    resetForm();
  };

  return (
    <AppShell title="Contatos" subtitle="Hub de pessoas, empresas e família">
      {pessoas.length === 0 && !openNew && (
        <div className="rounded-3xl bg-card p-8 text-center shadow-card">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">Nenhum contato ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Comece cadastrando quem envolve seu dinheiro.
          </p>
          <button
            type="button"
            onClick={() => setOpenNew(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Novo contato
          </button>
        </div>
      )}

      {openNew && (
        <form
          onSubmit={submit}
          className="mb-5 space-y-3 rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/50"
        >
          <p className="text-sm font-semibold text-foreground">
            {editing ? "Editar contato" : "Novo contato"}
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          />
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
            {(["contato", "empresa", "familia"] as PersonType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-lg py-1.5 text-[11px] font-semibold capitalize ${
                  type === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {TYPE_LABEL[t]}
              </button>
            ))}
          </div>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observação (opcional)"
            className="w-full rounded-xl bg-surface-elevated px-3 py-2.5 text-sm outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setOpenNew(false);
                setEditing(null);
                resetForm();
              }}
              className="flex-1 rounded-xl bg-secondary py-2 text-sm font-semibold text-muted-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-primary py-2 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {pessoas.map((p) => {
          const items = totaisPorPessoa.get(p.id) ?? [];
          const saldo = saldoDaPessoa(items);
          return (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-card ring-1 ring-border/50"
            >
              <Link
                to="/contatos/$id"
                params={{ id: p.id }}
                className="flex flex-1 items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {TYPE_LABEL[p.type]} · {items.length} lançamento(s)
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold tabular-nums ${
                      saldo === 0
                        ? "text-muted-foreground"
                        : saldo > 0
                          ? "text-success"
                          : "text-destructive"
                    }`}
                  >
                    {saldo === 0 ? "—" : `${saldo > 0 ? "+" : "−"}${formatBRLFull(Math.abs(saldo))}`}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <button
                type="button"
                aria-label="Editar"
                onClick={() => startEdit(p.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Excluir"
                onClick={() => setConfirmDel(p.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          );
        })}
      </ul>

      {!openNew && pessoas.length > 0 && (
        <button
          type="button"
          onClick={() => setOpenNew(true)}
          className="fixed bottom-24 right-1/2 z-40 flex translate-x-[calc(50%+9rem)] items-center gap-2 rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> Novo
        </button>
      )}

      <ConfirmDialog
        open={!!confirmDel}
        title="Excluir contato?"
        description="Os lançamentos de terceiros vinculados ficarão sem pessoa associada."
        destructive
        confirmLabel="Excluir"
        onClose={() => setConfirmDel(null)}
        onConfirm={async () => {
          if (confirmDel) await deletePerson(confirmDel);
        }}
      />
    </AppShell>
  );
}
