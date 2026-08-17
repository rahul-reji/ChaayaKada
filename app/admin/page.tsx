"use client";

import { useState, useCallback } from "react";
import { PLAYLISTS } from "@/lib/tracks";
import { STATIONS } from "@/lib/stations";

type SongRequest = {
  id: string;
  title: string;
  artist: string;
  note: string;
  timestamp: number;
  status: "pending" | "approved" | "rejected";
  videoId?: string;
  playlistId?: string;
  youtubeVideoId?: string;
};

type ApproveState = { videoId: string; playlistId: string; officialTitle?: string; officialArtist?: string };

// returns human-readable matches from static playlists + already-approved requests
function findDuplicates(title: string, approvedRequests: SongRequest[]): string[] {
  const q = title.toLowerCase().trim();
  if (!q) return [];
  const hits: string[] = [];
  for (const pl of PLAYLISTS) {
    for (const t of pl.tracks) {
      const tl = t.title.toLowerCase();
      if (tl.includes(q) || q.includes(tl))
        hits.push(`"${t.title}" — ${pl.name}`);
    }
  }
  for (const r of approvedRequests) {
    const rl = r.title.toLowerCase();
    if (rl.includes(q) || q.includes(rl))
      hits.push(`"${r.title}" (approved request)`);
  }
  return hits;
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [approveFields, setApproveFields] = useState<Record<string, ApproveState>>({});
  const [actionStatus, setActionStatus] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ title: string; artist: string; videoId: string }>({ title: "", artist: "", videoId: "" });
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [flagStatus, setFlagStatus] = useState<Record<string, string>>({});

  const load = useCallback(async (adminKey: string) => {
    setLoading(true);
    setLoginError("");
    const res = await fetch("/api/admin/requests", {
      headers: { "x-admin-key": adminKey },
    });
    if (res.status === 401) {
      setLoginError("Wrong key");
      setAuthed(false);
      setLoading(false);
      return;
    }
    setRequests(await res.json());
    setAuthed(true);
    setLoading(false);
    // load feature flags
    fetch("/api/flags")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, boolean>) => setFlags(data))
      .catch(() => {});
  }, []);

  async function toggleFlag(flag: string, enabled: boolean) {
    setFlagStatus((s) => ({ ...s, [flag]: "saving…" }));
    const res = await fetch("/api/admin/flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ flag, enabled }),
    }).catch(() => null);
    if (res?.ok) {
      setFlags((f) => ({ ...f, [flag]: enabled }));
      setFlagStatus((s) => ({ ...s, [flag]: "" }));
    } else {
      setFlagStatus((s) => ({ ...s, [flag]: "✗ failed" }));
    }
  }

  async function autoFill(id: string, title: string, artist: string) {
    setActionStatus((s) => ({ ...s, [id]: "Searching YouTube…" }));
    const res = await fetch("/api/admin/fetch-video-id", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ title, artist }),
    }).catch(() => null);
    if (!res?.ok) {
      setActionStatus((s) => ({ ...s, [id]: "✗ Search failed" }));
      return;
    }
    const { videoId, title: officialTitle, channelTitle: officialArtist } = await res.json();
    if (videoId) {
      setApproveFields((s) => ({
        ...s,
        [id]: {
          ...(s[id] ?? { videoId: "", playlistId: "" }),
          videoId,
          ...(officialTitle && { officialTitle }),
          ...(officialArtist && { officialArtist }),
        },
      }));
      setActionStatus((s) => ({ ...s, [id]: "✓ Verify the preview below" }));
    } else {
      setActionStatus((s) => ({ ...s, [id]: "✗ Not found on YouTube" }));
    }
  }

  async function doAction(id: string, act: "approve" | "reject") {
    const f = approveFields[id] ?? { videoId: "", playlistId: "" };
    if (act === "approve" && (!f.videoId || !f.playlistId)) {
      setActionStatus((s) => ({ ...s, [id]: "Fill in video ID and playlist first" }));
      return;
    }
    setActionStatus((s) => ({ ...s, [id]: "…" }));
    const res = await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, action: act, ...f }),
    }).catch(() => null);
    if (res?.ok) {
      setActionStatus((s) => ({
        ...s,
        [id]: act === "approve" ? "✓ Added to playlist!" : "✗ Rejected",
      }));
      load(key);
    } else {
      const err = await res?.json().catch(() => null);
      setActionStatus((s) => ({ ...s, [id]: err?.error ?? "Failed" }));
    }
  }

  const setField = (id: string, patch: Partial<ApproveState>) =>
    setApproveFields((s) => ({ ...s, [id]: { ...(s[id] ?? { videoId: "", playlistId: "" }), ...patch } }));

  async function saveEdit(id: string) {
    setActionStatus((s) => ({ ...s, [id]: "…" }));
    const res = await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, action: "edit", title: editDraft.title, artist: editDraft.artist, videoId: editDraft.videoId }),
    }).catch(() => null);
    if (res?.ok) {
      setEditingId(null);
      setActionStatus((s) => ({ ...s, [id]: "✓ Updated" }));
      load(key);
    } else {
      const err = await res?.json().catch(() => null);
      setActionStatus((s) => ({ ...s, [id]: err?.error ?? "Failed" }));
    }
  }

  async function autoFillEdit(id: string) {
    setActionStatus((s) => ({ ...s, [id]: "Searching YouTube…" }));
    const res = await fetch("/api/admin/fetch-video-id", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ title: editDraft.title, artist: editDraft.artist }),
    }).catch(() => null);
    if (!res?.ok) {
      setActionStatus((s) => ({ ...s, [id]: "✗ Search failed" }));
      return;
    }
    const { videoId, title: officialTitle, channelTitle: officialArtist } = await res.json();
    if (videoId) {
      setEditDraft((d) => ({
        ...d,
        videoId,
        ...(officialTitle && { title: officialTitle }),
        ...(officialArtist && { artist: officialArtist }),
      }));
      setActionStatus((s) => ({ ...s, [id]: "✓ Verify the preview below" }));
    } else {
      setActionStatus((s) => ({ ...s, [id]: "✗ Not found on YouTube" }));
    }
  }

  if (!authed) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#0d0c0a] p-6" style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}>
        <form
          onSubmit={(e) => { e.preventDefault(); load(key); }}
          className="w-full max-w-xs space-y-4"
        >
          <div className="mb-2 text-2xl">☕</div>
          <h1 className="text-xl font-semibold text-white">Chayakada Admin</h1>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-white placeholder-white/30 outline-none"
          />
          {loginError && <p className="text-sm text-red-400">{loginError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-amber-500/30 bg-amber-500/15 py-3.5 text-base font-medium text-amber-300 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </main>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");
  const done = requests.filter((r) => r.status !== "pending");

  return (
    <main className="min-h-dvh bg-[#0d0c0a] text-white" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {/* sticky header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#0d0c0a]/95 px-4 py-3 backdrop-blur-md"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <h1 className="text-base font-semibold">
          Requests{" "}
          <span className="font-normal text-white/40">({pending.length} pending)</span>
        </h1>
        <button
          onClick={() => load(key)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60 transition active:bg-white/15"
        >
          ↻ Refresh
        </button>
      </div>
      <div className="mx-auto max-w-2xl p-4">

        {/* Feature Flags */}
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 text-sm font-semibold text-white/70">Feature Flags</h2>
          <div className="space-y-3">
            {STATIONS.filter((s) => s.featureFlag).map((s) => {
              const flag = s.featureFlag!;
              const on = flags[flag] === true;
              return (
                <div key={flag} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{s.emoji} {s.englishName} station</p>
                    <p className="text-xs text-white/35">{flag}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {flagStatus[flag] && (
                      <span className="text-xs text-white/40">{flagStatus[flag]}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFlag(flag, !on)}
                      aria-label={on ? "Disable" : "Enable"}
                      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-green-500" : "bg-white/15"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {loading && <p className="text-sm text-white/50">Loading…</p>}

        {!loading && pending.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/50">
            No pending requests.
          </p>
        )}

        <div className="space-y-3">
          {pending.map((req) => {
            const f = approveFields[req.id] ?? { videoId: req.youtubeVideoId ?? "", playlistId: "" };
            const dupes = findDuplicates(req.title, requests.filter((r) => r.status === "approved"));
            return (
              <div key={req.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium">{req.title}</p>
                {req.artist && <p className="text-sm text-white/60">{req.artist}</p>}
                {req.note && (
                  <p className="mt-1 text-xs italic text-white/40">"{req.note}"</p>
                )}
                <p className="mt-1 text-[11px] text-white/25">
                  {new Date(req.timestamp).toLocaleString()}
                </p>
                {dupes.length > 0 && (
                  <div className="mt-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2">
                    <p className="text-[11px] font-semibold text-amber-400">⚠ Already in the list</p>
                    {dupes.map((d, i) => (
                      <p key={i} className="text-[11px] text-amber-300/70">{d}</p>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={f.videoId}
                      onChange={(e) => setField(req.id, { videoId: e.target.value })}
                      placeholder="YouTube Video ID or URL"
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/25 outline-none"
                    />
                    <button
                      onClick={() => autoFill(req.id, req.title, req.artist)}
                      title="Auto-fill using YouTube search"
                      className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-amber-400 transition hover:bg-white/10"
                    >
                      🔍 Auto-fill
                    </button>
                  </div>
                  {(() => {
                    const raw = f.videoId.trim();
                    const embedId = raw
                      .replace(/.*[?&]v=([^&]+).*/, "$1")
                      .replace(/.*youtu\.be\/([^?]+).*/, "$1");
                    if (!/^[a-zA-Z0-9_-]{11}$/.test(embedId)) return null;
                    return (
                      <>
                        <div className="overflow-hidden rounded-lg" style={{ aspectRatio: "16/9" }}>
                          <iframe
                            key={embedId}
                            src={`https://www.youtube.com/embed/${embedId}?controls=1`}
                            className="h-full w-full border-0"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <input
                          type="text"
                          value={f.officialTitle ?? ""}
                          onChange={(e) => setField(req.id, { officialTitle: e.target.value })}
                          placeholder="Song title (will be saved as-is)"
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/25 outline-none"
                        />
                        <input
                          type="text"
                          value={f.officialArtist ?? ""}
                          onChange={(e) => setField(req.id, { officialArtist: e.target.value })}
                          placeholder="Singer / Artist"
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/25 outline-none"
                        />
                      </>
                    );
                  })()}
                  <select
                    value={f.playlistId}
                    onChange={(e) => setField(req.id, { playlistId: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-[#1a1412] px-3 py-1.5 text-xs text-white outline-none"
                  >
                    <option value="">— Select playlist —</option>
                    {PLAYLISTS.map((pl) => (
                      <option key={pl.id} value={pl.id}>{pl.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => doAction(req.id, "approve")}
                      className="flex-1 rounded-lg border border-green-500/25 bg-green-500/15 py-1.5 text-xs font-medium text-green-400 transition hover:bg-green-500/25"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => doAction(req.id, "reject")}
                      className="flex-1 rounded-lg border border-red-500/25 bg-red-500/15 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/25"
                    >
                      Reject
                    </button>
                  </div>
                  {actionStatus[req.id] && (
                    <p className="text-center text-xs text-white/50">{actionStatus[req.id]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {done.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-widest text-white/30">
              Processed
            </h2>
            <div className="space-y-2">
              {done.map((req) => {
                const isEditing = editingId === req.id;
                return (
                  <div key={req.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editDraft.videoId}
                            onChange={(e) => setEditDraft((d) => ({ ...d, videoId: e.target.value }))}
                            placeholder="YouTube Video ID or URL"
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/25 outline-none"
                          />
                          <button
                            onClick={() => autoFillEdit(req.id)}
                            title="Auto-fill using YouTube search"
                            className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-amber-400 transition hover:bg-white/10"
                          >
                            🔍 Auto-fill
                          </button>
                        </div>
                        {(() => {
                          const raw = editDraft.videoId.trim();
                          const embedId = raw
                            .replace(/.*[?&]v=([^&]+).*/, "$1")
                            .replace(/.*youtu\.be\/([^?]+).*/, "$1");
                          if (!/^[a-zA-Z0-9_-]{11}$/.test(embedId)) return null;
                          return (
                            <div className="overflow-hidden rounded-lg" style={{ aspectRatio: "16/9" }}>
                              <iframe
                                key={embedId}
                                src={`https://www.youtube.com/embed/${embedId}?controls=1`}
                                className="h-full w-full border-0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          );
                        })()}
                        <input
                          type="text"
                          value={editDraft.title}
                          onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                          placeholder="Song title"
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none"
                        />
                        <input
                          type="text"
                          value={editDraft.artist}
                          onChange={(e) => setEditDraft((d) => ({ ...d, artist: e.target.value }))}
                          placeholder="Singer / Artist"
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/25 outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(req.id)}
                            className="flex-1 rounded-lg border border-green-500/25 bg-green-500/15 py-1.5 text-xs font-medium text-green-400 transition hover:bg-green-500/25"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs text-white/50 transition hover:bg-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                        {actionStatus[req.id] && (
                          <p className="text-center text-xs text-white/50">{actionStatus[req.id]}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{req.title}</p>
                          {req.artist && <p className="text-xs text-white/50">{req.artist}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          {req.status === "approved" && (
                            <button
                              onClick={() => { setEditingId(req.id); setEditDraft({ title: req.title, artist: req.artist ?? "", videoId: req.videoId ?? "" }); }}
                              className="text-xs text-white/30 transition hover:text-white/70"
                            >
                              Edit
                            </button>
                          )}
                          <span className={`text-xs font-medium ${req.status === "approved" ? "text-green-400" : "text-red-400"}`}>
                            {req.status === "approved" ? "✓ Approved" : "✗ Rejected"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
