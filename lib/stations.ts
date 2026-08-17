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
      {
        id: "sabarimala-devotional",
        name: "Ayyappa Devotional",
        tracks: [
          { id: "sb-01", title: "Vaishaakha Sandhye (Male Version)", artist: "K.J. Yesudas", film: "", year: 0, duration: "0:00", videoId: "GJCj4lfraDc" },
          { id: "sb-02", title: "Sreeraagamo Thedunnu", artist: "K.J. Yesudas", film: "Pavithram", year: 0, duration: "0:00", videoId: "aD9lDmwt9rk" },
          { id: "sb-03", title: "Megham Poothu Thudangi", artist: "K.J. Yesudas", film: "", year: 0, duration: "0:00", videoId: "JrIAGLBrN_0" },
          { id: "sb-04", title: "Thumpi Penne", artist: "K.J. Yesudas", film: "", year: 0, duration: "0:00", videoId: "dDdv4AZ661E" },
          { id: "sb-05", title: "Onnam Raagam Paadi", artist: "G. Venugopal", film: "", year: 0, duration: "0:00", videoId: "pBbHUxjiKd8" },
        ],
      },
    ],
  },
];
