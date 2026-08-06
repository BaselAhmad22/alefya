"use client";

import { type RefObject } from "react";
import { QUICK_REACTIONS } from "@/lib/chat-message";

export type ReactionChip = {
  emoji: string;
  count: number;
  me: boolean;
};

type ChipsProps = {
  reactions: ReactionChip[];
  onToggle: (emoji: string) => void;
  disabled?: boolean;
};

/** Aggregated reaction chips under a bubble. */
export function MessageReactionChips({
  reactions,
  onToggle,
  disabled,
}: ChipsProps) {
  if (!reactions.length) return null;
  return (
    <div className="msg-react-chips" onMouseDown={(e) => e.stopPropagation()}>
      {reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          className={`msg-react-chip ${r.me ? "is-me" : ""}`}
          data-no-loader
          disabled={disabled}
          aria-pressed={r.me}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(r.emoji);
          }}
        >
          <span className="msg-react-chip-emoji">{r.emoji}</span>
          <span className="msg-react-chip-count">{r.count}</span>
        </button>
      ))}
    </div>
  );
}

type StripProps = {
  onPick: (emoji: string) => void;
  onMore?: () => void;
  moreLabel?: string;
  moreOpen?: boolean;
  moreRef?: RefObject<HTMLButtonElement | null>;
  className?: string;
};

/** WhatsApp-style quick reaction strip. */
export function QuickReactStrip({
  onPick,
  onMore,
  moreLabel = "+",
  moreOpen = false,
  moreRef,
  className = "",
}: StripProps) {
  return (
    <div
      className={`msg-react-strip ${className}`}
      role="toolbar"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="msg-react-strip-btn"
          data-no-loader
          onClick={(e) => {
            e.stopPropagation();
            onPick(emoji);
          }}
        >
          {emoji}
        </button>
      ))}
      {onMore ? (
        <button
          ref={moreRef}
          type="button"
          className={`msg-react-strip-btn is-more ${moreOpen ? "is-open" : ""}`}
          data-no-loader
          aria-label={moreLabel}
          aria-expanded={moreOpen}
          onClick={(e) => {
            e.stopPropagation();
            onMore();
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="3.5" cy="3.5" r="1.1" fill="currentColor" />
            <circle cx="7" cy="3.5" r="1.1" fill="currentColor" />
            <circle cx="10.5" cy="3.5" r="1.1" fill="currentColor" />
            <circle cx="3.5" cy="7" r="1.1" fill="currentColor" />
            <circle cx="7" cy="7" r="1.1" fill="currentColor" />
            <circle cx="10.5" cy="7" r="1.1" fill="currentColor" />
            <circle cx="3.5" cy="10.5" r="1.1" fill="currentColor" />
            <circle cx="7" cy="10.5" r="1.1" fill="currentColor" />
            <circle cx="10.5" cy="10.5" r="1.1" fill="currentColor" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
