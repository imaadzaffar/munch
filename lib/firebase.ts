import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  getFirestore,
  query,
  where,
  limit,
  documentId,
  orderBy,
} from "firebase/firestore";
import app from "@/config/firebaseConfig";

import { Restaurant } from "@/lib/types";

const db = getFirestore(app);

const getAllUsers = async () => {
  console.log("getAllUsers() called");
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach(doc => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllRestaurants = async () => {
  try {
    const q = query(collection(db, "restaurants"), where("status", "==", "published"), limit(50));
    const querySnapshot = await getDocs(q);
    const restaurants: Restaurant[] = [];
    querySnapshot.forEach(doc => {
      restaurants.push({ id: doc.id, ...doc.data() } as Restaurant);
    });
    // console.log(restaurants);
    return restaurants;
  } catch (error) {
    console.log(error);
  }
};

const getNearbyRestaurants = async (latitude: number, longitude: number, range: number) => {
  try {
    const q = query(
      collection(db, "restaurants"),
      where("status", "==", "published"),
      orderBy("location.longitude"),
      where("location.longitude", ">=", -0.142671),
      where("location.longitude", "<=", -0.119926),
      where("location.latitude", ">=", 51.508142),
      where("location.latitude", "<=", 51.529318)
      // limit(10)
    );
    const querySnapshot = await getDocs(q);
    const restaurants: Restaurant[] = [];
    // TODO: calculate distance to user location
    querySnapshot.forEach(doc => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    // console.log(restaurants);
    return restaurants;
  } catch (error) {
    console.log(error);
  }
};

const getRestaurantsByIds = async (restaurantIds: string[]) => {
  try {
    console.log("getRestaurantsById", restaurantIds);
    const q = query(
      collection(db, "restaurants"),
      where(documentId(), "in", restaurantIds)
      // limit(10)
    );
    const querySnapshot = await getDocs(q);
    const restaurants: Restaurant[] = [];
    querySnapshot.forEach(doc => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    return restaurants;
  } catch (error) {
    console.log(error);
  }
};

const getUserSavedRestaurants = async (userId: string) => {
  try {
    console.log(`getUserSavedRestaurants: users/${userId}/saved`);
    const ids: string[] = [];
    const querySnapshot = await getDocs(collection(db, `users/${userId}/saved`));
    querySnapshot.forEach(doc => {
      ids.push(doc.id);
    });
    return ids;
  } catch (error) {
    console.log(error);
  }
};

const getUserReviewedRestaurants = async (userId: string) => {
  try {
    console.log(`getUserReviewedRestaurants: users/${userId}/reviews`);
    const ids: string[] = [];
    const querySnapshot = await getDocs(collection(db, `users/${userId}/reviews`));
    querySnapshot.forEach(doc => {
      ids.push(doc.data()["restaurant_id"]);
    });
    return ids;
  } catch (error) {
    console.log(error);
  }
};

export {
  getAllUsers,
  getAllRestaurants,
  getUserSavedRestaurants,
  getUserReviewedRestaurants,
  getRestaurantsByIds,
  getNearbyRestaurants,
};
