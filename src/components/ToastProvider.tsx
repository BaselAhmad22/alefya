"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type ToastKind = "success" | "error" | "info" | "warning";
export type ToastMode = "auto" | "sticky";

export type ToastInput = {
  kind?: ToastKind;
  message: string;
  /** auto: dismiss after durationMs (default 4200). sticky: until dismiss/action. */
  mode?: ToastMode;
  durationMs?: number;
};

type ToastItem = Required<Pick<ToastInput, "message">> & {
  id: string;
  kind: ToastKind;
  mode: ToastMode;
  durationMs: number;
};

type ToastContextValue = {
  push: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const timers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    setMounted(true);
    return () => {
      for (const id of timers.current.values()) window.clearTimeout(id);
      timers.current.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const kind = toast.kind || "info";
      const mode = toast.mode || (kind === "error" ? "sticky" : "auto");
      const durationMs = toast.durationMs ?? (mode === "auto" ? 4200 : 0);
      const item: ToastItem = {
        id,
        message: toast.message,
        kind,
        mode,
        durationMs,
      };
      setItems((prev) => [...prev.slice(-4), item]);

      if (mode === "auto" && durationMs > 0) {
        const timer = window.setTimeout(() => dismiss(id), durationMs);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <div className="ay-toast-stack" aria-live="polite" aria-relevant="additions">
              {items.map((item) => (
                <ToastCard
                  key={item.id}
                  item={item}
                  onDismiss={() => dismiss(item.id)}
                  onPause={() => {
                    const t = timers.current.get(item.id);
                    if (t) {
                      window.clearTimeout(t);
                      timers.current.delete(item.id);
                    }
                  }}
                  onResume={() => {
                    if (item.mode !== "auto" || item.durationMs <= 0) return;
                    if (timers.current.has(item.id)) return;
                    const timer = window.setTimeout(
                      () => dismiss(item.id),
                      Math.max(1600, Math.floor(item.durationMs * 0.55)),
                    );
                    timers.current.set(item.id, timer);
                  }}
                />
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

function ToastCard({
  item,
  onDismiss,
  onPause,
  onResume,
}: {
  item: ToastItem;
  onDismiss: () => void;
  onPause: () => void;
  onResume: () => void;
}) {
  return (
    <div
      className={`ay-toast ay-toast-${item.kind}`}
      role={item.kind === "error" ? "alert" : "status"}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
    >
      <span className="ay-toast-icon" aria-hidden>
        {item.kind === "success"
          ? "✓"
          : item.kind === "error"
            ? "!"
            : item.kind === "warning"
              ? "⚠"
              : "i"}
      </span>
      <p className="ay-toast-message">{item.message}</p>
      <button
        type="button"
        className="ay-toast-close"
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        ×
      </button>
      {item.mode === "auto" ? <span className="ay-toast-progress" /> : null}
    </div>
  );
}
