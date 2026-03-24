import { initializeApp }                              from "firebase/app";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore }                               from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyCpL_a2tAIlTH-d__XKeDkfT2ZWpoVo494",
  authDomain:        "trekwise-6cc67.firebaseapp.com",
  projectId:         "trekwise-6cc67",
  storageBucket:     "trekwise-6cc67.appspot.com",
  messagingSenderId: "779271955559",
  appId:             "1:779271955559:web:d065fe59659b22a14f20c2",
  measurementId:     "G-ZM9N81QR63",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db             = getFirestore(app);

// Tell Firebase to keep the session alive across refreshes
setPersistence(auth, browserLocalPersistence);