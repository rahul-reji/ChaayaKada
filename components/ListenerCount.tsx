"use client";

import { useEffect, useState } from "react";

function getSessionId(): string {
  let id = sessionStorage.getItem("ck_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("ck_sid", id);
  }
  return id;
}

export function ListenerCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const sessionId = getSessionId();

    const heartbeat = async () => {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch {
        // keep showing last known count on network error
      }
    };

    heartbeat();
    const id = setInterval(heartbeat, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 text-sm text-white/85 drop-shadow"
      suppressHydrationWarning
      aria-label={count ? `${count} listeners tuned in` : undefined}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      <span className="tabular-nums">{count ?? "—"}</span>
      <span className="text-white/50">tuned in</span>
    </div>
  );
}
