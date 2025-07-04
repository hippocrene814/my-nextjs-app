// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAOpwHUf8JfNzpJfBB50hkAGUi4921tPmE",
    authDomain: "museum-passport-web.firebaseapp.com",
    projectId: "museum-passport-web",
    storageBucket: "museum-passport-web.firebasestorage.app",
    messagingSenderId: "743294260027",
    appId: "1:743294260027:web:0569f740caa3649cf99d1e",
    measurementId: "G-JL1C2CV14S"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
const auth = getAuth(app);
