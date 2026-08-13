import Image from "next/image";
import logo from "@/public/bg/logo.png";
import { Clock } from "@/components/Clock";
import { ListenerCount } from "@/components/ListenerCount";
import { Player } from "@/components/Player";

// Inline feTurbulence grain as a data-URI (mix-blend overlay, opacity 0.3).
const GRAIN =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22180%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.85%22%20numOctaves%3D%222%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E";

// Safe-area helpers — every fixed corner reclaims space from the notch / home
// indicator while never sitting flush to the edge.
const insetTop = "max(1rem, env(safe-area-inset-top))";
const insetLeft = "max(1rem, env(safe-area-inset-left))";
const insetRight = "max(1rem, env(safe-area-inset-right))";
const insetBottom = "max(1rem, env(safe-area-inset-bottom))";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* 1 — fixed background: wide scene, swaps to tall in portrait via CSS */}
      <div className="hero-bg fixed inset-0 -z-20 bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80" />
      </div>

      {/* 2 — fixed grain overlay */}
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

      {/* 3 — fixed top row: clock (TL), listeners (top centre), social (TR) */}
      <div className="fixed z-20" style={{ top: insetTop, left: insetLeft }}>
        <Clock />
      </div>
      <div
        className="fixed z-20 -translate-x-1/2"
        style={{ top: insetTop, left: "50%" }}
      >
        <ListenerCount />
      </div>
      <nav
        className="fixed z-20 flex items-center gap-3"
        style={{ top: insetTop, right: insetRight }}
        aria-label="Social links"
      >
        <a
          href="#"
          aria-label="Share"
          className="text-white/75 transition hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .13 1.02l-6.1 3.56a3 3 0 1 0 0 4.84l6.1 3.56A3 3 0 1 0 18 16a2.98 2.98 0 0 0-1.98.75l-6.1-3.56a3.02 3.02 0 0 0 0-2.38l6.1-3.56A2.98 2.98 0 0 0 18 8Z" />
          </svg>
        </a>
      </nav>

      {/* Logo on the scene */}
      <div
        className="z-10 flex w-full justify-center"
        style={{ paddingTop: `calc(${insetTop} + 3.25rem)` }}
      >
        <Image
          src={logo}
          alt="ചായക്കട — Chayakada"
          priority
          sizes="(max-width: 640px) 78vw, 420px"
          className="h-auto w-[min(78vw,420px)] self-start drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* The player, bottom-anchored */}
      <div
        className="z-10 flex w-full justify-center"
        style={{
          paddingBottom: insetBottom,
          paddingLeft: insetLeft,
          paddingRight: insetRight,
        }}
      >
        <Player />
      </div>
    </main>
  );
}
