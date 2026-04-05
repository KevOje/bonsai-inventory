import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBA8icirZmnI_A-vu_7TQ8gMov92akscI0",
  authDomain: "bonsai-inventory.firebaseapp.com",
  projectId: "bonsai-inventory",
  storageBucket: "bonsai-inventory.firebasestorage.app",
  messagingSenderId: "321497275369",
  appId: "1:321497275369:web:e7f1032c12189501d04978",
  measurementId: "G-VVZQP45719",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
