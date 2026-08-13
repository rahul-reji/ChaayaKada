"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track as analytics } from "@vercel/analytics";
import { PLAYLISTS, type Track, type Playlist } from "@/lib/tracks";
import { loadYT } from "@/lib/loadYT";
import { PrevIcon, NextIcon, PlayIcon, PauseIcon, QueueIcon } from "./icons";

// ===========================================================================
// Helpers
// ===========================================================================
function fmtTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
  const s = Math.floor(totalSeconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, "0")}`;
}

// Glass recipe shared by both the desktop pill and the mobile card. A flat
// white/10 fill reads as a grey slab; the gradient + blur + saturate + inset
// highlight is what actually reads as glass.
const GLASS =
  "border border-white/10 bg-gradient-to-b from-white/[0.15] to-white/[0.055] " +
  "backdrop-blur-3xl backdrop-saturate-[1.7] " +
  "shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)]";

// ===========================================================================
// MODULE-SCOPE sub-components
// ---------------------------------------------------------------------------
// These MUST live at module scope. Declared inside <Player/> they would get a
// fresh function identity every render; React would treat them as a new type
// and remount the subtree — restarting the vinyl's CSS animation from 0deg on
// every ~250ms progress tick.
// ===========================================================================

// The spinning record shown in the artwork slot when a track has no embeddable
// videoId yet. When a real cleared upload is present, the live iframe takes the
// slot instead (see <Artwork/>).
function Vinyl({ playing, size }: { playing: boolean; size: number }) {
  const labelSize = size * 0.42;
  return (
    <div
      className="relative shrink-0 rounded-full"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-radial-gradient(circle at 50% 50%, #1b1b1e 0 2px, #0d0d0f 2px 4px)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          animation: "spin 8s linear infinite",
          animationPlayState: playing ? "running" : "paused",
        }}
      >
        {/* centre label with music note */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full grid place-items-center"
          style={{
            width: labelSize,
            height: labelSize,
            background:
              "radial-gradient(circle at 50% 35%, var(--color-accent-soft), var(--color-accent-deep))",
          }}
        >
          <span
            style={{ fontSize: labelSize * 0.5, lineHeight: 1 }}
            className="text-black/60 select-none"
          >
            ♫
          </span>
        </div>
      </div>
    </div>
  );
}

// The artwork slot. `hostRef` is an imperative-only container: <Player/>
// appends the YouTube host (which the API swaps for an <iframe>) into it. React
// never renders children into hostRef, so progress-tick re-renders can't touch
// the live iframe. The Vinyl fallback is a separate React-managed sibling.
function Artwork({
  hostRef,
  hasVideo,
  playing,
  vinylSize,
  rounded,
}: {
  hostRef: React.RefObject<HTMLDivElement | null>;
  hasVideo: boolean;
  playing: boolean;
  vinylSize: number;
  rounded: string;
}) {
  return (
    <div
      className={`yt-slot relative overflow-hidden ${rounded}`}
      style={{ height: vinylSize, width: vinylSize }}
    >
      {/* imperative-only host — hidden; provides audio only */}
      <div
        ref={hostRef}
        className="absolute inset-0"
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <Vinyl playing={playing} size={vinylSize} />
      </div>
    </div>
  );
}

function TitleBlock({ title, artist }: { title: string; artist: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[15px] font-semibold leading-tight text-white">
        {title}
      </p>
      <p className="truncate text-[12.5px] leading-tight text-white/70">{artist}</p>
    </div>
  );
}

function TimeReadout({ seconds }: { seconds: number }) {
  return (
    <span className="shrink-0 text-[10.5px] tabular-nums text-white/60">
      {fmtTime(seconds)}
    </span>
  );
}

// Pointer-driven seek bar: 24px invisible hit area, 3px visible rail, accent
// fill with a soft glow, knob on hover/drag only. onPointerDown + touch-none so
// dragging seeks instead of scrolling the page.
function SeekBar({
  fraction,
  onScrub,
}: {
  fraction: number;
  onScrub: (frac: number, commit: boolean) => void;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pct = Math.max(0, Math.min(1, fraction)) * 100;

  const fracFromClientX = (clientX: number) => {
    const el = railRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width));
  };

  return (
    <div
      ref={railRef}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        onScrub(fracFromClientX(e.clientX), true);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        onScrub(fracFromClientX(e.clientX), false);
      }}
      onPointerUp={(e) => {
        if (!dragging) return;
        setDragging(false);
        onScrub(fracFromClientX(e.clientX), true);
      }}
      onPointerCancel={() => setDragging(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex h-6 w-full flex-1 cursor-pointer touch-none items-center select-none"
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div className="relative h-[3px] w-full rounded-full bg-white/15">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          style={{ width: `${pct}%`, boxShadow: "0 0 8px var(--color-accent)" }}
        />
        <div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[14px] leading-none"
          style={{ left: `${pct}%` }}
        >
          ☕
        </div>
      </div>
    </div>
  );
}

function GhostButton({
  label,
  onClick,
  disabled,
  size,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{ width: size, height: size }}
      className="grid place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function PlayButton({
  playing,
  onClick,
  disabled,
  size,
  iconSize,
}: {
  playing: boolean;
  onClick: () => void;
  disabled?: boolean;
  size: number;
  iconSize: number;
}) {
  return (
    <button
      type="button"
      aria-label={playing ? "Pause" : "Play"}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        boxShadow: "0 8px 22px -6px var(--color-accent-deep)",
      }}
      className="grid shrink-0 place-items-center rounded-full bg-gradient-to-b from-accent-soft to-accent-deep text-black/85 ring-1 ring-white/25 transition active:scale-95 disabled:opacity-40"
    >
      <span
        className="grid place-items-center"
        style={{ width: iconSize, height: iconSize }}
      >
        {playing ? (
          <PauseIcon className="h-full w-full" />
        ) : (
          <PlayIcon className="h-full w-full" />
        )}
      </span>
    </button>
  );
}

function QueuePanel({
  playlists,
  currentPlaylistIndex,
  currentTrackIndex,
  onSelect,
}: {
  playlists: Playlist[];
  currentPlaylistIndex: number;
  currentTrackIndex: number;
  onSelect: (playlistIndex: number, trackIndex: number) => void;
}) {
  return (
    <div className={`mt-2 max-h-60 overflow-y-auto rounded-2xl p-1.5 ${GLASS}`}>
      {playlists.map((pl, pi) => (
        <div key={pl.id}>
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/35">
            {pl.name}
          </p>
          {pl.tracks.map((t, ti) => {
            const isActive = pi === currentPlaylistIndex && ti === currentTrackIndex;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelect(pi, ti)}
                className={
                  "flex w-full items-baseline justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/10 " +
                  (isActive ? "bg-white/10" : "")
                }
              >
                <span className={"truncate text-[13px] font-medium " + (isActive ? "text-accent" : "text-white/85")}>
                  {t.title}
                </span>
                <span className="ml-4 shrink-0 text-[11px] text-white/45">{t.artist}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PlaylistTabs({
  playlists,
  activeIndex,
  onSelect,
}: {
  playlists: { id: string; name: string }[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {playlists.map((pl, i) => (
        <button
          key={pl.id}
          type="button"
          onClick={() => onSelect(i)}
          className={
            "rounded-full px-3 py-1 text-[11px] font-medium tracking-wide transition " +
            (i === activeIndex
              ? "bg-accent/90 text-black shadow-[0_2px_10px_-2px_var(--color-accent-deep)]"
              : "bg-white/8 text-white/70 hover:bg-white/15 hover:text-white")
          }
        >
          {pl.name}
        </button>
      ))}
    </div>
  );
}

// ===========================================================================
// <Player/> — the engine
// ===========================================================================
export function Player() {
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [layout, setLayout] = useState<"desktop" | "mobile">("desktop");
  const [showQueue, setShowQueue] = useState(false);

  const playlist = PLAYLISTS[playlistIndex];
  const tracks = playlist.tracks;
  const current: Track = tracks[trackIndex];
  const hasVideo = Boolean(current.videoId);
  const anyPlayable = useMemo(() => tracks.some((t) => t.videoId), [tracks]);

  const ytRef = useRef<YT.Player | null>(null);
  const desktopHostRef = useRef<HTMLDivElement | null>(null);
  const mobileHostRef = useRef<HTMLDivElement | null>(null);

  // Latest values the (rarely re-running) init effect needs, without adding
  // them as deps and forcing a costly player re-create.
  const restoreRef = useRef({ videoId: "", elapsed: 0, wasPlaying: false });
  const autoplayRef = useRef(false);
  restoreRef.current = { videoId: current.videoId, elapsed, wasPlaying: isPlaying };

  // Latest ENDED / error handlers, so the (layout-keyed) player created once per
  // breakpoint always calls current logic instead of a stale closure after a
  // playlist switch.
  const endedRef = useRef<() => void>(() => {});
  const errorRef = useRef<(code: number) => void>(() => {});

  // ---- responsive layout (drives which artwork slot hosts the iframe) ------
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setLayout(mq.matches ? "desktop" : "mobile");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // ---- create / re-create the player against the ACTIVE slot ----------------
  // Keyed on `layout` only: within a breakpoint the iframe is created once and
  // never re-created, so progress ticks never disturb it. Crossing the 640px
  // boundary (resize / rotate) re-creates it and resumes at the saved time.
  useEffect(() => {
    const slot =
      layout === "desktop" ? desktopHostRef.current : mobileHostRef.current;
    if (!slot) return;

    let cancelled = false;
    setIsReady(false);

    loadYT().then((YTns) => {
      if (cancelled) return;
      slot.innerHTML = "";
      const host = document.createElement("div");
      slot.appendChild(host);

      const { videoId, elapsed: savedElapsed, wasPlaying } = restoreRef.current;

      ytRef.current = new YTns.Player(host, {
        width: "100%",
        height: "100%",
        videoId: videoId || undefined,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        },
        events: {
          onReady: (e) => {
            setIsReady(true);
            if (videoId) {
              if (wasPlaying) {
                e.target.loadVideoById(videoId, savedElapsed);
              } else {
                e.target.cueVideoById(videoId, savedElapsed);
              }
            }
          },
          onStateChange: (e) => {
            const S = YTns.PlayerState;
            if (e.data === S.PLAYING) {
              setIsPlaying(true);
              setDuration(e.target.getDuration() || 0);
            } else if (e.data === S.PAUSED) {
              setIsPlaying(false);
            } else if (e.data === S.ENDED) {
              endedRef.current();
            }
          },
          onError: (e) => {
            // Videos get deleted or have embedding switched off AFTER ship.
            errorRef.current(e.data);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      const p = ytRef.current;
      ytRef.current = null;
      try {
        p?.destroy();
      } catch {
        /* noop */
      }
      slot.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  // ---- load the track when the selection changes ---------------------------
  useEffect(() => {
    const p = ytRef.current;
    if (!p || !isReady) return;
    setElapsed(0);
    setDuration(0);
    if (!current.videoId) {
      try {
        p.stopVideo();
      } catch {
        /* noop */
      }
      setIsPlaying(false);
      return;
    }
    if (autoplayRef.current) {
      p.loadVideoById(current.videoId);
    } else {
      p.cueVideoById(current.videoId);
    }
    autoplayRef.current = false;
    // Keyed on selection only (NOT isReady): re-creating the player on a
    // breakpoint change must not reset playback to 0 — onReady restores the
    // saved position instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistIndex, trackIndex]);

  // ---- progress polling ----------------------------------------------------
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const p = ytRef.current;
      if (!p) return;
      try {
        setElapsed(p.getCurrentTime() || 0);
        const d = p.getDuration() || 0;
        if (d) setDuration(d);
      } catch {
        /* noop */
      }
    }, 250);
    return () => clearInterval(id);
  }, [isPlaying]);

  // ---- controls ------------------------------------------------------------
  const togglePlay = useCallback(() => {
    const p = ytRef.current;
    if (!p || !current.videoId) return; // never gate on canplay; safe no-op if empty
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
  }, [isPlaying, current.videoId]);

  // Global spacebar → play/pause, suppressing the default page scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (e.target instanceof HTMLElement && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)) return;
      e.preventDefault();
      togglePlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [togglePlay]);

  // Step by ±1 (browsing the list). Keeps playing if we were playing.
  const step = useCallback(
    (dir: 1 | -1) => {
      autoplayRef.current = isPlaying;
      setTrackIndex((i) => (i + dir + tracks.length) % tracks.length);
    },
    [isPlaying, tracks.length]
  );

  // Skip to the next/prev PLAYABLE track (used by ENDED / onError). If nothing
  // is playable, stop cleanly instead of looping.
  const skipTo = useCallback(
    (dir: 1 | -1, autoplay: boolean) => {
      setTrackIndex((from) => {
        const n = tracks.length;
        for (let k = 1; k <= n; k++) {
          const idx = (from + dir * k + n * n) % n;
          if (tracks[idx].videoId) {
            autoplayRef.current = autoplay;
            return idx;
          }
        }
        setIsPlaying(false);
        return from;
      });
    },
    [tracks]
  );

  const selectPlaylist = useCallback(
    (i: number) => {
      if (i === playlistIndex) return;
      autoplayRef.current = true;
      const pl = PLAYLISTS[i];
      const playable = pl.tracks.map((t, idx) => (t.videoId ? idx : -1)).filter((idx) => idx !== -1);
      const randomIdx = playable.length
        ? playable[Math.floor(Math.random() * playable.length)]
        : 0;
      setPlaylistIndex(i);
      setTrackIndex(randomIdx);
    },
    [playlistIndex]
  );

  const selectTrack = useCallback(
    (pIdx: number, tIdx: number) => {
      autoplayRef.current = true;
      setPlaylistIndex(pIdx);
      setTrackIndex(tIdx);
      setShowQueue(false);
    },
    []
  );

  const onScrub = useCallback(
    (frac: number, commit: boolean) => {
      const d = duration;
      if (!d) return;
      const t = frac * d;
      setElapsed(t);
      if (commit) {
        try {
          ytRef.current?.seekTo(t, true);
        } catch {
          /* noop */
        }
      }
    },
    [duration]
  );

  // Keep the YT event refs pointing at the freshest closures every render.
  useEffect(() => {
    endedRef.current = () => {
      autoplayRef.current = true;
      skipTo(1, true);
    };
    errorRef.current = (code: number) => {
      analytics("yt_error", { code, videoId: current.videoId });
      autoplayRef.current = true;
      skipTo(1, true);
    };
  });

  const fraction = duration > 0 ? elapsed / duration : 0;

  // =========================================================================
  // Render — TWO SEPARATE BLOCKS (hidden sm:flex / sm:hidden). Only the active
  // block hosts the live iframe; the other keeps an empty host ref.
  // =========================================================================
  return (
    <div className="pointer-events-auto w-full max-w-xl">
      <div className="mb-3 flex justify-center sm:justify-start">
        <PlaylistTabs
          playlists={PLAYLISTS}
          activeIndex={playlistIndex}
          onSelect={selectPlaylist}
        />
      </div>

      {/* ---------- DESKTOP: one horizontal glass pill ---------- */}
      <div className={`hidden items-center gap-4 rounded-full p-3 pr-5 sm:flex ${GLASS}`}>
        <Artwork
          hostRef={desktopHostRef}
          hasVideo={hasVideo && layout === "desktop"}
          playing={isPlaying}
          vinylSize={80}
          rounded={hasVideo ? "rounded-xl" : "rounded-full"}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <TitleBlock title={current.title} artist={current.artist} />
          <div className="flex items-center gap-2.5">
            <TimeReadout seconds={elapsed} />
            <SeekBar fraction={fraction} onScrub={onScrub} />
            <TimeReadout seconds={duration} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <GhostButton label="Previous track" size={36} onClick={() => step(-1)}>
            <PrevIcon className="h-5 w-5" />
          </GhostButton>
          <PlayButton
            playing={isPlaying}
            onClick={togglePlay}
            disabled={!hasVideo}
            size={44}
            iconSize={20}
          />
          <GhostButton label="Next track" size={36} onClick={() => step(1)}>
            <NextIcon className="h-5 w-5" />
          </GhostButton>
          <GhostButton label="Toggle queue" size={36} onClick={() => setShowQueue((v) => !v)}>
            <QueueIcon className="h-5 w-5" />
          </GhostButton>
        </div>
      </div>

      {/* ---------- MOBILE: stacked glass card ---------- */}
      <div className={`flex flex-col gap-3 rounded-[26px] p-4 sm:hidden ${GLASS}`}>
        {/* row 1 */}
        <div className="flex items-center gap-3">
          <Artwork
            hostRef={mobileHostRef}
            hasVideo={hasVideo && layout === "mobile"}
            playing={isPlaying}
            vinylSize={64}
            rounded={hasVideo ? "rounded-2xl" : "rounded-full"}
          />
          <TitleBlock title={current.title} artist={current.artist} />
        </div>

        {/* row 2 — full-width seek */}
        <SeekBar fraction={fraction} onScrub={onScrub} />

        {/* row 3 — times left, transport centred, 44px targets */}
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center gap-1 justify-self-start text-[10.5px] tabular-nums text-white/60">
            <span>{fmtTime(elapsed)}</span>
            <span className="text-white/30">/</span>
            <span>{fmtTime(duration)}</span>
          </div>
          <div className="flex items-center justify-self-center gap-2">
            <GhostButton label="Previous track" size={44} onClick={() => step(-1)}>
              <PrevIcon className="h-6 w-6" />
            </GhostButton>
            <PlayButton
              playing={isPlaying}
              onClick={togglePlay}
              disabled={!hasVideo}
              size={52}
              iconSize={24}
            />
            <GhostButton label="Next track" size={44} onClick={() => step(1)}>
              <NextIcon className="h-6 w-6" />
            </GhostButton>
          </div>
          <GhostButton label="Toggle queue" size={44} onClick={() => setShowQueue((v) => !v)}>
            <QueueIcon className="h-5 w-5" />
          </GhostButton>
        </div>
      </div>

      {showQueue && (
        <QueuePanel
          playlists={PLAYLISTS}
          currentPlaylistIndex={playlistIndex}
          currentTrackIndex={trackIndex}
          onSelect={selectTrack}
        />
      )}

      {!anyPlayable && (
        <p className="mt-2 text-center text-[11px] leading-snug text-white/55 sm:text-left">
          No embeddable videoId set yet — add one to a track in{" "}
          <code className="rounded bg-white/10 px-1">lib/tracks.ts</code> to start
          playback.
        </p>
      )}
    </div>
  );
}
