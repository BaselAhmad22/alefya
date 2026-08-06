"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";

type Listener = () => void;

let sharedSocket: Socket | null = null;
let connecting: Promise<Socket | null> | null = null;
let refCount = 0;
const statusListeners = new Set<Listener>();
let live = false;

function emitStatus() {
  for (const l of statusListeners) l();
}

function subscribeStatus(listener: Listener) {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

async function connectSocket(): Promise<Socket | null> {
  if (sharedSocket?.connected) return sharedSocket;
  if (connecting) return connecting;

  connecting = (async () => {
    try {
      const tokenRes = await fetch("/api/realtime/token");
      const tokenData = await tokenRes.json().catch(() => ({}));
      if (!tokenRes.ok || !tokenData.token) return null;
      const url =
        tokenData.realtimeUrl ||
        process.env.NEXT_PUBLIC_REALTIME_URL ||
        "http://localhost:4001";
      const socket = io(url, {
        auth: { token: tokenData.token },
        transports: ["websocket", "polling"],
      });
      sharedSocket = socket;
      socket.on("connect", () => {
        live = true;
        emitStatus();
      });
      socket.on("disconnect", () => {
        live = false;
        emitStatus();
      });
      return socket;
    } catch {
      return null;
    } finally {
      connecting = null;
    }
  })();

  return connecting;
}

function releaseSocket() {
  refCount = Math.max(0, refCount - 1);
  if (refCount > 0) return;
  // Keep socket warm briefly so quick navigations don't reconnect.
  window.setTimeout(() => {
    if (refCount > 0) return;
    sharedSocket?.disconnect();
    sharedSocket = null;
    live = false;
    emitStatus();
  }, 1500);
}

/**
 * One shared Socket.IO connection for header badges + messenger.
 * Avoids opening 3–4 connections on every logged-in page.
 */
export function useRealtimeSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const isLive = useSyncExternalStore(
    subscribeStatus,
    () => live,
    () => false,
  );

  useEffect(() => {
    if (!session?.user) {
      socketRef.current = null;
      setSocket(null);
      return;
    }

    let cancelled = false;
    refCount += 1;
    void connectSocket().then((s) => {
      if (cancelled) return;
      socketRef.current = s;
      setSocket(s);
    });

    return () => {
      cancelled = true;
      releaseSocket();
    };
  }, [session?.user]);

  return { socket, live: isLive };
}
