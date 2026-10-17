import Image from "next/image";
import Link from "next/link";
import { Viewfinder } from "@/components/brand/viewfinder";
import { FinalCta } from "@/components/marketing/final-cta";
import { SolutionLinks } from "@/components/marketing/home-page";
import { Phone } from "@/components/marketing/phone";
import { CounterTicket, ListScreen, solutionScreens } from "@/components/marketing/phone-screens";
import { PhoneStory } from "@/components/marketing/phone-story";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SOLUTION_MEDIA } from "@/components/marketing/solution-media";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SIGNUP_PATH } from "@/config/site";
import { getDictionary, localePath, type Locale, type SolutionId } from "@/i18n";

/** La page d'un type d'établissement : ce que la plateforme fait chez lui, pas à pas. */
export function SolutionPage({ locale, id }: { locale: Locale; id: SolutionId }) {
  const dict = getDictionary(locale);
  const copy = dict.solutions[id];
  const media = SOLUTION_MEDIA[id];

  return (
    <>
      <ScrollReveal />

      <section className="overflow-x-clip">
        <Container className="grid items-center gap-x-10 gap-y-14 pt-12 pb-24 sm:pt-16 lg:grid-cols-2 lg:pb-28">
          <div>
            <p className="type-eyebrow animate-rise text-accent-text">{copy.eyebrow}</p>
            <h1 className="type-display-2 mt-5 animate-rise [animation-delay:80ms]">{copy.title}</h1>
            <p className="type-lead mt-6 max-w-lg animate-rise text-fg-muted [animation-delay:160ms]">
              {copy.intro}
            </p>
            <div className="mt-9 flex animate-rise flex-wrap items-center gap-3 [animation-delay:240ms]">
              <a href={SIGNUP_PATH} className={buttonStyles({ size: "lg" })}>
                {dict.hero.primary}
              </a>
              <a href="#fonctionnement" className={buttonStyles({ variant: "ghost", size: "lg" })}>
                {dict.hero.secondary}
              </a>
            </div>
            <p className="mt-6 animate-rise text-sm text-fg-subtle [animation-delay:320ms]">
              {dict.hero.assurances}
            </p>
          </div>

          <div className="relative animate-rise [animation-delay:200ms] lg:ml-10">
            <Viewfinder cornerClassName="size-10" className="rounded-2xl p-3 text-fg">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl sm:aspect-4/3 lg:aspect-4/5">
                <Image
                  src={media.hero}
                  alt={copy.heroAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 540px, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            </Viewfinder>
            <Phone
              aria-hidden="true"
              className="absolute -bottom-14 left-0 origin-bottom-left scale-[0.52] sm:scale-[0.62] lg:-left-20 lg:scale-[0.8]"
            >
              <ListScreen copy={copy.screens.list} cover={media.cover} photos={media.items} />
            </Phone>
          </div>
        </Container>
      </section>

      <section id="fonctionnement" data-theme="dark" className="scroll-mt-16 bg-surface">
        <Container className="pt-20 pb-20 sm:pt-28 lg:pb-10">
          <SectionHeading
            eyebrow={dict.solutionPage.storyEyebrow}
            title={copy.storyTitle}
            intro={copy.storyIntro}
          />
          <div className="mt-10 lg:mt-4">
            <PhoneStory
              steps={copy.steps}
              screens={solutionScreens(copy.screens, media)}
              aside={<CounterTicket copy={copy.screens.ticket} />}
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container className="grid gap-x-16 gap-y-12 py-20 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={dict.solutionPage.benefitsEyebrow} title={copy.benefitsTitle} />
            <Link
              data-reveal
              href={`${localePath(locale)}#tarifs`}
              className={`${buttonStyles({ variant: "outline" })} mt-9`}
            >
              {dict.solutionPage.pricingLink}
            </Link>
          </div>
          <ol className="grid lg:col-span-7">
            {copy.benefits.map((benefit, index) => (
              <li
                key={benefit.title}
                data-reveal
                className="grid gap-x-8 gap-y-2 border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[3rem_1fr]"
              >
                <span className="type-eyebrow pt-2 text-accent-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="type-title">{benefit.title}</h3>
                  <p className="type-lead mt-2 text-fg-muted">{benefit.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
        <Container className="pb-20 sm:pb-24">
          <SolutionLinks locale={locale} dict={dict} exclude={id} title={dict.solutionPage.othersTitle} />
        </Container>
      </section>

      <FinalCta dict={dict} />
    </>
  );
}
