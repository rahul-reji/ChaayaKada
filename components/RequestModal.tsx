"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function RequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [note, setNote] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setStatus("loading");
    const res = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), artist: artist.trim(), note: note.trim(), youtubeUrl: youtubeUrl.trim() }),
    }).catch(() => null);
    setStatus(res?.ok ? "success" : "error");
  }

  function close() {
    if (status === "loading") return;
    setTitle(""); setArtist(""); setNote(""); setYoutubeUrl(""); setStatus("idle");
    onClose();
  }

  if (!open) return null;

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={close}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 p-6 shadow-2xl"
        style={{ background: "rgba(20,14,8,0.92)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 text-white/40 transition hover:text-white/80"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="py-4 text-center">
            <div className="mb-3 text-4xl">🎵</div>
            <h2 className="mb-2 text-lg font-semibold text-white">Request Sent!</h2>
            <p className="mb-5 text-sm text-white/60">
              We'll review it and add it if it fits the Chayakada vibe. Thanks!
            </p>
            <button
              onClick={close}
              className="w-full rounded-xl py-2.5 text-sm font-medium"
              style={{
                background: "rgba(224,180,106,0.15)",
                border: "1px solid rgba(224,180,106,0.4)",
                color: "rgb(224,180,106)",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="mb-1 text-3xl">🎶</div>
            <h2 className="mb-1 text-lg font-semibold text-white">Request a Song</h2>
            <p className="mb-5 text-sm text-white/50">
              We'll add it to the playlist if it fits the mood here.
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-white/60">Song Title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ente Swarnamazha"
                  maxLength={120}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/60">Artist / Film (optional)</label>
                <input
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. K.J. Yesudas"
                  maxLength={80}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/60">A note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Why this song? Any context?"
                  maxLength={300}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/60">YouTube link <span className="text-white/30">(optional)</span></label>
                <input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onKeyDown={(e) => e.key === " " && e.stopPropagation()}
                  placeholder="https://youtube.com/watch?v=..."
                  maxLength={200}
                  className={inputCls}
                />
                <p className="mt-1 text-[11px] text-white/30">Helps us find the exact version you want</p>
              </div>
            </div>

            {status === "error" && (
              <p className="mt-2 text-xs text-red-400">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !title.trim()}
              className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium transition-all disabled:opacity-50"
              style={{
                background: "rgba(224,180,106,0.15)",
                border: "1px solid rgba(224,180,106,0.4)",
                color: "rgb(224,180,106)",
              }}
            >
              {status === "loading" ? "Sending…" : "Send Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
