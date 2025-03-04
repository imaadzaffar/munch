import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  getFirestore,
  query,
  where,
  limit,
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
      where("status", "==", "published"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      restaurants.push(doc.data());
    });
    return restaurants;
  } catch (error) {
    console.log(error);
  }
};

export { getAllUsers, getAllRestaurants };
