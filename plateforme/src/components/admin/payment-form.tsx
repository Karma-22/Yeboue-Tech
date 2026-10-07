"use client";

import { useActionState, useState } from "react";
import { recordPaymentAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormNotice } from "@/components/ui/form-notice";
import { Input, Select } from "@/components/ui/input";
import { PLAN_IDS, PLANS, type PlanId } from "@/config/plans";

const METHODS = [
  ["wave", "Wave"],
  ["orange", "Orange Money"],
  ["mtn", "MTN MoMo"],
  ["moov", "Moov Money"],
  ["cash", "Espèces"],
] as const;

/** Enregistrer un paiement reçu : l'offre, la durée, le montant. L'abonnement est prolongé d'autant. */
export function PaymentForm({ establishmentId, plan: initialPlan }: { establishmentId: string; plan: PlanId }) {
  const [state, action, pending] = useActionState(recordPaymentAction, {});
  const [plan, setPlan] = useState<PlanId>(initialPlan);
  const [months, setMonths] = useState(1);
  // Le montant suit l'offre et la durée, tant qu'il n'a pas été corrigé à la main.
  const [amount, setAmount] = useState<string | null>(null);
  const expected = PLANS[plan].monthlyPrice * months;

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2" noValidate>
      <input type="hidden" name="establishmentId" value={establishmentId} />
      <Field label="Offre" error={state.errors?.plan}>
        <Select name="plan" value={plan} onChange={(event) => setPlan(event.target.value as PlanId)}>
          {PLAN_IDS.map((id) => (
            <option key={id} value={id}>
              {PLANS[id].name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Durée" error={state.errors?.months}>
        <Select name="months" value={months} onChange={(event) => setMonths(Number(event.target.value))}>
          {[1, 3, 6, 12].map((value) => (
            <option key={value} value={value}>
              {value} mois
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Montant reçu (F CFA)" hint={`Prix de l'offre pour cette durée : ${expected}.`} error={state.errors?.amount}>
        <Input name="amount" inputMode="numeric" value={amount ?? String(expected)} onChange={(event) => setAmount(event.target.value)} required />
      </Field>
      <Field label="Moyen de paiement" error={state.errors?.method}>
        <Select name="method" defaultValue="wave">
          {METHODS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Référence" hint="Le numéro de la transaction, si vous l'avez." optional error={state.errors?.reference} className="sm:col-span-2">
        <Input name="reference" maxLength={60} />
      </Field>
      <FormNotice state={state} className="sm:col-span-2" />
      <Button type="submit" loading={pending} className="justify-self-start">
        Enregistrer le paiement
      </Button>
    </form>
  );
}
