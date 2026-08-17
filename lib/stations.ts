import { PLAYLISTS, type Playlist } from "./tracks";

export type Station = {
  id: string;
  name: string;
  englishName: string;
  emoji: string;
  logo: string;
  bgWide: string;
  bgTall: string;
  accent: string;
  playlists: Playlist[];
};

export const STATIONS: Station[] = [
  {
    id: "chayakada",
    name: "ചായക്കട",
    englishName: "Chayakada",
    emoji: "☕",
    logo: "/bg/logo.png",
    bgWide: "/bg/scene-wide.png",
    bgTall: "/bg/scene-tall.png",
    accent: "#e0b46a",
    playlists: PLAYLISTS,
  },
  {
    id: "sabarimala",
    name: "ശബരിമല",
    englishName: "Sabarimala",
    emoji: "🪔",
    logo: "/bg/sabarimala-logo.png",
    bgWide: "/bg/sabarimala-scene-wide.png",
    bgTall: "/bg/sabarimala-scene-tall.png",
    accent: "#f97316",
    playlists: [
      { id: "sabarimala-devotional", name: "Ayyappa Devotional", tracks: [] },
    ],
  },
];
