import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { PLAYLISTS } from "@/lib/tracks";

export async function GET() {
  try {
    const pipeline = redis.pipeline();
    for (const pl of PLAYLISTS) pipeline.lrange(`ck:extra:${pl.id}`, 0, -1);
    const results = await pipeline.exec();

    const extra: Record<string, unknown[]> = {};
    PLAYLISTS.forEach((pl, i) => {
      const items = (results[i] as string[] | null) ?? [];
      extra[pl.id] = items
        .map((s) => { try { return typeof s === "string" ? JSON.parse(s) : s; } catch { return null; } })
        .filter(Boolean);
    });

    return NextResponse.json(extra, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({});
  }
}
