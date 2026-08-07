/**
 * Best-effort ping to the Socket.io notify endpoint.
 * On Render, web and realtime are separate services — never use 127.0.0.1.
 */
export async function notifyRealtimeUser(
  userId: string,
  notification: Record<string, unknown>,
): Promise<void> {
  const base =
    process.env.REALTIME_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_REALTIME_URL ||
    `http://127.0.0.1:${process.env.REALTIME_PORT || "4001"}`;

  const url = `${base.replace(/\/$/, "")}/notify`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, notification }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    /* polling / next page load will pick it up */
  }
}
