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
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    setMessages([]);
  }, [trackSlug, lessonSlug]);

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
    <div className="ai-helper-root">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ai-helper-fab"
        aria-label={t("title")}
        aria-expanded={open}
      >
        <BrandLogo size={48} />
      </button>

      {open && (
        <div className="ai-sheet ai-helper-panel">
          <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
            <div className="flex items-start gap-3">
              <BrandLogo size={36} className="border border-line" />
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg text-accent">
                  {t("title")}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
                  {t("context", { lesson: lessonTitle })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ink-muted transition-colors hover:text-ink"
              aria-label={t("close")}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="space-y-2 text-sm text-ink-muted">
                <p>{t("welcome")}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[t("suggest1"), t("suggest2"), t("suggest3")].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInput(s)}
                      className="rounded border border-line px-2.5 py-1 text-xs transition-colors hover:border-accent hover:text-accent"
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
                className={`rounded px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ms-6 bg-accent-soft text-ink"
                    : "me-4 border border-line bg-bg-soft"
                }`}
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
                  <span /><span /><span /><span />
                </span>
              </div>
            )}
            <div ref={endRef} />
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
