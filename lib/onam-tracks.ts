// ---------------------------------------------------------------------------
// Onam station — track catalogue
// ---------------------------------------------------------------------------
// Same rules as tracks.ts: videoId must be an embeddable upload from the
// rights holder's own channel. Leave "" to skip the track.
// ---------------------------------------------------------------------------

import { type Playlist, type Track } from "./tracks";

// --- Onam Hits --------------------------------------------------------------
const onamHits: Track[] = [
  { id: "sm-01", title: "Poovili Poovili Ponnonomayi",       artist: "K.J. Yesudas",                    film: "Vishukkani",                  year: 1977, duration: "0:00", videoId: "P9eE7OdVrS0" },
  { id: "sm-02", title: "Thiruvaavaniraavu",                  artist: "Unni Menon, Sithara Krishnakumar", film: "Jacobinte Swargarajyam",      year: 2016, duration: "0:00", videoId: "VrrnflVEiMg" },
  { id: "sm-03", title: "Uthrada Poonilave Vaa",              artist: "K.J. Yesudas",                    film: "Album - Sravanam",             year: 1983, duration: "0:00", videoId: "YbuIlwpL-_A" },
  { id: "sm-04", title: "Kuttanadan Punjayile",               artist: "K.J. Yesudas",                    film: "Kaavalam Chundan",             year: 1967, duration: "0:00", videoId: "M1_VFAFP2WM" },
  { id: "sm-05", title: "Thiruvona Pularithan",               artist: "Vani Jairam",                     film: "Thiruvonam",                   year: 1975, duration: "0:00", videoId: "v4XqeKI1M28" },
  { id: "sm-06", title: "Onapattin Thalam Thullum",           artist: "Kalyani",                         film: "Quotation",                    year: 2004, duration: "0:00", videoId: "q6YqPk7H8Fs" },
  { id: "sm-07", title: "Onam Vanne Onam Vanne",              artist: "P. Jayachandran, Ambili",         film: "Velluvili",                    year: 1978, duration: "0:00", videoId: "lxAQ1QJY0PA" },
  { id: "sm-08", title: "Onapoove Poove Omal Poove",          artist: "K.J. Yesudas",                    film: "Ee Ganam Marakkumo",           year: 1978, duration: "0:00", videoId: "e0LdsrRAM90" },
  { id: "sm-09", title: "Omanathinkalin Onam",                artist: "K.J. Yesudas",                    film: "Triveni",                      year: 1970, duration: "0:00", videoId: "UUjBwVCGj5s" },
  { id: "sm-10", title: "Onam Vannallo Ponnonam Vannallo",    artist: "Daya Bijibal",                    film: "Album Single",                 year: 2014, duration: "0:00", videoId: "oaSMBo7FYkM" },
  { id: "sm-11", title: "Mavelikkarayude Naattil",            artist: "K.J. Yesudas",                    film: "Album - Sravanam",             year: 1983, duration: "0:00", videoId: "" },
  { id: "sm-12", title: "Paraniraye Ponnalakkum",             artist: "K.J. Yesudas, Sujatha Mohan",    film: "Album - Onappoovukal",          year: 1990, duration: "0:00", videoId: "lQG5jdA_jPE" },
  { id: "sm-13", title: "Aavani Ponroopam",                   artist: "K.J. Yesudas",                    film: "Album - Sravana Sangeetham",   year: 1985, duration: "0:00", videoId: "" },
  { id: "sm-14", title: "Onam Varavayi Keram Thingum",        artist: "K.J. Yesudas",                    film: "Album - Sravanapardha",        year: 1988, duration: "0:00", videoId: "UUjBwVCGj5s" },
  { id: "sm-15", title: "Onam Sadyayunnan",                   artist: "M.G. Sreekumar",                  film: "Album - Onappattu",            year: 1992, duration: "0:00", videoId: "IX267iopndY" },
  { id: "sm-16", title: "Maveli Thampuran",                   artist: "K.J. Yesudas, Ashalatha",        film: "Ashtabandham",                  year: 1986, duration: "0:00", videoId: "y62umLj9SOU" },
  { id: "sm-17", title: "Ponnin Thiruvonam Vannu",            artist: "P. Leela",                        film: "Amma",                         year: 1952, duration: "0:00", videoId: "YenpclW-fXw" },
  { id: "sm-18", title: "Athappoo Chithirappoo",              artist: "Jency, M.K. Arjunan",            film: "Album - Onappaattukal",         year: 1980, duration: "0:00", videoId: "VDJUo0G-vpI" },
  { id: "sm-19", title: "Raakkuyil Paadi",                    artist: "K.S. Chithra",                    film: "Casual / Devotional",          year: 1995, duration: "0:00", videoId: "3L9GcD8GTSE" },
  { id: "sm-20", title: "Maveli Naadu Vaneedum Kaalam",       artist: "Traditional Folk / Choir",        film: "Traditional Folk",             year: 0,    duration: "0:00", videoId: "4XsmZvalkUY" },
  { id: "sm-21", title: "Keranirakal Aadum",                  artist: "K.J. Yesudas",                    film: "Jalolsavam",                   year: 2004, duration: "0:00", videoId: "nLswEJnZVxA" },
  { id: "sm-22", title: "Pookkalam Kanai",                    artist: "Vani Jairam",                     film: "Album - Pookkalam",            year: 1982, duration: "0:00", videoId: "joSUHBWhT_s" },
  { id: "sm-23", title: "Thumba Poove Thumba Poove",          artist: "S. Janaki",                       film: "Album - Onappoove",            year: 1987, duration: "0:00", videoId: "BtAoUN0-yxg" },
  { id: "sm-24", title: "Aavani Thumbe Vaa",                  artist: "K.S. Chithra",                    film: "Album - Sravana Sandhya",      year: 1991, duration: "0:00", videoId: "C5CzEouHOPQ" },
  { id: "sm-25", title: "Onam Ponnona Pulari",                artist: "P. Jayachandran",                 film: "Album - Onam Onam",            year: 1989, duration: "0:00", videoId: "6_85e3vnltA" },
  { id: "sm-26", title: "Athapathonam Vinnil",                artist: "Vani Jairam",                     film: "Album - Atham",                year: 1981, duration: "0:00", videoId: "uXolLsoS6kE" },
  { id: "sm-27", title: "Onam Vannu Ponnona Poove",           artist: "M.G. Sreekumar",                  film: "Album - Thiruvonam",           year: 1996, duration: "0:00", videoId: "K9_s464WSbw" },
  { id: "sm-28", title: "Thiruvona Ponnunjal",                artist: "Sreekanth Hariharan",             film: "Independent Single",           year: 2020, duration: "0:00", videoId: "LtIJb6nVtNc" },
  { id: "sm-29", title: "Kummiyadikkuvin",                    artist: "G. Devarajan, C.O. Anto",        film: "Kadalamma",                     year: 1963, duration: "0:00", videoId: "eX3Mx3P5zr0" },
  { id: "sm-30", title: "Onamaasa Poonilaavum",               artist: "K.J. Yesudas",                    film: "Thiruvonam Special",           year: 1976, duration: "0:00", videoId: "UUjBwVCGj5s" },
  { id: "sm-31", title: "Ponnin Chingamaasam",                artist: "P. Jayachandran, Sujatha Mohan", film: "Meesa Madhavan",                year: 2002, duration: "0:00", videoId: "-9mJF8K8xCo" },
  { id: "sm-32", title: "Velamparambile",                     artist: "M.G. Sreekumar",                  film: "Kannezhuthi Pottum Thottu",    year: 1999, duration: "0:00", videoId: "voj0KMpE8oY" },
  { id: "sm-33", title: "Aalilathaliyumay",                   artist: "K.J. Yesudas",                    film: "Mizhirandilum",                year: 2003, duration: "0:00", videoId: "P2Oex160VPw" },
  { id: "sm-34", title: "Thiruvonathumba",                    artist: "K.S. Chithra",                    film: "Album - Thiruvonam",           year: 1994, duration: "0:00", videoId: "" },
  { id: "sm-35", title: "Pazhayoru Onam",                     artist: "Vineeth Sreenivasan",             film: "Album Single",                 year: 2018, duration: "0:00", videoId: "VrrnflVEiMg" },
  { id: "sm-36", title: "Uthradathinnallil",                  artist: "K.G. Markose",                    film: "Album - Sravanapournami",      year: 1990, duration: "0:00", videoId: "ph__9KYXv1c" },
  { id: "sm-37", title: "Pookkalam Varavayi",                 artist: "K.J. Yesudas",                    film: "Pookkalam Varavayi",           year: 1991, duration: "0:00", videoId: "GVqucTJd-y4" },
  { id: "sm-38", title: "Ona thumbi Ona thumbi",              artist: "M.G. Sreekumar",                  film: "Album - Onam Songs",           year: 1993, duration: "0:00", videoId: "HjMLDhNxkYQ" },
  { id: "sm-39", title: "Karutha Penne",                      artist: "K.J. Yesudas",                    film: "Thenmavin Kombath",            year: 1994, duration: "0:00", videoId: "hk9FOM-_1YA" },
  { id: "sm-40", title: "Poovillam Koodinullil",              artist: "Sujatha Mohan",                   film: "Album - Sravanapournami",      year: 1997, duration: "0:00", videoId: "" },
  { id: "sm-41", title: "Ona Veyilukal",                      artist: "Vijay Yesudas",                   film: "Album Single",                 year: 2017, duration: "0:00", videoId: "" },
  { id: "sm-42", title: "Kattil Aadum Happy Onam",            artist: "Ambili",                          film: "Album - Ranjini Creations",    year: 2010, duration: "0:00", videoId: "qoUzElw73zY" },
  { id: "sm-43", title: "Muthu Mazha Pehyunne",               artist: "M.G. Sreekumar",                  film: "Album - Sravanam",             year: 1998, duration: "0:00", videoId: "TezA_0cmMbk" },
  { id: "sm-44", title: "Ponnona Thumbee",                    artist: "Unni Menon",                      film: "Album - Onaniyanthram",        year: 1992, duration: "0:00", videoId: "DWDQ7kwkaEg" },
  { id: "sm-45", title: "Aaranne Aaranne",                    artist: "Traditional Chorus",              film: "Folk Song",                    year: 0,    duration: "0:00", videoId: "nr7yfNfGMCE" },
  { id: "sm-46", title: "Onam Vanne Vanaari",                 artist: "Bichu Thirumala, P. Jayachandran",film: "Velluvili",                    year: 1978, duration: "0:00", videoId: "" },
  { id: "sm-47", title: "Thumba Poovin Muttam",               artist: "K.S. Chithra",                    film: "Album - Thumba",               year: 1999, duration: "0:00", videoId: "eSBtx91mbkU" },
  { id: "sm-48", title: "Mabali Vanne",                       artist: "Amritha Suresh",                  film: "Independent Single",           year: 2020, duration: "0:00", videoId: "4iCeddfbJU0" },
  { id: "sm-49", title: "Veendum Vannallo Thiruvonam",        artist: "Vani Jairam",                     film: "Album - Onam Hits",            year: 1984, duration: "0:00", videoId: "h0WmPrXKzDQ" },
  { id: "sm-50", title: "Pookkalam Ennum Pookkalam",          artist: "K.J. Yesudas",                    film: "Album - Sravanapardha",        year: 1988, duration: "0:00", videoId: "BDSfYLTIUow" },
];

export const ONAM_PLAYLISTS: Playlist[] = [
  { id: "onam-hits", name: "Onam Hits", tracks: onamHits },
];
