import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { STATIONS } from "@/lib/stations";

function authOk(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  if (!authOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allPlaylists = STATIONS.flatMap((s) =>
    s.playlists.map((pl) => ({ stationId: s.id, playlistId: pl.id }))
  );

  const pipeline = redis.pipeline();
  for (const { playlistId } of allPlaylists) pipeline.lrange(`ck:extra:${playlistId}`, 0, -1);
  const results = await pipeline.exec();

  const extraByPlaylist: Record<string, unknown[]> = {};
  allPlaylists.forEach(({ playlistId }, i) => {
    const items = (results[i] as string[] | null) ?? [];
    extraByPlaylist[playlistId] = items
      .map((s) => { try { return typeof s === "string" ? JSON.parse(s) : s; } catch { return null; } })
      .filter(Boolean);
  });

  const stations = STATIONS.map((s) => ({
    id: s.id,
    name: s.englishName,
    emoji: s.emoji,
    playlists: s.playlists.map((pl) => ({
      id: pl.id,
      staticCount: pl.tracks.length,
      extraTracks: extraByPlaylist[pl.id] ?? [],
    })),
  }));

  return NextResponse.json(stations);
}

export async function DELETE(req: Request) {
  if (!authOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { playlistId, trackId } = await req.json().catch(() => ({}));
  if (!playlistId || !trackId) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const items: string[] = await redis.lrange(`ck:extra:${playlistId}`, 0, -1);
  const kept = items.filter((item) => {
    try {
      const parsed = typeof item === "string" ? JSON.parse(item) : item;
      return parsed.id !== trackId;
    } catch { return true; }
  });

  if (kept.length === items.length) return NextResponse.json({ error: "track not found" }, { status: 404 });

  const pipe = redis.pipeline().del(`ck:extra:${playlistId}`);
  if (kept.length > 0) pipe.rpush(`ck:extra:${playlistId}`, ...kept);
  await pipe.exec();

  return NextResponse.json({ ok: true });
}
