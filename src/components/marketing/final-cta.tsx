import { LogoMark } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SIGNUP_PATH, site } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/utils/cn";

/** Le dernier appel, en bas de chaque page du site vitrine. */
export function FinalCta({ dict }: { dict: Dictionary }) {
  return (
    <section data-theme="dark" className="relative isolate overflow-hidden bg-surface">
      {/* Les repères aux angles, comme sur un QR Code. */}
      <LogoMark aria-hidden="true" className="absolute -top-16 -left-16 -z-10 size-56 opacity-25 sm:size-72" />
      <LogoMark
        aria-hidden="true"
        className="absolute -right-16 -bottom-16 -z-10 size-56 opacity-25 sm:size-72"
      />
      <Container className="py-24 text-center sm:py-32">
        <h2 data-reveal className="type-display-1 mx-auto max-w-4xl">
          {dict.cta.title}
        </h2>
        <p data-reveal className="type-lead mx-auto mt-6 max-w-xl text-fg-muted">
          {dict.cta.text}
        </p>
        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={SIGNUP_PATH} className={buttonStyles({ size: "lg" })}>
            {dict.cta.primary}
          </a>
          <a
            href={`tel:${site.contact.phone}`}
            className={cn(buttonStyles({ variant: "outline", size: "lg" }), "tabular-nums")}
          >
            {dict.cta.call} {site.contact.phoneDisplay}
          </a>
        </div>
      </Container>
    </section>
  );
}
