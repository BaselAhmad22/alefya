"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { EMOJI_PICKER_SET } from "@/lib/chat-message";

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
  /** Toggle button(s) — clicks here should not count as outside dismiss */
  anchorRef?: RefObject<HTMLElement | null>;
  /** Anchor: render as popover above composer or floating */
  className?: string;
};

export function EmojiPicker({
  open,
  onClose,
  onPick,
  anchorRef,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const emojis = useMemo(
    () => Array.from(new Set(EMOJI_PICKER_SET)),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      className={`emoji-picker ${className}`}
      role="dialog"
      aria-label="Emoji"
    >
      <div className="emoji-picker-scroll">
        <div className="emoji-picker-grid">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="emoji-picker-btn"
              data-no-loader
              onClick={() => {
                onPick(emoji);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
