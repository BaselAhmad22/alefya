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
      <form onSubmit={onSubmit} className="auth-form">
        <label className="auth-field">
          <span className="auth-label">{t("username")}</span>
          <input
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`auth-input ${
              usernameStatus === "error"
                ? "is-error"
                : usernameStatus === "ok"
                  ? "is-ok"
                  : ""
            }`}
          />
          {usernameStatus === "checking" && (
            <p className="auth-hint">{t("usernameChecking")}</p>
          )}
          {usernameStatus === "ok" && (
            <p className="auth-hint is-ok">✓ {t("usernameAvailable")}</p>
          )}
          {usernameError && (
            <p className="auth-hint is-error" role="alert">
              {usernameError}
            </p>
          )}
        </label>

        <label className="auth-field">
          <span className="auth-label">{t("password")}</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
        </label>

        <ul className="auth-pw-rules" aria-live="polite">
          {PASSWORD_RULES.map((key) => {
            const ok = pwMet[key];
            return (
              <li
                key={key}
                className={`auth-pw-rule ${ok ? "is-ok" : ""}`}
              >
                <span className="auth-pw-rule-mark" aria-hidden>
                  {ok ? "✓" : ""}
                </span>
                {issueLabels[key]}
              </li>
            );
          })}
        </ul>

        {error && (
          <p role="alert" className="auth-alert is-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary auth-submit"
        >
          {loading ? "…" : t("registerSubmit")}
        </button>

        <p className="auth-switch">
          {t("hasAccount")}{" "}
          <Link
            href={`/login${searchParams.get("next") ? `?next=${encodeURIComponent(searchParams.get("next")!)}` : ""}`}
            className="auth-switch-link"
          >
            {t("loginSubmit")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
