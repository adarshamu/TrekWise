const UNSPLASH_BASE_URL = "https://api.unsplash.com";

/**
 * Get images for a place / trek
 * @param {string} query - place name (example: "Mullayanagiri trek")
 */
export async function getTrekImages(query) {
  try {
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=6&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_API_KEY}`,
        },
      }
    );

    if (!response.ok) throw new Error("Unsplash API error");

    const data = await response.json();
    return data.results ?? [];
  } catch (error) {
    console.error("Unsplash error:", error);
    return [];
  }
}