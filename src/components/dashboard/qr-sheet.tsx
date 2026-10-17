"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrImage } from "./qr-card";

interface QrSheetProps {
  establishmentName: string;
  accent: string;
  /** Une étiquette par emplacement : « Terrasse — Table 12 », et l'adresse dessinée dans son QR Code. */
  codes: { label: string; url: string }[];
  /** La phrase écrite sous chaque code. */
  invitation: string;
}

/**
 * La planche des QR Codes, prête à imprimer ou à enregistrer en PDF depuis le
 * navigateur (ARCHITECTURE.md §17). Neuf étiquettes par page A4, à découper.
 */
export function QrSheet({ establishmentName, accent, codes, invitation }: QrSheetProps) {
  return (
    <div data-theme="light" className="min-h-dvh bg-surface-sunken print:bg-white">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-raised px-5 py-3 print:hidden">
        <p className="text-sm">
          <strong>{codes.length} étiquettes.</strong> Dans la fenêtre d&apos;impression, choisissez « Enregistrer au format
          PDF » pour les envoyer à un imprimeur.
        </p>
        <Button onClick={() => window.print()}>
          <Printer aria-hidden="true" className="size-4" />
          Imprimer
        </Button>
      </div>

      <ul className="mx-auto grid max-w-[21cm] grid-cols-2 gap-3 p-5 sm:grid-cols-3 print:max-w-none print:grid-cols-3 print:gap-0 print:p-0">
        {codes.map((code) => (
          <li
            key={code.url}
            className="flex break-inside-avoid flex-col items-center rounded-lg border border-line bg-white p-4 text-center text-ink print:rounded-none print:border-dashed print:border-ink/40"
          >
            <p className="font-display text-sm leading-tight font-bold">{establishmentName}</p>
            <QrImage url={code.url} accent={accent} className="my-2 w-full max-w-44" />
            <p className="font-display text-base leading-tight font-bold">{code.label}</p>
            <p className="mt-1 text-xs text-ink/70">{invitation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
