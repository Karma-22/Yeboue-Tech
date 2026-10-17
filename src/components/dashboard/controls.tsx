"use client";

import { useState, useTransition } from "react";
import { Check, Copy } from "lucide-react";
import { changeMember, changePlan, setPublished } from "@/app/app/[estId]/actions";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { PlanId } from "@/config/plans";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import type { Role } from "@/lib/db/types";
import { PlanCards } from "./forms";

/* Les petits gestes du tableau de bord : un bouton, un interrupteur, une liste, et l'action part au serveur. */

type Result = { ok: boolean; message?: string };

interface ActionButtonProps extends Omit<ButtonProps, "onClick" | "loading"> {
  /** Une action du serveur, déjà liée à ce qu'elle doit modifier. */
  action: () => Promise<Result | void>;
  /** La question posée avant d'agir, pour ce qui ne se rattrape pas. */
  confirm?: string;
}

/** Un bouton qui lance une action du serveur, attend, et dit si elle a échoué. */
export function ActionButton({ action, confirm, children, ...props }: ActionButtonProps) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        {...props}
        loading={pending}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          start(async () => {
            const result = await action();
            setError(result && !result.ok ? (result.message ?? "Cela n'a pas fonctionné.") : null);
          });
        }}
      >
        {children}
      </Button>
      {error && (
        <span role="alert" className="text-sm font-medium text-danger-text">
          {error}
        </span>
      )}
    </span>
  );
}

/** Copie un texte, et le confirme un instant. */
export function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard?.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
      {copied ? "Copié" : label}
    </Button>
  );
}

/** Mettre la page en ligne, ou la retirer, d'un geste. */
export function PublishSwitch({ establishmentId, published }: { establishmentId: string; published: boolean }) {
  const [pending, start] = useTransition();
  return (
    <label className="flex items-center gap-3 text-sm font-semibold">
      <Switch
        checked={published}
        disabled={pending}
        onCheckedChange={(next) => start(async () => void (await setPublished(establishmentId, next)))}
      />
      {published ? "Votre page est en ligne" : "Votre page est hors ligne"}
    </label>
  );
}

/** Le rôle d'un membre, et son retrait de l'équipe. */
export function MemberControl({ establishmentId, userId, role }: { establishmentId: string; userId: string; role: Role }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const change = (next: Role | "remove") => {
    if (next === "remove" && !window.confirm("Retirer cette personne de l'équipe ?")) return;
    start(async () => {
      const result = await changeMember(establishmentId, userId, next);
      setError(result.ok ? null : (result.message ?? null));
    });
  };
  return (
    <div className="grid justify-items-end gap-1">
      <Select
        value={role}
        disabled={pending}
        aria-label="Rôle"
        onChange={(event) => change(event.target.value as Role | "remove")}
        className="h-9 w-44 text-sm"
      >
        {(["manager", "waiter", "kitchen"] as const).map((value) => (
          <option key={value} value={value}>
            {ROLE_LABELS[value]}
          </option>
        ))}
        <option value="remove">Retirer de l&apos;équipe</option>
      </Select>
      {error && <span className="text-sm font-medium text-danger-text">{error}</span>}
    </div>
  );
}

/** Changer d'offre pendant l'essai : le choix s'applique tout de suite. */
export function PlanSwitcher({ establishmentId, plan, locked }: { establishmentId: string; plan: PlanId; locked: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="grid gap-3">
      <PlanCards
        value={plan}
        disabled={pending || locked}
        onChange={(next) => {
          if (next === plan) return;
          start(async () => {
            const result = await changePlan(establishmentId, next);
            setError(result.ok ? null : (result.message ?? null));
          });
        }}
      />
      {error && (
        <p role="alert" className="text-sm font-medium text-danger-text">
          {error}
        </p>
      )}
    </div>
  );
}
