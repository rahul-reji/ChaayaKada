import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

function authOk(req: Request) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_KEY;
}

export async function PATCH(req: Request) {
  if (!authOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { flag, enabled } = body ?? {};

  if (!flag || typeof enabled !== "boolean") {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  await redis.hset("ck:flags", { [flag]: enabled ? "1" : "0" });
  return NextResponse.json({ ok: true, flag, enabled });
}
