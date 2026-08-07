"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { hideNavLoader, showNavLoader } from "@/lib/nav-loader";

type Props = {
  trackSlug: string;
  className?: string;
};

export function LeaveTrackButton({ trackSlug, className }: Props) {
  const t = useTranslations("tracks");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirmLeave() {
    setBusy(true);
    showNavLoader();
    try {
      const res = await fetch("/api/tracks/start", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackSlug }),
      });
      if (!res.ok) {
        hideNavLoader();
        setBusy(false);
        setOpen(false);
        return;
      }
      setOpen(false);
      router.push("/tracks");
      router.refresh();
    } catch {
      hideNavLoader();
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={className ?? "btn-ghost leave-track-btn"}
        disabled={busy}
        onClick={() => setOpen(true)}
      >
        {t("leaveTrack")}
      </button>
      <ConfirmDialog
        open={open}
        title={t("leaveTrackTitle")}
        description={t("leaveTrackDesc")}
        confirmLabel={t("leaveTrackConfirm")}
        cancelLabel={t("leaveTrackCancel")}
        busy={busy}
        tone="danger"
        onConfirm={() => void confirmLeave()}
        onCancel={() => {
          if (!busy) setOpen(false);
        }}
      />
    </>
  );
}
