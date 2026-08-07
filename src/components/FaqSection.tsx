import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Reveal } from "@/components/Reveal";
import { FaqAccordion } from "@/components/FaqAccordion";
import { getPreviewFaqItems } from "@/lib/faq";

export async function FaqSection() {
  const t = await getTranslations("faq");
  const items = getPreviewFaqItems();

  return (
    <section className="faq-home">
      <div className="page-container py-16 sm:py-20">
        <Reveal>
          <div className="faq-home-head">
            <p className="faq-kicker">{t("homeKicker")}</p>
            <h2 className="faq-home-title">{t("homeTitle")}</h2>
            <p className="faq-home-sub">{t("homeSub")}</p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <FaqAccordion items={items} />
        </Reveal>
        <Reveal delay={140}>
          <div className="faq-home-cta">
            <Link href="/faq" className="btn-ghost home-interview-btn">
              {t("seeAll")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
