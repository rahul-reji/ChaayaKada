"use client";

import { useState } from "react";

const SHARE_URL = "https://chaya-kada-psi.vercel.app/";
const SHARE_TEXT = "🎵 Chayakada — free Malayalam classics radio from the 80s & 90s. Listen now!";

const encoded = encodeURIComponent(SHARE_URL);
const encodedText = encodeURIComponent(SHARE_TEXT + " " + SHARE_URL);

const SHARE_CHANNELS = [
  {
    label: "WhatsApp",
    href: `https://wa.me/?text=${encodedText}`,
    color: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}&quote=${encodeURIComponent(SHARE_TEXT)}`,
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:?subject=${encodeURIComponent("You'll love this! — Chayakada")}&body=${encodeURIComponent(SHARE_TEXT + "\n\n" + SHARE_URL)}`,
    color: "#e0b46a",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("input");
      el.value = SHARE_URL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Share"
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 p-2.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/70 cursor-pointer sm:px-3.5 sm:py-1.5"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden>
          <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .13 1.02l-6.1 3.56a3 3 0 1 0 0 4.84l6.1 3.56A3 3 0 1 0 18 16a2.98 2.98 0 0 0-1.98.75l-6.1-3.56a3.02 3.02 0 0 0 0-2.38l6.1-3.56A2.98 2.98 0 0 0 18 8Z" />
        </svg>
        <span className="hidden sm:inline">Share</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-white/10 p-6 text-center shadow-2xl"
            style={{ background: "rgba(20,14,8,0.92)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-white/40 transition hover:text-white/80"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-3 text-4xl">☕</div>
            <h2 className="mb-1 text-lg font-semibold text-white">Enjoyed the music?</h2>
            <p className="mb-5 text-sm text-white/60">
              Share Chayakada with your friends and spread the love for good music.
            </p>

            {/* share channel buttons */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              {SHARE_CHANNELS.map(({ label, href, color, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 py-3 text-white transition hover:bg-white/10"
                >
                  <span style={{ color }}>{icon}</span>
                  <span className="text-[11px] text-white/70">{label}</span>
                </a>
              ))}
            </div>

            {/* copy link row */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2" style={{ background: "rgba(255,255,255,0.05)" }}>
              <span className="flex-1 truncate text-left text-xs text-white/70">{SHARE_URL}</span>
              <button
                onClick={copyLink}
                className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
                style={{
                  background: copied ? "rgba(80,160,80,0.25)" : "rgba(224,180,106,0.15)",
                  border: `1px solid ${copied ? "rgba(80,160,80,0.5)" : "rgba(224,180,106,0.4)"}`,
                  color: copied ? "rgb(120,200,120)" : "rgb(224,180,106)",
                }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
