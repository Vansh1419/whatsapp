import { getFirestore, collection } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAKjzxw72G8h8A6WZhZy5LwuXdA4YQhZGM",
  authDomain: "whatsapp-clone-5efc6.firebaseapp.com",
  projectId: "whatsapp-clone-5efc6",
  storageBucket: "whatsapp-clone-5efc6.appspot.com",
  messagingSenderId: "976547411567",
  appId: "1:976547411567:web:0f27de4c50e19b1959bf9a",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const userCollectionRef = collection(database, "users");
export const chatCollectionRef = collection(database, "chats");
