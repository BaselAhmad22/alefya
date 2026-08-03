"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { AuthShell } from "@/components/AuthShell";
import { PASSWORD_RULES, passwordRuleMet } from "@/lib/validation";

function safeNext(raw: string | null, locale: string) {
  if (!raw || !raw.startsWith("/")) return `/${locale}/dashboard`;
  return raw;
}

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "ok" | "error"
  >("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pwMet = useMemo(() => passwordRuleMet(password), [password]);
  const allPwOk = PASSWORD_RULES.every((k) => pwMet[k]);

  const issueLabels = useMemo(
    () => ({
      too_short: t("pwTooShort"),
      need_lower: t("pwLower"),
      need_upper: t("pwUpper"),
      need_number: t("pwNumber"),
      need_special: t("pwSpecial"),
    }),
    [t],
  );

  useEffect(() => {
    const value = username.trim().toLowerCase();
    if (!value) {
      setUsernameStatus("idle");
      setUsernameError(null);
      return;
    }
    if (value.length < 5) {
      setUsernameStatus("error");
      setUsernameError(t("usernameShort"));
      return;
    }
    if (!/^[a-z0-9_]+$/i.test(value)) {
      setUsernameStatus("error");
      setUsernameError(t("usernameChars"));
      return;
    }

    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/username/check?username=${encodeURIComponent(value)}`,
        );
        const data = await res.json();
        if (data.available) {
          setUsernameStatus("ok");
          setUsernameError(null);
        } else if (data.reason === "username_taken") {
          setUsernameStatus("error");
          setUsernameError(t("usernameTaken"));
        } else if (data.reason === "username_short") {
          setUsernameStatus("error");
          setUsernameError(t("usernameShort"));
        } else if (data.reason === "username_chars") {
          setUsernameStatus("error");
          setUsernameError(t("usernameChars"));
        } else {
          setUsernameStatus("error");
          setUsernameError(t("usernameInvalid"));
        }
      } catch {
        setUsernameStatus("error");
        setUsernameError(t("usernameCheckError"));
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username, t]);

  const canSubmit = usernameStatus === "ok" && allPwOk && !loading;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    const payload = {
      username: username.trim().toLowerCase(),
      password,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (data.error === "username_taken") {
        setUsernameStatus("error");
        setUsernameError(t("usernameTaken"));
      } else {
        setError(t("registerError"));
      }
      setLoading(false);
      return;
    }

    const login = await signIn("credentials", {
      username: payload.username,
      password: payload.password,
      redirect: false,
    });
    setLoading(false);
    if (login?.error) {
      window.location.href = `/${locale}/login`;
      return;
    }
    window.location.href = safeNext(searchParams.get("next"), locale);
  }

  return (
    <AuthShell
      title={t("registerTitle")}
      subtitle={t("registerHint")}
      brandLine={t("authBrandLine")}
      brandSub={t("authBrandSub")}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-ink-muted">{t("username")}</span>
          <input
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`auth-input ${
              usernameStatus === "error"
                ? "!border-danger"
                : usernameStatus === "ok"
                  ? "!border-teal"
                  : ""
            }`}
          />
          {usernameStatus === "checking" && (
            <p className="text-xs text-ink-muted">{t("usernameChecking")}</p>
          )}
          {usernameStatus === "ok" && (
            <p className="text-xs text-teal">✓ {t("usernameAvailable")}</p>
          )}
          {usernameError && (
            <p className="text-xs text-danger" role="alert">
              {usernameError}
            </p>
          )}
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium text-ink-muted">{t("password")}</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
        </label>

        <ul className="space-y-2 text-xs">
          {PASSWORD_RULES.map((key) => {
            const ok = pwMet[key];
            return (
              <li
                key={key}
                className={`flex items-center gap-2.5 transition-colors duration-200 ${
                  ok ? "text-teal" : "text-ink-muted"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-all duration-200 ${
                    ok
                      ? "scale-100 border-teal bg-teal/20 text-teal"
                      : "scale-95 border-line text-transparent"
                  }`}
                  aria-hidden
                >
                  ✓
                </span>
                {issueLabels[key]}
              </li>
            );
          })}
        </ul>

        {error && (
          <p
            role="alert"
            className="rounded-[var(--radius)] border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary w-full"
        >
          {loading ? "…" : t("registerSubmit")}
        </button>

        <p className="text-center text-sm text-ink-muted">
          {t("hasAccount")}{" "}
          <Link
            href={`/login${searchParams.get("next") ? `?next=${encodeURIComponent(searchParams.get("next")!)}` : ""}`}
            className="font-medium text-teal transition-colors hover:text-accent"
          >
            {t("loginSubmit")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
