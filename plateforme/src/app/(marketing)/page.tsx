import Image from "next/image";
import { LogoMark } from "@/components/brand/logo";
import { Viewfinder } from "@/components/brand/viewfinder";
import { AudienceCard } from "@/components/marketing/audience-card";
import { AutoplayVideo } from "@/components/marketing/autoplay-video";
import { FeatureRow } from "@/components/marketing/feature-row";
import { Phone } from "@/components/marketing/phone";
import {
  CounterTicket,
  DishScreen,
  MenuScreen,
  OrderScreen,
  ScanScreen,
} from "@/components/marketing/phone-screens";
import { PhoneStory, type StoryStep } from "@/components/marketing/phone-story";
import { Pricing } from "@/components/marketing/pricing";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { signupHref, site } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import barPhoto from "@/assets/photos/bar-lounge.jpg";
import customerPhoto from "@/assets/photos/cliente-telephone.jpg";
import heroPhoto from "@/assets/photos/clients-telephone.jpg";
import kitchenPhoto from "@/assets/photos/cuisine-flammes.jpg";
import ownerPhoto from "@/assets/photos/gerante-telephone.jpg";
import hotelPhoto from "@/assets/photos/hotel-chambre.jpg";
import maquisPhoto from "@/assets/photos/maquis-poisson-braise.jpg";
import qrPhoto from "@/assets/photos/qr-table.jpg";
import restaurantPhoto from "@/assets/photos/restaurant-service.jpg";

const STEPS: StoryStep[] = [
  {
    title: "Le client scanne",
    text: "Il ouvre l'appareil photo de son téléphone et vise le QR Code posé sur la table. Aucune application à installer, aucun compte à créer.",
  },
  {
    title: "Votre menu s'ouvre",
    text: "Vos plats, vos photos, vos prix du jour. La page est légère : elle s'ouvre vite, même quand le réseau est faible.",
  },
  {
    title: "Il choisit",
    text: "Une grande photo, une description claire, le prix. Il ajoute le plat à son panier sans attendre qu'on vienne à sa table.",
  },
  {
    title: "La commande arrive au comptoir",
    text: "Elle s'affiche aussitôt sur votre téléphone ou votre tablette, avec le numéro de la table. Le client suit sa commande jusqu'à ce qu'elle soit prête.",
  },
];

const QUESTIONS = [
  {
    question: "Mes clients doivent-ils installer une application ?",
    answer:
      "Non. Ils ouvrent l'appareil photo de leur téléphone, visent le QR Code, et votre menu s'affiche dans leur navigateur. Rien à télécharger, aucun compte à créer.",
  },
  {
    question: "Faut-il réimprimer le QR Code quand je change un prix ?",
    answer:
      "Jamais. Le QR Code mène toujours à la même adresse ; c'est le contenu de la page qui change. Vous imprimez une fois, vous modifiez autant que vous voulez.",
  },
  {
    question: "Je ne suis pas à l'aise avec l'informatique. Est-ce pour moi ?",
    answer:
      "Oui. Tout se fait depuis un téléphone, comme écrire un message. Et si vous préférez ne rien faire vous-même, l'installation clé en main s'occupe de tout : saisie du menu, impression et pose des QR Codes, formation de votre équipe.",
  },
  {
    question: "Qui prend les photos de mes plats ?",
    answer:
      "Vous, avec votre téléphone : un petit guide vous montre comment réussir vos photos, et la page reste belle même pour un plat sans photo. Si vous voulez mieux, un photographe partenaire peut venir chez vous.",
  },
  {
    question: "Comment se paie l'abonnement ?",
    answer:
      "Par Wave ou Orange Money, pour un mois ou plusieurs mois d'avance. Vous recevez un rappel avant l'échéance, et votre menu n'est jamais coupé en plein service.",
  },
  {
    question: "Que se passe-t-il à la fin des 14 jours d'essai ?",
    answer:
      "Vous choisissez l'offre qui vous convient. Vos QR Codes restent les mêmes : ceux que vous avez posés pendant l'essai continuent de fonctionner.",
  },
];

export default function HomePage() {
  return (
    <>
      <ScrollReveal />

      {/* ——— Haut de page ——— */}
      <section className="overflow-x-clip">
        <Container className="grid items-center gap-x-10 gap-y-14 pt-12 pb-24 sm:pt-16 lg:grid-cols-2 lg:pb-28">
          <div>
            <p className="type-eyebrow animate-rise text-fg-subtle">
              Menus par QR Code · {site.contact.city}
            </p>
            <h1 className="type-display-1 mt-5 animate-rise [animation-delay:80ms]">
              Votre menu en ligne en 15&nbsp;minutes.
            </h1>
            <p className="type-lead mt-6 max-w-lg animate-rise text-fg-muted [animation-delay:160ms]">
              Un QR Code sur chaque table, et vos clients voient vos plats, vos photos et vos prix
              du jour. Vous changez tout vous-même, depuis votre téléphone, sans jamais réimprimer.
            </p>
            <div className="mt-9 flex animate-rise flex-wrap items-center gap-3 [animation-delay:240ms]">
              <a href={signupHref} className={buttonStyles({ size: "lg" })}>
                Créer mon menu
              </a>
              <a href="#fonctionnement" className={buttonStyles({ variant: "ghost", size: "lg" })}>
                Voir comment ça marche
              </a>
            </div>
            <p className="mt-6 animate-rise text-sm text-fg-subtle [animation-delay:320ms]">
              Essai gratuit de 14 jours · Sans engagement · Aucune application à installer
            </p>
          </div>

          <div className="relative animate-rise [animation-delay:200ms] lg:ml-10">
            <Viewfinder cornerClassName="size-10" className="rounded-2xl p-3 text-fg">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl sm:aspect-4/3 lg:aspect-4/5">
                <Image
                  src={heroPhoto}
                  alt="Deux clients attablés regardent le menu sur un téléphone"
                  fill
                  priority
                  sizes="(min-width: 1024px) 540px, 100vw"
                  placeholder="blur"
                  className="object-cover object-[62%_center]"
                />
              </div>
            </Viewfinder>
            <Phone
              aria-hidden="true"
              className="absolute -bottom-14 left-0 origin-bottom-left scale-[0.52] sm:scale-[0.62] lg:-left-20 lg:scale-[0.8]"
            >
              <MenuScreen />
            </Phone>
          </div>
        </Container>
      </section>

      {/* ——— Pour qui ——— */}
      <section id="pour-qui" className="scroll-mt-16 border-t border-line">
        <Container className="py-20 sm:py-28">
          <SectionHeading
            eyebrow="Pour qui"
            title="Du maquis de quartier à l'hôtel."
            intro="Le même outil pour toutes les maisons. Vous y mettez votre nom, vos couleurs et vos plats."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2">
            <AudienceCard
              title="Maquis"
              text="Le poisson du jour au prix du jour, affiché en dix secondes."
              photo={maquisPhoto}
              alt="Des poissons en train de griller sur un barbecue"
              sizes="(min-width: 768px) 42vw, 100vw"
              className="md:col-span-5 md:row-span-2 md:min-h-136"
            />
            <AudienceCard
              title="Restaurants"
              text="Une carte toujours juste, en français et en anglais."
              photo={restaurantPhoto}
              alt="Une équipe en tablier sert des clients au comptoir d'un restaurant"
              sizes="(min-width: 768px) 58vw, 100vw"
              className="md:col-span-7"
            />
            <AudienceCard
              title="Bars et lounges"
              text="Vos cocktails en photo, vos soirées à l'affiche."
              photo={barPhoto}
              alt="Le comptoir éclairé d'un bar"
              sizes="(min-width: 768px) 25vw, 100vw"
              className="md:col-span-3"
            />
            <AudienceCard
              title="Hôtels"
              text="La carte et les services de la maison, dans chaque chambre."
              photo={hotelPhoto}
              alt="Un employé prépare le lit d'une chambre d'hôtel"
              sizes="(min-width: 768px) 33vw, 100vw"
              className="md:col-span-4"
            />
          </div>
        </Container>
      </section>

      {/* ——— Comment ça marche : l'histoire d'une commande, racontée par un téléphone ——— */}
      <section id="fonctionnement" data-theme="dark" className="scroll-mt-16 bg-surface">
        <Container className="pt-20 pb-20 sm:pt-28 lg:pb-8">
          <SectionHeading
            eyebrow="Comment ça marche"
            title="Du scan à la cuisine, en quatre gestes."
            intro="Voici ce que vit un client qui s'assoit chez vous, et ce que vous voyez de votre côté."
          />
          <div className="mt-16 lg:mt-4">
            <PhoneStory
              steps={STEPS}
              screens={[
                <ScanScreen key="scan" />,
                <MenuScreen key="menu" />,
                <DishScreen key="dish" />,
                <OrderScreen key="order" />,
              ]}
              aside={<CounterTicket />}
            />
          </div>
        </Container>
      </section>

      {/* ——— Ce qui change pour vous ——— */}
      <section className="border-t border-line">
        <Container className="py-20 sm:py-28">
          <SectionHeading
            eyebrow="Ce qui change pour vous"
            title="Moins de papier, moins d'allers-retours."
          />
          <div className="mt-16 grid gap-24 sm:gap-32">
            <FeatureRow
              number="01"
              title="Vous changez un prix en dix secondes."
              text="Un plat en rupture, un nouveau tarif, le plat du jour : vous le faites vous-même, depuis votre téléphone. Vos clients le voient au scan suivant."
              points={[
                "Plats et photos illimités",
                "Un plat en rupture se retire d'un seul geste",
                "Plat du jour et promotions affichés aux heures choisies",
              ]}
              photo={ownerPhoto}
              alt="Une gérante en tablier, assise à une table de son restaurant, au téléphone"
            >
              <EditCrumb />
            </FeatureRow>

            <FeatureRow
              flip
              number="02"
              title="Vous imprimez une fois, pour toujours."
              text="Le QR Code mène à une adresse qui ne change jamais. Vous modifiez votre carte autant que vous voulez : rien à réimprimer, rien à recoller."
              points={[
                "Un QR Code pour la maison, ou un par table",
                "Des affiches et des planches prêtes à imprimer",
                "Le même lien pour Instagram, WhatsApp et votre fiche Google",
              ]}
              photo={qrPhoto}
              alt="Un petit chevalet avec un QR Code posé sur une table de restaurant"
            >
              <LinkCrumb />
            </FeatureRow>

            <FeatureRow
              number="03"
              title="La commande arrive au comptoir, sans crier."
              text="Le client commande depuis sa table. La commande s'affiche aussitôt chez vous, avec une sonnerie et le numéro de la table. Vous l'acceptez d'un geste."
              points={[
                "Un écran de commandes sur n'importe quel téléphone ou tablette",
                "Le client suit sa commande : acceptée, prête, servie",
                "Appel du serveur et demande de l'addition depuis la table",
              ]}
              photo={kitchenPhoto}
              alt="Un chef fait flamber une poêle dans une cuisine ouverte"
            >
              <CounterTicket />
            </FeatureRow>

            <FeatureRow
              flip
              number="04"
              title="À emporter ? La commande part sur WhatsApp."
              text="Le client remplit son panier sur votre page et vous l'envoie sur WhatsApp, déjà rédigé. Vous réglez l'heure et la livraison avec lui, comme d'habitude."
              points={[
                "Rien de nouveau à apprendre pour votre équipe",
                "Le total est calculé, les plats sont listés",
                "Compris dans les deux offres",
              ]}
              photo={customerPhoto}
              alt="Une cliente assise à une table de café consulte son téléphone"
            >
              <MessageCrumb />
            </FeatureRow>
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
              <p className="type-display-2 max-w-2xl">
                Pendant le service, vous n&apos;avez pas une minute.
              </p>
              <p className="type-lead mt-4 max-w-xl text-fg-muted">
                Alors tout se règle d&apos;un geste, entre deux assiettes : un prix, une rupture,
                une commande à accepter.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ——— Tarifs ——— */}
      <section id="tarifs" className="scroll-mt-16 border-t border-line">
        <Container className="py-20 sm:py-28">
          <SectionHeading
            eyebrow="Tarifs"
            title="Deux offres, sans surprise."
            intro="Pas de limite sur le nombre de plats, de photos ou de commandes. Pas de commission sur vos ventes."
          />
          <div className="mt-12">
            <Pricing />
          </div>
        </Container>
      </section>

      {/* ——— Questions ——— */}
      <section id="questions" className="scroll-mt-16 border-t border-line">
        <Container className="grid gap-x-16 gap-y-10 py-20 sm:py-28 lg:grid-cols-12">
          <SectionHeading eyebrow="Questions" title="Ce qu'on nous demande souvent." className="lg:col-span-5" />
          <div data-reveal className="lg:col-span-7">
            <Accordion defaultValue={QUESTIONS[0].question}>
              {QUESTIONS.map((item) => (
                <AccordionItem key={item.question} value={item.question} question={item.question}>
                  {item.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>

      {/* ——— Dernier appel ——— */}
      <section data-theme="dark" className="relative isolate overflow-hidden bg-surface">
        {/* Les repères aux angles, comme sur un QR Code. */}
        <LogoMark aria-hidden="true" className="absolute -top-16 -left-16 -z-10 size-56 opacity-25 sm:size-72" />
        <LogoMark aria-hidden="true" className="absolute -right-16 -bottom-16 -z-10 size-56 opacity-25 sm:size-72" />
        <Container className="py-24 text-center sm:py-32">
          <h2 data-reveal className="type-display-1 mx-auto max-w-4xl">
            Votre carte en ligne dès ce soir.
          </h2>
          <p data-reveal className="type-lead mx-auto mt-6 max-w-xl text-fg-muted">
            Quinze minutes pour créer votre menu, un QR Code à poser sur vos tables, et 14 jours
            pour essayer gratuitement.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href={signupHref} className={buttonStyles({ size: "lg" })}>
              Créer mon menu
            </a>
            <a
              href={`tel:${site.contact.phone}`}
              className={cn(buttonStyles({ variant: "outline", size: "lg" }), "tabular-nums")}
            >
              Appeler le {site.contact.phoneDisplay}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

/*
 * Les trois petits morceaux d'interface posés sur les photos. Ce sont des
 * dessins, comme les écrans du téléphone : ils montrent le geste, ils ne font rien.
 */

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
function EditCrumb() {
  return (
    <Crumb>
      <p className="font-semibold">Poisson braisé</p>
      <div className="mt-2.5 flex items-center justify-between gap-3 rounded-sm border border-fg px-2.5 py-2 ring-3 ring-fg/15">
        <span className="text-fg-muted">Prix</span>
        <span className="font-semibold tabular-nums">{formatPrice(4500)}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <span>Disponible aujourd&apos;hui</span>
        <span className="flex h-5 w-9 items-center justify-end rounded-full bg-fg p-0.5">
          <span className="size-4 rounded-full bg-surface-raised" />
        </span>
      </div>
    </Crumb>
  );
}

/** L'adresse permanente de la page. */
function LinkCrumb() {
  return (
    <Crumb>
      <p className="text-fg-muted">L&apos;adresse de votre page</p>
      <p className="mt-1 text-sm font-semibold">…/chez-tantie</p>
      <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success-text">
        <span className="size-1.5 rounded-full bg-current" />
        Ne change jamais
      </p>
    </Crumb>
  );
}

/** Le message prêt à partir sur WhatsApp. */
function MessageCrumb() {
  return (
    <Crumb>
      <p className="text-fg-muted">Message prêt à envoyer</p>
      <p className="mt-2 rounded-md rounded-bl-xs bg-surface-sunken p-2.5 leading-relaxed">
        Bonjour, je souhaite commander :<br />
        1 × Poisson braisé
        <br />
        2 × Bissap maison
        <br />
        <span className="font-semibold">Total : {formatPrice(5500)}</span>
      </p>
    </Crumb>
  );
}
