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
function DialButton({
  label,
  onClick,
  disabled,
  handActive,
  dialDir = "right",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  handActive: boolean;
  dialDir?: "left" | "right";
}) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full transition active:scale-95 disabled:opacity-25"
        style={{
          background: "radial-gradient(circle at 38% 36%, #424242, #1c1c1c)",
          boxShadow:
            "0 5px 14px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.13), inset 0 -1px 0 rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* concentric groove rings */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "repeating-radial-gradient(circle at 50% 50%, transparent 0 38%, rgba(255,255,255,0.025) 38% 40%, transparent 40% 48%)",
          }}
          aria-hidden
        />
        <span className="relative text-[9px] font-bold uppercase tracking-widest text-white/65">
          {label}
        </span>
      </button>

      {/* hand animation — overlaid when this dial was turned */}
      {handActive && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ animation: `${dialDir === "left" ? "turn-dial-left" : "turn-dial"} 0.42s ease-in-out forwards` }}
          aria-hidden
        >
          <span style={{ fontSize: 22, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.9))" }}>
            🤚
          </span>
        </div>
      )}
    </div>
  );
}

function TunerStrip({
  stations,
  activeIdx,
  onPrev,
  onNext,
  scanDir,
}: {
  stations: typeof STATIONS;
  activeIdx: number;
  onPrev: () => void;
  onNext: () => void;
  scanDir: "prev" | "next" | null;
}) {
  const station = stations[activeIdx];
  const hasPrev = activeIdx > 0;
  const hasNext = activeIdx < stations.length - 1;
  const needlePct = stations.length > 1 ? (activeIdx / (stations.length - 1)) * 100 : 50;
  const scanning = scanDir !== null;

  return (
    <div
      className="flex w-full sm:w-[500px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md"
      style={{ boxShadow: `0 0 28px -8px ${station.accent}50` }}
    >
      {/* LCD display */}
      <div
        className="flex flex-col items-center px-2 pt-2.5 pb-1.5"
        style={{ background: "rgba(0,0,0,0.55)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-[7px] font-semibold uppercase tracking-[0.22em] text-white/25">
          {scanning ? "scanning…" : "now on air"}
        </span>
        <span
          className="mt-0.5 text-center text-[15px] font-semibold leading-tight tracking-wide transition-all duration-300"
          style={{
            color: scanning ? "rgba(255,255,255,0.25)" : station.accent,
            filter: scanning ? "blur(5px)" : "none",
          }}
        >
          {station.emoji} {station.englishName}
        </span>
      </div>

      {/* FM frequency band */}
      <div className="relative mx-2 mt-1.5" style={{ height: 42 }}>
        {/* band rail */}
        <div
          className="absolute inset-x-0"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            height: 14,
            background: "linear-gradient(90deg,#111 0%,#222 45%,#1a1a1a 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 3,
          }}
        />

        {/* frequency tick marks + labels */}
        {Array.from({ length: 9 }).map((_, i) => {
          const pct = (i / 8) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            >
              <span className="text-[5.5px] tabular-nums text-white/20">
                {88 + i * 2}
              </span>
              <div
                style={{
                  width: 1,
                  height: i % 2 === 0 ? 7 : 4,
                  marginTop: 1,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: 1,
                }}
              />
            </div>
          );
        })}

        {/* station dot markers */}
        {stations.map((s, i) => {
          const pct = stations.length > 1 ? (i / (stations.length - 1)) * 100 : 50;
          const isActive = i === activeIdx;
          return (
            <div
              key={s.id}
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            >
              <span className="text-[8px] leading-none" style={{ opacity: isActive ? 1 : 0.4 }}>
                {s.emoji}
              </span>
              <div
                className="mt-0.5 rounded-full transition-all duration-500"
                style={{
                  width: isActive ? 7 : 4,
                  height: isActive ? 7 : 4,
                  background: isActive ? s.accent : "rgba(255,255,255,0.25)",
                  boxShadow: isActive ? `0 0 8px ${s.accent}` : "none",
                }}
              />
            </div>
          );
        })}

        {/* sliding needle */}
        <div
          className="pointer-events-none absolute inset-y-0 flex flex-col items-center"
          style={{
            left: `${needlePct}%`,
            transform: "translateX(-50%)",
            transition: "left 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "3px solid transparent",
              borderRight: "3px solid transparent",
              borderBottom: "5px solid rgba(255,70,70,0.95)",
            }}
          />
          <div
            className="flex-1"
            style={{
              width: 2,
              background: "linear-gradient(to bottom, rgba(255,70,70,0.95), rgba(255,70,70,0.4))",
              boxShadow: "0 0 5px rgba(255,70,70,0.8)",
              borderRadius: 1,
            }}
          />
        </div>
      </div>

      {/* dial buttons row */}
      <div className="flex items-center justify-between px-6 py-2">
        <DialButton
          label="Prev"
          onClick={onPrev}
          disabled={!hasPrev}
          handActive={scanDir === "prev"}
          dialDir="left"
        />
        <DialButton
          label="Next"
          onClick={onNext}
          disabled={!hasNext}
          handActive={scanDir === "next"}
          dialDir="right"
        />
      </div>
    </div>
  );
}

// Slim single-row station switcher for mobile — keeps background visible.
function CompactStationBar({
  stations,
  activeIdx,
  onPrev,
  onNext,
  scanDir,
}: {
  stations: typeof STATIONS;
  activeIdx: number;
  onPrev: () => void;
  onNext: () => void;
  scanDir: "prev" | "next" | null;
}) {
  const station = stations[activeIdx];
  const scanning = scanDir !== null;
  return (
    <div
      className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md"
      style={{ boxShadow: `0 0 16px -6px ${station.accent}40` }}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={activeIdx === 0}
        aria-label="Previous station"
        className="shrink-0 text-white/50 transition active:scale-90 disabled:opacity-20"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
          <path d="M11 3L5 8l6 5V3z" />
        </svg>
      </button>
      <div className="flex flex-1 flex-col items-center">
        <span className="text-[7.5px] font-semibold uppercase tracking-[0.2em] text-white/30">
          {scanning ? "scanning…" : "station"}
        </span>
        <span
          className="text-[13px] font-semibold transition-all duration-300"
          style={{
            color: scanning ? "rgba(255,255,255,0.25)" : station.accent,
            filter: scanning ? "blur(4px)" : "none",
          }}
        >
          {station.emoji} {station.englishName}
        </span>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={activeIdx === stations.length - 1}
        aria-label="Next station"
        className="shrink-0 text-white/50 transition active:scale-90 disabled:opacity-20"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
          <path d="M5 3l6 5-6 5V3z" />
        </svg>
      </button>
    </div>
  );
}

export function AppShell() {
  const [stationIdx, setStationIdx] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const [scanDir, setScanDir] = useState<"prev" | "next" | null>(null);
  // null = still loading; {} = loaded (all off); { sabarimala: true } = flag on
  const [flags, setFlags] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    fetch("/api/flags")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, boolean>) => setFlags(data))
      .catch(() => setFlags({}));
  }, []);

  // hide stations whose featureFlag is off; while flags are loading, hide flagged stations
  const visibleStations = STATIONS.filter(
    (s) => !s.featureFlag || (flags !== null && flags[s.featureFlag] === true)
  );

  // clamp index if visible set shrank
  const safeIdx = Math.min(stationIdx, Math.max(0, visibleStations.length - 1));

  const switchStation = (next: number, dir: "prev" | "next") => {
    if (next === safeIdx || next < 0 || next >= visibleStations.length) return;
    setScanDir(dir);
    setTimeout(() => {
      setStationIdx(next);
      setScanDir(null);
    }, 420);
  };

  const station = visibleStations[safeIdx] ?? STATIONS[0];
  const bgImage = portrait ? station.bgTall : station.bgWide;

  return (
    <main className="relative flex h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* background — crossfades on station change */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url("${bgImage}")`, filter: scanDir ? "brightness(0.4) blur(4px)" : "none" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />
        {/* extra dim on mobile so background doesn't compete with content */}
        <div className="absolute inset-0 bg-black/40 sm:hidden" />
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
          opacity: scanDir ? 0 : 1,
          transform: scanDir ? "scale(0.96)" : "scale(1)",
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

      {/* mobile: slim pill; desktop: full FM tuner side-by-side with player */}
      <div
        className="z-10 flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-end"
        style={{
          paddingBottom: insetBottom,
          paddingLeft: insetLeft,
          paddingRight: insetRight,
        }}
      >
        <div className="sm:hidden">
          <CompactStationBar
            stations={visibleStations}
            activeIdx={safeIdx}
            onPrev={() => switchStation(safeIdx - 1, "prev")}
            onNext={() => switchStation(safeIdx + 1, "next")}
            scanDir={scanDir}
          />
        </div>
        <div className="hidden sm:block">
          <TunerStrip
            stations={visibleStations}
            activeIdx={safeIdx}
            onPrev={() => switchStation(safeIdx - 1, "prev")}
            onNext={() => switchStation(safeIdx + 1, "next")}
            scanDir={scanDir}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <Player key={station.id} basePlaylists={station.playlists} />
          <p className="pointer-events-none select-none text-xs text-white/50">
            ☕ Created by Rahul Reji
          </p>
        </div>
      </div>
    </main>
  );
}
