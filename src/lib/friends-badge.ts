export const FRIENDS_BADGE_EVENT = "alefya:friends-badge";

type FriendsPayload = {
  friends?: unknown[];
  incoming?: unknown[];
  outgoing?: unknown[];
  incomingCount?: number;
};

let prefetchCache: { data: FriendsPayload; at: number } | null = null;

export function dispatchFriendsBadgeRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FRIENDS_BADGE_EVENT));
}

/** Warm the friends API before navigating from a notification. */
export function prefetchFriendsData() {
  if (typeof window === "undefined") return;
  void fetch("/api/friends")
    .then(async (res) => {
      if (!res.ok) return;
      const data = (await res.json().catch(() => ({}))) as FriendsPayload;
      prefetchCache = { data, at: Date.now() };
    })
    .catch(() => {});
}

export function consumeFriendsPrefetch(): FriendsPayload | null {
  if (!prefetchCache || Date.now() - prefetchCache.at > 30_000) {
    prefetchCache = null;
    return null;
  }
  const data = prefetchCache.data;
  prefetchCache = null;
  return data;
}
