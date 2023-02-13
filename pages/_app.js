import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "../firebaseConfig";
import LogIn from "./logIn";
import Loading from "./loading";
import { useEffect } from "react";
import { serverTimestamp, addDoc, setDoc, doc } from "firebase/firestore";
import { userCollectionRef } from "../firebaseConfig";
export default function App({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    const addUser = async () => {
      if (!user) return;
      await setDoc(doc(userCollectionRef, user.uid), {
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
        lastSeen: serverTimestamp(),
      });
    };
    addUser();
  }, [user]);
  if (loading) return <Loading />;
  if (!user) return <LogIn />;
  return <Component {...pageProps} />;
}
