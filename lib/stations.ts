import { PLAYLISTS, type Playlist } from "./tracks";
import { SABARIMALA_PLAYLISTS } from "./sabarimala-tracks";

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
  featureFlag?: string; // if set, station is hidden unless this flag is enabled in Redis
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
    // featureFlag: "sabarimala",
    playlists: SABARIMALA_PLAYLISTS,
  },
];
