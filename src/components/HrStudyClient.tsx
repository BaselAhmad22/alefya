"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BackLink } from "@/components/BackLink";

type StudyQ = {
  id: string;
  kind: string;
  difficulty: string;
  competency: string;
  interviewStage: string;
  prompt: string;
  options: string[];
  whyAsked: string;
  recruiterIntent: string;
  modelAnswer: string;
  redFlags: string[];
  passTip: string;
  explanation: string;
  improvement: string;
  correctIndex: number;
};

type Props = {
  trackSlug: string;
  trackTitle: string;
  bankSize: number;
};

const STAGE_OPTIONS = ["", "screening", "hr", "manager"] as const;
const DIFF_OPTIONS = ["", "entry", "mid", "senior"] as const;

function StudyAnswerFlow({ q, t }: { q: StudyQ; t: ReturnType<typeof useTranslations<"hrInterviews">> }) {
  return (
    <div className="hr-study-flow">
      <section className="hr-study-block">
        <h3 className="hr-study-block-head">
          <span className="hr-study-block-num" aria-hidden>
            1
          </span>
          {t("studyBlockContext")}
        </h3>
        <dl className="hr-study-dl">
          <div className="hr-study-dl-row">
            <dt>{t("whyAsked")}</dt>
            <dd>{q.whyAsked}</dd>
          </div>
          <div className="hr-study-dl-row">
            <dt>{t("recruiterIntent")}</dt>
            <dd>{q.recruiterIntent}</dd>
          </div>
        </dl>
      </section>

      <section className="hr-study-block is-highlight">
        <h3 className="hr-study-block-head">
          <span className="hr-study-block-num" aria-hidden>
            2
          </span>
          {t("studyBlockAnswer")}
        </h3>
        <p className="hr-study-model">{q.modelAnswer}</p>
        <div className="hr-study-best">
          <p className="hr-study-best-kicker">{t("bestApproach")}</p>
          <p className="hr-study-best-line">{q.options[q.correctIndex]}</p>
          <p className="hr-study-best-note">{q.explanation}</p>
        </div>
      </section>

      <section className="hr-study-block is-warn">
        <h3 className="hr-study-block-head">
          <span className="hr-study-block-num" aria-hidden>
            3
          </span>
          {t("studyBlockAvoid")}
        </h3>
        <ul className="hr-study-flag-list">
          {q.redFlags.map((flag, fi) => (
            <li key={fi}>{flag}</li>
          ))}
        </ul>
      </section>

      <section className="hr-study-block">
        <h3 className="hr-study-block-head">
          <span className="hr-study-block-num" aria-hidden>
            4
          </span>
          {t("studyBlockNext")}
        </h3>
        <dl className="hr-study-dl">
          <div className="hr-study-dl-row">
            <dt>{t("passTip")}</dt>
            <dd>{q.passTip}</dd>
          </div>
          <div className="hr-study-dl-row">
            <dt>{t("improvement")}</dt>
            <dd>{q.improvement}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function StudySkeleton() {
  return (
    <div className="hr-study-skeleton-list" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="hr-study-skeleton-card" style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`hr-study-filter-chip ${active ? "is-active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function HrStudyClient({ trackSlug, trackTitle, bankSize }: Props) {
  const t = useTranslations("hrInterviews");
  const locale = useLocale() as "ar" | "en";
  const listId = useId();
  const hasLoadedOnce = useRef(false);
  const [questions, setQuestions] = useState<StudyQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    const soft = hasLoadedOnce.current;
    if (soft) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interviews/hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "list",
          trackSlug,
          locale,
          stage: stage || undefined,
          difficulty: difficulty || undefined,
          search: search.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(t("loadError"));
        if (!soft) setQuestions([]);
        return;
      }
      setQuestions(data.questions || []);
    } catch {
      setError(t("loadError"));
      if (!soft) setQuestions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      hasLoadedOnce.current = true;
    }
  }, [trackSlug, locale, stage, difficulty, search, t]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), search ? 320 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  useEffect(() => {
    setExpanded(null);
  }, [stage, difficulty, search]);

  const hasFilters = Boolean(stage || difficulty || search.trim());
  const isInitialLoad = loading && !hasLoadedOnce.current;
  const showEmpty = !loading && !refreshing && !error && questions.length === 0;

  function clearFilters() {
    setSearch("");
    setStage("");
    setDifficulty("");
  }

  const stageLabel = (value: string) =>
    value ? t(`stage_${value}` as "stage_screening") : t("filterAllStages");

  const diffLabel = (value: string) =>
    value ? t(`diff_${value}` as "diff_entry") : t("filterAllDiff");

  return (
    <div className="ay-page hr-study-page">
      <div className="ay-page-ambient" aria-hidden />

      <BackLink href={`/interviews/hr/${trackSlug}`} className="hr-study-back">
        {t("backTrackHub")}
      </BackLink>

      <header className="hr-study-hero">
        <p className="page-kicker">{t("studyModeKicker")}</p>
        <h1 className="page-title">{trackTitle}</h1>
        <p className="page-sub hr-study-hero-sub">{t("studyModeDesc")}</p>
        <div className={`hr-study-stats ${refreshing ? "is-updating" : ""}`}>
          <span className="hr-study-stat">
            <span className="hr-study-stat-value">{questions.length}</span>
            <span className="hr-study-stat-label">{t("studyShown")}</span>
          </span>
          <span className="hr-study-stat-divider" aria-hidden />
          <span className="hr-study-stat">
            <span className="hr-study-stat-value">{bankSize}</span>
            <span className="hr-study-stat-label">{t("studyInBank")}</span>
          </span>
          {refreshing && (
            <span className="hr-study-stat-status" aria-live="polite">
              {t("updatingResults")}
            </span>
          )}
        </div>
      </header>

      <div className={`hr-study-filters ${refreshing ? "is-refreshing" : ""}`}>
        <label className="hr-study-search-wrap">
          <svg className="hr-study-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 10.5 13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="hr-study-search"
            aria-label={t("searchPlaceholder")}
          />
        </label>

        <div className="hr-study-filter-block">
          <span className="hr-study-filter-label">{t("filterStage")}</span>
          <div className="hr-study-filter-chips" role="group" aria-label={t("filterStage")}>
            {STAGE_OPTIONS.map((value) => (
              <FilterChip
                key={value || "all-stages"}
                label={stageLabel(value)}
                active={stage === value}
                onClick={() => setStage(value)}
              />
            ))}
          </div>
        </div>

        <div className="hr-study-filter-block">
          <span className="hr-study-filter-label">{t("filterDifficulty")}</span>
          <div className="hr-study-filter-chips" role="group" aria-label={t("filterDifficulty")}>
            {DIFF_OPTIONS.map((value) => (
              <FilterChip
                key={value || "all-diff"}
                label={diffLabel(value)}
                active={difficulty === value}
                onClick={() => setDifficulty(value)}
              />
            ))}
          </div>
        </div>

        {hasFilters && (
          <div className="hr-study-active-bar">
            <span className="hr-study-active-label">{t("activeFilters")}</span>
            <div className="hr-study-active-chips">
              {search.trim() && (
                <button
                  type="button"
                  className="hr-study-active-chip"
                  onClick={() => setSearch("")}
                >
                  <span>{search.trim()}</span>
                  <span className="hr-study-active-chip-x" aria-hidden>
                    ×
                  </span>
                  <span className="sr-only">{t("clearFilters")}</span>
                </button>
              )}
              {stage && (
                <button
                  type="button"
                  className="hr-study-active-chip"
                  onClick={() => setStage("")}
                >
                  <span>{stageLabel(stage)}</span>
                  <span className="hr-study-active-chip-x" aria-hidden>
                    ×
                  </span>
                </button>
              )}
              {difficulty && (
                <button
                  type="button"
                  className="hr-study-active-chip"
                  onClick={() => setDifficulty("")}
                >
                  <span>{diffLabel(difficulty)}</span>
                  <span className="hr-study-active-chip-x" aria-hidden>
                    ×
                  </span>
                </button>
              )}
            </div>
            <button type="button" className="hr-study-clear-btn" onClick={clearFilters}>
              {t("clearFilters")}
            </button>
          </div>
        )}
      </div>

      {isInitialLoad && <StudySkeleton />}

      {error && (
        <p className="hr-study-message is-error" role="alert">
          {error}
        </p>
      )}

      {showEmpty && (
        <div className="hr-study-empty">
          <p className="hr-study-empty-title">{t("emptyFilter")}</p>
          {hasFilters && (
            <button type="button" className="hr-study-clear-btn mt-4" onClick={clearFilters}>
              {t("clearFilters")}
            </button>
          )}
        </div>
      )}

      <div
        className={`hr-study-results ${refreshing ? "is-refreshing" : ""}`}
        aria-busy={refreshing}
      >
        <div id={listId} className="hr-study-list" role="list">
          {!isInitialLoad &&
            questions.map((q, i) => {
              const open = expanded === q.id;
              const panelId = `${listId}-panel-${q.id}`;
              const headId = `${listId}-head-${q.id}`;
              return (
                <article
                  key={q.id}
                  role="listitem"
                  className={`hr-study-card ${open ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    id={headId}
                    className="hr-study-card-head"
                    onClick={() => setExpanded(open ? null : q.id)}
                    aria-expanded={open}
                    aria-controls={panelId}
                  >
                    <span className="hr-study-card-index" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="hr-study-card-main">
                      <span className="hr-study-card-pills">
                        <span className="hr-study-pill">{t(`stage_${q.interviewStage}`)}</span>
                        <span className="hr-study-pill is-muted">{t(`diff_${q.difficulty}` as "diff_entry")}</span>
                      </span>
                      <span className="hr-study-card-prompt">{q.prompt}</span>
                    </span>
                    <span className="hr-study-card-chevron" aria-hidden>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M4.5 7 9 11.5 13.5 7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headId}
                    aria-hidden={!open}
                    className={`hr-study-card-expand ${open ? "is-open" : ""}`}
                  >
                    <div className="hr-study-card-expand-inner">
                      <div className="hr-study-card-inner">
                        <StudyAnswerFlow q={q} t={t} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </div>
  );
}
