import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { STATIONS } from "@/lib/stations";

const LEGACY_CHAYAKADA_IDS = ["golden-voices", "melody-makers", "the-nineties"];

function authOk(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  if (!authOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allPlaylists = STATIONS.flatMap((s) =>
    s.playlists.map((pl) => ({ stationId: s.id, playlistId: pl.id }))
  );
  const allIds = [...allPlaylists.map((p) => p.playlistId), ...LEGACY_CHAYAKADA_IDS];

  const pipeline = redis.pipeline();
  for (const id of allIds) pipeline.lrange(`ck:extra:${id}`, 0, -1);
  const results = await pipeline.exec();

  const parse = (s: unknown) => { try { return typeof s === "string" ? JSON.parse(s) : s; } catch { return null; } };
  const rawByKey: Record<string, unknown[]> = {};
  allIds.forEach((id, i) => {
    rawByKey[id] = ((results[i] as string[] | null) ?? []).map(parse).filter(Boolean);
  });

  const stations = STATIONS.map((s) => ({
    id: s.id,
    name: s.englishName,
    emoji: s.emoji,
    playlists: s.playlists.map((pl) => {
      let extraTracks = [...(rawByKey[pl.id] ?? [])];
      if (pl.id === "chayakada") {
        for (const legacyId of LEGACY_CHAYAKADA_IDS) {
          extraTracks = [...extraTracks, ...(rawByKey[legacyId] ?? [])];
        }
      }
      return { id: pl.id, staticCount: pl.tracks.length, extraTracks };
    }),
  }));

  return NextResponse.json(stations);
}

export async function DELETE(req: Request) {
  if (!authOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { playlistId, trackId } = await req.json().catch(() => ({}));
  if (!playlistId || !trackId) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  // when playlistId is "chayakada", the track may live under a legacy key
  const keysToSearch =
    playlistId === "chayakada"
      ? [playlistId, ...LEGACY_CHAYAKADA_IDS]
      : [playlistId];

  for (const key of keysToSearch) {
    const items: string[] = await redis.lrange(`ck:extra:${key}`, 0, -1);
    const kept = items.filter((item) => {
      try {
        const parsed = typeof item === "string" ? JSON.parse(item) : item;
        return parsed.id !== trackId;
      } catch { return true; }
    });

    if (kept.length < items.length) {
      const pipe = redis.pipeline().del(`ck:extra:${key}`);
      if (kept.length > 0) pipe.rpush(`ck:extra:${key}`, ...kept);
      await pipe.exec();
      return NextResponse.json({ ok: true });
    }
  }

  return NextResponse.json({ error: "track not found" }, { status: 404 });
}
