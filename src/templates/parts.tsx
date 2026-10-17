import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { formatPhone, whatsappLink } from "@/lib/utils/phone";
import type { TemplateCategory, TemplateData, TemplateItem } from "./types";

/* Les petites pièces que les dix modèles ont en commun. Chacun les habille à sa façon. */

/** L'identifiant de la section d'une catégorie dans la page : c'est là que mène la rangée des catégories. */
export function sectionId(category: TemplateCategory): string {
  return `c-${category.id}`;
}

export function navOf(data: TemplateData): { id: string; name: string }[] {
  return data.categories.map((category) => ({ id: sectionId(category), name: category.name }));
}

/** Le prix d'un article, ou sa mention (« Gratuit », « Inclus ») s'il n'en a pas. */
export function priceOf(item: TemplateItem): string {
  return item.price !== null ? formatPrice(item.price) : item.note;
}

/** Le prix sans le « F », pour les cartes qui alignent des chiffres. */
export function bareAmount(item: TemplateItem): string {
  return item.price !== null ? formatPrice(item.price).replace(/\s?F$/, "") : item.note;
}

/** « Cocody, Abidjan » — sans virgule orpheline si l'un des deux manque. */
export function placeOf(data: TemplateData): string {
  return [data.district, data.city].filter(Boolean).join(", ");
}

interface PhotoProps {
  src: string;
  alt?: string;
  className?: string;
  /** À mettre sur la première image visible : elle se charge sans attendre. */
  eager?: boolean;
}

/** Une photo d'article ou de couverture. Elle se charge quand elle approche de l'écran. */
export function Photo({ src, alt = "", className, eager = false }: PhotoProps) {
  return (
    // Les photos sont déjà réduites à l'envoi (ARCHITECTURE.md §6.3) : l'optimiseur d'images n'apporterait rien.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      className={cn("object-cover", className)}
    />
  );
}

/** Les deux boutons de contact. Rien ne s'affiche pour un numéro absent. */
export function ContactLinks({
  data,
  className,
  linkClassName,
}: {
  data: TemplateData;
  className?: string;
  linkClassName?: string;
}) {
  if (!data.phone && !data.whatsapp) return null;
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {data.phone && (
        <a href={`tel:+${data.phone}`} className={cn("inline-flex items-center gap-2", linkClassName)}>
          <Phone aria-hidden="true" className="size-4" />
          {formatPhone(data.phone)}
        </a>
      )}
      {data.whatsapp && (
        <a
          href={whatsappLink(data.whatsapp, "")}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("inline-flex items-center gap-2", linkClassName)}
        >
          <MessageCircle aria-hidden="true" className="size-4" />
          {data.labels.whatsapp}
        </a>
      )}
    </div>
  );
}

/** Le lien vers l'autre langue, quand la carte en a deux. */
export function LanguageLink({ data, className }: { data: TemplateData; className?: string }) {
  if (!data.languageSwitch) return null;
  return (
    <a href={data.languageSwitch.href} className={cn("inline-flex h-9 items-center px-3 text-sm font-semibold", className)}>
      {data.languageSwitch.label}
    </a>
  );
}

/** La signature discrète en bas de chaque carte. */
export function PoweredBy({ data, className }: { data: TemplateData; className?: string }) {
  return (
    <p className={cn("text-xs", className)}>
      {data.labels.poweredBy}{" "}
      <Link href="/" prefetch={false} className="font-semibold underline underline-offset-4">
        {site.name}
      </Link>
    </p>
  );
}
