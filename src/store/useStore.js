// // // import { create } from "zustand";

// // // export const useStore = create((set) => ({
// // //   user: null,
// // //   favorites: [],
// // //   setUser: (user) => set({ user }),
// // //   addFavorite: (trek) =>
// // //     set((state) => ({
// // //       favorites: [...state.favorites, trek],
// // //     })),
// // //   removeFavorite: (id) =>
// // //     set((state) => ({
// // //       favorites: state.favorites.filter((t) => t.id !== id),
// // //     })),
// // // }));

// // import { create } from "zustand";
// // import { loadUserProfile, saveUserProfile, updateFavorites } from "../services/userService";

// // export const useStore = create((set, get) => ({
// //   user: null,
// //   username: "",
// //   favorites: [],

// //   // ── Auth ──────────────────────────────────────────────────
// //   setUser: (user) => set({ user }),

// //   // Call this right after login / on auth state change
// //   // It loads username + favorites from Firestore
// //   initUserProfile: async (user) => {
// //     set({ user });
// //     if (!user) return;

// //     const profile = await loadUserProfile(user.uid);

// //     if (profile) {
// //       set({
// //         username: profile.username ?? user.displayName ?? "Trek User",
// //         favorites: profile.favorites ?? [],
// //       });
// //     } else {
// //       // First login — create the profile document
// //       const defaultUsername = user.displayName ?? "Trek User";
// //       set({ username: defaultUsername, favorites: [] });
// //       await saveUserProfile(user.uid, {
// //         username: defaultUsername,
// //         favorites: [],
// //         email: user.email,
// //       });
// //     }
// //   },

// //   // ── Username ──────────────────────────────────────────────
// //   setUsername: async (newUsername) => {
// //     const { user } = get();
// //     set({ username: newUsername });
// //     if (user?.uid) {
// //       const { updateUsername } = await import("../services/userService");
// //       await updateUsername(user.uid, newUsername);
// //     }
// //   },

// //   // ── Favorites ─────────────────────────────────────────────
// //   addFavorite: async (place) => {
// //     const { favorites, user } = get();
// //     if (favorites.some((f) => f.id === place.id)) return; // no duplicates
// //     const updated = [...favorites, place];
// //     set({ favorites: updated });
// //     if (user?.uid) await updateFavorites(user.uid, updated);
// //   },

// //   removeFavorite: async (id) => {
// //     const { favorites, user } = get();
// //     const updated = favorites.filter((f) => f.id !== id);
// //     set({ favorites: updated });
// //     if (user?.uid) await updateFavorites(user.uid, updated);
// //   },
// // }));

// import { create } from "zustand";
// import { loadUserProfile, saveUserProfile, updateFavorites } from "../services/userService";

// export const useStore = create((set, get) => ({
//   user: null,
//   username: "",
//   favorites: [],

//   // ── Auth ──────────────────────────────────────────────────
//   setUser: (user) => set({ user }),

//   // Call this right after login / on auth state change
//   // It loads username + favorites from Firestore
//   initUserProfile: async (user, initialUsername = null) => {
//     set({ user });
//     if (!user) return;

//     const profile = await loadUserProfile(user.uid);

//     if (profile) {
//       set({
//         username: profile.username ?? user.displayName ?? "Trek User",
//         favorites: profile.favorites ?? [],
//       });
//     } else {
//       // First login — use username from signup form if provided
//       const defaultUsername = initialUsername || user.displayName || "Trek User";
//       set({ username: defaultUsername, favorites: [] });
//       await saveUserProfile(user.uid, {
//         username: defaultUsername,
//         favorites: [],
//         email: user.email,
//       });
//     }
//   },

//   // ── Username ──────────────────────────────────────────────
//   setUsername: async (newUsername) => {
//     const { user } = get();
//     set({ username: newUsername });
//     if (user?.uid) {
//       const { updateUsername } = await import("../services/userService");
//       await updateUsername(user.uid, newUsername);
//     }
//   },

//   // ── Favorites ─────────────────────────────────────────────
//   addFavorite: async (place) => {
//     const { favorites, user } = get();
//     if (favorites.some((f) => f.id === place.id)) return; // no duplicates
//     const updated = [...favorites, place];
//     set({ favorites: updated });
//     if (user?.uid) await updateFavorites(user.uid, updated);
//   },

//   removeFavorite: async (id) => {
//     const { favorites, user } = get();
//     const updated = favorites.filter((f) => f.id !== id);
//     set({ favorites: updated });
//     if (user?.uid) await updateFavorites(user.uid, updated);
//   },
// }));


// src/store/useStore.js
import { create } from "zustand";
import {
  loadUserProfile,
  createUserProfile,
  saveUsername,
  saveFavorites,
} from "../services/userService";

export const useStore = create((set, get) => ({
  user: null,
  username: "",
  favorites: [],

  setUser: (user) => set({ user }),

  /**
   * Called on login / page refresh via onAuthStateChanged in App.jsx.
   * Also called on signup with an initialUsername.
   * Loads or creates the Firestore profile for this user.
   */
  initUserProfile: async (firebaseUser, initialUsername = "") => {
    set({ user: firebaseUser });

    const profile = await loadUserProfile(firebaseUser.uid);

    if (profile) {
      // Existing user — restore saved data
      set({
        username: profile.username || firebaseUser.email,
        favorites: profile.favorites || [],
      });
    } else {
      // Brand-new user — create their Firestore doc
      const name = initialUsername || firebaseUser.displayName || firebaseUser.email;
      await createUserProfile(firebaseUser.uid, name);
      set({ username: name, favorites: [] });
    }
  },

  /**
   * Update username in store AND Firestore.
   */
  updateUsername: async (newUsername) => {
    const { user } = get();
    if (!user) return;
    set({ username: newUsername });
    await saveUsername(user.uid, newUsername);
  },

  /**
   * Add a favorite — syncs to Firestore immediately.
   */
  addFavorite: async (place) => {
    const { user, favorites } = get();
    // Prevent duplicates
    if (favorites.some((f) => f.id === place.id)) return;
    const updated = [...favorites, place];
    set({ favorites: updated });
    if (user) await saveFavorites(user.uid, updated);
  },

  /**
   * Remove a favorite — syncs to Firestore immediately.
   */
  removeFavorite: async (id) => {
    const { user, favorites } = get();
    const updated = favorites.filter((f) => f.id !== id);
    set({ favorites: updated });
    if (user) await saveFavorites(user.uid, updated);
  },
}));