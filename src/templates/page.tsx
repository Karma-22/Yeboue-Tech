import type { TemplateId } from "@/config/templates";
import { MenuShell, type Ordering, type PlaceOrderResult } from "@/components/public/menu-shell";
import type { ShellLabels } from "@/components/public/shell-labels";
import { loadTemplate } from "./registry";
import type { TemplateData } from "./types";

interface TemplatePageProps {
  template: TemplateId;
  /** La couleur choisie par le gérant. */
  accent: string;
  data: TemplateData;
  ordering: Ordering;
  shellLabels: ShellLabels;
  placeOrder?: (cart: { itemId: string; quantity: number }[], note: string) => Promise<PlaceOrderResult>;
}

/** Une page d'établissement complète : le modèle choisi, sa couleur, et le panier commun à tous. */
export async function TemplatePage({ template, accent, data, ordering, shellLabels, placeOrder }: TemplatePageProps) {
  const Component = await loadTemplate(template);
  return (
    <MenuShell
      accent={accent}
      ordering={ordering}
      items={data.categories.flatMap((category) => category.items)}
      labels={shellLabels}
      placeOrder={placeOrder}
    >
      <Component data={data} />
    </MenuShell>
  );
}
