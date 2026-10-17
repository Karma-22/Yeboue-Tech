import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils/cn";

interface FeatureRowProps {
  number: string;
  title: string;
  text: string;
  points: string[];
  photo: StaticImageData;
  alt: string;
  /** Place la photo à droite au lieu de la gauche. */
  flip?: boolean;
  /** Un morceau de l'interface, posé sur la photo. */
  children?: React.ReactNode;
}

/** Une fonction présentée par une photo de terrain, un morceau d'interface et un texte. */
export function FeatureRow({
  number,
  title,
  text,
  points,
  photo,
  alt,
  flip = false,
  children,
}: FeatureRowProps) {
  return (
    <div className="grid items-center gap-x-16 gap-y-12 lg:grid-cols-2">
      <div data-reveal className={cn("relative", flip && "lg:order-2")}>
        <div className="relative aspect-4/5 overflow-hidden rounded-xl sm:aspect-4/3 lg:aspect-4/5">
          <Image
            src={photo}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            placeholder="blur"
            className="object-cover"
          />
        </div>
        {children && (
          <div
            aria-hidden="true"
            className={cn(
              "absolute -bottom-6 w-64 max-w-[80%]",
              flip ? "left-4 lg:-left-10" : "right-4 lg:-right-10",
            )}
          >
            {children}
          </div>
        )}
      </div>

      <div data-reveal>
        <p className="type-eyebrow text-accent-text">{number}</p>
        <h3 className="type-display-3 mt-3">{title}</h3>
        <p className="type-lead mt-4 text-fg-muted">{text}</p>
        <ul className="mt-7 grid gap-3">
          {points.map((point) => (
            <li key={point} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
