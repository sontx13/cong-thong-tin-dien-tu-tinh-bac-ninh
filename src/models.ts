export interface Restaurant {
  id: number;
  name: string;
  districtId: number;
  location: Location;
  views: number;
  image: string;
  address: string;
  hours: {
    opening: Hours;
    closing: Hours;
  };
  days: {
    opening: number;
    closing: number;
  };
  hotline: string;
  map: string;
  rating: number;
}

export interface Article {
  id: number;
  cat_id: number;
  cat_name: string;
  is_show_image: number;
  author_id: number;
  category_id: number;
  title: string;
  excerpt: string;
  image: string;
  url_title: string;
  published_at: Date;
}

export interface District {
  id: number;
  name: string;
}

export interface PageInfor {
  pagenumber: number;
  pagesize: number,
  category_id: number;
}

export interface Location {
  lat: number;
  long: number;
}

export interface IDonvi {
  id: number;
  ten_donvi: string;
}

export interface IUser {
  ID: number;
  ZID: number;
  NAME: string;
  AVATAR: string;
  PHONE_NUMBER: string;
  CREATED_DATE: string;
  UPDATED_DATE: string;
  donvi: {
    ZID: number;
    ID_THON: number;
    ID_XA: number;
    ID_HUYEN: number;
    ROLE_ID: number;
    TEN_THON: number;
    TEN_XA: string;
    TEN_HUYEN: string;
    CREATED_DATE: string;
    UPDATED_DATE: string;
  };
}

export interface Menu {
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  foods: Food[];
}

export interface Food {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categories: string[];
  extras: Extra[];
  options: Option[];
}

export interface Option {
  key: string;
  label: string;
  selected: boolean;
}

export interface Extra {
  key: string;
  label: string;
  options: {
    key: string;
    label: string;
    selected?: boolean;
  }[];
}

export interface Cart {
  items: CartItem[];
}

export interface CartItem {
  quantity: number;
  food: Food;
  note: string;
}

export type Hours = [number, number, "AM" | "PM"];

export interface Booking {
  id: string;
  restaurant: Restaurant;
  cart?: Cart;
  bookingInfo?: {
    date: Date;
    hour: Hours;
    table: string;
    seats: number;
  };
}

export type TabType = "info" | "menu" | "book";

export interface CongKhai {
  id: string;
  ten_xaphuong: string;
  noidung_congkhai: string;
  view:number;
  share:number;
}

