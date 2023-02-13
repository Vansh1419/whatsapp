import { getFirestore, collection } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDxXtqVETN7BOHTYj5zYMCFWZ7c0ORIMCw",
  authDomain: "whatsapp-clone-14c5c.firebaseapp.com",
  projectId: "whatsapp-clone-14c5c",
  storageBucket: "whatsapp-clone-14c5c.appspot.com",
  messagingSenderId: "959790240743",
  appId: "1:959790240743:web:8db98a556905f49d356342",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const userCollectionRef = collection(database, "users");
export const chatCollectionRef = collection(database, "chats");
