import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils/cn";

interface AudienceCardProps {
  title: string;
  text: string;
  photo: StaticImageData;
  /** Décrit la photo pour qui ne la voit pas. */
  alt: string;
  /** Largeurs d'affichage, pour que le navigateur choisisse la bonne taille d'image. */
  sizes: string;
  className?: string;
}

/** Carte à photo pleine : un type d'établissement, et ce que la plateforme lui apporte. */
export function AudienceCard({ title, text, photo, alt, sizes, className }: AudienceCardProps) {
  return (
    <article
      data-reveal
      className={cn(
        "group relative isolate flex min-h-72 items-end overflow-hidden rounded-xl bg-ink",
        className,
      )}
    >
      <Image
        src={photo}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        className="-z-10 object-cover transition-transform duration-700 ease-emphasized group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink/90 via-ink/30 to-transparent" />
      <div className="p-6 text-ivory">
        <h3 className="type-title">{title}</h3>
        <p className="mt-1.5 max-w-xs text-[0.9375rem] text-ivory/85">{text}</p>
      </div>
    </article>
  );
}
