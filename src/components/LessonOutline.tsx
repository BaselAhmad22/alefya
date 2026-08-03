import { Link } from "@/i18n/routing";

export type OutlineItem = {
  slug: string;
  title: string;
  status: "done" | "current" | "available" | "locked";
  href?: string;
};

type Props = {
  backHref: string;
  backLabel: string;
  outlineLabel: string;
  stageTitle: string;
  lockedLabel: string;
  items: OutlineItem[];
  exam?: { href: string; label: string; active?: boolean } | null;
};

export function LessonOutline({
  backHref,
  backLabel,
  outlineLabel,
  stageTitle,
  lockedLabel,
  items,
  exam,
}: Props) {
  return (
    <aside className="lesson-outline sticky top-20 z-20 hidden max-h-[calc(100vh-5.5rem)] self-start overflow-y-auto overscroll-contain lg:block">
      <div className="lesson-outline-shell">
        <div className="lesson-outline-core">
          <Link href={backHref} className="lesson-outline-back">
            <span className="lesson-outline-back-chip rtl:rotate-180" aria-hidden>
              ←
            </span>
            <span>{backLabel}</span>
          </Link>

          <div className="lesson-outline-head">
            <span className="lesson-outline-kicker">{outlineLabel}</span>
            <h2 className="lesson-outline-stage">{stageTitle}</h2>
          </div>

          <ol className="lesson-outline-list">
            {items.map((item, i) => {
              const n = String(i + 1).padStart(2, "0");
              const body = (
                <>
                  <span className="lesson-outline-marker" aria-hidden>
                    {item.status === "done" ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6.2 4.8 8.5 9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : item.status === "locked" ? (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <rect
                          x="2.6"
                          y="5.2"
                          width="6.8"
                          height="4.8"
                          rx="1.1"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M4.1 5.2V4.1a1.9 1.9 0 0 1 3.8 0v1.1"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      n
                    )}
                  </span>
                  <span className="lesson-outline-title">
                    {item.title}
                    {item.status === "locked" ? (
                      <span className="lesson-outline-locked-tag">
                        {" "}
                        · {lockedLabel}
                      </span>
                    ) : null}
                  </span>
                </>
              );

              return (
                <li
                  key={item.slug}
                  className={`lesson-outline-item is-${item.status}`}
                  style={{ animationDelay: `${60 + i * 40}ms` }}
                >
                  {item.href && item.status !== "locked" ? (
                    <Link
                      href={item.href}
                      className="lesson-outline-link"
                      aria-current={
                        item.status === "current" ? "page" : undefined
                      }
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="lesson-outline-link is-disabled">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>

          {exam ? (
            <Link
              href={exam.href}
              className={`lesson-outline-exam${exam.active ? " is-active" : ""}`}
              aria-current={exam.active ? "page" : undefined}
            >
              <span>{exam.label}</span>
              <span className="lesson-outline-exam-chip rtl:rotate-180" aria-hidden>
                →
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
