"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  getFaqItemsByCategory,
  type FaqCategoryId,
} from "@/lib/faq";
import { FaqAccordion } from "@/components/FaqAccordion";

type CatFilter = "all" | FaqCategoryId;

export function FaqPageClient() {
  const t = useTranslations("faq");
  const [category, setCategory] = useState<CatFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const base = getFaqItemsByCategory(category);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((item) => {
      const question = t(`items.${item.id}.q`).toLowerCase();
      const answer = t(`items.${item.id}.a`).toLowerCase();
      return question.includes(q) || answer.includes(q);
    });
  }, [category, query, t]);

  return (
    <div className="faq-page">
      <div className="faq-toolbar">
        <label className="faq-search">
          <span className="sr-only">{t("search")}</span>
          <svg
            className="faq-search-icon"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
          >
            <circle
              cx="8"
              cy="8"
              r="5.25"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M12.2 12.2 15.5 15.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="faq-search-input"
          />
        </label>
      </div>

      <div className="faq-cats" role="tablist" aria-label={t("title")}>
        <button
          type="button"
          role="tab"
          aria-selected={category === "all"}
          className={`faq-cat ${category === "all" ? "is-active" : ""}`}
          onClick={() => setCategory("all")}
        >
          {t("all")}
          <span className="faq-cat-count">{FAQ_ITEMS.length}</span>
        </button>
        {FAQ_CATEGORIES.map((id) => {
          const count = getFaqItemsByCategory(id).length;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={category === id}
              className={`faq-cat ${category === id ? "is-active" : ""}`}
              onClick={() => setCategory(id)}
            >
              {t(`categories.${id}`)}
              <span className="faq-cat-count">{count}</span>
            </button>
          );
        })}
      </div>

      <FaqAccordion items={filtered} multi />
    </div>
  );
}
