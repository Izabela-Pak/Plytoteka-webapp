export interface Cd {
    id_album: number;
    title: string;
    author: string;
    year: string;
    image_link?: string | null;
    vinyl_or_cd: string;
    genre_required: string;
    genre_optional: string | null;
}

export interface CreateOrModifyCd {
    id_album: number | null;
    author: string | null;
    title: string | null;
    year: string | null;
    file: File | null;
    genre: string | null;
    genreOpcional: string | null;
    cdType: string | null;
}

export interface PreparedCd {
    original: Cd;

    author: string;
    authorWords: string[];

    title: string;
    titleWords: string[];
};

export interface ModifyData {
    editingCD?: number;
}

export interface WhichCdDelete {
    albumNumber: number;
}

export const genres = [
  { value: "Ambient", label: "Ambient" },
  { value: "Blues", label: "Blues" },
  { value: "Country", label: "Country" },
  { value: "Dance", label: "Dance" },
  { value: "Disco", label: "Disco" },
  { value: "Disco-polo", label: "Disco-polo" },
  { value: "Electronic", label: "Electronic" },
  { value: "Funk", label: "Funk" },
  { value: "Gospel", label: "Gospel" },
  { value: "Grunge", label: "Grunge" },
  { value: "Hip-hop", label: "Hip-hop" },
  { value: "House", label: "House" },
  { value: "Indie", label: "Indie" },
  { value: "Jazz", label: "Jazz" },
  { value: "K-pop", label: "K-pop" },
  { value: "Lo-fi", label: "Lo-fi" },
  { value: "Metal", label: "Metal" },
  { value: "Muzyka filmowa", label: "Muzyka filmowa" },
  { value: "Muzyka klasyczna", label: "Muzyka klasyczna" },
  { value: "Muzyka ludowa", label: "Muzyka ludowa" },
  { value: "Muzyka średniowiecza", label: "Muzyka średniowiecza" },
  { value: "Nu-metal", label: "Nu-metal" },
  { value: "Heavy-metal", label: "Heavy-metal" },
  { value: "Opera", label: "Opera" },
  { value: "Pop", label: "Pop" },
  { value: "Punk", label: "Punk" },
  { value: "Rap", label: "Rap" },
  { value: "R&B", label: "R&B" },
  { value: "Reggae", label: "Reggae" },
  { value: "Rock", label: "Rock" },
  { value: "Rock & Roll", label: "Rock & Roll" },
  { value: "Ścieżka dźwiękowa", label: "Ścieżka dźwiękowa" },
  { value: "Soul", label: "Soul" },
  { value: "Ska", label: "Ska" },
  { value: "Trap", label: "Trap" }
];

export const sortBy = [
    {value: "Wykonawcy (A-Z)", label: "AuthorASC"},
    {value: "Wykonawcy (Z-A)", label: "AuthorDESC"},
    {value: "Tytule (A-Z)", label: "TitleASC"},
    {value: "Tytule (Z-A)", label: "TitleDESC"},
    {value: "Roku wydania (od najstarszego)", label: "YearASC"},
    {value: "Roku wydania (od najwcześniejszego)", label: "YearDESC"},
]

export const displayType = [
    {value: "Wyświetl same płyty cd", label: "Cd"},
    {value: "Wyświetl same płyty winylowe", label: "Vinyl"},
    {value: "Wyświetl wszystko", label: "All"}
]