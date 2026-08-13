import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 120) : "";
  const artist = typeof body?.artist === "string" ? body.artist.trim().slice(0, 80) : "";
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 300) : "";

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const id = `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const timestamp = Date.now();

  await redis.pipeline()
    .set(`ck:req:${id}`, JSON.stringify({ id, title, artist, note, timestamp, status: "pending" }))
    .zadd("ck:req_ids", { score: timestamp, member: id })
    .exec();

  return NextResponse.json({ ok: true }, { status: 201 });
}
