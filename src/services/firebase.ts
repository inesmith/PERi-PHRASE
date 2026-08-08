import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVe9qKeQGADZK-vg4rYCM8jZSN5iMBUh4",
  authDomain: "peri-phrase.firebaseapp.com",
  projectId: "peri-phrase",
  storageBucket: "peri-phrase.firebasestorage.app",
  messagingSenderId: "187671351273",
  appId: "1:187671351273:web:8bf07e88da91a2eb868578"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);