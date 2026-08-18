import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { STATIONS } from "@/lib/stations";

// old Chayakada playlist IDs before the merge — needed to recover already-approved songs
const LEGACY_CHAYAKADA_IDS = ["golden-voices", "melody-makers", "the-nineties"];

export async function GET() {
  try {
    const allPlaylists = STATIONS.flatMap((s) => s.playlists);
    const allIds = [...allPlaylists.map((pl) => pl.id), ...LEGACY_CHAYAKADA_IDS];

    const pipeline = redis.pipeline();
    for (const id of allIds) pipeline.lrange(`ck:extra:${id}`, 0, -1);
    const results = await pipeline.exec();

    const parse = (s: unknown) => { try { return typeof s === "string" ? JSON.parse(s) : s; } catch { return null; } };

    const rawByKey: Record<string, unknown[]> = {};
    allIds.forEach((id, i) => {
      rawByKey[id] = ((results[i] as string[] | null) ?? []).map(parse).filter(Boolean);
    });

    const extra: Record<string, unknown[]> = {};
    for (const pl of allPlaylists) {
      extra[pl.id] = [...(rawByKey[pl.id] ?? [])];
      if (pl.id === "chayakada") {
        for (const legacyId of LEGACY_CHAYAKADA_IDS) {
          extra[pl.id] = [...extra[pl.id], ...(rawByKey[legacyId] ?? [])];
        }
      }
    }

    return NextResponse.json(extra, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({});
  }
}
