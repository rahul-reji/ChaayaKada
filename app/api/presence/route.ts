import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const KEY = "chayakada:presence";
const TTL_MS = 60_000; // treat user as offline after 60s with no heartbeat
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId =
      typeof body?.sessionId === "string" ? body.sessionId : null;
    if (!sessionId || !UUID_RE.test(sessionId)) {
      return NextResponse.json({ count: 0 }, { status: 400 });
    }

    const now = Date.now();
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(KEY, 0, now - TTL_MS); // evict stale sessions
    pipeline.zadd(KEY, { score: now, member: sessionId });
    pipeline.expire(KEY, 120);
    await pipeline.exec();

    const count = await redis.zcard(KEY);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
