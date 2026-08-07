"use client";

import {
  FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Link, useRouter } from "@/i18n/routing";
import { LEVELS } from "@/lib/roadmap";
import { PASSWORD_RULES, passwordRuleMet } from "@/lib/validation";
import { BrandLogo } from "@/components/BrandLogo";
import { AccordionToggle } from "@/components/AccordionToggle";
import { useToast } from "@/components/ToastProvider";

type Props = {
  initialUsername: string;
  initialLevel: string | null;
};

type UsernameStatus = "idle" | "checking" | "ok" | "error";

export function ProfileForm({ initialUsername, initialLevel }: Props) {
  const t = useTranslations("profile");
  const tAuth = useTranslations("auth");
  const locale = useLocale() as "ar" | "en";
  const router = useRouter();
  const { push: pushToast } = useToast();
  const usernameDialogTitleId = useId();
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const [savedUsername, setSavedUsername] = useState(initialUsername);
  const [username, setUsername] = useState(initialUsername);
  const [level, setLevel] = useState(initialLevel || "");
  const [savedLevel, setSavedLevel] = useState(initialLevel || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [usernameVisible, setUsernameVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const usernameDirty =
    username.trim().toLowerCase() !== savedUsername.toLowerCase();
  const passwordDirty =
    currentPassword.length > 0 || newPassword.length > 0;
  const levelDirty = level !== "" && level !== savedLevel;

  const pwMet = useMemo(() => passwordRuleMet(newPassword), [newPassword]);
  const allPwOk = PASSWORD_RULES.every((k) => pwMet[k]);
  const issueLabels = useMemo(
    () => ({
      too_short: tAuth("pwTooShort"),
      need_lower: tAuth("pwLower"),
      need_upper: tAuth("pwUpper"),
      need_number: tAuth("pwNumber"),
      need_special: tAuth("pwSpecial"),
    }),
    [tAuth],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!usernameOpen) {
      setUsernameStatus("idle");
      setUsernameError(null);
      return;
    }
    const value = username.trim().toLowerCase();
    if (!value || value === savedUsername.toLowerCase()) {
      setUsernameStatus("idle");
      setUsernameError(null);
      return;
    }
    if (value.length < 5) {
      setUsernameStatus("error");
      setUsernameError(tAuth("usernameShort"));
      return;
    }
    if (!/^[a-z0-9_]+$/i.test(value)) {
      setUsernameStatus("error");
      setUsernameError(tAuth("usernameChars"));
      return;
    }
    setUsernameStatus("checking");
    const timer = window.setTimeout(async () => {
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
          setUsernameError(tAuth("usernameTaken"));
        } else {
          setUsernameStatus("error");
          setUsernameError(tAuth("usernameInvalid"));
        }
      } catch {
        setUsernameStatus("error");
        setUsernameError(tAuth("usernameCheckError"));
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [username, usernameOpen, savedUsername, tAuth]);

  useEffect(() => {
    if (!usernameOpen) {
      setUsernameVisible(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setUsernameVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, [usernameOpen]);

  useEffect(() => {
    if (!usernameOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const tFocus = window.setTimeout(() => usernameInputRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && busy !== "username") {
        setUsernameOpen(false);
        setUsername(savedUsername);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(tFocus);
      document.removeEventListener("keydown", onKey);
    };
  }, [usernameOpen, busy, savedUsername]);

  function errorMessage(error: string) {
    if (error === "username_taken") return t("usernameTaken");
    if (error === "wrong_password") return t("wrongPassword");
    if (error === "roadmap_required") return t("levelNeedsRoadmap");
    if (
      error === "too_short" ||
      error === "need_lower" ||
      error === "need_upper" ||
      error === "need_number" ||
      error === "need_special" ||
      error === "too_long"
    ) {
      return tAuth("weakPassword");
    }
    return t("saveError");
  }

  async function patch(data: Record<string, string>, action: string) {
    setBusy(action);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = errorMessage(result.error);
        if (action === "username" && result.error === "username_taken") {
          setUsernameStatus("error");
          setUsernameError(tAuth("usernameTaken"));
        } else {
          pushToast({ kind: "error", message, mode: "sticky" });
        }
        return false;
      }
      pushToast({ kind: "success", message: t("saved"), mode: "auto" });
      router.refresh();
      return true;
    } catch {
      pushToast({ kind: "error", message: t("saveError"), mode: "sticky" });
      return false;
    } finally {
      setBusy(null);
    }
  }

  function openUsernameModal() {
    setUsername(savedUsername);
    setUsernameStatus("idle");
    setUsernameError(null);
    setUsernameOpen(true);
  }

  function closeUsernameModal() {
    setUsernameOpen(false);
    setUsername(savedUsername);
    setUsernameStatus("idle");
    setUsernameError(null);
  }

  async function updateUsername(event: FormEvent) {
    event.preventDefault();
    if (!usernameDirty) return;
    if (usernameStatus === "error" || usernameStatus === "checking") return;
    const saved = await patch({ username }, "username");
    if (saved) {
      const normalized = username.trim().toLowerCase();
      setSavedUsername(normalized);
      setUsername(normalized);
      setConfirmation("");
      setUsernameOpen(false);
    }
  }

  async function updatePassword(event: FormEvent) {
    event.preventDefault();
    if (!allPwOk) {
      pushToast({
        kind: "error",
        message: tAuth("weakPassword"),
        mode: "sticky",
      });
      return;
    }
    const saved = await patch({ currentPassword, newPassword }, "password");
    if (saved) {
      setCurrentPassword("");
      setNewPassword("");
      setPasswordOpen(false);
    }
  }

  async function updateLevel(event: FormEvent) {
    event.preventDefault();
    if (!level) return;
    const saved = await patch({ level }, "level");
    if (saved) setSavedLevel(level);
  }

  async function deleteAccount(event: FormEvent) {
    event.preventDefault();
    if (confirmation !== savedUsername) return;
    setBusy("delete");
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: deletePassword }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        pushToast({
          kind: "error",
          message: errorMessage(result.error),
          mode: "sticky",
        });
        return;
      }
      await signOut({ callbackUrl: `/${locale}` });
    } catch {
      pushToast({ kind: "error", message: t("deleteError"), mode: "sticky" });
    } finally {
      setBusy(null);
    }
  }

  const usernameModal =
    mounted && usernameOpen
      ? createPortal(
          <div
            className={`confirm-overlay ${usernameVisible ? "is-open" : ""}`}
            role="presentation"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && busy !== "username") {
                closeUsernameModal();
              }
            }}
          >
            <div
              className={`profile-modal-shell ${usernameVisible ? "is-open" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={usernameDialogTitleId}
            >
              <form onSubmit={updateUsername} className="profile-modal-panel">
                <h2 id={usernameDialogTitleId} className="profile-modal-title">
                  {t("changeUsername")}
                </h2>
                <p className="profile-modal-hint">{t("usernameHint")}</p>
                <label className="profile-field">
                  <span>{t("username")}</span>
                  <input
                    ref={usernameInputRef}
                    required
                    minLength={5}
                    maxLength={32}
                    pattern="[A-Za-z0-9_]+"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    className={
                      usernameStatus === "error"
                        ? "is-error"
                        : usernameStatus === "ok"
                          ? "is-ok"
                          : undefined
                    }
                    aria-invalid={usernameStatus === "error"}
                  />
                  {usernameStatus === "checking" ? (
                    <p className="auth-hint">{tAuth("usernameChecking")}</p>
                  ) : null}
                  {usernameStatus === "ok" ? (
                    <p className="auth-hint is-ok">
                      ✓ {tAuth("usernameAvailable")}
                    </p>
                  ) : null}
                  {usernameError ? (
                    <p className="auth-hint is-error" role="alert">
                      {usernameError}
                    </p>
                  ) : null}
                </label>
                <div className="profile-modal-actions">
                  <button
                    type="button"
                    className="btn-ghost btn-compact"
                    disabled={busy === "username"}
                    onClick={closeUsernameModal}
                  >
                    {t("discard")}
                  </button>
                  <button
                    type="submit"
                    disabled={
                      !usernameDirty ||
                      busy !== null ||
                      usernameStatus === "error" ||
                      usernameStatus === "checking"
                    }
                    className="btn-primary btn-compact"
                  >
                    {busy === "username" ? t("saving") : t("saveUsername")}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="profile-page">
      <header className="page-hero profile-header">
        <p className="page-kicker">AlefYa</p>
        <h1 className="page-title profile-title">{t("title")}</h1>
        <p className="page-sub profile-sub">{t("subtitle")}</p>
        <hr className="page-hero-rule" />
      </header>

      <div className={`profile-identity ${passwordOpen ? "is-pw-open" : ""}`}>
        <div className="profile-identity-top">
          <div className="profile-identity-main">
            <BrandLogo size={52} className="border border-line/70" />
            <div className="profile-identity-copy min-w-0">
              <div className="profile-identity-name-row">
                <p className="profile-identity-name">@{savedUsername}</p>
                <button
                  type="button"
                  className="profile-edit-btn"
                  aria-label={t("changeUsername")}
                  title={t("changeUsername")}
                  onClick={openUsernameModal}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M4 20h4.5L19.2 9.3a1.6 1.6 0 0 0 0-2.26l-2.24-2.24a1.6 1.6 0 0 0-2.26 0L4 15.5V20Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.5 6.5 17.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="profile-identity-actions">
            <Link href={`/u/${savedUsername}`} className="btn-ghost btn-compact">
              {t("viewPublic")}
            </Link>
            <button
              type="button"
              className={`profile-pw-trigger ${passwordOpen ? "is-open" : ""}`}
              aria-expanded={passwordOpen}
              aria-controls="profile-password-panel"
              onClick={() => setPasswordOpen((v) => !v)}
            >
              <span className="profile-pw-trigger-icon" aria-hidden>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M8 11V8a4 4 0 0 1 8 0v3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>{t("changePassword")}</span>
            </button>
          </div>
        </div>

        <div
          id="profile-password-panel"
          className={`profile-password-panel ${passwordOpen ? "is-open" : ""}`}
          role="region"
          aria-hidden={!passwordOpen}
          inert={!passwordOpen ? true : undefined}
        >
          <div className="profile-password-panel-inner">
            <form onSubmit={updatePassword} className="profile-password-body">
              <p className="profile-password-lead">{t("passwordHint")}</p>
              <div className="profile-fields-2">
                <label className="profile-field">
                  <span>{t("currentPassword")}</span>
                  <input
                    required={passwordOpen}
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    tabIndex={passwordOpen ? undefined : -1}
                  />
                </label>
                <label className="profile-field">
                  <span>{t("newPassword")}</span>
                  <input
                    required={passwordOpen}
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    tabIndex={passwordOpen ? undefined : -1}
                  />
                </label>
              </div>
              <ul className="profile-pw-rules" aria-live="polite">
                {PASSWORD_RULES.map((key) => {
                  const ok = pwMet[key];
                  return (
                    <li
                      key={key}
                      className={`profile-pw-rule ${ok ? "is-ok" : ""}`}
                    >
                      <span className="profile-pw-rule-mark" aria-hidden>
                        {ok ? "✓" : ""}
                      </span>
                      {issueLabels[key]}
                    </li>
                  );
                })}
              </ul>
              <div className="profile-section-foot">
                <button
                  type="button"
                  className="btn-ghost btn-compact"
                  disabled={!passwordDirty || busy !== null}
                  tabIndex={passwordOpen ? undefined : -1}
                  onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setPasswordOpen(false);
                  }}
                >
                  {t("discard")}
                </button>
                <button
                  type="submit"
                  disabled={
                    !passwordDirty ||
                    !allPwOk ||
                    busy !== null ||
                    !currentPassword
                  }
                  className="btn-primary btn-compact"
                  tabIndex={passwordOpen ? undefined : -1}
                >
                  {busy === "password" ? t("saving") : t("savePassword")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="profile-stack">
        <form
          onSubmit={updateLevel}
          className="profile-section"
          style={{ animationDelay: "100ms" }}
        >
          <div className="profile-section-head">
            <h2>{t("learningLevel")}</h2>
            <p>{t("levelHint")}</p>
          </div>
          <div className="profile-section-body">
            <div
              className="profile-level-grid"
              role="radiogroup"
              aria-label={t("level")}
            >
              {LEVELS.map((option) => {
                const active = level === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`profile-level-card ${active ? "is-active" : ""}`}
                    onClick={() => setLevel(option.id)}
                  >
                    <span className="profile-level-radio" aria-hidden />
                    <span className="profile-level-copy">
                      <span className="profile-level-title">
                        {option.title[locale]}
                      </span>
                      <span className="profile-level-summary">
                        {option.summary[locale]}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="profile-section-foot">
            <button
              type="button"
              className="btn-ghost btn-compact"
              disabled={!levelDirty || busy !== null}
              onClick={() => setLevel(savedLevel)}
            >
              {t("discard")}
            </button>
            <button
              type="submit"
              disabled={!levelDirty || busy !== null}
              className="btn-primary btn-compact"
            >
              {busy === "level" ? t("saving") : t("saveLevel")}
            </button>
          </div>
        </form>
      </div>

      <section
        className={`profile-danger ${dangerOpen ? "is-open" : ""}`}
        style={{ animationDelay: "150ms" }}
      >
        <button
          type="button"
          className="profile-danger-toggle"
          aria-expanded={dangerOpen}
          aria-controls="profile-danger-panel"
          onClick={() => setDangerOpen((v) => !v)}
        >
          <span>
            <span className="profile-danger-title">{t("deleteAccount")}</span>
            <span className="profile-danger-hint">{t("dangerHint")}</span>
          </span>
          <AccordionToggle open={dangerOpen} tone="danger" />
        </button>

        <div
          id="profile-danger-panel"
          className={`profile-danger-panel ${dangerOpen ? "is-open" : ""}`}
          role="region"
          aria-hidden={!dangerOpen}
          inert={!dangerOpen ? true : undefined}
        >
          <div className="profile-danger-panel-inner">
            <form onSubmit={deleteAccount} className="profile-danger-body">
              <p className="profile-danger-warn">{t("deleteWarning")}</p>
              <div className="profile-fields-2">
                <label className="profile-field">
                  <span>{t("currentPassword")}</span>
                  <input
                    required={dangerOpen}
                    type="password"
                    value={deletePassword}
                    onChange={(event) => setDeletePassword(event.target.value)}
                    autoComplete="current-password"
                    tabIndex={dangerOpen ? undefined : -1}
                  />
                </label>
                <label className="profile-field">
                  <span>{t("typeUsername", { username: savedUsername })}</span>
                  <input
                    required={dangerOpen}
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    autoComplete="off"
                    tabIndex={dangerOpen ? undefined : -1}
                  />
                </label>
              </div>
              <div className="profile-section-foot is-danger">
                <button
                  type="button"
                  className="btn-ghost btn-compact"
                  disabled={busy !== null}
                  tabIndex={dangerOpen ? undefined : -1}
                  onClick={() => {
                    setDangerOpen(false);
                    setDeletePassword("");
                    setConfirmation("");
                  }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={busy !== null || confirmation !== savedUsername}
                  className="profile-danger-btn"
                  tabIndex={dangerOpen ? undefined : -1}
                >
                  {busy === "delete" ? t("deleting") : t("deleteButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {usernameModal}
    </div>
  );
}
