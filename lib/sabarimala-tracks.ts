// ---------------------------------------------------------------------------
// Sabarimala station — track catalogue
// ---------------------------------------------------------------------------
// Same rules as tracks.ts: videoId must be an embeddable upload from the
// rights holder's own channel. Leave "" to skip the track.
// ---------------------------------------------------------------------------

import { type Playlist, type Track } from "./tracks";

// --- Ayyappa Devotional -----------------------------------------------------
const ayyappaDevotional: Track[] = [
  { id: "sb-01", title: "Vaishaakha Sandhye (Male Version)", artist: "K.J. Yesudas", film: "", year: 0, duration: "0:00", videoId: "GJCj4lfraDc" },
  { id: "sb-02", title: "Sreeraagamo Thedunnu",              artist: "K.J. Yesudas", film: "Pavithram", year: 0, duration: "0:00", videoId: "aD9lDmwt9rk" },
  { id: "sb-03", title: "Megham Poothu Thudangi",            artist: "K.J. Yesudas", film: "", year: 0, duration: "0:00", videoId: "JrIAGLBrN_0" },
  { id: "sb-04", title: "Thumpi Penne",                      artist: "K.J. Yesudas", film: "", year: 0, duration: "0:00", videoId: "dDdv4AZ661E" },
  { id: "sb-05", title: "Onnam Raagam Paadi",                artist: "G. Venugopal",  film: "", year: 0, duration: "0:00", videoId: "pBbHUxjiKd8" },
];

export const SABARIMALA_PLAYLISTS: Playlist[] = [
  { id: "sabarimala-devotional", name: "Ayyappa Devotional", tracks: ayyappaDevotional },
];
