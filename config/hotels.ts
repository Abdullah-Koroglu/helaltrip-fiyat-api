export interface HotelMapping {
  id: number;
  name: string;
  location?: string;
}

// - *Wome Deluxe* → *227*
// - *Angels Marmaris* → *31*
// - *Adenya Resort* → *2*
// - *Sah inn Paradise*
// - *The Oba* → *8729*
// - *Adin Beach* → *135*
// - *Bera Alanya* → *1*
// - *Rizom Beach* → *325448*
// - *Selge Beach* → *142*
// - *Royal Teos* → *465835*
// - *Rizom Tatil Köyü* → *716488*
// - *Zeyda Kemer* → *716355*
// - *Zeyda Lara* → *716356*

export const HOTELS: HotelMapping[] = [
  {
    id: 227,
    name: "Wome Deluxe",
    location: ""
  },
  {
    id: 2,
    name: "Adenya Resort",
    location: ""
  },
  {
    id: 31,
    name: "Angels Marmaris",
    location: ""
  },
  {
    id: 2,
    name: "Adenya Resort",
    location: ""
  },
  {
    id: 8729,
    name: "The Oba",
    location: ""
  },
  {
    id: 135,
    name: "Adin Beach",
    location: ""
  },
  {
    id: 1,
    name: "Bera Alanya",
    location: ""
  },
  {
    id: 325448,
    name: "Rizom Beach",
    location: ""
  },
  {
    id: 142,
    name: "Selge Beach",
    location: ""
  },
  {
    id: 465835,
    name: "Royal Teos",
    location: ""
  },
  {
    id: 716488,
    name: "Rizom Tatil Köyü",
    location: ""
  },
  {
    id: 716355,
    name: "Zeyda Kemer",
    location: ""
  },
  {
    id: 716356,
    name: "Zeyda Lara",
    location: ""
  }
  // Buraya daha fazla otel ekleyebilirsiniz
  // {
  //   id: 228,
  //   name: "Başka Otel Adı",
  //   location: "Konum"
  // },
];

export const getHotelNameById = (id: number): string => {
  const hotel = HOTELS.find(h => h.id === id);
  return hotel ? hotel.name : `Hotel ID: ${id}`;
};

export const getHotelById = (id: number): HotelMapping | undefined => {
  return HOTELS.find(h => h.id === id);
};

