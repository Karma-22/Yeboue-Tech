import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { whatsappUrl } from "@/config/site";
import { localePath, SOLUTION_IDS, type Dictionary, type Locale } from "@/i18n";
import { LocaleSwitch } from "./locale-switch";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const home = localePath(locale);
  const links = [
    { href: `${home}#pour-qui`, label: dict.nav.audiences },
    { href: `${home}#fonctionnement`, label: dict.nav.how },
    { href: `${home}#tarifs`, label: dict.nav.pricing },
    { href: `${home}#questions`, label: dict.nav.faq },
  ];
  const solutions = SOLUTION_IDS.map((id) => ({
    href: localePath(locale, `/solutions/${id}`),
    label: dict.solutions[id].name,
  }));
  const cta = { href: whatsappUrl(dict.signupMessage), label: dict.nav.cta };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link href={home} className="rounded-sm">
          <Logo className="h-6 sm:h-7" />
        </Link>

        <nav aria-label={dict.nav.menuTitle} className="hidden md:block">
          <ul className="flex items-center gap-6 text-[0.9375rem] font-medium text-fg-muted lg:gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="rounded-sm transition-colors hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LocaleSwitch
            label={locale === "fr" ? "EN" : "FR"}
            className="hidden px-2 text-sm text-fg-muted md:block"
          />
          <ThemeToggle toDark={dict.nav.toDark} toLight={dict.nav.toLight} className="hidden md:grid" />
          <a href={cta.href} className={buttonStyles({ size: "sm" })}>
            {cta.label}
          </a>
          <MobileMenu
            links={links}
            solutions={solutions}
            cta={cta}
            labels={{
              open: dict.nav.openMenu,
              title: dict.nav.menuTitle,
              solutions: dict.nav.solutions,
              language: dict.nav.language,
              switchTo: dict.nav.switchTo,
              theme: dict.nav.theme,
              toDark: dict.nav.toDark,
              toLight: dict.nav.toLight,
            }}
          />
        </div>
      </Container>
    </header>
  );
}
