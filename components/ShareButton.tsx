"use client";

import { useState } from "react";

const SHARE_URL = "https://chaya-kada-psi.vercel.app/";

export function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for browsers without clipboard API
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
        className="text-white/75 transition hover:text-white cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .13 1.02l-6.1 3.56a3 3 0 1 0 0 4.84l6.1 3.56A3 3 0 1 0 18 16a2.98 2.98 0 0 0-1.98.75l-6.1-3.56a3.02 3.02 0 0 0 0-2.38l6.1-3.56A2.98 2.98 0 0 0 18 8Z" />
        </svg>
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
            {/* close */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-white/40 transition hover:text-white/80"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* tea cup accent */}
            <div className="mb-3 text-4xl">☕</div>

            <h2 className="mb-1 text-lg font-semibold text-white">
              Enjoyed the music?
            </h2>
            <p className="mb-5 text-sm text-white/60">
              Share Chayakada with your friends and spread the love for good music.
            </p>

            {/* link display */}
            <div
              className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <span className="flex-1 truncate text-left text-xs text-white/70">
                {SHARE_URL}
              </span>
            </div>

            {/* copy button */}
            <button
              onClick={copyLink}
              className="w-full rounded-xl py-2.5 text-sm font-medium transition-all"
              style={{
                background: copied ? "rgba(80,160,80,0.25)" : "rgba(224,180,106,0.15)",
                border: `1px solid ${copied ? "rgba(80,160,80,0.5)" : "rgba(224,180,106,0.4)"}`,
                color: copied ? "rgb(120,200,120)" : "rgb(224,180,106)",
              }}
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
