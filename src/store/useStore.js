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