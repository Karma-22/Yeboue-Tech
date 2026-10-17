import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getDictionary } from "@/i18n";

/**
 * Le site vitrine en anglais. La page entière est déclarée en français par le
 * layout racine ; ce bloc dit aux lecteurs d'écran et aux moteurs de recherche
 * que son contenu est en anglais.
 */
export default function EnglishLayout({ children }: LayoutProps<"/en">) {
  const dict = getDictionary("en");
  return (
    <div lang="en">
      <SiteHeader locale="en" dict={dict} />
      <main>{children}</main>
      <SiteFooter locale="en" dict={dict} />
    </div>
  );
}
