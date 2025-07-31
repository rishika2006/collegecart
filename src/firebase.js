// src/firebase.js ✅

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Your config from Firebase Console (measurementId is optional and not needed)
const firebaseConfig = {
  apiKey: "AIzaSyA8u-Qo2d_D9jh0041Khq_DgO37ioQJG5o",
  authDomain: "collegecart-ef322.firebaseapp.com",
  projectId: "collegecart-ef322",
  storageBucket: "collegecart-ef322.appspot.com", // ✅ fix ".app" to ".appspot.com"
  messagingSenderId: "750300402582",
  appId: "1:750300402582:web:c0546c572710397a52c3b7",
};

// ✅ Initialize app
const app = initializeApp(firebaseConfig);

// ✅ Export what you need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
