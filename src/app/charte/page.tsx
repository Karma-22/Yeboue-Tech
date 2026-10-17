import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo, LogoMark } from "@/components/brand/logo";
import { Viewfinder } from "@/components/brand/viewfinder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Charte d'interface",
  robots: { index: false },
};

/*
 * Les pastilles de couleur lisent les vraies variables de globals.css.
 * Seuls les codes écrits à côté sont recopiés ici : à tenir à jour avec ce fichier.
 */
const TOKENS = [
  { name: "surface", light: "#FAF6EF", dark: "#14213D", role: "Fond de page" },
  { name: "surface-raised", light: "#FFFDFA", dark: "#222E48", role: "Cartes, champs, fenêtres" },
  { name: "surface-sunken", light: "#EFEBE6", dark: "#0E182C", role: "Zones en retrait" },
  { name: "fg", light: "#14213D", dark: "#FAF6EF", role: "Texte principal" },
  { name: "fg-muted", light: "#4B5468", dark: "#BEBFC1", role: "Texte secondaire" },
  { name: "fg-subtle", light: "#62697A", dark: "#9598A1", role: "Légendes, aides" },
  { name: "line", light: "#DCDAD8", dark: "#343F56", role: "Filets, séparations" },
  { name: "line-strong", light: "#878C96", dark: "#757A88", role: "Contours des champs" },
  { name: "accent", light: "#F2622E", dark: "#F2622E", role: "L'action : boutons, jamais de petit texte" },
  { name: "accent-text", light: "#B6390C", dark: "#F7784A", role: "La braise quand elle doit se lire" },
  { name: "signal", light: "#2EC2EA", dark: "#2EC2EA", role: "Le scan et le direct, rien d'autre" },
  { name: "success-text", light: "#1C6E48", dark: "#5CD69D", role: "C'est fait, c'est prêt" },
  { name: "warning-text", light: "#7E5607", dark: "#F5B83D", role: "À surveiller" },
  { name: "danger-text", light: "#B4223B", dark: "#F18395", role: "Erreur, suppression" },
] as const;

const DISHES = [
  { name: "Attiéké poisson braisé", detail: "Carpe braisée, attiéké frais, piment, oignons", price: 3500 },
  { name: "Kedjenou de poulet", detail: "Mijoté à l'étouffée, servi avec du riz", price: 4000 },
  { name: "Foutou banane, sauce graine", detail: "Viande de bœuf ou poisson fumé", price: 3000 },
  { name: "Alloco", detail: "Banane plantain frite", price: 1000 },
  { name: "Bissap maison", detail: "Le verre", price: 500 },
] as const;

export default function ChartePage() {
  // Page de travail : elle n'existe pas sur le site en ligne.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <header className="border-b border-line">
        <Container className="flex h-18 items-center justify-between gap-4">
          <Logo className="h-7" />
          <Badge>Page interne</Badge>
        </Container>
      </header>

      <main>
        <Container className="grid items-end gap-10 py-16 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <p className="type-eyebrow text-fg-subtle">Charte d&apos;interface · version 1</p>
            <h1 className="type-display-1 mt-5">
              L&apos;encre, l&apos;ivoire et un peu de braise.
            </h1>
            <p className="type-lead mt-7 max-w-2xl text-fg-muted">
              Tout ce que la plateforme affiche est construit avec ce qui suit : trois couleurs de
              marque, deux polices et une poignée de composants.
            </p>
          </div>
          <LogoMark
            aria-hidden="true"
            className="hidden size-44 justify-self-end lg:col-span-3 lg:block"
          />
        </Container>

        <Section
          number="01"
          title="Couleurs"
          intro="L'ivoire porte la page, l'encre porte le texte. La braise ne sert qu'à l'action : un bouton, pas un décor. Le cyan n'apparaît qu'au moment du scan."
        >
          <figure>
            <div className="flex h-44 overflow-hidden rounded-xl border border-line sm:h-56">
              <div className="flex flex-[62] flex-col justify-end bg-ivory p-4 text-ink sm:p-5">
                <span className="font-semibold">Ivoire</span>
                <span className="text-sm tabular-nums opacity-70">#FAF6EF</span>
              </div>
              <div className="flex flex-[30] flex-col justify-end bg-ink p-4 text-ivory sm:p-5">
                <span className="font-semibold">Encre</span>
                <span className="text-sm tabular-nums opacity-70">#14213D</span>
              </div>
              <div className="flex flex-[8] items-end justify-center bg-ember pb-4 text-ink sm:pb-5">
                <span className="text-xs font-semibold [writing-mode:vertical-rl]">
                  Braise · #F2622E
                </span>
              </div>
            </div>
            <figcaption className="mt-3 text-sm text-fg-subtle">
              Les proportions d&apos;usage : beaucoup d&apos;ivoire, de l&apos;encre, très peu de
              braise.
            </figcaption>
          </figure>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="type-eyebrow text-fg-subtle">
                  <th className="pb-3 font-semibold">Jeton</th>
                  <th className="pb-3 font-semibold">Clair</th>
                  <th className="pb-3 font-semibold">Sombre</th>
                  <th className="hidden pb-3 font-semibold sm:table-cell">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {TOKENS.map((token) => (
                  <tr key={token.name} className="border-t border-line">
                    <td className="py-3 pr-4">
                      <span className="font-semibold">{token.name}</span>
                      {/* Sur téléphone, le rôle passe sous le nom : la quatrième colonne ne tient pas. */}
                      <span className="block text-fg-muted sm:hidden">{token.role}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <Swatch theme="light" token={token.name} code={token.light} />
                    </td>
                    <td className="py-3 pr-4">
                      <Swatch theme="dark" token={token.name} code={token.dark} />
                    </td>
                    <td className="hidden py-3 text-fg-muted sm:table-cell">{token.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          number="02"
          title="Typographie"
          intro="Bricolage Grotesque pour les titres : du caractère, légèrement resserrée. Hanken Grotesk pour tout le reste : elle s'efface et reste lisible en petit."
        >
          <div>
            <Specimen name="Titre 1" spec="Bricolage 700 · 44 à 92 px">
              <p className="type-display-1">Scannez, c&apos;est servi.</p>
            </Specimen>
            <Specimen name="Titre 2" spec="Bricolage 700 · 34 à 60 px">
              <p className="type-display-2">Le plat du jour s&apos;affiche tout seul.</p>
            </Specimen>
            <Specimen name="Titre 3" spec="Bricolage 700 · 26 à 38 px">
              <p className="type-display-3">Vos tables, vos zones, vos QR Codes</p>
            </Specimen>
            <Specimen name="Intertitre" spec="Bricolage 700 · 22 px">
              <p className="type-title">Abonnement et paiements</p>
            </Specimen>
            <Specimen name="Chapeau" spec="Hanken 400 · 18 à 21 px">
              <p className="type-lead">
                Le gérant change un prix sur son téléphone ; au scan suivant, la table voit le
                nouveau prix.
              </p>
            </Specimen>
            <Specimen name="Texte" spec="Hanken 400 · 16 px">
              <p className="max-w-prose">
                Aucune application à installer. Le client ouvre l&apos;appareil photo, vise le QR
                Code posé sur la table, et le menu s&apos;affiche avec les photos, les descriptions
                et les prix du jour.
              </p>
            </Specimen>
            <Specimen name="Légende" spec="Hanken 400 · 14 px">
              <p className="text-sm text-fg-muted">Dernière modification il y a 3 minutes.</p>
            </Specimen>
            <Specimen name="Surtitre" spec="Hanken 600 · 12 px · capitales">
              <p className="type-eyebrow text-fg-subtle">Plats de résistance</p>
            </Specimen>
          </div>

          <Card className="p-6 sm:p-8">
            <p className="type-eyebrow text-fg-subtle">En situation : une carte</p>
            <p className="type-title mt-2">Maquis Chez Tantie</p>
            <ul className="mt-6 grid gap-5">
              {DISHES.map((dish) => (
                <li key={dish.name}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-semibold">{dish.name}</span>
                    <span
                      aria-hidden="true"
                      className="min-w-6 flex-1 border-b border-dotted border-line-strong"
                    />
                    <span className="font-semibold tabular-nums">{formatPrice(dish.price)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-fg-muted">{dish.detail}</p>
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        <Section
          number="03"
          title="Logo"
          intro="Le logo suit le thème tout seul : anneau et nom dans la couleur du texte, centre dans celle du fond, assiette toujours braise."
        >
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-5">
              <div className="grid min-h-52 place-items-center rounded-xl border border-line p-8 sm:col-span-3">
                <Logo className="h-11" />
              </div>
              <div
                data-theme="dark"
                className="grid min-h-52 place-items-center rounded-xl bg-surface p-8 sm:col-span-2"
              >
                <Logo className="h-9" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-5">
              <div className="flex items-end gap-5 rounded-xl border border-line bg-white p-6 sm:col-span-3">
                <LogoMark className="size-4" />
                <LogoMark className="size-6" />
                <LogoMark className="size-8" />
                <LogoMark className="size-12" />
                <LogoMark className="size-16" />
              </div>
              <div className="flex items-end gap-5 rounded-xl border border-line bg-white p-6 sm:col-span-2">
                <LogoMark mono className="size-8 text-ink" />
                <LogoMark mono className="size-16 text-ink" />
              </div>
            </div>
            <p className="text-sm text-fg-subtle">
              Du symbole à 16 px dans un onglet jusqu&apos;au chevalet imprimé. À droite, la version
              une couleur pour le tampon et la gravure. Fichiers d&apos;origine dans{" "}
              <code className="font-semibold text-fg-muted">public/brand</code>.
            </p>
          </div>
        </Section>

        <Section
          number="04"
          title="Composants"
          intro="Les briques de base. Elles sont pensées pour le pouce : 44 px de haut au minimum, et un texte de 16 px dans les champs."
        >
          <div className="grid gap-5">
            <Sub>Boutons</Sub>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Mettre en ligne</Button>
              <Button variant="secondary">Télécharger le QR Code</Button>
              <Button variant="outline">Aperçu</Button>
              <Button variant="ghost">Annuler</Button>
              <Button variant="danger">Supprimer</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg">Créer mon menu</Button>
              <Button size="md">Enregistrer</Button>
              <Button size="sm">Ajouter un plat</Button>
              <Button loading>Enregistrer</Button>
              <Button disabled>Indisponible</Button>
            </div>
          </div>

          <div className="grid gap-5">
            <Sub>Champs</Sub>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Field label="Nom de l'établissement" hint="C'est le nom que vos clients verront.">
                <Input name="demo-name" placeholder="Maquis Chez Tantie" autoComplete="off" />
              </Field>
              <Field label="Type d'établissement">
                <Select name="demo-type" defaultValue="maquis">
                  <option value="restaurant">Restaurant</option>
                  <option value="maquis">Maquis</option>
                  <option value="bar">Bar ou lounge</option>
                  <option value="hotel">Hôtel</option>
                </Select>
              </Field>
              <Field label="Adresse e-mail" error="Cette adresse est déjà utilisée.">
                <Input name="demo-email" type="email" defaultValue="tantie@exemple.ci" />
              </Field>
              <Field label="Prix" hint="En francs CFA, sans espace.">
                <Input name="demo-price" inputMode="numeric" defaultValue="3500" />
              </Field>
              <Field label="Description" optional className="sm:col-span-2">
                <Textarea
                  name="demo-description"
                  rows={3}
                  placeholder="Carpe braisée, attiéké frais, piment, oignons"
                />
              </Field>
            </div>
          </div>

          <div className="grid gap-5">
            <Sub>Interrupteur et case à cocher</Sub>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-line bg-surface-raised px-4 py-3">
                <span>
                  <span className="block font-semibold">Attiéké poisson braisé</span>
                  <span className="block text-sm text-fg-muted">Disponible à la commande</span>
                </span>
                <Switch defaultChecked />
              </label>
              <label className="flex cursor-pointer items-center gap-3 px-1 py-3">
                <Checkbox defaultChecked />
                <span>Afficher le menu aussi en anglais</span>
              </label>
            </div>
          </div>

          <div className="grid gap-5">
            <Sub>Étiquettes d&apos;état</Sub>
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">Nouvelle</Badge>
              <Badge tone="warning">En préparation</Badge>
              <Badge tone="success">Prête</Badge>
              <Badge>Servie</Badge>
              <Badge tone="danger">Refusée</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="solid">Essai · 9 jours</Badge>
              <Badge tone="success" dot>
                Abonnement actif
              </Badge>
              <Badge tone="warning" dot>
                À renouveler
              </Badge>
              <Badge tone="signal" dot="live">
                En direct
              </Badge>
            </div>
          </div>

          <div className="grid gap-5">
            <Sub>En situation : une commande</Sub>
            <Card className="max-w-md p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="type-title">Table 12</p>
                  <p className="text-sm text-fg-muted">Étage · il y a 2 minutes</p>
                </div>
                <Badge tone="accent">Nouvelle</Badge>
              </div>
              <ul className="mt-5 grid gap-2 border-t border-line pt-4">
                <li className="flex justify-between gap-4">
                  <span>
                    <span className="font-semibold tabular-nums">2 ×</span> Attiéké poisson braisé
                  </span>
                  <span className="tabular-nums">{formatPrice(7000)}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>
                    <span className="font-semibold tabular-nums">1 ×</span> Bissap maison
                  </span>
                  <span className="tabular-nums">{formatPrice(500)}</span>
                </li>
              </ul>
              <p className="mt-3 rounded-sm bg-surface-sunken px-3 py-2 text-sm text-fg-muted">
                « Un des deux plats sans piment, s&apos;il vous plaît. »
              </p>
              <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-fg-muted">Total</span>
                <span className="type-title tabular-nums">{formatPrice(7500)}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button variant="outline">Refuser</Button>
                <Button>Accepter</Button>
              </div>
            </Card>
          </div>

          <div className="grid gap-5">
            <Sub>Fenêtre de confirmation</Sub>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Supprimer un plat…</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Supprimer « Alloco » ?</DialogTitle>
                  <DialogDescription>
                    Le plat disparaît tout de suite du menu. Les commandes déjà passées ne changent
                    pas.
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Annuler</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="danger">Supprimer</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Section>

        <Section
          number="05"
          title="Thème sombre"
          intro="Un bloc qui porte data-theme=&quot;dark&quot; inverse tout seul ses couleurs. C'est le fond des moments forts : l'accueil, le scan."
        >
          <div
            data-theme="dark"
            className="grid gap-10 rounded-2xl bg-surface p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center"
          >
            <div>
              <Logo className="h-7" />
              <p className="type-display-2 mt-8">Le menu s&apos;ouvre en une seconde.</p>
              <p className="mt-4 max-w-md text-fg-muted">
                Même en 3G, même sur un vieux téléphone. La page d&apos;un établissement pèse moins
                qu&apos;une photo.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button>Créer mon menu</Button>
                <Button variant="outline">Voir la démonstration</Button>
                <Badge tone="signal" dot="live">
                  En direct
                </Badge>
              </div>
              <div className="mt-7 max-w-sm">
                <Field label="Votre numéro WhatsApp" hint="Pour recevoir les commandes à emporter.">
                  <Input name="demo-whatsapp" type="tel" placeholder="07 00 00 00 00" />
                </Field>
              </div>
            </div>

            <Viewfinder
              scanning
              aria-hidden="true"
              className="mx-auto grid size-48 place-items-center md:mx-0"
            >
              <LogoMark className="size-24" />
            </Viewfinder>
          </div>
        </Section>
      </main>

      <footer className="border-t border-line">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-8 text-sm text-fg-subtle">
          <span>
            Couleurs et styles : <code className="font-semibold">src/app/globals.css</code>
          </span>
          <span>
            Composants : <code className="font-semibold">src/components/ui</code>
          </span>
        </Container>
      </footer>
    </>
  );
}

function Section({
  number,
  title,
  intro,
  children,
}: {
  number: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line">
      <Container className="grid gap-x-12 gap-y-10 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-10">
            <p className="type-eyebrow text-accent-text">{number}</p>
            <h2 className="type-display-3 mt-3">{title}</h2>
            <p className="mt-4 max-w-sm text-fg-muted">{intro}</p>
          </div>
        </div>
        <div className="grid min-w-0 gap-14 lg:col-span-8">{children}</div>
      </Container>
    </section>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="type-eyebrow text-fg-subtle">{children}</h3>;
}

function Specimen({
  name,
  spec,
  children,
}: {
  name: string;
  spec: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-x-8 gap-y-3 border-t border-line py-6 first:border-t-0 first:pt-0 sm:grid-cols-[13rem_1fr]">
      <div className="text-sm">
        <p className="font-semibold">{name}</p>
        <p className="text-fg-subtle">{spec}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Swatch({ theme, token, code }: { theme: "light" | "dark"; token: string; code: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        data-theme={theme}
        className="size-7 shrink-0 rounded-xs border border-black/10"
        style={{ backgroundColor: `var(--${token})` }}
      />
      <span className="tabular-nums text-fg-muted">{code}</span>
    </span>
  );
}
