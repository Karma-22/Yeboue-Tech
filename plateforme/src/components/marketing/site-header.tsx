import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { signupHref } from "@/config/site";

const LINKS = [
  { href: "/#pour-qui", label: "Pour qui" },
  { href: "/#fonctionnement", label: "Comment ça marche" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/#questions", label: "Questions" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="rounded-sm">
          <Logo className="h-7" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.9375rem] font-medium text-fg-muted">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="rounded-sm transition-colors hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a href={signupHref} className={buttonStyles({ size: "sm" })}>
          Créer mon menu
        </a>
      </Container>
    </header>
  );
}
