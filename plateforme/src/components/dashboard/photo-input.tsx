"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { uploadPhoto, type UploadedPhoto } from "@/lib/images/resize";
import { cn } from "@/lib/utils/cn";

interface PhotoInputProps {
  establishmentId: string;
  kind: "item" | "logo" | "cover";
  /** La photo en place, s'il y en a une. */
  value: UploadedPhoto | null;
  onChange: (photo: UploadedPhoto | null) => void;
  /** Ce qui est écrit sur le bouton tant qu'il n'y a pas de photo. */
  label: string;
  className?: string;
}

/**
 * Choisir une photo : le navigateur la réduit, l'envoie, puis l'affiche
 * (ARCHITECTURE.md §6.3). Sur téléphone, le bouton propose l'appareil photo ou la galerie.
 */
export function PhotoInput({ establishmentId, kind, value, onChange, label, className }: PhotoInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadPhoto(file, establishmentId, kind));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "L'image n'a pas pu être envoyée.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <input ref={input} type="file" accept="image/*" onChange={pick} className="sr-only" tabIndex={-1} aria-hidden="true" />
      <div
        className={cn(
          "relative grid place-items-center overflow-hidden rounded-md border border-dashed border-line-strong bg-surface-sunken text-fg-muted",
          kind === "logo" ? "size-24 rounded-full" : "aspect-[16/10] w-full",
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.thumb} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <ImagePlus aria-hidden="true" className="size-7" />
        )}
        {busy && (
          <span className="absolute inset-0 grid place-items-center bg-surface/80 text-fg">
            <Spinner />
          </span>
        )}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="inline-flex h-9 items-center gap-2 rounded-sm border border-line-strong px-3 text-sm font-semibold hover:border-fg hover:bg-fg/5 disabled:opacity-50"
        >
          {value ? "Changer" : label}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={busy}
            aria-label="Retirer la photo"
            className="grid size-9 place-items-center rounded-sm text-fg-muted hover:bg-fg/7 hover:text-danger-text"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-danger-text">
          {error}
        </p>
      )}
    </div>
  );
}
