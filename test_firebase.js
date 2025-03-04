import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  getFirestore,
  where,
  limit,
  query,
} from "firebase/firestore";

import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB5m0Q1jX1d-pj4aMMa_vHJZRTTBoN92Aw",
  authDomain: "halal-munch-26dba.firebaseapp.com",
  projectId: "halal-munch-26dba",
  storageBucket: "halal-munch-26dba.appspot.com",
  messagingSenderId: "614744126899",
  appId: "1:614744126899:web:2c6bfd7b223d0e201707c6",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const getAllUsers = async () => {
  console.log("getAllUsers() called");
  const querySnapshot = await query(
    collection(db, "restaurants"),
    where("status", "==", "published"),
    limit(10)
  );
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
};

getAllUsers();
