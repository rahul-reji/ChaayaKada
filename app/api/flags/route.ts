import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

// Public endpoint — returns feature flags as { flagName: boolean }
export async function GET() {
  try {
    const raw = (await redis.hgetall("ck:flags")) ?? {};
    const flags: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(raw)) {
      flags[k] = String(v) === "1";
    }
    return NextResponse.json(flags, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({});
  }
}
