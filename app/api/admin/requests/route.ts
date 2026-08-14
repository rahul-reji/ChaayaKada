import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { PLAYLISTS } from "@/lib/tracks";

type SongRequest = {
  id: string;
  title: string;
  artist: string;
  note: string;
  timestamp: number;
  status: "pending" | "approved" | "rejected";
  videoId?: string;
  playlistId?: string;
};

function authOk(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  if (!authOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ids = await redis.zrange("ck:req_ids", 0, -1, { rev: true }); // newest first
  if (!ids.length) return NextResponse.json([]);

  const pipeline = redis.pipeline();
  for (const id of ids) pipeline.get(`ck:req:${id}`);
  const results = await pipeline.exec();

  const requests: SongRequest[] = results
    .map((r) => {
      if (typeof r === "string") return JSON.parse(r);
      if (r && typeof r === "object") return r as SongRequest;
      return null;
    })
    .filter(Boolean) as SongRequest[];

  return NextResponse.json(requests);
}

export async function PATCH(req: Request) {
  if (!authOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { id, action, videoId, playlistId, officialTitle, officialArtist } = body ?? {};

  if (!id || !action) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const raw = await redis.get(`ck:req:${id}`);
  if (!raw) return NextResponse.json({ error: "not found" }, { status: 404 });
  const request: SongRequest = typeof raw === "string" ? JSON.parse(raw) : (raw as SongRequest);

  if (action === "approve") {
    if (!videoId || !playlistId)
      return NextResponse.json({ error: "videoId and playlistId required" }, { status: 400 });
    if (!PLAYLISTS.find((p) => p.id === playlistId))
      return NextResponse.json({ error: "invalid playlist" }, { status: 400 });

    // accepts full YouTube URLs or bare 11-char IDs
    const cleanId = (videoId as string)
      .trim()
      .replace(/.*[?&]v=([^&]+).*/, "$1")
      .replace(/.*youtu\.be\/([^?]+).*/, "$1");

    const track = {
      id: `req-${id}`,
      title: (officialTitle as string) || request.title,
      artist: (officialArtist as string) || request.artist || "Unknown",
      film: "",
      year: 0,
      duration: "0:00",
      videoId: cleanId,
    };

    await redis.pipeline()
      .set(`ck:req:${id}`, JSON.stringify({ ...request, status: "approved", videoId: cleanId, playlistId }))
      .rpush(`ck:extra:${playlistId}`, JSON.stringify(track))
      .exec();

    return NextResponse.json({ ok: true });
  }

  if (action === "reject") {
    await redis.set(`ck:req:${id}`, JSON.stringify({ ...request, status: "rejected" }));
    return NextResponse.json({ ok: true });
  }

  if (action === "edit") {
    if (!request.playlistId)
      return NextResponse.json({ error: "no playlistId on this request" }, { status: 400 });
    const newTitle = (body.title as string)?.trim() || request.title;
    const newArtist = (body.artist as string)?.trim() ?? "";
    const rawVid = (body.videoId as string)?.trim();
    const newVideoId = rawVid
      ? rawVid.replace(/.*[?&]v=([^&]+).*/, "$1").replace(/.*youtu\.be\/([^?]+).*/, "$1")
      : request.videoId;

    const items: string[] = await redis.lrange(`ck:extra:${request.playlistId}`, 0, -1);
    const trackId = `req-${id}`;
    const idx = items.findIndex((item) => {
      const t = typeof item === "string" ? JSON.parse(item) : item;
      return t.id === trackId;
    });

    const updatedRequest = { ...request, title: newTitle, artist: newArtist, videoId: newVideoId };
    const pipe = redis.pipeline().set(`ck:req:${id}`, JSON.stringify(updatedRequest));
    if (idx !== -1) {
      const existing = typeof items[idx] === "string" ? JSON.parse(items[idx]) : items[idx];
      pipe.lset(`ck:extra:${request.playlistId}`, idx, JSON.stringify({ ...existing, title: newTitle, artist: newArtist, videoId: newVideoId }));
    }
    await pipe.exec();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "invalid action" }, { status: 400 });
}
