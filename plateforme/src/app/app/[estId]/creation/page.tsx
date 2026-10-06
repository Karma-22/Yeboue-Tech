import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { goToStep } from "@/app/app/[estId]/actions";
import { AppearanceEditor } from "@/components/dashboard/appearance-editor";
import { PlanStepForm } from "@/components/dashboard/forms";
import { MenuEditor } from "@/components/dashboard/menu-editor";
import { AccountBar } from "@/components/dashboard/page-header";
import { Steps } from "@/components/dashboard/steps";
import { Button } from "@/components/ui/button";
import { TRIAL } from "@/config/plans";
import { requireAccess } from "@/lib/auth/session";
import { getMenu } from "@/lib/db/menu";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Créer mon établissement" };

/**
 * Les écrans 2 à 4 de la création guidée (ARCHITECTURE.md §6.1 et §17) :
 * l'apparence, la carte, puis l'offre. Chaque écran enregistre : si le gérant
 * ferme la page, il reprend où il s'était arrêté.
 */
export default async function CreationPage({ params }: PageProps<"/app/[estId]/creation">) {
  const { estId } = await params;
  const { establishment, session } = await requireAccess(estId, "billing.manage");
  if (establishment.subscription !== null) redirect(`/app/${estId}`);

  const step = Math.min(4, Math.max(2, establishment.setupStep ?? 2));
  const goTo = {
    2: goToStep.bind(null, estId, 2),
    3: goToStep.bind(null, estId, 3),
    4: goToStep.bind(null, estId, 4),
  };
  const itemWord = establishment.type === "hotel" || establishment.type === "residence" ? "service" : "article";

  return (
    <>
      <AccountBar admin={session.superAdmin} />
      <main className={cn("mx-auto px-5 py-10 sm:px-8", step === 2 ? "max-w-6xl" : "max-w-2xl")}>
        <div className="max-w-2xl">
          <Steps current={step} goTo={goTo} />
        </div>

        {step === 2 && (
          <>
            <h1 className="type-display-3 mt-8">À quoi ressemblera votre page ?</h1>
            <p className="mt-2 mb-9 max-w-xl text-fg-muted">
              Choisissez un modèle et votre couleur. Tout se change plus tard, sans rien perdre.
            </p>
            <AppearanceEditor
              establishmentId={estId}
              type={establishment.type}
              template={establishment.template}
              accentColor={establishment.accentColor}
              logoUrl={establishment.logoUrl}
              coverUrl={establishment.coverUrl}
              submitLabel="Continuer"
              after={goTo[3]}
            />
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="type-display-3 mt-8">Votre carte.</h1>
            <p className="mt-2 mb-9 text-fg-muted">
              Quelques catégories et quelques {itemWord}s suffisent pour commencer : vous compléterez ensuite, photos
              comprises.
            </p>
            <MenuEditor
              establishmentId={estId}
              {...await getMenu(estId)}
              canEdit
              canToggle={false}
              english={establishment.english}
              itemWord={itemWord}
            />
            <form action={goTo[4]} className="mt-9">
              <Button type="submit" size="lg">
                Continuer
              </Button>
            </form>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="type-display-3 mt-8">Choisissez votre offre.</h1>
            <p className="mt-2 mb-9 text-fg-muted">
              Vous l&apos;essayez {TRIAL.days} jours sans rien payer, et vous pouvez en changer pendant l&apos;essai. Dès
              que vous validez, votre page est en ligne et votre QR Code est prêt.
            </p>
            <PlanStepForm establishmentId={estId} whatsapp={establishment.whatsapp} />
          </>
        )}
      </main>
    </>
  );
}
