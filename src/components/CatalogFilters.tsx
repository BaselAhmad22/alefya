"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export type FilterStatus = "all" | "in_progress" | "completed";
export type FilterSort = "recent" | "name" | "progress";

type ProgressCard = {
  slug: string;
  title: string;
  done: number;
  total: number;
  href: string;
  resumeLabel: string;
  completedLabel: string;
};

type DashboardLabels = {
  search: string;
  status: string;
  all: string;
  inProgress: string;
  completed: string;
  sort: string;
  sortRecent: string;
  sortName: string;
  sortProgress: string;
  emptyFiltered: string;
  clear: string;
};

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

function SortMenu({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: FilterSort;
  onChange: (v: FilterSort) => void;
  options: { id: FilterSort; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value)?.label ?? label;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`catalog-sort ${open ? "is-open" : ""}`}>
      <span className="catalog-seg-label">{label}</span>
      <button
        type="button"
        className="catalog-sort-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="catalog-sort-icon" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 3.5h10M3.5 7h7M5 10.5h4"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="catalog-sort-value">{current}</span>
        <span className={`catalog-sort-chevron ${open ? "is-open" : ""}`} aria-hidden>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5 6 8l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <ul className="catalog-sort-menu" role="listbox" aria-label={label}>
          {options.map((opt, i) => (
            <li key={opt.id} role="option" aria-selected={value === opt.id}>
              <button
                type="button"
                className={`catalog-sort-option ${value === opt.id ? "is-active" : ""}`}
                style={{ animationDelay: `${40 + i * 40}ms` }}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {value === opt.id && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M3 7.2 5.8 10 11 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DashboardFilters({
  cards,
  labels,
}: {
  cards: ProgressCard[];
  labels: DashboardLabels;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [sort, setSort] = useState<FilterSort>("recent");
  const [listKey, setListKey] = useState(0);

  const filtered = useMemo(() => {
    let list = [...cards];
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((c) => c.title.toLowerCase().includes(query));
    }
    if (status === "completed") {
      list = list.filter((c) => c.total > 0 && c.done >= c.total);
    } else if (status === "in_progress") {
      list = list.filter((c) => c.done < c.total);
    }
    if (sort === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "progress") {
      list.sort((a, b) => {
        const pa = a.total ? a.done / a.total : 0;
        const pb = b.total ? b.done / b.total : 0;
        return pb - pa;
      });
    }
    return list;
  }, [cards, q, status, sort]);

  useEffect(() => {
    setListKey((k) => k + 1);
  }, [q, status, sort]);

  return (
    <div className="dashboard-tracks-section">
      <div className="catalog-toolbar dashboard-toolbar">
        <div className="catalog-toolbar-inner">
          <SearchField
            value={q}
            onChange={setQ}
            placeholder={labels.search}
            clearLabel={labels.clear}
          />
          <div className="catalog-toolbar-controls">
            <SegmentedControl
              label={labels.status}
              value={status}
              onChange={setStatus}
              options={[
                { id: "all", label: labels.all },
                { id: "in_progress", label: labels.inProgress },
                { id: "completed", label: labels.completed },
              ]}
            />
            <SortMenu
              label={labels.sort}
              value={sort}
              onChange={setSort}
              options={[
                { id: "recent", label: labels.sortRecent },
                { id: "name", label: labels.sortName },
                { id: "progress", label: labels.sortProgress },
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
        <div key={listKey} className="catalog-results dashboard-track-grid mt-6">
          {filtered.map(
            ({ slug, title, done, total, href, resumeLabel, completedLabel }, i) => {
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <a
                  key={slug}
                  href={href}
                  className="dashboard-track-card catalog-result-card group"
                  style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                >
                  <div className="dashboard-track-body min-w-0">
                    <h2 className="dashboard-track-title">{title}</h2>
                    <p className="dashboard-track-meta">
                      {done}/{total} {completedLabel}
                    </p>
                    <div className="dashboard-track-bar" aria-hidden>
                      <span style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="dashboard-track-aside">
                    <span className="dashboard-track-pct">{pct}%</span>
                    <span className="dashboard-track-go">
                      {resumeLabel}
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
                  </div>
                </a>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

type CatCard = {
  slug: string;
  title: string;
  description: string;
  trackCount: number;
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
                ["--card-accent"]:
                  i % 3 === 0
                    ? "var(--teal)"
                    : i % 3 === 1
                      ? "var(--accent)"
                      : "#2dd4bf",
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
