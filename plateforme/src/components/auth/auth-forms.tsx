"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, resetPassword, signIn, signUp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/validation/forms";

const EMPTY: FormState = {};

/** Message général d'un formulaire : une erreur, ou une confirmation. */
function Notice({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={
        state.ok
          ? "rounded-md bg-success-soft px-4 py-3 text-sm font-medium text-success-text"
          : "rounded-md bg-danger-soft px-4 py-3 text-sm font-medium text-danger-text"
      }
    >
      {state.message}
    </p>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, EMPTY);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" error={state.errors?.firstName}>
          <Input name="firstName" autoComplete="given-name" defaultValue={state.values?.firstName} required />
        </Field>
        <Field label="Nom" error={state.errors?.lastName}>
          <Input name="lastName" autoComplete="family-name" defaultValue={state.values?.lastName} required />
        </Field>
      </div>
      <Field
        label="Numéro WhatsApp"
        hint="Nous vous y écrirons avant la fin de votre essai."
        error={state.errors?.phone}
      >
        <Input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="07 00 00 00 00"
          defaultValue={state.values?.phone}
          required
        />
      </Field>
      <Field label="Adresse e-mail" hint="Vous y recevrez un code de vérification." error={state.errors?.email}>
        <Input name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </Field>
      <Field label="Mot de passe" hint="Au moins 8 caractères." error={state.errors?.password}>
        <Input name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Notice state={state} />
      <Button type="submit" size="lg" block loading={pending}>
        Créer mon compte
      </Button>
    </form>
  );
}

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, EMPTY);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Field label="Adresse e-mail" error={state.errors?.email}>
        <Input name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </Field>
      <Field label="Mot de passe" error={state.errors?.password}>
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Notice state={state} />
      <Button type="submit" size="lg" block loading={pending}>
        Me connecter
      </Button>
      <p className="text-center text-sm">
        <Link href="/mot-de-passe-oublie" className="font-semibold underline underline-offset-4">
          Mot de passe oublié ?
        </Link>
      </p>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, EMPTY);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Field label="Adresse e-mail" hint="Celle de votre compte." error={state.errors?.email}>
        <Input name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </Field>
      <Notice state={state} />
      <Button type="submit" size="lg" block loading={pending}>
        Recevoir un code
      </Button>
    </form>
  );
}

export function ResetForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(resetPassword, EMPTY);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="email" value={email} />
      <Field label="Code reçu par e-mail" hint="Six chiffres." error={state.errors?.code}>
        <Input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className="font-display text-xl tracking-[0.4em]"
          required
        />
      </Field>
      <Field label="Nouveau mot de passe" hint="Au moins 8 caractères." error={state.errors?.password}>
        <Input name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Notice state={state} />
      <Button type="submit" size="lg" block loading={pending}>
        Changer mon mot de passe
      </Button>
    </form>
  );
}
