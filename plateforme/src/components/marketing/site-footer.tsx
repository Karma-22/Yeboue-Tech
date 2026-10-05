import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { site, whatsappUrl } from "@/config/site";

export function SiteFooter() {
  return (
    <footer data-theme="dark" className="border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="h-7" />
          <p className="mt-5 max-w-sm text-fg-muted">
            Le menu en ligne des restaurants, maquis, bars et hôtels de Côte d&apos;Ivoire. Un QR
            Code sur la table, et vos plats toujours à jour.
          </p>
        </div>

        <nav aria-label="Pied de page" className="md:col-span-3">
          <p className="type-eyebrow text-fg-subtle">Le produit</p>
          <ul className="mt-4 grid gap-2.5">
            <FooterLink href="/#pour-qui">Pour qui</FooterLink>
            <FooterLink href="/#fonctionnement">Comment ça marche</FooterLink>
            <FooterLink href="/#tarifs">Tarifs</FooterLink>
            <FooterLink href="/#questions">Questions</FooterLink>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="type-eyebrow text-fg-subtle">Nous joindre</p>
          <ul className="mt-4 grid gap-2.5">
            <li>
              <a
                href={whatsappUrl("Bonjour, j'ai une question sur Yéboué Tech.")}
                className="rounded-sm underline-offset-4 hover:underline"
              >
                Écrire sur WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.contact.phone}`}
                className="rounded-sm tabular-nums underline-offset-4 hover:underline"
              >
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li className="text-fg-muted">{site.contact.city}, Côte d&apos;Ivoire</li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line py-6 text-sm text-fg-subtle">
        <p>
          © {new Date().getFullYear()} {site.name}. Fait à Abidjan.
        </p>
        <p>Photos et vidéo d&apos;illustration : Pexels et Unsplash.</p>
      </Container>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="rounded-sm underline-offset-4 hover:underline">
        {children}
      </Link>
    </li>
  );
}
