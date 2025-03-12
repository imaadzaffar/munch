import { GeoPoint, Timestamp } from "firebase/firestore";

export interface Restaurant {
  id: string;
  name: string;
  coordinates: GeoPoint;
  google_rating: number;
  google_rating_count: number;
  avg_rating: {
    food: number;
    value: number;
    vibes: number;
  };
  avg_price: number;
  cuisines: string[];
  halal_status: {
    fully_halal: boolean;
    halal_meat: string[];
    halal_ceritificate: string;
    seafood: boolean;
    vegetarian: boolean;
    vegan: boolean;
    serves_alcohol: boolean;
    serves_pork: boolean;
    prayer_room: boolean;
    last_verified: Timestamp;
  };
  links: {
    google_maps: string;
    website: string;
  };
  img: string;
  status: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  profile_pic: string;
  followers: string[];
  following: string[];
  friend_requests: string[];
  admin: boolean;
}

export interface Review {
  id: string;
  timestamp: Timestamp;
  price: number;
  rating: {
    food: number;
    value: number;
    vibes: number;
  };
  user_id: string;
  restaurant: Restaurant;
}