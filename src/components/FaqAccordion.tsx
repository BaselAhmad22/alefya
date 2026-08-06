"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import type { FaqItemDef } from "@/lib/faq";
import { AccordionToggle } from "@/components/AccordionToggle";

type Props = {
  items: FaqItemDef[];
  /** Allow multiple panels open at once */
  multi?: boolean;
};

export function FaqAccordion({ items, multi = false }: Props) {
  const t = useTranslations("faq");
  const baseId = useId();
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(multi ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (items.length === 0) {
    return <p className="faq-empty">{t("empty")}</p>;
  }

  return (
    <ul className="faq-list">
      {items.map((item, index) => {
        const isOpen = open.has(item.id);
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-btn-${item.id}`;
        return (
          <li
            key={item.id}
            className={`faq-item ${isOpen ? "is-open" : ""}`}
            style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
          >
            <button
              type="button"
              id={buttonId}
              className="faq-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
            >
              <span className="faq-question">{t(`items.${item.id}.q`)}</span>
              <AccordionToggle open={isOpen} />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`faq-panel ${isOpen ? "is-open" : ""}`}
            >
              <p className="faq-answer">{t(`items.${item.id}.a`)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
