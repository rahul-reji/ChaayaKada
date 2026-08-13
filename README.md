# ചായക്കട · Chayakada

A single-page nostalgia radio for 80s & 90s Malayalam classics — a roadside
tea-stall scene, a floating glass player, a live spinning vinyl, and a
YouTube-driven engine. Built with **Next.js (App Router) + TypeScript** and
**Tailwind CSS v4** (`@theme` tokens, no config file).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Dependencies: `next`, `react`, `react-dom`, `@vercel/analytics`,
`@vercel/speed-insights`. No CSS-in-JS, no component library, no state manager.

## Project shape

```
app/
  layout.tsx        # metadata + viewport (viewportFit: "cover") + analytics
  page.tsx          # server component: background, grain, top row, logo, player
  globals.css       # Tailwind v4 @theme tokens, hero-bg swap, keyframes
components/
  Player.tsx        # the engine (client)
  Clock.tsx         # IST clock, blinking colon
  ListenerCount.tsx # ambient "listeners" figure
  icons.tsx         # module-scope SVG transport icons
lib/
  tracks.ts         # the catalogue — edit this to add songs
  loadYT.ts         # memoised YouTube IFrame API loader
  youtube.d.ts      # ambient YT types
public/bg/          # scene-wide.png, scene-tall.png, logo.png
```

## Adding a song (one line)

Append a `Track` to any playlist array in `lib/tracks.ts`:

```ts
{ id: "gv-12", title: "Song title", artist: "Composer", film: "Film", year: 1991, duration: "4:12", videoId: "" }
```

`duration` is only a fallback label; the player reports the real length once the
video loads. Playlists are just arrays — the same engine drives all of them, and
switching a playlist restarts at track 1.

## ⚠️ About `videoId` — read before you paste anything

**Every track ships with `videoId: ""` on purpose.** I did not search for, guess,
or add any YouTube ids, because the songs in `songs.txt` are commercial
recordings and I won't attach copyrighted streams on your behalf.

Populate `videoId` **only** with the 11-character id of an upload you have the
right to embed — i.e. the **rights holder's own** YouTube upload (label /
composer / official channel) with embedding enabled. A track left blank is
simply skipped by the engine, and until at least one id is set the player shows
the idle spinning vinyl with a hint.

## Compliance notes (by design)

- **The player is visible, never hidden.** The live `<iframe>` sits in the
  artwork slot at `aspect-video` (16:9). It is never placed in a 1px / opacity-0
  box — that violates YouTube's Developer Policies (no background players, no
  separating audio from video) and would trap listeners behind an unreachable
  ad **Skip** button.
- **Spinning vinyl = fallback art.** The circular vinyl (with spindle hole and
  play/pause-linked spin) shows only when a track has no embeddable id. As soon
  as a cleared upload is set, that track shows the real, interactive 16:9 player
  instead — the only way to keep the Skip button reachable and avoid
  square-cropping a 16:9 source.
- **No re-hosted thumbnails.** Cover art is displayed by the YouTube player
  itself; nothing is downloaded or copied onto your domain.
- **`onError` self-heals.** If a video is later deleted or has embedding turned
  off, the engine skips to the next playable track and fires a `yt_error`
  analytics event with the error `code` and `videoId`.

## Implementation details worth knowing

- **Sub-components live at module scope.** Declared inside `<Player/>` they would
  get a new identity each render, remount the subtree, and restart the vinyl's
  CSS animation from 0° on every ~250 ms progress tick. They're all top-level.
- **The iframe is created once per breakpoint.** It's created imperatively into
  an empty, ref'd host so progress-tick re-renders never touch it. Crossing the
  640px boundary (resize/rotate) re-creates it and resumes at the saved time.
- **Seeking uses `onPointerDown` + `touch-none`** so dragging seeks instead of
  scrolling. The play button is never gated on a `canplay` event (iOS Safari
  won't fire it before a gesture).
- Background swaps `scene-wide.png` → `scene-tall.png` purely in CSS via
  `@media (orientation: portrait)`; all fixed corners use
  `max(1rem, env(safe-area-inset-*))`.
