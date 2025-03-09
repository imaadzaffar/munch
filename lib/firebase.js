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
} from "firebase/firestore";
import app from "@/config/firebaseConfig";

const db = getFirestore(app);

const getAllUsers = async () => {
  console.log("getAllUsers() called");
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllRestaurants = async () => {
  try {
    const q = query(
      collection(db, "restaurants"),
      where("status", "==", "published")
      // limit(10)
    );
    const querySnapshot = await getDocs(q);
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      restaurants.push({ id: doc.id, type: "all", ...doc.data() });
    });
    // console.log(restaurants);
    return restaurants;
  } catch (error) {
    console.log(error);
  }
};

const getRestaurantsByIds = async (restaurantIds) => {
  try {
    console.log("getRestaurantsById", restaurantIds);
    const q = query(
      collection(db, "restaurants"),
      where(documentId(), "in", restaurantIds)
      // limit(10)
    );
    const querySnapshot = await getDocs(q);
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    // console.log(restaurants);
    return restaurants;
  } catch (error) {
    console.log(error);
  }
};

const getUserSavedRestaurants = async (userId) => {
  try {
    console.log(`getUserSavedRestaurants: users/${userId}/saved`);
    const restaurants = [];
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/saved`)
    );
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      restaurants.push(doc.id);
    });
    return restaurants;
  } catch (error) {
    console.log(error);
  }
};

const getUserReviewedRestaurants = async (userId) => {
  try {
    console.log(`getUserReviewedRestaurants: users/${userId}/reviews`);
    const restaurants = [];
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/reviews`)
    );
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      restaurants.push(doc.data()["restaurant_id"]);
    });
    return restaurants;
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
};
