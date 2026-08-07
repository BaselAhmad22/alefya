"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { AuthShell } from "@/components/AuthShell";

function safeNext(raw: string | null, locale: string) {
  if (!raw || !raw.startsWith("/")) return `/${locale}/dashboard`;
  return raw;
}

export function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      username: String(form.get("username") || ""),
      password: String(form.get("password") || ""),
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setError(t("error"));
      return;
    }
    window.location.href = safeNext(searchParams.get("next"), locale);
  }

  return (
    <AuthShell
      title={t("loginTitle")}
      subtitle={t("loginHint")}
      brandLine={t("authBrandLine")}
      brandSub={t("authBrandSub")}
    >
      <form onSubmit={onSubmit} className="auth-form">
        <label className="auth-field">
          <span className="auth-label">{t("username")}</span>
          <input
            name="username"
            type="text"
            autoComplete="username"
            required
            minLength={5}
            className="auth-input"
          />
        </label>
        <label className="auth-field">
          <span className="auth-label">{t("password")}</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={1}
            className="auth-input"
          />
        </label>
        {error && (
          <p role="alert" className="auth-alert is-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary auth-submit"
        >
          {loading ? "…" : t("loginSubmit")}
        </button>
        <p className="auth-switch">
          {t("noAccount")}{" "}
          <Link
            href={`/register${searchParams.get("next") ? `?next=${encodeURIComponent(searchParams.get("next")!)}` : ""}`}
            className="auth-switch-link"
          >
            {t("registerSubmit")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
