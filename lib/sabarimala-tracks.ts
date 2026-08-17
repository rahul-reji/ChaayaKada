// ---------------------------------------------------------------------------
// Sabarimala station — track catalogue
// ---------------------------------------------------------------------------
// Same rules as tracks.ts: videoId must be an embeddable upload from the
// rights holder's own channel. Leave "" to skip the track.
// ---------------------------------------------------------------------------

import { type Playlist, type Track } from "./tracks";

// --- Ayyappa Devotional -----------------------------------------------------
const ayyappaDevotional: Track[] = [
  { id: "sm-01", title: "Harivarasanam",                     artist: "K.J. Yesudas",   film: "Swami Ayyappan", year: 1975, duration: "0:00", videoId: "lUqeGuFfoDo" },
  { id: "sm-02", title: "Gangayaaru Pirakkunnu",             artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "kQeXk8jNMko" },
  { id: "sm-03", title: "Ore Oru Lakshyam",                  artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "tUv0p__n0uw" },
  { id: "sm-04", title: "Pambayarin Ponpulari",              artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "zIQBPw7aZ1c" },
  { id: "sm-05", title: "Sabarimalayil Thanka Sooryodayam",  artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "Tn7ef-xtu0E" },
  { id: "sm-06", title: "Neela Neelamalayude",               artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "3K8M7DxFqx4" },
  { id: "sm-07", title: "Shabarimala Mukalile",              artist: "K.G. Markose",   film: "", year: 0, duration: "0:00", videoId: "qY4BWxGloOY" },
  { id: "sm-08", title: "Ayyappa Thinthakam Pettathulli",    artist: "M.G. Sreekumar", film: "", year: 0, duration: "0:00", videoId: "sXBxyPUWB68" },
  { id: "sm-09", title: "Makara Vilakke",                    artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "8q2_6IkwzpQ" },
  { id: "sm-10", title: "Vighnam Mattunna",                  artist: "M.G. Sreekumar", film: "", year: 0, duration: "0:00", videoId: "Ua9rgYlUhUk" },
  { id: "sm-11", title: "Erumeli Pettah",                    artist: "M.G. Sreekumar", film: "", year: 0, duration: "0:00", videoId: "KAny5yqpQrk" },
  { id: "sm-12", title: "Khedamekum",                        artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "xcHKJPf5Ymw" },
  { id: "sm-13", title: "Malameluyarum Makarajyothi",        artist: "P. Jayachandran",film: "", year: 0, duration: "0:00", videoId: "QHf3QpWbAxs" },
  { id: "sm-14", title: "Lokaveeram Mahapoojyam",            artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "aA5K5BhNBos" },
  { id: "sm-15", title: "Irumudi Kettumay",                  artist: "G. Venugopal",   film: "", year: 0, duration: "0:00", videoId: "k3IEy7N7i1Q" },
  { id: "sm-16", title: "Onnam Thiruppadi",                  artist: "Satheesh Babu",  film: "", year: 0, duration: "0:00", videoId: "yNMzZY9oDvY" },
  { id: "sm-17", title: "Rithu Bhedangal",                   artist: "Unni Menon",     film: "", year: 0, duration: "0:00", videoId: "S8oF_MlTq0o" },
  { id: "sm-18", title: "Karppoora Deepamananju",            artist: "Unni Menon",     film: "", year: 0, duration: "0:00", videoId: "7VzuW1vFgHU" },
  { id: "sm-19", title: "Sankaranachalam",                   artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "WiXBhzrCsA4" },
  { id: "sm-20", title: "Ponnum Pathinettam Padi",           artist: "K.J. Yesudas",   film: "", year: 0, duration: "0:00", videoId: "V3-YnzWdi9g" },
];

export const SABARIMALA_PLAYLISTS: Playlist[] = [
  { id: "sabarimala-devotional", name: "Ayyappa Devotional", tracks: ayyappaDevotional },
];
