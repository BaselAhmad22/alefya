"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BrandLogo } from "@/components/BrandLogo";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  trackSlug: string;
  lessonSlug: string;
  lessonTitle: string;
};

export function AiHelper({ trackSlug, lessonSlug, lessonTitle }: Props) {
  const t = useTranslations("ai");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    setMessages([]);
  }, [trackSlug, lessonSlug]);

  useEffect(() => {
    if (!visible || !listRef.current) return;
    const el = listRef.current;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, visible]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  function openPanel() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setClosing(false);
    setVisible(true);
    setOpen(true);
  }

  function closePanel() {
    if (!open || closing) return;
    setOpen(false);
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
      closeTimer.current = null;
    }, 280);
  }

  function togglePanel() {
    if (open) closePanel();
    else openPanel();
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (root.contains(e.target as Node)) return;
      closePanel();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }

    // Capture so outside click closes even if something stops bubbling.
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close when open flips; closePanel reads latest open/closing
  }, [open, closing]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          trackSlug,
          lessonSlug,
          locale,
          history: nextMessages.slice(-8),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || t("error"),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("error") },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={rootRef} className="ai-helper-root">
      <button
        type="button"
        onClick={togglePanel}
        className={`ai-helper-fab ${open ? "ai-helper-fab-active" : ""}`}
        aria-label={t("title")}
        aria-expanded={open}
      >
        <BrandLogo size={48} />
      </button>

      {visible && (
        <div
          className={`ai-sheet ai-helper-panel ${
            closing ? "ai-helper-panel-out" : "ai-helper-panel-in"
          }`}
          role="dialog"
          aria-label={t("title")}
        >
          <button
            type="button"
            onClick={togglePanel}
            className="ai-helper-header"
            aria-label={t("close")}
          >
            <div className="flex min-w-0 items-start gap-3">
              <BrandLogo size={36} className="shrink-0 border border-line" />
              <div className="min-w-0 text-start">
                <p className="font-[family-name:var(--font-display)] text-lg text-accent">
                  {t("title")}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
                  {t("context", { lesson: lessonTitle })}
                </p>
              </div>
            </div>
          </button>

          <div ref={listRef} className="ai-helper-scroll flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="ai-helper-welcome space-y-2 text-sm text-ink-muted">
                <p>{t("welcome")}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[t("suggest1"), t("suggest2"), t("suggest3")].map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInput(s)}
                      style={{ animationDelay: `${80 + i * 60}ms` }}
                      className="ai-chip rounded border border-line px-2.5 py-1 text-xs transition-colors hover:border-accent hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`ai-msg rounded px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ms-6 bg-accent-soft text-ink"
                    : "me-4 border border-line bg-bg-soft"
                }`}
                style={{ animationDelay: `${Math.min(i, 4) * 40}ms` }}
              >
                {m.role === "assistant" ? (
                  <div className="prose-lesson !max-w-none !text-sm [&_h1]:!text-base [&_h2]:!text-sm [&_h3]:!text-sm [&_pre]:!my-2 [&_pre]:!p-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start py-1">
                <span className="page-loader-bars !h-3" aria-hidden>
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="min-w-0 flex-1 border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary !px-3 !py-2 text-sm disabled:opacity-40"
              >
                {t("send")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
