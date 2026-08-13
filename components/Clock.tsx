"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

// Split "8:05 pm" -> { hh: "8", mm: "05", suffix: "pm" } so the colon can blink
// independently of the digits.
function parts(date: Date) {
  const raw = fmt.format(date); // e.g. "8:05 pm"
  const [time, suffix = ""] = raw.split(" ");
  const [hh, mm] = time.split(":");
  return { hh, mm, suffix };
}

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Render nothing until mounted to avoid a server/client hydration mismatch.
  if (!now) {
    return (
      <div
        className="font-sans text-sm tabular-nums text-white/80"
        suppressHydrationWarning
        aria-hidden
      />
    );
  }

  const { hh, mm, suffix } = parts(now);

  return (
    <div
      className="flex items-baseline gap-1 text-sm font-medium tabular-nums text-white/85 drop-shadow"
      suppressHydrationWarning
      aria-label={`Current time in India ${hh}:${mm} ${suffix}`}
    >
      <span>{hh}</span>
      <span style={{ animation: "blink 1s step-end infinite" }}>:</span>
      <span>{mm}</span>
      <span className="ml-1 text-xs uppercase text-white/55">{suffix}</span>
    </div>
  );
}
