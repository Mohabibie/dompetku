import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqQS9oD_y_RWqawivUgY0h25R0pwevsUI",
  authDomain: "dompetku-2a6d3.firebaseapp.com",
  projectId: "dompetku-2a6d3",
  storageBucket: "dompetku-2a6d3.firebasestorage.app",
  messagingSenderId: "276675045177",
  appId: "1:276675045177:web:618a6cb34a79d3aee3aae8",
  measurementId: "G-77KL35WH49"
};

// Cegah duplicate app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);