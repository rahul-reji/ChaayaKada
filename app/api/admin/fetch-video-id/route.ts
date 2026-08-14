import { NextResponse } from "next/server";

// Uses the same YouTube Data API v3 search logic as your local fetch script,
// but runs server-side so the API key stays out of the browser.
export async function POST(req: Request) {
  if (req.headers.get("x-admin-key") !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const artist = typeof body?.artist === "string" ? body.artist.trim() : "";

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "YOUTUBE_API_KEY not set" }, { status: 500 });

  const q = encodeURIComponent(`${title} ${artist} Malayalam song`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&maxResults=1&type=video&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) return NextResponse.json({ videoId: null });

  const data = await res.json();
  const item = data.items?.[0];
  const videoId: string | null = item?.id?.videoId ?? null;
  const officialTitle: string | null = item?.snippet?.title ?? null;
  const officialArtist: string | null = item?.snippet?.channelTitle ?? null;

  return NextResponse.json({ videoId, title: officialTitle, channelTitle: officialArtist });
}
