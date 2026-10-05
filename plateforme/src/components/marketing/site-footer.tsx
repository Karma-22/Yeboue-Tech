import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { site, whatsappUrl } from "@/config/site";
import { localePath, SOLUTION_IDS, type Dictionary, type Locale } from "@/i18n";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const home = localePath(locale);

  return (
    <footer data-theme="dark" className="border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="h-7" />
          <p className="mt-5 max-w-sm text-fg-muted">{dict.footer.about}</p>
        </div>

        <nav aria-label={dict.footer.product} className="md:col-span-2">
          <p className="type-eyebrow text-fg-subtle">{dict.footer.product}</p>
          <ul className="mt-4 grid gap-2.5">
            <FooterLink href={`${home}#fonctionnement`}>{dict.nav.how}</FooterLink>
            <FooterLink href={`${home}#tarifs`}>{dict.nav.pricing}</FooterLink>
            <FooterLink href={`${home}#questions`}>{dict.nav.faq}</FooterLink>
          </ul>
        </nav>

        <nav aria-label={dict.nav.solutions} className="md:col-span-3">
          <p className="type-eyebrow text-fg-subtle">{dict.nav.solutions}</p>
          <ul className="mt-4 grid gap-2.5">
            {SOLUTION_IDS.map((id) => (
              <FooterLink key={id} href={localePath(locale, `/solutions/${id}`)}>
                {dict.solutions[id].name}
              </FooterLink>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="type-eyebrow text-fg-subtle">{dict.footer.contact}</p>
          <ul className="mt-4 grid gap-2.5">
            <li>
              <a
                href={whatsappUrl(dict.footer.whatsappMessage)}
                className="rounded-sm underline-offset-4 hover:underline"
              >
                {dict.footer.whatsapp}
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
            <li className="text-fg-muted">
              {site.contact.city}, {dict.footer.country}
            </li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line py-6 text-sm text-fg-subtle">
        <p>
          © {new Date().getFullYear()} {site.name}. {dict.footer.made}
        </p>
        <p>{dict.footer.credits}</p>
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
