"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";

export interface MenuLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  links: MenuLink[];
  solutions: MenuLink[];
  cta: MenuLink;
  labels: {
    open: string;
    title: string;
    solutions: string;
    language: string;
    switchTo: string;
    theme: string;
    toDark: string;
    toLight: string;
  };
}

/** Le menu du site sur téléphone : il monte du bas de l'écran, à portée de pouce. */
export function MobileMenu({ links, solutions, cta, labels }: MobileMenuProps) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={labels.open}
        className="grid size-10 shrink-0 place-items-center rounded-full text-fg transition-colors hover:bg-fg/7 md:hidden"
      >
        <Menu aria-hidden="true" className="size-6" />
      </DialogTrigger>

      <DialogContent className="gap-6">
        <DialogTitle>{labels.title}</DialogTitle>

        <nav aria-label={labels.title}>
          <ul className="grid">
            {links.map((link) => (
              <li key={link.href}>
                <DialogClose asChild>
                  <Link
                    href={link.href}
                    className="block border-b border-line py-3.5 font-display text-xl font-bold"
                  >
                    {link.label}
                  </Link>
                </DialogClose>
              </li>
            ))}
          </ul>

          <p className="type-eyebrow mt-6 text-fg-subtle">{labels.solutions}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {solutions.map((solution) => (
              <li key={solution.href}>
                <DialogClose asChild>
                  <Link
                    href={solution.href}
                    className="block rounded-full border border-line-strong px-3.5 py-2 text-sm font-semibold"
                  >
                    {solution.label}
                  </Link>
                </DialogClose>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-between gap-4 text-fg-muted">
          <span className="flex items-center gap-2">
            {labels.language}
            <LocaleSwitch label={labels.switchTo} className="text-fg underline underline-offset-4" />
          </span>
          <span className="flex items-center gap-1">
            {labels.theme}
            <ThemeToggle toDark={labels.toDark} toLight={labels.toLight} />
          </span>
        </div>

        <a href={cta.href} className={buttonStyles({ size: "lg", block: true })}>
          {cta.label}
        </a>
      </DialogContent>
    </Dialog>
  );
}
