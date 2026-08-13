"use client";

import { useState } from "react";
import { RequestModal } from "./RequestModal";

export function RequestButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Request a song"
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/70"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        Request a Song
      </button>
      <RequestModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
