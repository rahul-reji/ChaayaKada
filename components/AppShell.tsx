"use client";

import { useState, useEffect } from "react";
import { Clock } from "./Clock";
import { ListenerCount } from "./ListenerCount";
import { Player } from "./Player";
import { ShareButton } from "./ShareButton";
import { RequestButton } from "./RequestButton";
import { InstallButton } from "./InstallButton";
import { STATIONS, type Station } from "@/lib/stations";

const GRAIN =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22180%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.85%22%20numOctaves%3D%222%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E";

const insetTop = "max(1rem, env(safe-area-inset-top))";
const insetLeft = "max(1rem, env(safe-area-inset-left))";
const insetRight = "max(1rem, env(safe-area-inset-right))";
const insetBottom = "max(1rem, env(safe-area-inset-bottom))";

function StationPill({
  stations,
  activeIdx,
  onSelect,
}: {
  stations: Station[];
  activeIdx: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full border border-white/15 bg-black/45 p-1 backdrop-blur-md">
      {stations.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(i)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
            i !== activeIdx ? "text-white/40 hover:text-white/70" : ""
          }`}
          style={
            i === activeIdx
              ? { background: `${s.accent}22`, color: s.accent, boxShadow: `0 0 14px -3px ${s.accent}70` }
              : {}
          }
        >
          {s.emoji} {s.englishName}
        </button>
      ))}
    </div>
  );
}

export function AppShell() {
  const [stationIdx, setStationIdx] = useState(0);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const station = STATIONS[stationIdx];
  const bgImage = portrait ? station.bgTall : station.bgWide;

  return (
    <main className="relative flex h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* background — swaps on station change */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url("${bgImage}")` }}
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
        className="z-10 flex w-full justify-center"
        style={{ paddingTop: `calc(${insetTop} + 3.25rem)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={station.id}
          src={station.logo}
          alt={station.name}
          className="h-auto w-[min(78vw,420px)] self-start drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* station pill + player + watermark — bottom-anchored */}
      <div
        className="z-10 flex w-full flex-col items-center gap-2"
        style={{
          paddingBottom: insetBottom,
          paddingLeft: insetLeft,
          paddingRight: insetRight,
        }}
      >
        <StationPill stations={STATIONS} activeIdx={stationIdx} onSelect={setStationIdx} />
        <Player key={station.id} basePlaylists={station.playlists} />
        <p className="pointer-events-none select-none text-xs text-white/50">
          ☕ Created by Rahul Reji
        </p>
      </div>
    </main>
  );
}
