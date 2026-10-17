import "server-only";

import { site } from "@/config/site";

/*
 * L'envoi des e-mails. Deux façons de faire, choisies par la configuration :
 * - RESEND_API_KEY défini : l'e-mail part par le service Resend ;
 * - sinon : rien ne part, et le contenu s'écrit dans la console du serveur.
 * Pour brancher un autre service, il suffit d'écrire une autre fonction `deliver`.
 */

export interface Email {
  to: string;
  subject: string;
  /** La phrase d'ouverture. */
  intro: string;
  /** Un code à mettre en évidence, s'il y en a un. */
  code?: string;
  /** Un bouton, s'il y en a un. */
  action?: { label: string; url: string };
  /** La phrase de fin, en petit. */
  outro: string;
}

/**
 * Le gabarit commun à tous les e-mails : provisoire, aux couleurs de la charte.
 * Il sera remplacé par la maquette définitive (ARCHITECTURE.md §3.1 bis).
 * Mise en page en tableaux et styles en ligne : c'est ce que lisent les messageries.
 */
export function renderEmail(email: Email): { html: string; text: string } {
  const code = email.code
    ? `<p style="margin:28px 0;font:700 34px/1 'Courier New',monospace;letter-spacing:10px;color:#14213D;">${email.code}</p>`
    : "";
  const action = email.action
    ? `<p style="margin:28px 0;"><a href="${email.action.url}" style="display:inline-block;background:#F2622E;color:#14213D;font:600 16px Arial,sans-serif;text-decoration:none;padding:14px 26px;border-radius:12px;">${email.action.label}</a></p>`
    : "";
  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;background:#FAF6EF;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6EF;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFDFA;border-radius:20px;padding:36px 32px;font:16px/1.6 Arial,sans-serif;color:#14213D;">
<tr><td>
<p style="margin:0 0 28px;font:700 20px Arial,sans-serif;color:#14213D;">${site.name}</p>
<p style="margin:0;">${email.intro}</p>
${code}${action}
<p style="margin:0;font-size:14px;color:#4B5468;">${email.outro}</p>
</td></tr></table>
</td></tr></table>
</body></html>`;
  const text = [email.intro, email.code, email.action?.url, email.outro].filter(Boolean).join("\n\n");
  return { html, text };
}

async function deliver(email: Email, body: { html: string; text: string }): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(
      `\n──────── E-mail non envoyé (aucun service configuré) ────────\nPour : ${email.to}\nObjet : ${email.subject}\n\n${body.text}\n─────────────────────────────────────────────────────────────\n`,
    );
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`,
      to: email.to,
      subject: email.subject,
      html: body.html,
      text: body.text,
    }),
  });
  if (!response.ok) throw new Error(`L'e-mail n'a pas pu partir (${response.status}).`);
}

export async function sendEmail(email: Email): Promise<void> {
  await deliver(email, renderEmail(email));
}

export function sendCodeEmail(to: string, code: string, purpose: "verify" | "reset"): Promise<void> {
  return sendEmail(
    purpose === "verify"
      ? {
          to,
          subject: `${code} est votre code ${site.name}`,
          intro: "Bienvenue. Pour confirmer votre adresse e-mail, saisissez ce code sur la page de vérification :",
          code,
          outro: "Le code est valable 10 minutes. Si vous n'avez pas créé de compte, ignorez ce message.",
        }
      : {
          to,
          subject: `${code} : votre code pour changer de mot de passe`,
          intro: "Vous avez demandé à changer de mot de passe. Saisissez ce code pour en choisir un nouveau :",
          code,
          outro: "Le code est valable 10 minutes. Si vous n'avez rien demandé, ignorez ce message : votre mot de passe ne change pas.",
        },
  );
}
