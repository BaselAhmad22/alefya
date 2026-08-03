"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter, Link } from "@/i18n/routing";
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

const STEPS: Step[] = ["level", "field", "language", "framework", "result"];

function stepIndex(s: Step) {
  return STEPS.indexOf(s);
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
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt, i) => (
        <button
          key={opt.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(opt.id)}
          style={animate ? { animationDelay: `${80 + i * 55}ms` } : undefined}
          className={`${animate ? "wizard-card" : ""} border px-4 py-4 text-start transition-all duration-300 ${
            selected === opt.id
              ? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(217,119,6,0.35)]"
              : "border-line bg-bg-elevated/40 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-bg-elevated"
          } disabled:pointer-events-none disabled:opacity-60`}
        >
          <p className="font-[family-name:var(--font-display)] text-lg">
            {locText(opt.title, locale)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {locText(opt.summary, locale)}
          </p>
        </button>
      ))}
    </div>
  );
}

export function RoadmapWizard() {
  const t = useTranslations("roadmap");
  const locale = useLocale() as Locale;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<Step>("level");
  const [visibleStep, setVisibleStep] = useState<Step>("level");
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const transitioning = useRef(false);

  const [level, setLevel] = useState<string | null>(null);
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
  const currentN = stepIndex(visibleStep) + 1;

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
      router.push(
        `/register?next=${encodeURIComponent(`/${locale}/start`)}`,
      );
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, field, language, framework }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(t("saveError"));
        return;
      }
      router.push(data.startHref || "/dashboard");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const busy = phase === "out";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <BrandLogo size={48} className="border border-line" />
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-ink-muted">{t("subtitle")}</p>

      <nav
        className="wizard-steps mt-8"
        aria-label={t("step", { n: currentN, total: 5 })}
      >
        <ol className="flex w-full items-center">
          {STEPS.map((s, i) => {
            const n = i + 1;
            const done = n < currentN;
            const active = n === currentN;
            const labels = [
              t("stepLevel"),
              t("stepField"),
              t("stepLanguage"),
              t("stepFramework"),
              t("stepPlan"),
            ] as const;

            return (
              <li
                key={s}
                className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}
              >
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[0.75rem] font-semibold transition-all duration-400 ${
                      done
                        ? "border-teal bg-teal text-[#042f2e]"
                        : active
                          ? "border-accent bg-accent/15 text-accent ring-4 ring-accent/15"
                          : "border-line/80 bg-bg-elevated text-ink-muted"
                    }`}
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
                    className={`mt-2 whitespace-nowrap text-[0.65rem] sm:text-xs ${
                      active
                        ? "font-medium text-ink"
                        : done
                          ? "text-teal"
                          : "text-ink-muted"
                    }`}
                  >
                    {labels[i]}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className={`mx-2 mb-5 h-px min-w-[0.75rem] flex-1 transition-colors duration-500 ${
                      done ? "bg-teal/60" : "bg-line"
                    }`}
                  />
                )}
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
            <h2 className="mb-4 text-xl font-medium">{t("pickLevel")}</h2>
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
            <h2 className="mb-4 text-xl font-medium">{t("pickField")}</h2>
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
            <button
              type="button"
              disabled={busy}
              className="mt-4 text-sm text-ink-muted transition-colors hover:text-accent disabled:opacity-50"
              onClick={() => goTo("level")}
            >
              {t("back")}
            </button>
          </>
        )}

        {visibleStep === "language" && field && (
          <>
            <h2 className="mb-4 text-xl font-medium">{t("pickLanguage")}</h2>
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
            <h2 className="mb-4 text-xl font-medium">{t("pickFramework")}</h2>
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
            <h2 className="mb-2 text-xl font-medium">{t("yourPlan")}</h2>
            <p className="text-sm text-ink-muted">{t("planHint")}</p>
            <ol className="mt-6 space-y-2 border-s border-line ps-5">
              {selectedFw.trackSequence.map((slug, i) => (
                <li
                  key={slug}
                  className={phase === "in" ? "wizard-card text-sm" : "text-sm"}
                  style={
                    phase === "in"
                      ? { animationDelay: `${90 + i * 60}ms` }
                      : undefined
                  }
                >
                  <span className="font-mono text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  {slug}
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
        <div className="wizard-ai mt-12 border border-line bg-bg-elevated/40 p-5">
          <p className="text-sm font-medium">{t("askAi")}</p>
          <p className="mt-1 text-xs text-ink-muted">{contextTitle}</p>
          <div className="mt-3 flex gap-2">
            <input
              value={aiQ}
              onChange={(e) => setAiQ(e.target.value)}
              placeholder={t("aiPlaceholder")}
              className="min-w-0 flex-1 border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              disabled={aiLoading}
              onClick={() => void askAi()}
              className="rounded bg-accent px-3 py-2 text-sm font-medium text-bg disabled:opacity-50"
            >
              {aiLoading ? "…" : t("aiSend")}
            </button>
          </div>
          {aiA && (
            <div className="prose-lesson wizard-ai-answer mt-4 text-sm whitespace-pre-wrap">
              {aiA}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
