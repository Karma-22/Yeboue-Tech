import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AudienceCardProps {
  title: string;
  text: string;
  photo: StaticImageData;
  /** Décrit la photo pour qui ne la voit pas. */
  alt: string;
  /** Largeurs d'affichage, pour que le navigateur choisisse la bonne taille d'image. */
  sizes: string;
  /** La page de ce type d'établissement. */
  href: string;
  /** Le libellé du lien : « Voir comment ça marche ». */
  more: string;
  className?: string;
}

/** Carte à photo pleine : un type d'établissement, et le lien vers sa page. */
export function AudienceCard({ title, text, photo, alt, sizes, href, more, className }: AudienceCardProps) {
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
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink/95 via-ink/40 to-transparent" />
      <div className="p-6 text-ivory">
        <h3 className="type-title">
          {/* Le lien couvre toute la carte. */}
          <Link href={href} className="rounded-sm after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="mt-1.5 max-w-xs text-[0.9375rem] text-ivory/85">{text}</p>
        <p className="mt-4 flex items-center gap-1 text-sm font-semibold">
          {more}
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </p>
      </div>
    </article>
  );
}
