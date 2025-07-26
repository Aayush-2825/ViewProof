// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQK7I8lQvCuR1WtqhhZeWYAmZ6p5phnqg",
  authDomain: "view-proof.firebaseapp.com",
  projectId: "view-proof",
  storageBucket: "view-proof.firebasestorage.app",
  messagingSenderId: "558267809327",
  appId: "1:558267809327:web:5a135dbccfbf1c902a10da",
  measurementId: "G-V9L1VVYDTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);