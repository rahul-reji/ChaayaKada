"use client";

import { useEffect, useState } from "react";

// A decorative ambient "listeners" figure that gently drifts. Rendered only
// after mount so the server and client markup never disagree (no hydration
// mismatch from a random seed).
export function ListenerCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(120 + Math.floor(Math.random() * 60));
    const id = setInterval(() => {
      setCount((c) => {
        const base = c ?? 140;
        const next = base + (Math.floor(Math.random() * 7) - 3);
        return Math.max(80, Math.min(240, next));
      });
    }, 4000);
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
