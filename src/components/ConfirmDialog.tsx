"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  busy?: boolean;
  /** Optional username shown in a highlight chip */
  username?: string;
  tone?: "danger" | "warn";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  busy = false,
  username,
  tone = "danger",
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => cancelRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, busy, onCancel]);

  if (!mounted || !open) return null;

  const node = (
    <div
      className={`confirm-overlay ${visible ? "is-open" : ""}`}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div
        className={`confirm-shell tone-${tone} ${visible ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="confirm-panel">
          <div className="confirm-orb" aria-hidden />
          <div className="confirm-icon" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 8.2v7.2M14 19.6h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="14"
                cy="14"
                r="10.25"
                stroke="currentColor"
                strokeWidth="1.6"
                opacity="0.85"
              />
            </svg>
          </div>

          <h2 id={titleId} className="confirm-title">
            {title}
          </h2>
          <p id={descId} className="confirm-desc">
            {description}
          </p>

          {username ? (
            <p className="confirm-user">
              <span className="confirm-user-avatar" aria-hidden>
                {username.slice(0, 1).toUpperCase()}
              </span>
              <span>@{username}</span>
            </p>
          ) : null}

          <div className="confirm-actions">
            <button
              ref={cancelRef}
              type="button"
              className="confirm-btn is-cancel"
              data-no-loader
              disabled={busy}
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="confirm-btn is-confirm"
              data-no-loader
              disabled={busy}
              onClick={onConfirm}
            >
              {busy ? "…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
