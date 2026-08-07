"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter, Link } from "@/i18n/routing";
import { showNavLoader, hideNavLoader } from "@/lib/nav-loader";
import {
  LEVELS,
  FIELDS,
  LANGUAGES_BY_FIELD,
  frameworksFor,
  type RoadmapField,
} from "@/lib/roadmap";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/BrandLogo";

function locText(s: { ar: string; en: string }, locale: Locale) {
  return s[locale] || s.en;
}

type Step = "level" | "field" | "language" | "framework" | "result";

const ALL_STEPS: Step[] = ["level", "field", "language", "framework", "result"];

function stepIndex(s: Step) {
  return ALL_STEPS.indexOf(s);
}

type Option = {
  id: string;
  title: { ar: string; en: string };
  summary: { ar: string; en: string };
};

function OptionCards({
  options,
  selected,
  onSelect,
  disabled,
  animate,
}: {
  options: Option[];
  selected: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
  animate?: boolean;
}) {
  const locale = useLocale() as Locale;

  return (
    <div className="wizard-options-grid">
      {options.map((opt, i) => (
        <button
          key={opt.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(opt.id)}
          style={animate ? { animationDelay: `${80 + i * 55}ms` } : undefined}
          className={`wizard-option-card ${animate ? "wizard-card" : ""} ${
            selected === opt.id ? "is-selected" : ""
          }`}
        >
          <p className="wizard-option-title">{locText(opt.title, locale)}</p>
          <p className="wizard-option-summary">{locText(opt.summary, locale)}</p>
        </button>
      ))}
    </div>
  );
}

export function RoadmapWizard({
  savedLevel,
}: {
  savedLevel?: string | null;
}) {
  const t = useTranslations("roadmap");
  const locale = useLocale() as Locale;
  const { data: session, status } = useSession();
  const router = useRouter();

  const initialStep: Step = savedLevel ? "field" : "level";
  const [step, setStep] = useState<Step>(initialStep);
  const [visibleStep, setVisibleStep] = useState<Step>(initialStep);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const transitioning = useRef(false);

  const [level, setLevel] = useState<string | null>(savedLevel || null);
  const [field, setField] = useState<RoadmapField | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [framework, setFramework] = useState<string | null>(null);
  const [aiQ, setAiQ] = useState("");
  const [aiA, setAiA] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages = field ? LANGUAGES_BY_FIELD[field] : [];
  const frameworks =
    field && language ? frameworksFor(field, language) : [];
  const selectedFw = frameworks.find((f) => f.id === framework);
  const steps = savedLevel ? ALL_STEPS.slice(1) : ALL_STEPS;
  const currentN = steps.indexOf(visibleStep) + 1;

  const contextTitle = useMemo(() => {
    if (visibleStep === "field") return t("aiContextField");
    if (visibleStep === "language") return t("aiContextLanguage");
    if (visibleStep === "framework") return t("aiContextFramework");
    return t("aiContextGeneric");
  }, [visibleStep, t]);

  function goTo(next: Step) {
    if (next === step || transitioning.current) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setDirection(stepIndex(next) >= stepIndex(step) ? "forward" : "back");
    setStep(next);

    if (reduce) {
      setVisibleStep(next);
      setPhase("in");
      return;
    }

    transitioning.current = true;
    setPhase("out");
    window.setTimeout(() => {
      setVisibleStep(next);
      setPhase("in");
      transitioning.current = false;
    }, 220);
  }

  useEffect(() => {
    setAiA(null);
    setAiQ("");
  }, [visibleStep]);

  async function askAi() {
    if (!aiQ.trim()) return;
    setAiLoading(true);
    setAiA(null);
    try {
      const res = await fetch("/api/ai-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: aiQ,
          trackSlug: "roadmap",
          lessonSlug: visibleStep,
          locale,
          history: [],
          roadmapContext: {
            level,
            field,
            language,
            framework,
            step: visibleStep,
            contextTitle,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      setAiA(data.answer || t("aiError"));
    } catch {
      setAiA(t("aiError"));
    } finally {
      setAiLoading(false);
    }
  }

  async function startLearning() {
    if (!level || !field || !language || !framework) return;
    if (status !== "authenticated" || !session?.user) {
      showNavLoader();
      router.push(
        `/register?next=${encodeURIComponent(`/${locale}/start`)}`,
      );
      return;
    }
    setSaving(true);
    setError(null);
    showNavLoader();
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, field, language, framework }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        hideNavLoader();
        setError(t("saveError"));
        return;
      }
      router.push(data.startHref || "/dashboard");
      router.refresh();
    } catch {
      hideNavLoader();
    } finally {
      setSaving(false);
    }
  }

  const busy = phase === "out";

  return (
    <div className="ay-page wizard-shell">
      <div className="ay-page-ambient" aria-hidden />

      <div className="wizard-layout">
      <header className="wizard-hero page-hero">
        <BrandLogo size={48} className="border border-line" />
        <h1 className="page-title !mt-5">{t("title")}</h1>
        <p className="page-sub">{t("subtitle")}</p>
        <hr className="page-hero-rule" />
      </header>

      <nav
        className="wizard-steps"
        aria-label={t("step", { n: currentN, total: steps.length })}
      >
        <ol className="wizard-steps-track">
          {steps.map((s, i) => {
            const n = i + 1;
            const done = n < currentN;
            const active = n === currentN;
            const labels: Record<Step, string> = {
              level: t("stepLevel"),
              field: t("stepField"),
              language: t("stepLanguage"),
              framework: t("stepFramework"),
              result: t("stepPlan"),
            };

            return (
              <li
                key={s}
                className={`wizard-step ${i < steps.length - 1 ? "has-connector" : ""} ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}
              >
                <div className="wizard-step-node">
                  <span
                    className={`wizard-step-dot ${done ? "is-done" : active ? "is-active" : ""}`}
                  >
                    {done ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M2.5 6.2 4.8 8.5 9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      n
                    )}
                  </span>
                  <span
                    className={`wizard-step-label ${active ? "is-active" : done ? "is-done" : ""}`}
                  >
                    {labels[s]}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden
                    className={`wizard-step-connector ${done ? "is-done" : ""}`}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>

      <div
        className={`wizard-panel mt-6 ${
          phase === "out"
            ? `wizard-panel-out wizard-dir-${direction}`
            : `wizard-panel-in wizard-dir-${direction}`
        }`}
        key={`${visibleStep}-${phase === "in" ? "show" : "hide"}`}
      >
        {visibleStep === "level" && (
          <>
            <h2 className="wizard-panel-title">{t("pickLevel")}</h2>
            <OptionCards
              options={LEVELS}
              selected={level}
              disabled={busy}
              animate={phase === "in"}
              onSelect={(id) => {
                setLevel(id);
                goTo("field");
              }}
            />
          </>
        )}

        {visibleStep === "field" && (
          <>
            <h2 className="wizard-panel-title">{t("pickField")}</h2>
            <OptionCards
              options={FIELDS}
              selected={field}
              disabled={busy}
              animate={phase === "in"}
              onSelect={(id) => {
                setField(id as RoadmapField);
                setLanguage(null);
                setFramework(null);
                goTo("language");
              }}
            />
            {!savedLevel && (
              <button
                type="button"
                disabled={busy}
                className="mt-4 text-sm text-ink-muted transition-colors hover:text-accent disabled:opacity-50"
                onClick={() => goTo("level")}
              >
                {t("back")}
              </button>
            )}
          </>
        )}

        {visibleStep === "language" && field && (
          <>
            <h2 className="wizard-panel-title">{t("pickLanguage")}</h2>
            <OptionCards
              options={languages}
              selected={language}
              disabled={busy}
              animate={phase === "in"}
              onSelect={(id) => {
                setLanguage(id);
                setFramework(null);
                goTo("framework");
              }}
            />
            <button
              type="button"
              disabled={busy}
              className="mt-4 text-sm text-ink-muted transition-colors hover:text-accent disabled:opacity-50"
              onClick={() => goTo("field")}
            >
              {t("back")}
            </button>
          </>
        )}

        {visibleStep === "framework" && (
          <>
            <h2 className="wizard-panel-title">{t("pickFramework")}</h2>
            <OptionCards
              options={frameworks}
              selected={framework}
              disabled={busy}
              animate={phase === "in"}
              onSelect={(id) => {
                setFramework(id);
                goTo("result");
              }}
            />
            <button
              type="button"
              disabled={busy}
              className="mt-4 text-sm text-ink-muted transition-colors hover:text-accent disabled:opacity-50"
              onClick={() => goTo("language")}
            >
              {t("back")}
            </button>
          </>
        )}

        {visibleStep === "result" && selectedFw && (
          <>
            <h2 className="wizard-panel-title">{t("yourPlan")}</h2>
            <p className="wizard-panel-hint">{t("planHint")}</p>
            <ol className="wizard-plan-list">
              {selectedFw.trackSequence.map((slug, i) => (
                <li
                  key={slug}
                  className={phase === "in" ? "wizard-card wizard-plan-item" : "wizard-plan-item"}
                  style={
                    phase === "in"
                      ? { animationDelay: `${90 + i * 60}ms` }
                      : undefined
                  }
                >
                  <span className="journey-row-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="wizard-plan-slug">{slug}</span>
                </li>
              ))}
            </ol>
            {error && <p className="mt-4 text-sm text-danger">{error}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={saving || busy}
                onClick={() => void startLearning()}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? "…" : t("startLearning")}
              </button>
              <button
                type="button"
                disabled={busy}
                className="text-sm text-ink-muted transition-colors hover:text-accent disabled:opacity-50"
                onClick={() => goTo("framework")}
              >
                {t("back")}
              </button>
            </div>
            {status !== "authenticated" && (
              <p className="mt-3 text-sm text-ink-muted">
                {t("needAccount")}{" "}
                <Link href="/register" className="text-accent hover:underline">
                  {t("signUp")}
                </Link>
              </p>
            )}
          </>
        )}
      </div>

      {(visibleStep === "field" ||
        visibleStep === "language" ||
        visibleStep === "framework") && (
        <div className="wizard-ai wizard-ai-panel mt-12 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <BrandLogo size={36} className="shrink-0 rounded-xl border border-line" />
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg text-accent">
                {t("askAi")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {contextTitle}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(visibleStep === "field"
              ? [t("aiSuggestField1"), t("aiSuggestField2"), t("aiSuggestField3")]
              : visibleStep === "language"
                ? [
                    t("aiSuggestLang1"),
                    t("aiSuggestLang2"),
                    t("aiSuggestLang3"),
                  ]
                : [t("aiSuggestFw1"), t("aiSuggestFw2"), t("aiSuggestFw3")]
            ).map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setAiQ(s)}
                style={{ animationDelay: `${70 + i * 50}ms` }}
                className="ai-chip rounded-xl border border-line/80 bg-bg/40 px-2.5 py-1 text-xs text-ink-muted transition-colors hover:border-accent hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={aiQ}
              onChange={(e) => setAiQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void askAi();
                }
              }}
              placeholder={t("aiPlaceholder")}
              className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
            <button
              type="button"
              disabled={aiLoading || !aiQ.trim()}
              onClick={() => void askAi()}
              className="btn-primary !px-4 !py-2.5 text-sm disabled:opacity-50"
            >
              {aiLoading ? "…" : t("aiSend")}
            </button>
          </div>
          {aiLoading && (
            <div className="mt-5 flex items-center gap-3 text-sm text-ink-muted">
              <span className="page-loader-bars !h-3" aria-hidden>
                <span />
                <span />
                <span />
                <span />
              </span>
              <span>{t("aiThinking")}</span>
            </div>
          )}
          {aiA && !aiLoading && (
            <div
              key={aiA.slice(0, 48)}
              className="wizard-ai-answer-wrap mt-5 rounded-xl border border-line/70 bg-bg/50 px-4 py-4"
            >
              <div className="prose-lesson text-sm [&_h3]:!mt-3 [&_h3]:!mb-1.5 [&_h3]:!text-[0.95rem] [&_p]:!my-1.5 [&_ul]:!my-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiA}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
