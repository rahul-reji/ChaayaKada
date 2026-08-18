// ---------------------------------------------------------------------------
// Track catalogue
// ---------------------------------------------------------------------------
// Adding a song is a ONE-LINE change: append a Track object to a playlist array.
//
// IMPORTANT (read before you paste any videoId):
//   `videoId` is intentionally left blank ("") on every track below. Populate it
//   ONLY with the 11-char id of a YouTube upload that you have the right to embed
//   — i.e. the rights holder's (label / composer / official channel) own upload
//   with embedding enabled. Do not paste ids of re-uploads or rips. Any track
//   left with videoId: "" is simply skipped by the engine.
//
//   `duration` is a display fallback ("m:ss"); once a video loads, the player
//   reports the real duration and overrides it.
// ---------------------------------------------------------------------------

export type Track = {
  id: string;
  title: string;
  artist: string; // composer / performer credit
  film: string;
  year: number;
  duration: string; // fallback "m:ss" until the player reports the real length
  videoId: string; // YouTube id — leave "" until you have an embeddable, cleared upload
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

// --- Playlist 1 -------------------------------------------------------------
const goldenVoices: Track[] = [
  {
    "id": "gv-01",
    "title": "Vaishaakha Sandhye (Male Version)",
    "artist": "K.J. Yesudas",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "GJCj4lfraDc"
  },
  {
    "id": "gv-02",
    "title": "Nee En Sarga",
    "artist": "K.J. Yesudas",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "CtcbQ-t2FcU"
  },
  {
    "id": "gv-03",
    "title": "Sreeraagamo Thedunnu",
    "artist": "K.J. Yesudas",
    "film": "Pavithram",
    "year": 0,
    "duration": "0:00",
    "videoId": "aD9lDmwt9rk"
  },
  {
    "id": "gv-04",
    "title": "Megham Poothu Thudangi",
    "artist": "K.J. Yesudas",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "JrIAGLBrN_0"
  },
  {
    "id": "gv-05",
    "title": "Thumpi Penne",
    "artist": "K.J. Yesudas",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "dDdv4AZ661E"
  },
  {
    "id": "gv-06",
    "title": "Onnam Raagam Paadi",
    "artist": "G. Venugopal",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "pBbHUxjiKd8"
  },
  {
    "id": "gv-07",
    "title": "Swargangal",
    "artist": "G. Venugopal",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "9as4cATbebc"
  },
  {
    "id": "gv-08",
    "title": "Oru Chembaneer",
    "artist": "Unnimenon",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "mI2a5VGpH_4"
  },
  {
    "id": "gv-09",
    "title": "Neeyoru Puzhayayi",
    "artist": "Jayachandran",
    "film": "Thilakkam",
    "year": 0,
    "duration": "0:00",
    "videoId": "hokpsEvcw3A"
  },
  {
    "id": "gv-10",
    "title": "Pon Veene",
    "artist": "K.S. Chithra",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "3vp4ddZ-bCI"
  },
  {
    "id": "gv-11",
    "title": "Karukavayal",
    "artist": "K.S. Chithra",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "1Dj6B9hHBfQ"
  }
];

const melodyMakers: Track[] = [
  {
    "id": "mm-01",
    "title": "Poomkaatte",
    "artist": "Raghu Kumar",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "170DpQb2CmE"
  },
  {
    "id": "mm-02",
    "title": "Paadam Pootha (Male Version)",
    "artist": "Kannur Rajan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "vXE6-8DqpHc"
  },
  {
    "id": "mm-03",
    "title": "Eeranmegham",
    "artist": "Kannur Rajan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "B1KVjeuGJ0Q"
  },
  {
    "id": "mm-04",
    "title": "Doore Kizhakkudikkin",
    "artist": "Kannur Rajan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "Q275cikkmR4"
  },
  {
    "id": "mm-05",
    "title": "Aalilathaaliyumaai",
    "artist": "Raveendran",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "rrFQMo5yR6o"
  },
  {
    "id": "mm-06",
    "title": "Kandu Njaan Mizhikalil",
    "artist": "Raveendran",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "1sXVCRVDQVQ"
  },
  {
    "id": "mm-07",
    "title": "Anthiponvettam",
    "artist": "Ousepachan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "ocDX-cBYckw"
  },
  {
    "id": "mm-08",
    "title": "Etho Vaarmukilin (Male Version)",
    "artist": "Ousepachan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "_Q_Yz0uM3BY"
  },
  {
    "id": "mm-09",
    "title": "Mounam Swaramaai (Version 1)",
    "artist": "Ousepachan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "u3I_ekX3_bs"
  },
  {
    "id": "mm-10",
    "title": "Allikalil",
    "artist": "M.G. Radhakrishnan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "iteTjGpT3O4"
  },
  {
    "id": "mm-11",
    "title": "Ambhalappuzhe",
    "artist": "M.G. Radhakrishnan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "xW-tBF8vyQo"
  },
  {
    "id": "mm-12",
    "title": "Nilavinte Neelabhasma",
    "artist": "M.G. Radhakrishnan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "Vgm4pt1CFZQ"
  },
  {
    "id": "mm-13",
    "title": "AavaniPoonoonjal",
    "artist": "M.G. Radhakrishnan",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": ""
  },
  {
    "id": "mm-14",
    "title": "Maayaamanchalil",
    "artist": "Sharreth",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "B9BmjGD29sQ"
  }
];

const nineties: Track[] = [
  {
    "id": "nn-01",
    "title": "Aazhakkadalinte",
    "artist": "Vidyasagar",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "V8oca7dNaYo"
  },
  {
    "id": "nn-02",
    "title": "Pinneyum Pinneyum (Male Version)",
    "artist": "Vidyasagar",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "OJAHO6nS4ms"
  },
  {
    "id": "nn-03",
    "title": "Anuraaga Vilochananaayi",
    "artist": "Vidyasagar",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "fFU5OxdXf70"
  },
  {
    "id": "nn-04",
    "title": "Vellinilaa Thullikalo",
    "artist": "Vidyasagar",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "PapBqEKdRZU"
  },
  {
    "id": "nn-05",
    "title": "Kunje (Male Version)",
    "artist": "Mohan Sithara",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "CDjE8EmM7M4"
  },
  {
    "id": "nn-06",
    "title": "Pon Kasavu Njoriyum (Female Version)",
    "artist": "Mohan Sithara",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "BtDk3uSw00M"
  },
  {
    "id": "nn-07",
    "title": "Chanchala Druthapada",
    "artist": "Mohan Sithara",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "rSu0usSE-MY"
  },
  {
    "id": "nn-08",
    "title": "Attirambile Kombile",
    "artist": "Ilaiyaraaja",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "yl1cSIHUP8U"
  },
  {
    "id": "nn-09",
    "title": "Manjil Kulikkum",
    "artist": "Shyam Dharman",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "Lpr-4JxnCis"
  },
  {
    "id": "nn-10",
    "title": "Vannaathi Puzhayude",
    "artist": "Kaithapram",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "Vlqj-gjEkRM"
  },
  {
    "id": "nn-11",
    "title": "Olathumbathu (Female)",
    "artist": "Release",
    "film": "",
    "year": 0,
    "duration": "0:00",
    "videoId": "ojq1lfuzcjg"
  }
];
export const PLAYLISTS: Playlist[] = [
  { id: "chayakada", name: "Chayakada", tracks: [...goldenVoices, ...melodyMakers, ...nineties] },
];
