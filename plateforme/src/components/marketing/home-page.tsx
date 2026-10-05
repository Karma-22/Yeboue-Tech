import Image from "next/image";
import Link from "next/link";
import { AudienceCard } from "@/components/marketing/audience-card";
import { AutoplayVideo } from "@/components/marketing/autoplay-video";
import { FeatureRow } from "@/components/marketing/feature-row";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { CounterTicket, ListScreen, solutionScreens } from "@/components/marketing/phone-screens";
import { PhoneStory } from "@/components/marketing/phone-story";
import { Pricing } from "@/components/marketing/pricing";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SOLUTION_MEDIA } from "@/components/marketing/solution-media";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { whatsappUrl } from "@/config/site";
import { getDictionary, localePath, type Dictionary, type Locale, type SolutionId } from "@/i18n";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import customerPhoto from "@/assets/photos/cliente-telephone.jpg";
import heroPhoto from "@/assets/photos/clients-telephone.jpg";
import kitchenPhoto from "@/assets/photos/cuisine-flammes.jpg";
import ownerPhoto from "@/assets/photos/gerante-telephone.jpg";
import qrPhoto from "@/assets/photos/qr-table.jpg";

/** Les types montrés tour à tour en haut de page, dans l'ordre de `hero.rotating`. */
const HERO_SOLUTIONS: SolutionId[] = ["maquis", "bars-lounges", "hotels", "residences"];

/** L'exemple raconté dans « Comment ça marche ». Les autres types ont chacun leur page. */
const STORY_SOLUTION: SolutionId = "maquis";

/** La place de chaque carte « Pour qui » dans la grille, sur grand écran. */
const AUDIENCE_LAYOUT: { id: SolutionId; className: string; sizes: string }[] = [
  { id: "maquis", className: "md:col-span-4 md:row-span-2 md:min-h-136", sizes: "(min-width: 768px) 33vw, 100vw" },
  { id: "restaurants", className: "md:col-span-5", sizes: "(min-width: 768px) 42vw, 100vw" },
  { id: "bars-lounges", className: "md:col-span-3", sizes: "(min-width: 768px) 25vw, 100vw" },
  { id: "hotels", className: "md:col-span-4", sizes: "(min-width: 768px) 33vw, 100vw" },
  { id: "residences", className: "md:col-span-4", sizes: "(min-width: 768px) 33vw, 100vw" },
];

const FEATURE_PHOTOS = [ownerPhoto, qrPhoto, kitchenPhoto, customerPhoto];

/** La page d'accueil du site vitrine, dans une langue. */
export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const story = dict.solutions[STORY_SOLUTION];
  const storyMedia = SOLUTION_MEDIA[STORY_SOLUTION];
  const crumbs = [
    <EditCrumb key="edit" copy={dict.features.crumbs} />,
    <LinkCrumb key="link" copy={dict.features.crumbs} />,
    <CounterTicket key="ticket" copy={story.screens.ticket} />,
    <MessageCrumb key="message" copy={dict.features.crumbs} />,
  ];

  return (
    <>
      <ScrollReveal />

      <Hero
        rotating={dict.hero.rotating}
        titleRest={dict.hero.titleRest}
        text={dict.hero.text}
        assurances={dict.hero.assurances}
        primary={{ href: whatsappUrl(dict.signupMessage), label: dict.hero.primary }}
        secondary={{ href: "#fonctionnement", label: dict.hero.secondary }}
        photo={
          <div className="relative aspect-4/5 overflow-hidden rounded-xl sm:aspect-4/3 lg:aspect-4/5">
            <Image
              src={heroPhoto}
              alt={dict.hero.photoAlt}
              fill
              priority
              sizes="(min-width: 1024px) 540px, 100vw"
              placeholder="blur"
              className="object-cover object-[62%_center]"
            />
          </div>
        }
        screens={HERO_SOLUTIONS.map((id) => (
          <ListScreen
            key={id}
            copy={dict.solutions[id].screens.list}
            cover={SOLUTION_MEDIA[id].cover}
            photos={SOLUTION_MEDIA[id].items}
          />
        ))}
      />

      {/* ——— Pour qui ——— */}
      <section id="pour-qui" className="scroll-mt-16 border-t border-line">
        <Container className="py-20 sm:py-28">
          <SectionHeading
            eyebrow={dict.audiences.eyebrow}
            title={dict.audiences.title}
            intro={dict.audiences.intro}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2">
            {AUDIENCE_LAYOUT.map(({ id, className, sizes }) => (
              <AudienceCard
                key={id}
                title={dict.solutions[id].name}
                text={dict.solutions[id].card}
                photo={SOLUTION_MEDIA[id].card}
                alt={dict.solutions[id].cardAlt}
                sizes={sizes}
                href={localePath(locale, `/solutions/${id}`)}
                more={dict.audiences.more}
                className={className}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ——— Comment ça marche : l'histoire d'une commande, racontée par un téléphone ——— */}
      <section id="fonctionnement" data-theme="dark" className="scroll-mt-16 bg-surface">
        <Container className="pt-20 sm:pt-28">
          <SectionHeading eyebrow={dict.story.eyebrow} title={dict.story.title} intro={dict.story.intro} />
          <div className="mt-10 lg:mt-4">
            <PhoneStory
              steps={story.steps}
              screens={solutionScreens(story.screens, storyMedia)}
              aside={<CounterTicket copy={story.screens.ticket} />}
            />
          </div>
        </Container>
        <Container className="pb-20 sm:pb-24">
          <SolutionLinks locale={locale} dict={dict} exclude={STORY_SOLUTION} title={dict.story.others} />
        </Container>
      </section>

      {/* ——— Ce qui change pour vous ——— */}
      <section className="border-t border-line">
        <Container className="py-20 sm:py-28">
          <SectionHeading eyebrow={dict.features.eyebrow} title={dict.features.title} />
          <div className="mt-16 grid gap-24 sm:gap-32">
            {dict.features.items.map((feature, index) => (
              <FeatureRow
                key={feature.title}
                flip={index % 2 === 1}
                number={String(index + 1).padStart(2, "0")}
                title={feature.title}
                text={feature.text}
                points={feature.points}
                photo={FEATURE_PHOTOS[index]}
                alt={feature.alt}
              >
                {crumbs[index]}
              </FeatureRow>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— Vidéo ——— */}
      <section>
        <Container className="pb-20 sm:pb-28">
          <div
            data-reveal
            data-theme="dark"
            className="relative isolate overflow-hidden rounded-2xl bg-surface"
          >
            <div className="aspect-4/5 sm:aspect-video">
              <AutoplayVideo src="/video/service.mp4" poster="/video/service.jpg" />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-ink/95 via-ink/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
              <p className="type-display-2 max-w-2xl">{dict.video.title}</p>
              <p className="type-lead mt-4 max-w-xl text-fg-muted">{dict.video.text}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ——— Tarifs ——— */}
      <section id="tarifs" className="scroll-mt-16 overflow-x-clip border-t border-line">
        <Container className="py-20 sm:py-28">
          <SectionHeading eyebrow={dict.pricing.eyebrow} title={dict.pricing.title} intro={dict.pricing.intro} />
          <div className="mt-12">
            <Pricing dict={dict} />
          </div>
        </Container>
      </section>

      {/* ——— Questions ——— */}
      <section id="questions" className="scroll-mt-16 border-t border-line">
        <Container className="grid gap-x-16 gap-y-10 py-20 sm:py-28 lg:grid-cols-12">
          <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} className="lg:col-span-5" />
          <div data-reveal className="lg:col-span-7">
            <Accordion defaultValue={dict.faq.items[0].question}>
              {dict.faq.items.map((item) => (
                <AccordionItem key={item.question} value={item.question} question={item.question}>
                  {item.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>

      <FinalCta dict={dict} />
    </>
  );
}

/** Les liens vers les pages des autres types d'établissement. */
export function SolutionLinks({
  locale,
  dict,
  exclude,
  title,
}: {
  locale: Locale;
  dict: Dictionary;
  exclude?: SolutionId;
  title: string;
}) {
  const ids = (Object.keys(dict.solutions) as SolutionId[]).filter((id) => id !== exclude);
  return (
    <div data-reveal className="flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-line pt-8">
      <p className="text-fg-muted">{title}</p>
      <ul className="flex flex-wrap gap-2">
        {ids.map((id) => (
          <li key={id}>
            <Link
              href={localePath(locale, `/solutions/${id}`)}
              className="block rounded-full border border-line-strong px-4 py-2 text-[0.9375rem] font-semibold transition-colors hover:border-fg hover:bg-fg/5"
            >
              {dict.solutions[id].name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/*
 * Les petits morceaux d'interface posés sur les photos. Ce sont des dessins,
 * comme les écrans du téléphone : ils montrent le geste, ils ne font rien.
 */

type CrumbCopy = Dictionary["features"]["crumbs"];

function Crumb({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      data-theme="light"
      className={cn(
        "rounded-lg border border-line bg-surface-raised p-3.5 text-xs text-fg shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Modifier un plat : le prix, et l'interrupteur de disponibilité. */
function EditCrumb({ copy }: { copy: CrumbCopy }) {
  return (
    <Crumb>
      <p className="font-semibold">{copy.dish}</p>
      <div className="mt-2.5 flex items-center justify-between gap-3 rounded-sm border border-fg px-2.5 py-2 ring-3 ring-fg/15">
        <span className="text-fg-muted">{copy.price}</span>
        <span className="font-semibold tabular-nums">{formatPrice(4500)}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <span>{copy.available}</span>
        <span className="flex h-5 w-9 items-center justify-end rounded-full bg-fg p-0.5">
          <span className="size-4 rounded-full bg-surface-raised" />
        </span>
      </div>
    </Crumb>
  );
}

/** L'adresse permanente de la page. */
function LinkCrumb({ copy }: { copy: CrumbCopy }) {
  return (
    <Crumb>
      <p className="text-fg-muted">{copy.address}</p>
      <p className="mt-1 text-sm font-semibold">…/chez-tantie</p>
      <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success-text">
        <span className="size-1.5 rounded-full bg-current" />
        {copy.never}
      </p>
    </Crumb>
  );
}

/** Le message prêt à partir sur WhatsApp. */
function MessageCrumb({ copy }: { copy: CrumbCopy }) {
  return (
    <Crumb>
      <p className="text-fg-muted">{copy.message}</p>
      <p className="mt-2 rounded-md rounded-bl-xs bg-surface-sunken p-2.5 leading-relaxed">
        {copy.hello}
        {copy.messageLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        <span className="block font-semibold">
          {copy.total} {formatPrice(5500)}
        </span>
      </p>
    </Crumb>
  );
}
