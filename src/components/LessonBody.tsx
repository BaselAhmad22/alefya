"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";
import { checklistItemKey } from "@/lib/checklist";

type Props = {
  content: string;
  trackSlug: string;
  lessonSlug: string;
  isLoggedIn: boolean;
};

function textFromNode(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return textFromNode(props?.children);
  }
  return "";
}

export function LessonBody({
  content,
  trackSlug,
  lessonSlug,
  isLoggedIn,
}: Props) {
  const t = useTranslations("lesson");
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(!isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/checklist?track=${encodeURIComponent(trackSlug)}&lesson=${encodeURIComponent(lessonSlug)}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCheckedMap(data.items || {});
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, trackSlug, lessonSlug]);

  async function toggle(itemKey: string, next: boolean) {
    if (!isLoggedIn) return;
    setCheckedMap((prev) => ({ ...prev, [itemKey]: next }));
    await fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackSlug, lessonSlug, itemKey, checked: next }),
    });
  }

  const components = useMemo(
    () => ({
      li: ({ children, className, ...props }: React.ComponentProps<"li">) => {
        const isTask =
          typeof className === "string" &&
          className.includes("task-list-item");
        if (!isTask) {
          return (
            <li className={className} {...props}>
              {children}
            </li>
          );
        }

        const label = textFromNode(children).replace(/^\s*/, "").trim();
        const key = checklistItemKey(label);
        const checked = Boolean(checkedMap[key]);

        return (
          <li className={`${className || ""} list-none`} {...props}>
            <label className="flex cursor-pointer items-start gap-2.5 py-0.5">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--teal)] disabled:cursor-not-allowed"
                checked={checked}
                disabled={!isLoggedIn || !loaded}
                onChange={(e) => void toggle(key, e.target.checked)}
              />
              <span
                className={
                  checked ? "text-ink-muted line-through decoration-teal/50" : ""
                }
              >
                {label}
              </span>
            </label>
          </li>
        );
      },
      input: () => null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkedMap, isLoggedIn, loaded, trackSlug, lessonSlug],
  );

  return (
    <div className="prose-lesson">
      {!isLoggedIn && (
        <p className="mb-4 text-sm text-ink-muted">{t("checklistLoginHint")}</p>
      )}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
