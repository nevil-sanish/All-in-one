import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuP3Eaj6cWY1UhcFKLUKDtstNEXIUm8CM",
  authDomain: "campushub-6ce7e.firebaseapp.com",
  projectId: "campushub-6ce7e",
  storageBucket: "campushub-6ce7e.firebasestorage.app",
  messagingSenderId: "463180980611",
  appId: "1:463180980611:web:286ad3b666de92363f96b6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
