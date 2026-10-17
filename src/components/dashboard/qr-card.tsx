"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import { qrSvg } from "@/lib/qr/svg";
import { cn } from "@/lib/utils/cn";

/** Le dessin d'un QR Code, calculé dans le navigateur : il n'est stocké nulle part (ARCHITECTURE.md §6.4). */
export function QrImage({ url, accent, className }: { url: string; accent?: string; className?: string }) {
  const svg = useMemo(() => qrSvg(url, { accent }), [url, accent]);
  return (
    <div
      role="img"
      aria-label={`QR Code de ${url}`}
      className={cn("[&>svg]:block [&>svg]:size-full", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function save(blob: Blob, filename: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/** Les deux formats : le SVG pour l'imprimeur (net à toute taille), le PNG pour tout le reste. */
export function QrDownloads({ url, accent, filename }: { url: string; accent?: string; filename: string }) {
  const svg = () => qrSvg(url, { accent });

  const png = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1600;
      canvas.getContext("2d")?.drawImage(image, 0, 0, 1600, 1600);
      canvas.toBlob((blob) => blob && save(blob, `${filename}.png`), "image/png");
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg())}`;
  };

  const button =
    "inline-flex h-10 items-center gap-2 rounded-md border border-line-strong px-3.5 text-sm font-semibold transition-colors hover:border-fg hover:bg-fg/5";
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={png} className={button}>
        <Download aria-hidden="true" className="size-4" />
        Image (PNG)
      </button>
      <button
        type="button"
        onClick={() => save(new Blob([svg()], { type: "image/svg+xml" }), `${filename}.svg`)}
        className={button}
      >
        <Download aria-hidden="true" className="size-4" />
        Imprimeur (SVG)
      </button>
    </div>
  );
}
