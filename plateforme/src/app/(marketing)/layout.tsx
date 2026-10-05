import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getDictionary } from "@/i18n";

/** Le site vitrine en français. La version anglaise est dans src/app/en. */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  const dict = getDictionary("fr");
  return (
    <>
      <SiteHeader locale="fr" dict={dict} />
      <main>{children}</main>
      <SiteFooter locale="fr" dict={dict} />
    </>
  );
}
