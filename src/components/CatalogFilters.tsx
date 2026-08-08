"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

function SearchField({
  value,
  onChange,
  placeholder,
  clearLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  clearLabel: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label htmlFor={id} className="catalog-search group">
      <span className="catalog-search-icon" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M10.6 10.6 13.5 13.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="catalog-search-input"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          className="catalog-search-clear"
          aria-label={clearLabel}
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M3 3l6 6M9 3 3 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
      <span className="catalog-search-glow" aria-hidden />
    </label>
  );
}

function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const optionKey = options.map((o) => o.id).join("|");

  useEffect(() => {
    const root = groupRef.current;
    if (!root) return;

    const update = () => {
      const active = root.querySelector<HTMLElement>(`[data-seg="${value}"]`);
      if (!active) return;
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };

    update();
    // Wait a frame so fonts/layout settle before measuring
    const raf = window.requestAnimationFrame(update);
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(root);
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [value, optionKey]);

  return (
    <div className="catalog-seg" role="group" aria-label={label}>
      <span className="catalog-seg-label">{label}</span>
      <div ref={groupRef} className="catalog-seg-track">
        <span
          className={`catalog-seg-indicator ${indicator.width > 0 ? "is-ready" : ""}`}
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width,
          }}
          aria-hidden
        />
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            data-seg={opt.id}
            aria-pressed={value === opt.id}
            className={`catalog-seg-btn ${value === opt.id ? "is-active" : ""}`}
            onClick={() => onChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type CatCard = {
  slug: string;
  title: string;
  description: string;
  trackCount: number;
  color?: string;
  href: string;
  tracksLabel: string;
  comingSoon: string;
};

export function CategoriesFilters({
  cards,
  labels,
}: {
  cards: CatCard[];
  labels: {
    search: string;
    availability: string;
    all: string;
    withTracks: string;
    comingSoon: string;
    emptyFiltered: string;
    clear: string;
  };
}) {
  const [q, setQ] = useState("");
  const [avail, setAvail] = useState<"all" | "ready" | "soon">("all");
  const [listKey, setListKey] = useState(0);

  const filtered = useMemo(() => {
    let list = [...cards];
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query),
      );
    }
    if (avail === "ready") list = list.filter((c) => c.trackCount > 0);
    if (avail === "soon") list = list.filter((c) => c.trackCount === 0);
    return list;
  }, [cards, q, avail]);

  useEffect(() => {
    setListKey((k) => k + 1);
  }, [q, avail]);

  return (
    <div className="mt-10">
      <div className="catalog-toolbar">
        <div className="catalog-toolbar-inner">
          <SearchField
            value={q}
            onChange={setQ}
            placeholder={labels.search}
            clearLabel={labels.clear}
          />
          <div className="catalog-toolbar-controls">
            <SegmentedControl
              label={labels.availability}
              value={avail}
              onChange={setAvail}
              options={[
                { id: "all", label: labels.all },
                { id: "ready", label: labels.withTracks },
                { id: "soon", label: labels.comingSoon },
              ]}
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div key={`empty-${listKey}`} className="catalog-empty mt-8">
          <p className="text-ink-muted">{labels.emptyFiltered}</p>
        </div>
      ) : (
        <div key={listKey} className="catalog-results mt-8 catalog-grid">
          {filtered.map((cat, i) => (
            <a
              key={cat.slug}
              href={cat.href}
              className="catalog-card catalog-result-card h-full"
              style={{
                animationDelay: `${Math.min(i, 9) * 50}ms`,
                ["--card-accent"]: cat.color || "var(--teal)",
              } as CSSProperties}
            >
              <p className="catalog-card-meta">
                {cat.trackCount > 0
                  ? `${cat.trackCount} ${cat.tracksLabel}`
                  : cat.comingSoon}
              </p>
              <h2 className="catalog-card-title">{cat.title}</h2>
              <p className="catalog-card-desc line-clamp-2">{cat.description}</p>
              <span className="catalog-card-go">
                {cat.tracksLabel}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
