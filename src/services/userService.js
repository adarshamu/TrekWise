// import { db } from "../firebase/firebase";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// /**
//  * Load user profile (username + favorites) from Firestore
//  */
// export async function loadUserProfile(uid) {
//   try {
//     const ref = doc(db, "users", uid);
//     const snap = await getDoc(ref);
//     if (snap.exists()) {
//       return snap.data(); // { username, favorites }
//     }
//     return null;
//   } catch (err) {
//     console.error("loadUserProfile error:", err);
//     return null;
//   }
// }

// /**
//  * Create or update user profile in Firestore
//  */
// export async function saveUserProfile(uid, data) {
//   try {
//     const ref = doc(db, "users", uid);
//     await setDoc(ref, data, { merge: true });
//   } catch (err) {
//     console.error("saveUserProfile error:", err);
//   }
// }

// /**
//  * Update only the username
//  */
// export async function updateUsername(uid, username) {
//   try {
//     const ref = doc(db, "users", uid);
//     await updateDoc(ref, { username });
//   } catch (err) {
//     console.error("updateUsername error:", err);
//   }
// }

// /**
//  * Update only the favorites array
//  */
// export async function updateFavorites(uid, favorites) {
//   try {
//     const ref = doc(db, "users", uid);
//     await updateDoc(ref, { favorites });
//   } catch (err) {
//     console.error("updateFavorites error:", err);
//   }
// }

// src/services/userService.js
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/**
 * Load a user's profile from Firestore.
 * Returns { username, favorites } or null if no doc yet.
 */
export async function loadUserProfile(uid) {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
    return null;
  } catch (err) {
    console.error("loadUserProfile error:", err);
    return null;
  }
}

/**
 * Create a brand-new user doc in Firestore (called on first signup).
 */
export async function createUserProfile(uid, username) {
  try {
    const ref = doc(db, "users", uid);
    await setDoc(ref, {
      username,
      favorites: [],
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("createUserProfile error:", err);
  }
}

/**
 * Save an updated username to Firestore.
 */
export async function saveUsername(uid, username) {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { username });
  } catch (err) {
    console.error("saveUsername error:", err);
  }
}

/**
 * Save the full favorites array to Firestore.
 */
export async function saveFavorites(uid, favorites) {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { favorites });
  } catch (err) {
    console.error("saveFavorites error:", err);
  }
}