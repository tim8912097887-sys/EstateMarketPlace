import { initializeApp } from "firebase/app";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "estate-market-137b5.firebaseapp.com",
  projectId: "estate-market-137b5",
  storageBucket: "estate-market-137b5.firebasestorage.app",
  messagingSenderId: "167870460216",
  appId: "1:167870460216:web:74f9508f4a2b6300d151cd",
  measurementId: "G-GR4PXWG868"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);