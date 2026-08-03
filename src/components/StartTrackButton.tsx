"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";

type Props = {
  trackSlug: string;
  /** Absolute path within locale routing, e.g. /learn/react/foo or /learn/react/exam/stage */
  continueHref: string;
  alreadyStarted: boolean;
  labelStart: string;
  labelContinue: string;
};

export function StartTrackButton({
  trackSlug,
  continueHref,
  alreadyStarted,
  labelStart,
  labelContinue,
}: Props) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (status === "loading") return;

    if (!session?.user) {
      const callback = `/${locale}/tracks/${trackSlug}`;
      router.push(`/register?next=${encodeURIComponent(callback)}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tracks/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackSlug }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push(
            `/login?next=${encodeURIComponent(`/${locale}/tracks/${trackSlug}`)}`,
          );
          return;
        }
        return;
      }
      router.push(continueHref);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || status === "loading"}
      className="btn-primary disabled:opacity-50"
    >
      {loading
        ? "…"
        : !session?.user
          ? `${labelStart} · ${t("registerSubmit")}`
          : alreadyStarted
            ? labelContinue
            : labelStart}
    </button>
  );
}
