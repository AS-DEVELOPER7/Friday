// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB99SBD4l9FxM72kyAJJ3d4hv8XlPh3RKY",
  authDomain: "friday-4d010.firebaseapp.com",
  projectId: "friday-4d010",
  storageBucket: "friday-4d010.appspot.com",
  messagingSenderId: "486290678774",
  appId: "1:486290678774:web:b10137a7c2c5d98eb2ddd7",
  measurementId: "G-2XGHXH30NZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
