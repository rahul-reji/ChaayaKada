"use client";

import { useState, useEffect } from "react";
import { Clock } from "./Clock";
import { ListenerCount } from "./ListenerCount";
import { Player } from "./Player";
import { ShareButton } from "./ShareButton";
import { RequestButton } from "./RequestButton";
import { InstallButton } from "./InstallButton";
import { STATIONS } from "@/lib/stations";

const GRAIN =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22180%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.85%22%20numOctaves%3D%222%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E";

const insetTop = "max(1rem, env(safe-area-inset-top))";
const insetLeft = "max(1rem, env(safe-area-inset-left))";
const insetRight = "max(1rem, env(safe-area-inset-right))";
const insetBottom = "max(1rem, env(safe-area-inset-bottom))";

// FM-style tuner display with prev/next channel arrows.
function TunerStrip({
  activeIdx,
  onPrev,
  onNext,
  scanning,
}: {
  activeIdx: number;
  onPrev: () => void;
  onNext: () => void;
  scanning: boolean;
}) {
  const station = STATIONS[activeIdx];
  const hasPrev = activeIdx > 0;
  const hasNext = activeIdx < STATIONS.length - 1;

  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md"
      style={{ boxShadow: `0 0 18px -6px ${station.accent}50` }}
    >
      {/* prev channel */}
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous station"
        className="grid h-7 w-7 place-items-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M3.5 8a.5.5 0 0 1 .146-.354l5-5a.5.5 0 0 1 .708.708L4.707 8l4.647 4.646a.5.5 0 0 1-.708.708l-5-5A.5.5 0 0 1 3.5 8z"/>
          <path d="M8 8a.5.5 0 0 1 .146-.354l5-5a.5.5 0 0 1 .708.708L9.207 8l4.647 4.646a.5.5 0 0 1-.708.708l-5-5A.5.5 0 0 1 8 8z"/>
        </svg>
      </button>

      {/* station display */}
      <div className="flex min-w-[120px] flex-col items-center gap-0.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
          {scanning ? "scanning…" : "station"}
        </span>
        <span
          className="text-[13px] font-semibold tracking-wide transition-all duration-300"
          style={{
            color: scanning ? "rgba(255,255,255,0.4)" : station.accent,
            filter: scanning ? "blur(3px)" : "none",
          }}
        >
          {station.emoji} {station.englishName}
        </span>
        {/* station dots */}
        <div className="mt-0.5 flex gap-1">
          {STATIONS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIdx ? 14 : 5,
                height: 3,
                background: i === activeIdx ? station.accent : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>

      {/* next channel */}
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next station"
        className="grid h-7 w-7 place-items-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M12.5 8a.5.5 0 0 0-.146-.354l-5-5a.5.5 0 0 0-.708.708L11.293 8 6.646 12.646a.5.5 0 0 0 .708.708l5-5A.5.5 0 0 0 12.5 8z"/>
          <path d="M8 8a.5.5 0 0 0-.146-.354l-5-5a.5.5 0 0 0-.708.708L6.793 8 2.146 12.646a.5.5 0 0 0 .708.708l5-5A.5.5 0 0 0 8 8z"/>
        </svg>
      </button>
    </div>
  );
}

export function AppShell() {
  const [stationIdx, setStationIdx] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const switchStation = (next: number) => {
    if (next === stationIdx || next < 0 || next >= STATIONS.length) return;
    setScanning(true);
    setTimeout(() => {
      setStationIdx(next);
      setScanning(false);
    }, 420);
  };

  const station = STATIONS[stationIdx];
  const bgImage = portrait ? station.bgTall : station.bgWide;

  return (
    <main className="relative flex h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* background — crossfades on station change */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url("${bgImage}")`, filter: scanning ? "brightness(0.4) blur(4px)" : "none" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>

      {/* grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: "180px 180px",
          mixBlendMode: "overlay",
          opacity: 0.3,
        }}
        aria-hidden
      />

      {/* top row: clock (TL), listeners (centre), nav (TR) */}
      <div className="fixed z-20" style={{ top: insetTop, left: insetLeft }}>
        <Clock />
      </div>
      <div className="fixed z-20 -translate-x-1/2" style={{ top: insetTop, left: "50%" }}>
        <ListenerCount />
      </div>
      <nav
        className="fixed z-20 flex items-center gap-3"
        style={{ top: insetTop, right: insetRight }}
        aria-label="Social links"
      >
        <InstallButton />
        <RequestButton />
        <ShareButton />
      </nav>

      {/* station logo */}
      <div
        className="z-10 flex w-full justify-center transition-all duration-300"
        style={{
          paddingTop: `calc(${insetTop} + 3.25rem)`,
          opacity: scanning ? 0 : 1,
          transform: scanning ? "scale(0.96)" : "scale(1)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={station.id}
          src={station.logo}
          alt={station.name}
          className="h-auto w-[min(78vw,420px)] self-start drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* tuner strip + player + watermark — bottom-anchored */}
      <div
        className="z-10 flex w-full flex-col items-center gap-2"
        style={{
          paddingBottom: insetBottom,
          paddingLeft: insetLeft,
          paddingRight: insetRight,
        }}
      >
        <TunerStrip
          activeIdx={stationIdx}
          onPrev={() => switchStation(stationIdx - 1)}
          onNext={() => switchStation(stationIdx + 1)}
          scanning={scanning}
        />
        <Player key={station.id} basePlaylists={station.playlists} />
        <p className="pointer-events-none select-none text-xs text-white/50">
          ☕ Created by Rahul Reji
        </p>
      </div>
    </main>
  );
}
